import avatar from './avatar.jpg';
import style from './index.scss' // 依旧配合css module 使用
function createAvatar() {
    let img = new Image();
    img.src = avatar;
    img.className = style.other_avatar;
    let root = document.getElementById('root');
    root.append(img);
}

export default createAvatar
