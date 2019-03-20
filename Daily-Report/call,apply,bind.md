// call apply 都是为了解决改变this 的指向 作用相同，只是传参方式不同
// call 可以以多个参数的形式传入 apply 只接受两个参数 第二个参数是数组
let a = {
  value: 1
}
function getValue(name, age) {
  console.log(name)
  console.log(age)
  console.log(this.value)  // 如果不改变this 的指向，这里就会报错 这里this 指向window
}
getValue.call(a, 'yck', '24')//  把this 的指向从window 改到了 a，后面两个参数是getValue需要的
getValue.apply(a, ['yck', '24'])// 同理 只不过getValue需要的参数以数组的形式传入
getValue.bind(a,'yck', '24')(); // bind 也会改变this 指向 参数也是多个传入 但是 会返回一个函数 需要再次调用
