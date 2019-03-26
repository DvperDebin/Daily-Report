    <el-dialog title="导入数据" :visible.sync="dialogFormVisible">
      <el-upload
        class="upload-demo"
        ref="upload"
        action="http://47.100.228.18:12001/api/saas-crm-master-data/counter/import"
        :data="data"
        :file-list="fileList"
        accept=".csv"
        :headers="header"
        :on-change="addFile"
        :on-success="refresh"
        :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUpload">确 定</el-button>
      </div>
    </el-dialog>

    data(){
    return {
      searchData:{
        name:'',
      },
      fileList:[],
    }
  },
  computed:{
    header(){
      return{
        'Authorization':window.localStorage.token,
        'tenant':localStorage.tenant,
      }
    },
    data(){
      return {
        'zone':localStorage.zone,
      }
    }
  },

    // 添加文件
    addFile(file,fileList){
      this.fileList = fileList;
    },
    // 提交
     submitUpload(){
      this.$refs.upload.submit();
      this.dialogFormVisible = false;
    },
    // refresh
    refresh(){
      this.pageParams.page = this.pageParams.page -1;
      this.getCounters(this.pageParams);
    },
    // dialog显示
    addData(){
      this.dialogFormVisible = true;
    },