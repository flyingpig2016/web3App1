// SPDX-License-Identifier: GPL-3.0
//源码遵循协议
pragma solidity >=0.8.2 <0.9.0; //限定solidity编译器版本

contract StudentStorage {
    //状态变量，默认存在storage上的，存储在链上的
    uint256 age;
    string public name;

    function setData(string memory _name, uint256 _age) public {
        // string memory a = "aa";
        name = _name;
        age = _age;
    }

    // pure(纯函数，不访问，也不修改)
    // function test(uint256 x, uint256 y) public pure returns (uint256) {
    //     return x + y;
    // }

    //view(视图函数，只访问不修改状态) ，pure(纯函数，不访问，也不修改)
    function getData() public view returns (string memory, uint256) {
        return (name, age);
    }
}
