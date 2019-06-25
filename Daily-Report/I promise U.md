关于Promise

日常中我们使用Promise基本都是在发送ajax时使用，比如有两个请求 第二个请求需要第一个请求的返回值作为参数
这个时候就会用到promise.then()

Promise对象有三种status
pending: 等待中，或者进行中，表示还没有得到结果
resolved(Fulfilled): 已经完成，表示得到了我们想要的结果，可以继续往下执行 - 简单来说就是success
rejected: 也表示得到结果，但是由于结果并非我们所愿，因此拒绝执行 - 简单来说就是Error

手写一个小例子

  function fn(num) {
    return new Promise( function (res,rej) {
      if(num >10){
        res( num +' > 10')
      }else{
       rej('error')
      }
    })
  }

  fn(1).then((res) => {
    console.log(res);
  }).catch( (rej) => {
    console.log(rej);
  })
  // then 是成功的回调  catch 是失败的回调
  //  很简单 但是感觉很麻烦啊！不能随意调fn，必须要.then 或者.catch 得到结果
  
  // 稍微改造下
  
    function fn(num) {
    return new Promise( function (res,rej) {
      if(num >10){
        res( num +' > 10')
      }else{
       rej('error')
      }
    }).then( (res) => {
      console.log(res);
    }).catch( (rej) => {
      console.log(rej);
    })
  }

  fn(12);
  
*****Promise.all***** 当有一个ajax请求，它的参数需要另外2个甚至更多请求都有返回结果之后才能确定，那么这个时候，就需要用到Promise.all来帮助我们应对这个场景。
Promise.all()一般会接收一个数组作为参数 例如  Promise.all([getJSON(url), getJSON(url1)]);  假如getJSON是我们封装好的类似于axios的调接口函数，那么这边代码意思就是
等请求url 和 url1的接口都返回信息的时候再去执行其他。 Promise.all() 也会返回一个promise，所以还是需要用either .then() or .catch() 来使用

例如 ：
Promise.all([getJSON(url), getJSON(url1)]).then((res)=> {
  console.log(res)
})

***Promise.race*** 和promise.all 基本一样 只有一点 ****POromise.race( [arg1,arg2,...]) 接收的数组参数中只要有一个是promise.resolve状态 就可以执行Promise.race([arg1,arg2,..]).then ()
