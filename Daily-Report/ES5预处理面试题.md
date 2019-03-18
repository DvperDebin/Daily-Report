// 又回头看了几个变量提升的面试题  现在应该很少被问到了 因为ES6中 let 和 const 没有预处理功能了
//  假装自己懂过~

// Num.1
function a(){ }
var a
console.log(a)  输出啥？

输出 'function' 很简单 只是因为 先预处理函数 再预处理变量 如果已经存在就忽略。 所以其实只有第1,3行代码执行了~

// Num.2
if(!(b in window)){

var b = 1

}
console.log(b)  输出啥？

输出 undefined  代码就是判断 window中 是不是有 b 这个变量。 在if 语句中， var 了一个b， 这个b会遵循变量声明的提升
相当于代码是

var b;
if(!(b in window)){

  b = 1

}
console.log(b) // 所以输出 undefined

// Num.3

var c = 1;

function c(c){
  console.log(c);
  var c = 3,
}

c(2) 会有输出么？


答案是会报错！ /* 先预处理函数 再预处理变量 如果已经存在就忽略 */  依旧遵循这个rule

代码相当于

var c

function c(c){
  console.log(c);
  var c = 3,
}

c = 1

c(2) // 1(2)  肯定会报错 因为 1不是一个函数














