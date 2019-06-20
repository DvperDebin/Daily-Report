export default {
  data () {
    return {
      colLabel: [],
      searchData: [],
      operateData: [],
      multipleSelection: [],
      buttonConfig: this.buttonOperates
    }
  },
  // props: ['tableData', 'pageParams', 'totalNum', 'showCol', 'deleteAPI', 'getInitialData', 'path', 'searchOpts', 'isSelectionShow', 'operatorOpts', 'cellClick', 'buttonOperates'],
  props: {
    tableData: Array,
    pageParams: Object,
    totalNum: Number,
    showCol: Array,
    deleteAPI: Function,
    getInitialData: Function,
    path: String,
    searchOpts: Array,
    isSelectionShow: Boolean,
    operatorOpts: Array,
    cellClick: Function,
    buttonOperates: Array,
    isEditDelete: {
      type: Boolean,
      default: true
    },
    isCreateButton: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    dynamicButton (method) {
      method()
    },
    dynamicMethod (method, id, path) {
      method(id, path)
    },
    async getSearchData () {
      window.localStorage.searchData = JSON.stringify(this.searchOpts)
      let expression = ''
      for (let i = 0; i < this.searchOpts.length; i++) {
        if (this.searchOpts[i].bindVal) {
          expression ? expression += ' AND ' + this.searchOpts[i].value + ' ' + this.searchOpts[i].operator + ' ' + this.searchOpts[i].bindVal : expression += this.searchOpts[i].value + ' ' + this.searchOpts[i].operator + ' ' + this.searchOpts[i].bindVal
        }
      }
      this.pageParams.page = 0
      this.pageParams.expression = expression
      await this.getInitialData(this.pageParams)
    },
    create () {
      this.$router.push({
        path: this.path
      })
    },
    editItem (id, path) {
      this.$router.push(
        {
          path,
          query: {
            id
          }
        })
    },
    deleteItem (id) {
      this.deleteAPI(id).then((res) => {
        this.$message({
          type: 'success',
          message: `删除成功`
        })
        this.pageParams.page = 0
        this.getInitialData(this.pageParams)
      })
    },
    handleSizeChange (size) {
      this.pageParams.size = size
      this.pageParams.page = 0
      this.getInitialData(this.pageParams)
    },
    handleCurrentChange (page) {
      this.pageParams.page = page - 1 || 0
      this.getInitialData(this.pageParams)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    handleCellClick (row, col, cell) {
      Object.prototype.toString.call(this.cellClick) === 'object Function' ? this.cellClick(row, col, cell) : console.log('no table-click function')
    },
    headerStyle () {
      return 'color:#606266;background-color:rgb(227,227,227);text-align:center'
    },
    cellStyle () {
      return 'text-align:center'
    }
  },
  beforeUpdate () {
    window.localStorage.searchData && JSON.parse(window.localStorage.searchData).length ? this.searchData = JSON.parse(window.localStorage.searchData) : this.searchData = this.searchOpts
  },
  beforeDestroy () {
    window.localStorage.searchData = JSON.stringify([])
  }
}
