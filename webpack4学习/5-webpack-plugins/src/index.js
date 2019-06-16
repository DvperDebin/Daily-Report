import createAavatar from './createAvatar'
import style from './index.scss' // 配合css module 使用
import avatar from "./avatar.jpg";

createAavatar();

createAavatar();

let img = new Image();
img.src = avatar;
img.className = style.avatar;
let root = document.getElementById('root');
root.append(img);
