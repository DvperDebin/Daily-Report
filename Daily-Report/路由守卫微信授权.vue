router.beforeEach((to, from, next) => {
// 微信授权获取openId
let ua = window.navigator.userAgent.toLowerCase()
if (String(ua.match(/MicroMessenger/i)) === 'micromessenger') {
let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
if (!userInfo || !userInfo.unionId) {
if (!getUrlParam('code')) {
let WXAuthorizeUrl = window.location.href
let appid = 'wx691caf5d049d69e1'
let redirectUri = encodeURIComponent(WXAuthorizeUrl)
let responseType = 'code'
let scope = 'snsapi_userinfo'
let authorizeUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' + redirectUri + '&response_type=' + responseType + '&scope=' + scope + '&connect_redirect=1#wechat_redirect'
window.location.href = authorizeUrl
} else {
GetAuthUnionId(getUrlParam('code')).then(res => {
window.localStorage.setItem('userInfo', JSON.stringify(res.data))
GetUserInfo(res.data.unionId).then((data) => {
window.localStorage.member = JSON.stringify(data.data)
if (data.data) {
next()
} else {
next({ path: '/register' })
}
})
})
}
} else {
next()
}
} else {
next()
}
})
