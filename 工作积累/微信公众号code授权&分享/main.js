import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import 'normalize.css'
import './assets/style/index.scss'
import { InputNumber, MessageBox, Input } from 'element-ui'
import { Icon, NavBar, Field, Picker, Popup, DatetimePicker, Toast, Checkbox, CheckboxGroup, Dialog, Area, Button, RadioGroup, Radio, Lazyload, AddressList, Tab, Tabs, Pagination, List, Swipe, SwipeItem } from 'vant'
import { GetAuthUnionId, GetUserInfo } from './api/wechat_auth.js'
import { EventTrack } from './api/wxAuth'
Vue.use(InputNumber).use(Input)
Vue.use(Icon).use(NavBar).use(Field).use(Picker).use(Popup).use(DatetimePicker).use(Toast).use(CheckboxGroup).use(Checkbox).use(Dialog).use(Area).use(Button).use(RadioGroup).use(Radio).use(Lazyload).use(AddressList).use(Tab).use(Tabs).use(Pagination).use(List).use(Swipe).use(SwipeItem)
Vue.config.productionTip = false
Vue.prototype.$confirm = MessageBox.confirm

// 埋点指令
Vue.directive('event-track', {
  bind (el, binding) {
    el.addEventListener('click', () => {
      let data = {
        behavior: 'CLICK',
        button: binding.value.event,
        page: window.location.href,
        channel: 'WECHAT',
        memberCode: window.localStorage.member ? JSON.parse(window.localStorage.member).memberCode : '',
        unionId: window.localStorage.getItem('userInfo') ? JSON.parse(window.localStorage.getItem('userInfo')).unionId : '',
        openId: window.localStorage.getItem('userInfo') ? JSON.parse(window.localStorage.getItem('userInfo')).openId : ''
      }
      EventTrack(data)
    })
  }
})
// 路由守卫
router.beforeEach((to, from, next) => {
  // 微信授权获取openId
  let ua = window.navigator.userAgent.toLowerCase()
  // 是否为微信端
  if (String(ua.match(/MicroMessenger/i)) === 'micromessenger') {
    // 获取ls中的个人信息数据
    let userInfo = window.localStorage.getItem('userInfo')
    userInfo = userInfo ? JSON.parse(userInfo) : ''
    if (isIos()) store.commit('setWxSignUrl', getWechatSignUrl()) // 如果是ios 就记录第一次进入的页面url
    // 判断是否有userInfo和openId，没有说明第一次进入，使用code获取openId,unionID等信息
    if (!userInfo || !userInfo.openId) {
      // 判断路径是否有code
      if (!getUrlParam('code')) {
        // 配置微信接口路径获取code
        let WXAuthorizeUrl = window.location.href
        let appid = 'wx5e7a1d287f79763e'
        let redirectUri = encodeURIComponent(WXAuthorizeUrl)
        let responseType = 'code'
        let scope = 'snsapi_userinfo'
        let authorizeUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' + redirectUri + '&response_type=' + responseType + '&scope=' + scope + '&connect_redirect=1#wechat_redirect'
        window.location.href = authorizeUrl
      } else {
        // 根据code获取userInfo和openId
        GetAuthUnionId(getUrlParam('code')).then(res => {
          window.localStorage.setItem('userInfo', JSON.stringify(res.data))
          // 根据openId获取会员信息
          checkUserStatus(res.data.openId, next, to)
        })
      }
    } else {
      checkUserStatus(userInfo.openId, next, to)
    }
  } else {
    if (to.fullPath === '/complete_info') {
      next()
    } else {
      next()
      // alert('请在微信浏览器中打开')
    }
  }
})

function checkUserStatus (openId, next, to) {
  if (to.fullPath === '/attention_sub' || to.fullPath === '/register' || to.fullPath === '/attention' || to.fullPath === '/share_add_point' || to.fullPath === '/rotary_draw_two') {
    next()
  } else {
    GetUserInfo(openId).then((data) => {
      // code  0有数据  -1报错  2001未注册 2002用户未关注
      if (data.data.code === 0) {
        window.localStorage.member = JSON.stringify(data.data.data)
        if (!store.state.orderAddress) {
          if (data.data.data.proAddress && data.data.data.proAddress.province) {
            store.state.orderAddress = data.data.data.proAddress
          }
        }
        next()
      } else if (data.data.code === -1) {
        alert('系统繁忙')
      } else if (data.data.code === 2001) {
        alert('您未注册，请先注册')
        next({ path: '/register' })
      } else if (data.data.code === 2002) {
        alert('您未关注，请先关注')
        next({ path: '/attention' })
      }
    })
  }
}

function getUrlParam (name) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  let r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}

function isIos () {
  const u = navigator.userAgent
  return u.indexOf('iPhone') > -1 || u.indexOf('Mac OS') > -1
}

function getWechatSignUrl () {
  if (isIos()) {
    return window.location.href
  }
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
