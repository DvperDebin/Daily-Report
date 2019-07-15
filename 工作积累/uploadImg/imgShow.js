export default {
  data () {
    return {
      imgSrc: ''
    }
  },
  methods: {
    addImg () {
      this.$refs.fileInput.click()
    },
    selectFile () {
      this.loadImg()
    },
    loadImg () {
      // 读取文件信息
      let imageData = this.$refs.fileInput.files[0]
      // 创建formData对象
      let formData = new window.FormData()
      // 文件大小限制
      formData.append('imageData', imageData)
      let imgInfo = formData.getAll('imageData')
      if ((imgInfo[0].size / 1024 / 1024) > 2) {
        this.$message({
          type: 'error',
          message: `文件不能大于2MB`
        })
        return
      }
      // 创建fileReader
      let fileReader = new window.FileReader()
      fileReader.readAsDataURL(imageData)
      fileReader.onload = (e) => {
        this.imgSrc = e.target.result
      }
    }
  }
}
