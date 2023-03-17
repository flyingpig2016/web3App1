// SPDX-License-Identifier: GPL-3.0
//源码遵循协议
pragma solidity >=0.8.2 <0.9.0; //限定solidity编译器版本

import "openzeppelin-solidity/contracts/utils/math/SafeMath.sol";
import "./KerwinToken.sol";

contract Exchange {
    using SafeMath for uint256; //为后面使用sub，add方法

    //收费账号地址（创建交易所的人指定的账号）
    address public feeAccount; //收费
    uint256 public freePercent; //费率
    address constant ETHER = address(0);
    mapping(address => mapping(address => uint256)) public tokens;
    // {
    //     "比特币地址":{
    //         "a用户":100,
    //         "b用户":200,
    //     },
    //     "KWT地址":{
    //         "a用户":300,
    //         "b用户":200,
    //     },
    //     "以太币":{
    //         "a用户":200,
    //         "b用户":300,
    //     },
    // }

    struct _Order {
        uint id;
        address user;
        address tokenGet;
        uint amountGet;
        address tokenGive;
        uint amountGive;
        uint timestamp;
    }

    // _Order[] orderList;
    mapping(uint => _Order) public orders;
    mapping(uint => bool) public orderCancel;
    mapping(uint => bool) public orderFill;
    uint256 public orderCount;

    constructor(address _feeAcount, uint256 _freePercent) {
        feeAccount = _feeAcount;
        freePercent = _freePercent;
    }

    //amount修改的钱数 balance 余额
    event Deposit(address token, address user, uint256 amount, uint256 balance);
    event WithDraw(
        address token,
        address user,
        uint256 amount,
        uint256 balance
    );

    event Order(
        uint id,
        address user,
        address tokenGet,
        uint amountGet,
        address tokenGive,
        uint amountGive,
        uint timestamp
    );
    event Cancel(
        uint id,
        address user,
        address tokenGet,
        uint amountGet,
        address tokenGive,
        uint amountGive,
        uint timestamp
    );

    //填充订单事件
    event Trade(
        uint id,
        address user,
        address tokenGet,
        uint amountGet,
        address tokenGive,
        uint amountGive,
        uint timestamp
    );

    // 存以太币
    function depositEther() public payable {
        //msg.sender
        //msg.value
        // tokens[以太坊地址][msg.sender] = tokens[以太坊地址][msg.sender].add(msg.value);
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
        emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
    }

    // 存其他货币
    function depositToken(address _token, uint256 _amount) public {
        require(_token != ETHER);
        //调用方法，强行从我的账号往当前交易所账户(合约部署地址)转钱
        //msg.sender 我
        //address(this) 交易所
        //kerwintoken实例.transferFrom(msg.sender, 当前合约的地址, _amount);
        require(
            KerwinToken(_token).transferFrom(msg.sender, address(this), _amount)
        );

        tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);

        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    // 提取以太币
    function whithdrawEther(uint256 _amount) public {
        require(tokens[ETHER][msg.sender] >= _amount);
        //银行里的钱减去_amount
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].sub(_amount);
        //用户拿到钱，从当前合约的地址转_amount给msg.sender账户
        payable(msg.sender).transfer(_amount);
        emit WithDraw(ETHER, msg.sender, _amount, tokens[ETHER][msg.sender]);
    }

    // 提取kwt
    function whithdrawToken(address _token, uint256 _amount) public {
        require(_token != ETHER);
        require(tokens[_token][msg.sender] >= _amount);
        tokens[_token][msg.sender] = tokens[_token][msg.sender].sub(_amount);
        //当前合约账户（即当前交易所）给提取人msg.sender账户上转钱
        require(KerwinToken(_token).transfer(msg.sender, _amount));
        emit WithDraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    //查询余额
    function balanceOf(
        address _token,
        address _user
    ) public view returns (uint256) {
        return tokens[_token][_user];
    }

    //创建订单
    function makeOrder(
        address _tokenGet,
        uint _amountGet,
        address _tokenGive,
        uint _amountGive
    ) public {
        require(
            balanceOf(_tokenGive, msg.sender) >= _amountGive,
            unicode"创建订单时余额不足"
        );

        orderCount = orderCount.add(1);
        orders[orderCount] = _Order(
            orderCount,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp //获取时间戳
        );
        // 发出订单事件
        emit Order(
            orderCount,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp //获取时间戳
        );
    }

    //取消订单
    function cancelOrder(uint _id) public {
        _Order memory myorder = orders[_id];
        require(myorder.id == _id);
        orderCancel[_id] = true; //表示这个订单已经取消
        emit Cancel(
            myorder.id,
            msg.sender,
            myorder.tokenGet,
            myorder.amountGet,
            myorder.tokenGive,
            myorder.amountGive,
            block.timestamp
        );
    }

    //fillOrder是购买人(购买以太币的人)调用的
    function fillOrder(uint _id) public {
        _Order memory myorder = orders[_id];
        require(myorder.id == _id);
        /**
            账户余额  互换 && 小费收取
            xiaoming发起人创建订单 makeorder（你们谁愿意用100kwt换我的1EHT呀？）
            用户msg.sender完成订单
            100kwt ==> 1 ether

            msg.sender -> fillorder
            msg.sender 多了1 ether
            msg.sender 少了 100kwt

        */
        //计算抽成 kwt * 10 / 100
        uint feeAmount = myorder.amountGet.mul(freePercent).div(100);

        require(
            balanceOf(myorder.tokenGive, myorder.user) >= myorder.amountGive,
            unicode"创建订单的用户以太币余额不足！"
        );

        require(
            balanceOf(myorder.tokenGet, msg.sender) >=
                myorder.amountGet.add(feeAmount),
            unicode"填充订单的用户的以太币余额不足！"
        );

        //ktw变化情况
        tokens[myorder.tokenGet][msg.sender] = tokens[myorder.tokenGet][
            msg.sender
        ].sub(myorder.amountGet.add(feeAmount));
        //收钱的账户额度增加
        tokens[myorder.tokenGet][feeAccount] = tokens[myorder.tokenGet][
            feeAccount
        ].add(feeAmount);

        tokens[myorder.tokenGet][myorder.user] = tokens[myorder.tokenGet][
            myorder.user
        ].add(myorder.amountGet);

        //以太币的数量变化
        tokens[myorder.tokenGive][msg.sender] = tokens[myorder.tokenGive][
            msg.sender
        ].add(myorder.amountGive);

        tokens[myorder.tokenGive][myorder.user] = tokens[myorder.tokenGive][
            myorder.user
        ].sub(myorder.amountGive);

        orderFill[_id] = true; //表示这个订单已经取消

        emit Trade(
            myorder.id,
            myorder.user,
            myorder.tokenGet,
            myorder.amountGet,
            myorder.tokenGive,
            myorder.amountGive,
            block.timestamp
        );
    }
}
