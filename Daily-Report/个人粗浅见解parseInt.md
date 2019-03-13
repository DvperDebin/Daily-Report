又看到一面试题

['1', '2', '3'].map(parseInt)

先看一下map方法 ES6 中新的数组方法  映射！

一个小例子
let newArr = [1,2,3].map((each,idx) => {
  return each>1
});
console.log(newArr); // [ false, true, true ]

map 会根据条件映射出一个新数组


再看一下parseInt 简单来说这个方法是把 string 转化为 number

parseInt 接收两个参数 第一个是要转化的string 第二个是radix 一个介于2-36之间的整数，表示为基数(其实就是X进制)。 不填默认为10。

parseInt('10')  //  10
parseInt('10',2) // 2, 基数为2 即为满2进1
parseInt('11',3) // 4, 简单来说 可以这么理解满3进1: 0->0, 1->1, 2->2, 3->10, 4->11 所以输出4
parseInt(5,4) // 0->0, 1->1, 2->2, 3->3, 4->10,5->11, NaN


回到这个面试题 
['1', '2', '3'].map(parseInt)

转化一下

['1', '2', '3'].map((each,idx)=>{
  return parseInt(each,idx)
});

相当于
parseInt('1',0)  注意 radix为 undefined，或者radix为 0 或者没有指定的情况下

1.如果字符串 string 以"0x"或者"0X"开头, 则基数是16 
2.如果字符串 string 以其它任何值开头，则基数是10 

这里满足条件2 所以输出1

parseInt('2',1) // radix应该是2-36的整数 所以这里是NaN
parseInt('3',2)  // 0->0,1->1,2->10,3->11,4->100  所以还是NaN

/*
 粗浅理解
 written by Devin.Qiu
 3/13 2019
*/



