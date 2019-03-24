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
当我们创建执行上下文时，JS引擎同时会声明变量和函数。
一个执行上下文可以被分成两个生命周期 创建阶段 引用执行阶段

在创建阶段 会创建作用域链  确定this指向 创建变量对象
代码执行阶段会完成变量赋值 函数引用  执行其他代码

这里着重讲一下变量对象的创建  
1. 创建arguments 对象  
2. 检查当前上下文的函数声明( function xx())  在变量对象中创建一个新属性 属性值是改函数在内存中的地址引用 如果函数声明的属性已经存在则会被新的覆盖
3. 检查当前上下文的var 变量声明 如果已经有函数声明的属性 则跳过 否则 该属性的属性值为undefined

让我们来抄代码
function test() {
    console.log(a);
    console.log(foo());

    var a = 1;
    function foo() {
        return 2;
    }
}

test();


test调用时首先创建一个 函数test的执行上下文 
testEC = {
	scopechain:{}，
	VO:{},
	this:'',
}
VO = {
	arguments: 参数可以不用管,
	foo:foo 函数的引用, // 根据规则先找函数声明 找到了 foo
	a：undefined  // 根据规则 找声明变量 如果找到了 且没有被函数声明占用 就赋值undefined
}

执行阶段 - 变量赋值 函数引用 执行其他代码 
VO = {
	arguments: 参数可以不用管,
	foo:foo 函数的引用, // 根据规则先找函数声明 找到了 foo
	a:1  // 根据规则 找声明变量 如果找到了 且没有被函数声明占用 就赋值undefined
	this:window,
}

还没有到 执行阶段 就已经可以看到答案了 a 会输出undefined   console.log(foo());会输出2



再疯狂抄一段代码

// demo2
function test() {
    console.log(foo);  // 创建阶段
    console.log(bar);   // 创建阶段

    var foo = 'Hello';
    console.log(foo);   // 由于上面代码已经处理过一次foo  所以对于foo 来说已经是执行阶段了 不信这里打印bar依旧是undefined
    var bar = function () {
        return 'world';
    }

    function foo() {
        return 'hello';
    }
}

test();

testEC = {
	VO:{},
	scopechain:{},
	this:'',
}

创建阶段
VO = {
	arguments: arguments,
	foo:foo 引用,  // 因为先找function foo 再找var foo，因为已经有了 function foo 所以 跳过 var foo
	bar: undefined,
}
执行阶段 - 进行函数引用 变量赋值

VO = {
	arguments: arguments,
	foo: 'Hello',
	bar: bar 引用,
	this:window,
}
***** 作用域 作用域链 闭包*****
先来抄个概念 在JavaScript中，我们可以将作用域定义为一套规则,这套规则用来管理引擎如何在当前作用域以及嵌套的子作用域中根据标识符名称进行变量查找。
作用域 和 执行上下文 很像。。。同时也有 全局作用域 函数作用域 eval作用域这个不太考虑基本没人用

对于这段代码
var a = 20;

function test() {
    var b = a + 10;

    function innerTest() {
        var c = 10;
        return b + c;
    }

    return innerTest();
}

test();

很明显用栈来描述一下执行上下文 global -> test -> innerTest

对于innerTest来说 innerTestEC = {VO:{},scopechain:[innerTestVO,testVO,globalVo]} 这里注意 当前作用域和上层作用域不是包含被包含的关系

***闭包是一种特殊的对象***

它由两部分组成。执行上下文(代号A)，以及在该执行上下文中创建的函数（代号B）。

当B执行时，如果访问了A中变量对象中的值，那么闭包就会产生。

所以，通过闭包，我们可以在其他的执行上下文中，访问到函数的内部变量。

******  记住 函数从哪边调都不要紧 能不能访问到还是要看函数本身所在的执行上下文

这个小总结所以抄的内容都在这 https://www.jianshu.com/p/21a16d44f150 


