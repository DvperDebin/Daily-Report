浏览器的储存方式 cookie sessionstorage localstorage

localStorage  和 sessionStorage 都是本地存储 存储在客户端

LS：生命周期永久 除非代码操作或者用户在工具中手动清除 否则不会清除 存放大小为5M 不参与和服务器的通信 

SS：仅在当前会话下有效，关闭页面或者浏览器后数据会被清除 存放大小5M  

注意：不同浏览器之间不能共享LS 和 SS的内容。
      相同浏览器 不同的页签可以共享LS的内容 但是相同浏览器下不同页签之间不可以共享SS的内容。
      


Cookie: 
document.cookie = "cookieData='cookie test data';expires="+new Date(new Date().getTime()-1).toGMTString(); // 设置一个cookie和过期时间
document.cookie // 获取所有cookie

Cookie 生命周期是在代码中设置的 在过期时间到后会失效 存放大小4KB  最好不能超过20个 会在通信中放到Request Hearder中

原生的Cookie 很不友好，我对cookie 原生操作不够了解 从网上找到了封装好还可用的几个方法：

// 设置过期时间以天为单位
function setCookie(c_name,value,expiredays){
    var exdate=new Date();
    exdate.setDate(exdate.getDate()+expiredays);
    document.cookie=c_name+ "=" +escape(value)+
    ((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
  }
    setCookie('userName','xxx',1); // cookie过期时间为1天。

// 设置过期时间以秒为单位
function setCookie(c_name,value,expireseconds){
    var exdate=new Date();
    exdate.setTime(exdate.getTime()+expireseconds * 1000);
    document.cookie=c_name+ "=" +escape(value)+
    ((expireseconds==null) ? "" : ";expires="+exdate.toGMTString())
}
setCookie('userName','xxx',3600);  //cookie过期时间为一个小时


  // 读取某个Cookie。
  function getCookie(userName){
      if (document.cookie.length>0){
        c_start=document.cookie.indexOf(userName+ "=");
        if (c_start!=-1){
          c_start=c_start + userName.length+1;
          c_end=document.cookie.indexOf(";",c_start);
          if (c_end==-1){ 
              c_end=document.cookie.length;
          }
          return unescape(document.cookie.substring(c_start,c_end));
        }
     }
    return "";
}
  var  userName = getCookie('userName');

***Cookie优点：
   1. 高度的可扩展性和可用性
   2. 设置一个永远不会有效的cookie 可以保证如果被盗取 那么cookie也是无效的

***Cookie 缺点
   1. 大小限制4KB 条数最好不能超过20条
   2. 安全性 如果被拦截 那就会获得所有session信息

***Cookie 和 Session 之间的关系 
   首先，不是和sessionStorage之间的关系。 因为HTTP是无状态协议 所以当用户访问网站时 很难分清谁是谁 这时候就有了Cookie。
   客户端请求服务端，服务端会为这次请求开辟一块内存空间，这个对象便是Session对象 服务器可以利用session存储客户端在同一个会话期间的一些操作记录。
    流程：服务器第一次接收到请求时，开辟了一块Session空间（创建了Session对象），同时生成一个Session id，并通过响应头，向客户端发送要求设置cookie的响应
	       客户端收到响应后，在本机客户端设置了一个关于sessionId的cookie信息，该cookie的过期时间为浏览器会话结束（页面或者浏览器关闭）
		   接下来客户端每次向该网站发送请求时，请求头都会带上该cookie信息（包含Session id）； 然后，服务器通过读取请求头中的Cookie信息获取sessionId；
   最后别忘了Session是存储在服务端中的 Cookie是存储在客户端中的

// 总结

LS SS Cookie 共同点： 那就是都是同源的 且 都是保存在浏览器 也就是客户端中！
