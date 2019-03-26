<template>
    <div class="upload_wrapper">
        <div class="bar-container">
            <div class="fl"><span class="title-container">Audience File Upload</span> <i  @click="cancel()" style="color:#627892;margin-left:20px;cursor: pointer" class="iconfont icon-return"></i></div>
            <div class="fr" style="position: relative">
                <div class="bread-container">
                    <el-breadcrumb separator-class="el-icon-arrow-right" >
                        <el-breadcrumb-item>Home</el-breadcrumb-item>
                        <el-breadcrumb-item>CRM Campaign</el-breadcrumb-item>
                        <el-breadcrumb-item :to="{ path: '/campaign/audience/list' }">Audience List</el-breadcrumb-item>
                        <el-breadcrumb-item>Audience File Upload</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
            </div>
        </div>
        <div class="file_info">
            <el-row class="name">
                <el-col :span="3" class="type">
                    <span>Name:</span>
                </el-col>
                <el-col :span="7" class="input">
                    <el-input placeholder="Please input" v-model.trim="name">
                    </el-input>
                </el-col>
            </el-row>
            <el-row class="program">
                <el-col :span="3" class="type">
                    <span>Marketing Program:</span>
                </el-col>
                <el-col :span="7" class="input">
                    <el-select v-model.trim="mpId">
                        <el-option
                                v-for="item in $createMarketingProgramOption"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row class="file">
                <el-col :span="3" class="type">
                    <span>File Upload:</span>
                </el-col>
                <el-col :span="7" class="input">
                    <a href="javascript:;" class="file">Select File
                        <input type="file" accept=".csv" id="fileinput" @change="selectFile()">
                    </a>
                    <el-button style="margin-left: 10px;" size="small" type="success" @click="uploadBlob()">Upload to the server</el-button>
                </el-col>
            </el-row>
            <el-row class="fileName" type="flex">
                <el-col :span="3"></el-col>
                <el-col :span="5" class="input">
                   {{fileName}}
                </el-col>
                <el-col :span="2" class="loading" v-show="isLoadingShow">
                    <div class="fl"> Loading... </div> <div class="fl circle"> <i class="iconfont icon-loading"></i> </div>
                </el-col>
                <el-col :span="2" class="finish" v-show="isFinishShow">
                    Finished <i class="iconfont icon-finished"></i>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                isLoadingShow:false,
                isFinishShow:false,
                mpId:'',
                name:'',
                fileList:[],
                url:'',
                blobService:'',
                file:'',
                fileName:'',
                fileSize:0,
                activeName:'',
            }
        },
        mounted(){
            this.activeName = this.$route.query.activeName;
        },
        methods: {
            selectFile(){
                this.isLoadingShow = false;
                this.isFinishShow = false;
                const file = document.getElementById('fileinput');
                let value = file.value;
                let index = value.lastIndexOf("\\");
                let newVal = value.substring(index+1);
                this.fileName = newVal;
                const selectedFile = document.getElementById('fileinput').files[0];
                if(selectedFile){
                    this.fileSize = selectedFile.size
                }

            },

            uploadBlob(){
                let that = this;
                const file = document.getElementById('fileinput').files[0];
                let extName = '';
                if(file){
                     let fileName = file.name;
                     let index = fileName.lastIndexOf(".");
                     extName = fileName.substring(index+1);
                 }
                // 基本信息验证
                if(!this.name){
                    this.$message({
                        showClose: true,
                        message: 'Please input name.',
                        type: 'error'
                    });
                    return;
                }
                if(!this.mpId){
                    this.$message({
                        showClose: true,
                        message: 'Please select Marketing Program.',
                        type: 'error'
                    });
                    return;
                }
                // 判断是否有文件
                if(!file){
                    this.$message({
                        showClose: true,
                        message: 'Please select a file.',
                        type: 'error'
                    });
                    return;
                }
                if(extName != 'csv'){
                    this.$message({
                        showClose: true,
                        message: 'Please select a csv file.',
                        type: 'error'
                    });
                    return;
                }
                // 大小限制
                const isLt10M = file.size / 1024 / 1024 < 10;
                if(!isLt10M){
                    this.$message({
                        showClose: true,
                        message: 'File size should not be greater than 10M',
                        type: 'error'
                    });
                    return;
                }
                // loading 加载
                this.isLoadingShow = true;
                // 获取sas token
                let sas = '',name='';
                this.$ajaxWrap({
                    type: "GET",
                    url: "/cm-campaign/api/token",
                    success(res) {
                        sas = res.data.SasToken;
                        name = res.data.AccountName;
                        // 创建blob service实例
                        const account = {
                            name,
                            sas
                        };
                        const blobUri = 'https://' + account.name + '.blob.core.chinacloudapi.cn';
                        const blobService = AzureStorage.Blob.createBlobServiceWithSas(blobUri, account.sas);

                        // 上传文件
                        blobService.createBlockBlobFromBrowserFile('campaign',
                            file.name,
                            file,
                            (error, result) => {
                                if(error) {
                                    console.log('upload fail');
                                    // Handle blob error
                                } else {
                                    console.log('upload success');
                                    // 上传成功
                                    let upLoadData = {
                                        status:'DISABLE',
                                        count:0,
                                        customizedTag:1000,
                                        name:that.name,
                                        marketingProgramId:that.mpId,
                                        fileName:that.fileName,
                                        fileSize:that.fileSize,
                                        createBy:that.$userName,
                                    }
                                    that.$ajaxWrap({
                                        type: "post",
                                        url: '/cm-campaign/api/upload',
                                        data: upLoadData,
                                        success(res) {
                                            console.log('send success');
                                            that.$message({
                                                showClose: true,
                                                message: 'Upload Successfully!',
                                                type: 'success'
                                            });
                                            // 显示上传完成
                                            that.isLoadingShow = false;
                                            that.isFinishShow = true;
                                            that.$goRoute('/campaign/audience/list',{
                                                activeName:that.activeName
                                            })
                                        },
                                        error(err){
                                            that.isLoadingShow = false;
                                            that.isFinishShow = false;
                                            console.log('send fail');
                                        },
                                    })

                                }
                            });
                    },
                });

            },

            cancel(){
                let that = this
                this.$goRoute('/campaign/audience/list',{
                    activeName:that.activeName
                })
            },
        }
    }
