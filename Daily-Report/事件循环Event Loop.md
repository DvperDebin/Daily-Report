想要从偏底层理解事件循环 首先要理解很多JS 原理 这里稍做整理 也有一些其他有的没的。。。 （03/20 2019）

*****内存空间*****
 JS 其实没有像C/C++ 特别区分 堆和栈， 我们可以理解大部分时间 所有的变量都储存在堆中，但是对于某些内容 我们依旧需要用堆和栈的思维来解决。

稍微了解一下 堆 栈 队列

栈： FILO

堆(heap)：一个类似于树一样的结构 一个无序结构 可以以key-value的形式读取

队列： FIFO

*****JS内存的生命周期*****
分配需要的内存 -> 使用分配的内存(读、写) -> 不需要时释放、归还

最简单的例子:

var a = 10;
console.log(a);
a = null; 

平常我们都是让JS引擎自动回收，通过垃圾回收机制：找出那些不再继续使用的值，然后释放其占用的内存，垃圾收集器会每隔固定的时间段就执行一次释放操作。
注意： a=null 不是让JS回收a这个不再需要的变量 而是一种提高性能的手段 垃圾回收还是靠着JS 每隔一段时间就执行释放操作的垃圾回收器。

*****执行上下文*****

console.log(a);
var a = 10;

是个人都知道这里输出 undefined 为什么？ 因为变量提升
代码可以这么理解:
var a;
console.log(a);  // 所以是undefined
a = 10;

上面的解释没错 但是 这里其实和执行上下文有关

执行上下文概念：

每次当控制器转到可执行代码的时候，就会进入一个执行上下文。执行上下文可以理解为当前代码的执行环境，它会形成一个作用域。
JavaScript中的运行环境大概包括三种情况。


全局环境：JavaScript代码运行起来会首先进入该环境

函数环境：当函数被调用执行时，会进入当前函数中执行代码

eval（不建议使用，可忽略）

-----上面概念是抄的 xD

JavaScript引擎会以栈的方式来处理这些执行上下文

继续抄一段代码 -。-

var color = 'blue';

function changeColor() {
    var anotherColor = 'red';

    function swapColors() {
        var tempColor = anotherColor; 
        anotherColor = color;
        color = tempColor;
    }

    swapColors();// 因为在changeColor 中调用了 swapColors 所以 swapColors 执行上下文会在 changeColor 直接入栈
}

changeColor();

这里有一个全局执行上下文， 一个changeColor执行上下文， 一个swapColors上下文，成栈结构排列
然后没有其他环境了 开始出栈 先swapColors出 再changeColor 全局执行上下文只有关闭浏览器当前页面时才会出栈

再再抄一段代码 -。-

function f1(){
    var n=999;
    function f2(){
        alert(n);
    }
    return f2;
}
var result=f1();
result(); // 999

首先还是全局执行上下文入栈 -> f1 入栈 -> f1中没有调用f2,f1出栈 -> result执行时 f2入栈 -> f2执行完毕 f2出栈 -> 关闭当前页面 全局执行上下文出栈

最后抄一段代码:

var name = "window";

var p = {
  name: 'Perter',
  getName: function() {
    var self = this;
    return function() {
      return self.name;
    }
  }
}

var getName = p.getName();
var _name = getName();
console.log(_name);

// 全局入栈 -> p.getName 入栈 -> p.getName 出栈 -> getName入栈 -> getName 出栈 -> 全局出栈


*****变量对象详解***** （03/21 2019）