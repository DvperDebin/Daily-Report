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
                  {{item}}
                </span>
              </div>
              <div class="item_text" v-for="(item,i) in items" :key="i+20"
                :style="{'transform': `rotate(${ turnNum * i }turn)`, 'z-index': `${i+20}`, 'background' : `url(${srctwo}) center`}" v-show="i % 2 === 1">
                <span class="item_span" :style="{ 'transform': `rotate(${ turnNum }turn)`}">
                  {{item}}
                </span>
              </div>
              <!-- <div class="line" v-for="(item,index) in items" :key="index+50"
               :style="{'transform': `rotate(${ turnNum * index + turnNum / 2}turn)`, 'z-index': `${index+50}`}">
               </div>-->
            </div>
          </div>
        </div>
        <div class="pointer_img_box">
          <img class="pointer_img" src="../../../public/imgs/pointer_img.png" alt="pointer_img">
        </div>
      </div>
    </section>
    <div class="info">
      <div class="points line">
        <span class="current">现有积分:</span>
        <span class="current_point">{{currentPoints}}</span>
      </div>
      <div class="points right">
        <span class="expire">所需积分:</span>
        <span class="expire_point">{{expirePoints}}</span>
      </div>
    </div>
    <div class="prize">
      <div class="prize_item prize_set">奖项设置</div>
      <div class="prize_item prize_img_box">
        <img class="prize_img" src="../../../public/imgs/gift_img.png" alt="prize">
      </div>
      <div class="page">
        <ul class="prize_list">
          <li class="prize_list_li" v-for="(item, index) in prizeList" :key="index">
            {{item.grade}}: {{item.desc}}
          </li>
        </ul>
        <ul class="prize_list">
          <li class="prize_list_li" v-for="(item, index) in prizeList" :key="index">
            {{item.grade}}: {{item.desc}}
          </li>
        </ul>
      </div>
    </div>
    <div class="frequency">
      您还有<span class="frequency_num"> {{times}} </span>次免费抽奖的机会
    </div>
    <div class="start_btn" @click="rotate">
      开始抽奖
    </div>
    <div class="mask_content" v-if="isShowConfirmDialog">
      <div class="confirm_dialog" >
        <div class="dialog_content">
          {{message}}
        </div>
        <div class="dialog_btns">
          <button class="dialog_button dialog_button_confirm" @click="confirm">确认</button>
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

export default {
  data () {
    return {
      isTopNavShow: true,
      items: ['20积分', '谢谢参1', '150积分', '谢谢参2', '150积分', '谢谢参2', '150积分', '谢谢参2', '150积分', '谢谢参2'],
      turnNum: 0,
      currentPoints: '500', // 持有积分
      expirePoints: '300', // 过期积分
      prizeList: [
        {
          grade: '一等奖',
          desc: '精美礼品一份'
        },
        {
          grade: '二等奖',
          desc: '50积分'
        },
        {
          grade: '三等奖',
          desc: '20积分'
        }
      ],
      angle: 0,
      srcone: '',
      srctwo: '',
      times: 2, // 抽奖次数,
      message: '', // 中奖信息，
      isShowConfirmDialog: false,
      transition: '',// 过渡动画
      animate: false
    }
  },
  methods: {
    rotate () {
      if (!this.times) {
        // 蒙层显示 没有次数
        this.isShowConfirmDialog = true
        this.message = '您没有可用的抽奖次数了'
        return
      }
      let smallAngle = 360 / this.items.length
      let random = Math.floor(Math.random() * smallAngle - (smallAngle / 2))
      // 先调接口 获取奖项 然后计算出在数组中的index值 最后动态算出角度
      let x
      x = this.items.findIndex( (currentValue) => {
        return currentValue === '谢谢参2'
      })
      let angle = ((360 * 5) - (360 / this.items.length) * x) + random
      this.transition = 'transform 10s ease-in-out'
      this.angle = angle
      setTimeout(()=>{
        this.isShowConfirmDialog = true
        this.message = this.items[x]
      },10500)
    },
    confirm () {
      // 取消过渡动画
      this.transition = 'none'
      // 关闭蒙层
      this.isShowConfirmDialog = false
      // 角度归零
      this.angle = 0
    },
    goBack () {
      this.$router.go(-1)
    }
  },
  mounted () {
    this.turnNum = 1 / (this.items.length)
    this.srcone = getImgUrl(`transparent 0%, transparent ${this.turnNum * 50}%, #ffef52 ${this.turnNum * 50}%, #ffef52 ${this.turnNum * 150}%, transparent ${this.turnNum * 150}%, transparent 100%`)
    this.srctwo = getImgUrl(`transparent 0%, transparent ${this.turnNum * 50}%, #54b6fd ${this.turnNum * 50}%, #54b6fd ${this.turnNum * 150}%, transparent ${this.turnNum * 150}%, transparent 100%`)
  }
}
</script>

<style scoped lang="scss" src="./rotary_draw.scss">
</style>

