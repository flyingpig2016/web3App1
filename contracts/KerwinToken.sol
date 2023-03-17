// SPDX-License-Identifier: GPL-3.0
//源码遵循协议
pragma solidity >=0.8.2 <0.9.0; //限定solidity编译器版本

import "openzeppelin-solidity/contracts/utils/math/SafeMath.sol";

contract KerwinToken {
    using SafeMath for uint256; //为后面使用sub，add方法
    // 发型货币
    string public name = "KerwinToken";
    string public symbol = "KWT";
    uint256 public decimals = 18; //1kerwintoken = 10 * decimals
    uint256 public totalSupply; //货币总量
    //自动生成getter方法

    //mapping 相当于去中心化的数据库，表示每个账号下有多少钱
    mapping(address => uint256) public balanceOf; //创建的货币对象
    //每个账号授权给交易所多少额度
    mapping(address => mapping(address => uint256)) public allowance; //交易所对象

    constructor() {
        totalSupply = 1000000 * (10 ** decimals);
        //部署合约的账户，即部署时候扣款的账户
        balanceOf[msg.sender] = totalSupply;
    }

    //存储交易日志
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    event Approve(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    //msg.sender转value到_to的用户
    function transfer(address _to, uint256 _value) public returns (bool) {
        //从哪个账号发起的调用者
        require(_to != address(0));
        _tranfer(msg.sender, _to, _value);
        return true;
    }

    function _tranfer(address _from, address _to, uint256 _value) internal {
        require(balanceOf[_from] >= _value);
        balanceOf[_from] = balanceOf[_from].sub(_value);
        balanceOf[_to] = balanceOf[_to].add(_value);
        //触发事件
        emit Transfer(_from, _to, _value);
    }

    // 给交易所授权,也就是用户msg.sender给交易所多少钱
    function approve(address _spender, uint256 _value) public returns (bool) {
        //msg.sender当前网页登陆的账号
        //_spender 第三方 的交易所的账号地址
        //_value 授权的钱数
        require(_spender != address(0)); //require如果执行错误，可以退回gas值
        allowance[msg.sender][_spender] = _value;
        emit Approve(msg.sender, _spender, _value);
        return true;
    }

    //被授权的交易所调用
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool) {
        // _from 某个放款账号
        //_to 收款账户
        //msg.sender 交易所账户地址
        require(balanceOf[_from] >= _value);
        require(allowance[_from][msg.sender] >= _value);
        //因为_from向_to转了_value钱，所以这个用户给交易所的授权的钱数少了_value
        allowance[_from][msg.sender] = allowance[_from][msg.sender].sub(_value);
        //总的货币流向
        _tranfer(_from, _to, _value);

        return true;
    }
}
