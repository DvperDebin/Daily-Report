<template>
  <div class="imgLoadWrapper">
    <input type="file" id="selectFile" ref="fileInput" @change="selectFile">
    <div class="select_content" @click="addImg">
      <i class="el-icon-plus" v-show="!imgSrc"></i>
      <img :src="imgSrc" alt="封面图片" v-show="imgSrc" class="cover_img">
    </div>
  </div>
</template>

<script src="imgShow.js">

</script>

<style scoped lang="scss" src="imgShow.scss">

</style>
