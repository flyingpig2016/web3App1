// SPDX-License-Identifier: GPL-3.0
//源码遵循协议
pragma solidity >=0.8.2 <0.9.0; //限定solidity编译器版本

contract StudentListStorage {
    //状态变量，默认存在storage上的，存储在链上的
    struct Student{
        uint id;
        string name;
        uint age;
        address account;
    }

    //动态数组
    Student[] public StudentList; //自动生成getter()

    function addList(string memory _name, uint256 _age) public returns (uint){
        uint count = StudentList.length;
        uint index = count + 1;
        StudentList.push(Student(index,_name,_age,msg.sender));
        return StudentList.length;
    }



    //view(视图函数，只访问不修改状态) ，pure(纯函数，不访问，也不修改)
    function getList() public view returns (Student[] memory) {
        Student[] memory list = StudentList;
        return list;
    }
}