</script>

<style scoped lang="stylus">
    .file_info
        margin-top 30px
        .name
            margin-top 20px
            .type
                span
                    display inline-block
                    height 32px
                    line-height 32px
                    width 100%
                    text-align right
                    position relative
                    &::before
                        position absolute
                        right 46px
                        content "*"
                        color red
                        top 0
                        line-height 40px
                        font-size 20px;
            .input
                width 402px
                margin-left 22px
        .program
            margin-top 20px
            .type
                span
                    display inline-block
                    height 32px
                    line-height 32px
                    width 100%
                    text-align right
                    position relative
                    &::before
                        position absolute
                        right 128px
                        content "*"
                        font-size 20px;
                        color red
                        top 0
                        line-height 40px
            .input
                width 402px
                margin-left 22px
        .file
            margin-top 20px
            .type
                span
                    display inline-block
                    height 32px
                    line-height 32px
                    width 100%
                    text-align right
                    position relative
                    &::before
                        position absolute
                        right 80px
                        content "*"
                        color red
                        top 0
                        line-height 40px
                        font-size 20px;
            .input
                width 402px
                margin-left 22px
                .file
                    position: relative;
                    display: inline-block;
                    background: #D0EEFF;
                    border: 1px solid #99D3F5;
                    border-radius: 4px;
                    padding: 5px 12px;
                    overflow: hidden;
                    color: #1E88C7;
                    text-decoration: none;
                    text-indent: 0;
                    line-height: 20px;
                    margin-top 0
                    #fileinput
                        position: absolute;
                        font-size: 100px;
                        right: 0;
                        top: 0;
                        opacity: 0;
                        cursor pointer
                    &:hover
                        background: #85ce61;
                        border-color: #85ce61;
                        color: #fff;
                        text-decoration: none;
                        cursor pointer

        .fileName
            margin-top 5px
            .input
                margin-left 22px
            .finish
                color #67c23a
            .loading
                color #67c23a
                overflow hidden
                .fl
                    float left
                    &.circle
                        transform: rotate(45deg);
                        transform-origin: 50% 50%;
                        animation move 1s infinite linear
                        @keyframes move
                            0%
                                -webkit-transform scale(1.0) rotate(0deg)
                            100%
                                -webkit-transform scale(1.0) rotate(360deg)
</style>