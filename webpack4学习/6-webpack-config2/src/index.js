import createAavatar from './createAvatar'
//import "@babel/polyfill" // 补充低版本浏览器没有的 es6 语法, useBuiltIn:usage 设置后 这里可以remove
import style from './index.scss' // 配合css module 使用
import avatar from "./avatar.jpg";

createAavatar();

createAavatar();

let img = new Image();
img.src = avatar;
img.className = style.avatar;
let root = document.getElementById('root');
root.append(img);

let btn = document.createElement('button');
btn.innerText = 'add';
document.body.appendChild(btn);

let num = 0;
btn.onclick = function (e) {
  let count = num ;
  let span = document.createElement('span');
  span.innerText = 'item' + count;
  document.body.appendChild(span);
  num++
};
