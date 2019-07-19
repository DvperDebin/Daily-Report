<template>
  <div class="rotary_draw">
    <section class="rotary">
      <div class="rotary_box">
        <div class="ring_img_box" :style="{ 'transform': `rotate(${angle}deg)`, 'transition': transition}">
          <img class="ring_img" src="../../../public/imgs/ring_img.png" alt="rotary_img">
          <div class="content_wrapper">
            <div class="cn-wrapper" :style="{ 'transform': `rotate(-${ turnNum }turn)`}">
              <div class="item_text" v-for="(item,i) in items" :key="i"
                :style="{'transform': `rotate(${ turnNum * i }turn)`, 'z-index': `${i+20}`, 'background' : `url(${srcone}) center`}" v-show="i % 2 === 0">
                <span class="item_span" :style="{ 'transform': `rotate(${ turnNum }turn)`}">
                  {{item.desc}}
                   <img :src="item.imgSrc" class="item_gift_img">
                </span>
              </div>
              <div class="item_text" v-for="(item,i) in items" :key="i+20"
                :style="{'transform': `rotate(${ turnNum * i }turn)`, 'z-index': `${i+20}`, 'background' : `url(${srctwo}) center`}" v-show="i % 2 === 1">
                <span class="item_span" :style="{ 'transform': `rotate(${ turnNum }turn)`}">
                  {{item.desc}}
                    <img :src="item.imgSrc" class="item_gift_img">
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="pointer_img_box" @click="rotate" v-event-track="{ event: 'lucky draw_submit' }">
          <img class="pointer_img" src="../../../public/imgs/pointer_img.png" alt="pointer_img">
        </div>
      </div>
    </section>
    <div class="frequency">
      您还有<span class="frequency_num"> {{count}} </span>次抽奖的机会
    </div>
    <div class="info">
      <div class="points line">
        <span class="current">现有活力值:</span>
        <span class="current_point">{{currentPoints}}</span>
      </div>
      <div class="points right">
        <span class="expire">所需活力值:</span>
        <span class="expire_point">{{expirePoints}}</span>
      </div>
    </div>
    <div class="winning_record" v-show="rankList.length && rankList[0].nickName">
      <div class="winning_list" ref="winningList">
        <div class="winning_record_item" v-for="(item, index) in rankList" :key="index">
          {{item.nickName}}抽中{{item.prizeName}}
        </div>
      </div>
      <div class="winning_list">
        <div class="winning_record_item" v-for="(item, index) in rankList" :key="index">
          {{item.nickName}}抽中{{item.prizeName}}
        </div>
      </div>
    </div>
    <div class="prize">
      <div class="prize_item prize_set">
        <img class="prize_set_img" src="../../../public/imgs/draw_setting.png" alt="">
      </div>
      <div class="prize_item prize_img_box">
      </div>
      <div class="prize_item page">
        <ul class="prize_list" ref="prizeList">
          <li class="prize_list_li" v-for="(item, index) in prizeList" :key="index" v-show="index < 3">
            {{item.grade}}: {{item.desc}}
          </li>
        </ul>
      </div>
    </div>
    <div class="rule_link">
      <span class="rule_text" @click="goRule">抽奖规则</span>
    </div>
    <div class="mask_content" v-if="isShowConfirmDialog">
      <div class="confirm_dialog confirm_dialog_two" v-if="isPumping">
        <div class="confirm_dialog_tip">恭喜您抽中</div>
        <div class="dialog_content dialog_content_pize">
          {{message}}
        </div>
        <div class="dialog_btns">
          <button class="dialog_button_two" @click="confirm">收入囊中</button>
        </div>
      </div>
      <div class="confirm_dialog" v-else>
        <div class="dialog_content">
          {{message}}
        </div>
        <div class="dialog_btns">
          <button class="dialog_button dialog_button_confirm" @click="confirm">{{btnName ? '确认' : '领取'}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>/* eslint-disable */
function getImgUrl (stops) {
  let gradient = new ConicGradient({
    stops, // required
    repeating: true, // Default: false
    size: 715 // Default: Math.max(innerWidth, innerHeight)
  })
  return gradient.dataURL
}
import wx from 'weixin-js-sdk'
import { animation } from '../../../public/js/animate.js'
import { StartDraw, GetDrawDetail, GetDrawCount,ShareGetMoreTimes, GetDrawRank } from '../../api/draw_api.js'
import { GetWxAyth } from '../../api/wxAuth'
import { GetUserInfo } from '../../api/wechat_auth.js'
import store from '../../store'
import DRAWGIFT from '../../../public/imgs/draw_gift.png'
import POINTSRC from '../../../public/imgs/point.png'
import HUGEPOINTSRC from '../../../public/imgs/hugePoint.png'
export default {
  data () {
    return {
      isTopNavShow: true,
      items: [],
      turnNum: 0,
      currentPoints: 0, // 持有活力值
      expirePoints: 0, // 过期活力值
      prizeList: [],
      angle: 0,
      srcone: '',
      srctwo: '',
      count: 0, // 抽奖次数,
      message: 'dsadas!!!', // 中奖信息，
      isShowConfirmDialog: false,
      transition: '',// 过渡动画
      leveArr: ['奖品一', '奖品二', '奖品三', '奖品四', '奖品五', '奖品六', '奖品七', '奖品八', '奖品九', '奖品十', '奖品十一', '奖品十二', '奖品十三', '奖品十四', '奖品十五', '奖品十六', '奖品十七', '奖品十八', '奖品十九', '奖品二十'],
      animate: false,
      btnName: true,
      params: {
        drawId: 'MEetxUPpRizDBWZtqZiyZS',
        memberCode: ''
      },
      giftId: '',
      btnDisable: false,
      memberInfo: '',
      userInfo: '',
      drawId: '',
      link: '',
      prizeListH: 0,
      winningListH: 0,
      rankList: [
        { prizeName: '', nickName: '' },
        { prizeName: '', nickName: '' }
      ],
      isPumping: false,
    }
  },
  methods: {
    goRule () {
      this.$router.push({
        path: '/draw_rule'
      })
    },
    async rotate () {
      if (this.btnDisable) {
        this.$toast('已经在抽奖中...')
        return
      }
      this.btnDisable = true
      let res = await StartDraw(this.params)
      // 有未领取的奖品
      if (res.data.code === 1001) {
        this.isShowConfirmDialog = true
        this.message = res.data.msg
        this.btnName = false
        this.giftId = res.data.data
        this.isPumping = false
      } else if (!res.data.code) {
        // 抽奖成功
        let smallAngle = 360 / this.items.length
        let random = Math.floor(Math.random() * smallAngle - (smallAngle / 2))
        // 先调接口 获取奖项 然后计算出在数组中的index值 最后动态算出角度
        let x = ''
        this.items.forEach((currentValue, index) => {
          if (res.data.data.prizeType === 'GIFT') {
            if (currentValue.desc === res.data.data.prizeName + '一份') {
              x = index
            }
          } else {
            if (currentValue.desc === (res.data.data.point > 50 ? '活力值大礼包' : res.data.data.point + '活力值')) {
              x = index
            }
          }
        })
        let angle = ((360 * 5) - (360 / this.items.length) * x) + random
        this.message = this.items[x].desc
        this.transition = 'transform 10s ease-in-out'
        this.angle = angle
        setTimeout(()=>{
          this.isShowConfirmDialog = true
          if (res.data.data.prizeType === 'GIFT') {
            this.giftId = res.data.data.drawRecordId
            this.btnName = false
          } else {
            this.btnName = true
          }
          this.isPumping = true
          this.init()
        },11000)
      } else {
        // 失败或没有次数了
        this.isShowConfirmDialog = true
        this.isPumping = false
        this.message = res.data.msg
        this.btnName = true
      }
    },
    async getGiftList () {
      let res = await GetDrawDetail('MEetxUPpRizDBWZtqZiyZS')
      if (!res.data.code) {
        this.drawId = res.data.data.id
        this.prizeList = res.data.data.prizeInfo
        this.expirePoints = res.data.data.exchange
      } else {
        this.prizeList = []
      }
      this.prizeList.forEach((item, index) => {
        item.grade = this.leveArr[Number(item.level) - 1]
        if (item.prizeType === 'GIFT') {
          item.desc = item.prizeName + '一份'
          this.items.push({desc: item.desc, imgSrc:DRAWGIFT})
        } else {
          item.desc = item.point + '活力值'
          item.desctwo = item.point <= 50 ? item.point + '活力值' : '活力值大礼包'
          let POINTIMGSRC = item.point <= 50 ? POINTSRC : HUGEPOINTSRC
          this.items.push({desc: item.desctwo, imgSrc:POINTIMGSRC})
        }
      })
      this.turnNum = 1 / (this.items.length)
      let itemLength = this.items.length
      this.srcone = getImgUrl(`transparent 0%, transparent ${50 / itemLength}%, #fda6ae ${50 / itemLength}%, #fda6ae ${150 / itemLength}%, transparent ${150 / itemLength}%, transparent 100%`)
      this.srctwo = getImgUrl(`transparent 0%, transparent ${50 / itemLength}%, #bc8750 ${50 / itemLength}%, #fbcf79 ${58 / itemLength}%, #fbcf79 ${142 / itemLength}%, #bc8750 ${150 / itemLength}%, transparent ${150 / itemLength}%, transparent 100%`)
    },
    async init() {
      const data = await GetUserInfo(this.userInfo.openId)
      // const data = await GetUserInfo('oHY_K07-cgxRNc-RFIKjCDNkMjV0')
      this.memberInfo = data.data.data
      if (!this.memberInfo) {
        this.memberInfo = this.$store.state.memberInfo
      }
      this.params.memberCode = this.memberInfo.memberCode
      const res = await GetDrawCount(this.params)
      this.count = res.data.data.totalNumber - res.data.data.alreadyNumber
      this.currentPoints = this.memberInfo.availablePoints
    },
    confirm () {
      if (!this.btnName) {
        this.$router.push({
          path: '/user_info',
          query: {
            id: this.giftId
          }
        })
      }
      // 取消过渡动画
      this.transition = 'none'
      // 关闭蒙层
      this.isShowConfirmDialog = false
      // 角度归零
      this.angle = 0
      this.btnDisable = false
    },
    goBack () {
      this.$router.go(-1)
    },
    async share () {
      let that = this
      let res = ''
      let url = ''
      // 如果不是ios 就在组件里调即可
      if (!isIos()) {
        url = window.location.href
        res = await GetWxAyth({ url })
      } else {
        url = store.getters['getWxSignUrl']
        res = await GetWxAyth({ url })
      }
      let initialWxConfig = res.data.data
      let config = Object.assign({
        debug: false,
        appId: 'wx5e7a1d287f79763e',
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
      }, initialWxConfig)
      wx.config(config)
      wx.error(function(res){
        console.log(res)
      });
      console.log(that.link)
      wx.ready(function () {
        wx.onMenuShareTimeline({
          link: that.link,
          title: '善存钙尔奇会员中心',
          desc: '善存钙尔奇会员中心 分享注册加抽奖次数',
          imgUrl: 'http://wechat.pfizer.luckhut.com/static/wechat/logo.png'// 分享图标
        })
        wx.onMenuShareAppMessage({
          link: that.link,
          title: '善存钙尔奇会员中心',
          desc: '善存钙尔奇会员中心 分享注册加抽奖次数',
          imgUrl: 'http://wechat.pfizer.luckhut.com/static/wechat/logo.png' // 分享图标
        })
      })
    },
    // 抽奖排名动画
    wheelTwo () {
      let that = this
      animation(that.$refs.winningList, {
        data: {
          marginTop: -that.winningListH
        }
      }, (that.rankList.length / 2) * 2000, function () {
        if (that.$refs.winningList && that.$refs.winningList.style !== undefined) {
          that.$refs.winningList.style.marginTop = 0
        }
        that.wheelTwo()
      })
    },
    async ranking () {
      let that = this
      let res = await GetDrawRank({drawId: this.drawId})
      if (!res.data.code) {
        this.rankList = res.data.data
        if (this.rankList.length > 2) {
          this.$nextTick(() => {
            this.winningListH = this.$refs.winningList.offsetHeight
            this.wheelTwo()
          })
        }
      }
    }
  },

  async mounted () {
    this.userInfo = window.localStorage.getItem('userInfo')
    if (!this.userInfo) {
      this.userInfo = this.$store.state.userInfo
    } else {
      this.userInfo = JSON.parse(this.userInfo)
    }
    await this.getGiftList()
    await this.ranking()
    await this.init()
    if (!getUrlParam('drawId') && !getUrlParam('share_id') && !getUrlParam('recommendType')){
      this.link = window.location.href + '?share_id=' + JSON.parse(window.localStorage.member).memberCode + '&drawId=' + this.drawId + '&recommendType=ADD_DRAW_COUNT'
    } else {
      this.link = document.location.protocol + '//' + window.location.host + '/pfizer/rotary_draw' + '?share_id=' + JSON.parse(window.localStorage.member).memberCode + '&drawId=' + this.drawId + '&recommendType=ADD_DRAW_COUNT'
    }
    await this.share()
  }
}
function isIos () {
  const u = navigator.userAgent
  return u.indexOf('iPhone') > -1 || u.indexOf('Mac OS') > -1
}
function getUrlParam (name) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  let r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}
</script>

<style scoped lang="scss" src="./rotary_draw.scss">
</style>
