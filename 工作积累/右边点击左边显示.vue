<template>
  <div>
    <div class="create_product">
      <div class="wrapper">
        <div class="row">
          <div class="fl red flCon">
            {{$t('create.campaignName')}}:
          </div>
          <div class="fr">
            <el-input placeholder="Please input" v-model="createSMSData.name"></el-input>
          </div>
        </div>
				<div class="row" v-if="type==='route'">
          <div class="fl red flCon">
            {{$t('create.code')}}:
          </div>
          <div class="fr">
            <el-input placeholder="Please input" v-model="createSMSData.code"></el-input>
          </div>
        </div>
        <div class="row">
          <div class="fl red flCon">
            {{$t('create.campaignChanel')}}:
          </div>
          <div class="fr leftDiv">
            <el-select v-model="createSMSData.type" :placeholder="$t('element.selectType')" @change="changeType(createSMSData.type)">
              <el-option
                v-for="item in types"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-show="createSMSData.type !== ''" v-model="createSMSData.channelId" :placeholder="$t('element.select')">
              <el-option
                v-for="item in channels"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
        </div>

        <div class="row">
          <div class="fl red flCon">
            {{$t('create.communicateContent')}}:
          </div>
          <div class="fr leftDiv SMScontent">
						<div class="clearfix">
								<div class="contentLeft">
									<div class="Context conFloat">
										<span>{{contentLength}}/900</span>
									</div>
									<div class="schreibenContent conFloat" ref="templateTextArea" @keyup="inputText()"  contenteditable="true" v-html='dataConHtmlSMS'> <!-- @keydown="checkLength($event)" @keyup.delete="deleteLength" -->
										{{dataConHtmlSMS}}
									</div>
								</div>
								<div class="contentRight">
									<div class="inputSelBox">
										<el-select v-model="createSMSData.audience" :placeholder="$t('element.select')" class="inputSel" @change="changeAudience(createSMSData.audience)">
											<el-option
												v-for="item in audienceArr"
												:key="item.id"
												:label="item.categoryName"
												:value="item.id">
											</el-option>
										</el-select>
									</div>
									<div class="menuoption">
										<button
											v-for='(v, i) in datas'
											:key="i"
											class="menuLi"
											:style="activesTyle(i)"
											>
											{{v.name}}
										</button>
									</div>
								</div>
						</div>
						<div class="contentBottom">
							<!-- <span v-text="restTextNum">{{restTextNum}}</span> characters left -->
						</div>
					</div>
				</div>
				<div class="row" v-show="createSMSData.type!='EMAIL'&&type==='route'">
					<div class="fl flCon">
						{{$t('create.testAccount')}}:
					</div>
					<div class="fr leftDiv testPhotoBox">
						<el-input type="textarea" rows="5" placeholder="Please input" v-model="createSMSData.uatmobile" class="testPhoto"></el-input>
						<div class="photoSelect">
							<div class="photoBtnBox">
								<el-button class="photoBtn"
									v-for="item in photoValues"
									:key="item.id" @click="photoChange(item.content, item.id)">{{item.name}}
								</el-button>
							</div>
							<div style="display:inline-block;width: 50px;vertical-align: top;">
								<el-button @click="createPhoto" type="primary" icon="el-icon-plus" circle></el-button>
								<el-button @click="editPhoto" v-show="photoValue" type="info" icon="el-icon-edit" circle></el-button>
								<el-button @click="deletePhoto" v-show="photoValue" type="danger" icon="el-icon-delete" circle></el-button>
							</div>
						</div>
            <span style="display:block; font-size: 12px;font-weight: bold">{{$t('create.commaSeparated')}}</span>
					</div>
				</div>
       <!-- <div class="row">
          <div class="fl flCon">
            {{$t('table.desc')}}:
          </div>
          <div class="fr leftDiv">
            <el-input v-model="createSMSData.description" type="textarea" rows="5" placeholder="Please input"></el-input>
          </div>
        </div>-->
				<div class="row">
					<div class="fl red">
						{{$t('table.status')}}:
					</div>
					<div class="fr leftDiv">
						<el-radio v-model="createSMSData.status" label="ENABLE">{{$t('create.enable')}}</el-radio>
  					<el-radio v-model="createSMSData.status" label="DISABLE">{{$t('create.disable')}}</el-radio>
					</div>
				</div>
        <div class="row">
          <div class="fl flCon">
          </div>
          <div class="fr">
            <el-button type="info" @click="goBack" plain>{{$t('button.cancel')}}</el-button>
            <el-button type="primary"  @click="savaData">{{$t('button.save')}}</el-button>
          </div>
        </div>
      </div>
    </div>
		<el-dialog
			:visible.sync="DialogCreatePhoto"
			width="30%">
			<div class="diaglogRow">
				<div class="fl red">
					{{$t('create.name')}}：
				</div>
				<div class="fr leftDiv">
					<el-input v-model="communicateTestGroup.name" placeholder="name"></el-input>
				</div>
			</div>
			<div class="diaglogRow">
				<div class="fl red">
					{{$t('create.number')}}：
				</div>
				<div class="fr leftDiv">
					<el-input v-model="communicateTestGroup.content" placeholder="content"></el-input>
				</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="DialogCreatePhoto = false">{{$t('default.cancel')}}</el-button>
				<el-button type="primary" @click="createNewPhoto">{{$t('default.confirm')}}</el-button>
			</span>
		</el-dialog>
  </div>
</template>
<script>
import {getAudienceList,CreateCommunicateTemplateList,EditCommunicateTemplateList,GetCommunicateTemplateInfo,getChannels,getFindAttributeField,GetCommunicateTestGroup,EditCommunicateTestGroup,CreateCommunicateTestGroup,DetailCommunicateTestGroup,DeleteCommunicateTestGroup} from '../../../api/communicateTemplate'
import { setTimeout } from 'timers';
import { mapState } from 'vuex';
  const createSMSData = () => {
	  return {
			name: '',
			code: '',
			channelId:'',
			content:'',
			description:'',
			htmlContent:'',
			type:'',
			tentId:localStorage.getItem('tenant'),
			uatmobile:'',
			audience: '',
			zoneId:localStorage.getItem('zoneTwo'),
			status: 'ENABLE',
			refId: '',
		}
	};
	export default {
    computed: {
      ...mapState(['isShowTemplateCreateDiag'])
    },
    watch: {
      isShowTemplateCreateDiag(newValue){
        if(newValue && this.type === 'dialog'){
          let id = window.localStorage.getItem('templateValue')
          if(!id && id != null){
            this.isCreate = true
            this.createSMSData = createSMSData();
            this.contentLength = 0
            this.isnumerieren = false
            document.getElementsByClassName('schreibenContent')[0].innerText = ''
          }else{
            this.isCreate = false
            GetCommunicateTemplateInfo(window.localStorage.getItem('templateValue')).then( (res) => {
              this.changeType(res.data.type);
              this.createSMSData = res.data
              this.dataConHtmlSMS = res.data.htmlContent
            })
            this.isnumerieren = true
          }
          this.createSMSData.refId = this.$route.query.id
          this.createSMSData.code = window.localStorage.getItem('taskId')
        }

      }
    },
    props: {
      type: {
        type: String,
        default: 'route'
      }
    },
		data() {
			return {
				// ---关于测试账号
				DialogCreatePhoto: false,
				communicateTestGroup:{
					content: '',
					name: '',
					tenant: localStorage.getItem('tenant'),
					zone: localStorage.getItem('zoneTwo')
				},
				photoValues: [],
				photoValue: '',
				isEditPhoto: false,
				//---分割线
				datas:[],
				createSMSData:createSMSData(),

				value: '',
				types:[
					{
						label:'短信',
						value:'SMS'
					},
					{
						label:'彩信',
						value:'MMS',
					},
					{
						label:'邮箱',
						value:'EMAIL'
					},
				],
				index: null,
				dataConHtmlSMS: '',
        textContent:'',
				isBoxOrMenu: false,
				channels: [],
				audienceArr: [],
				isnumerieren: false,
        contentLength:0,
				textData:'',
				isEdit: true,
				conArr: [],
				conHtml: null,
        isCreate: true,
			}
		},
		methods: {
			// 验证非空字段
			validationSMS(){
				if(!this.createSMSData.name){
					this.$message({
						message: '请输入名称',
						type: 'warning'
					});
					return false
				}
				if(!this.createSMSData.code){
					this.$message({
						message: '请输入编号',
						type: 'warning'
					});
					return false
				}
				if(!this.createSMSData.content){
					this.$message({
						message: '请输入内容',
						type: 'warning'
					});
					return false
				}
				if(!this.createSMSData.type){
					this.$message({
						message: '请选择类型',
						type: 'warning'
					});
					return false
				}
				if(!this.createSMSData.channelId){
					this.$message({
						message: '请选择渠道',
						type: 'warning'
					});
					return false
				}
				return true
			},
			// -----关于测试账号的增删改查
			photoChange(content, id){
				this.createSMSData.uatmobile = content
				this.photoValue = id
			},
			// 创建
			createPhoto(){
				this.communicateTestGroup = {
					content: '',
					name: '',
					tenant: localStorage.getItem('tenant'),
					zone: localStorage.getItem('zoneTwo')
				}
				this.isEditPhoto = false
				this.DialogCreatePhoto = true
			},
			// 修改
			editPhoto(){
				DetailCommunicateTestGroup(this.photoValue).then(res=>{
					this.communicateTestGroup = res.data
				})
				this.DialogCreatePhoto = true
				this.isEditPhoto = true
			},
			// 删除
			deletePhoto(){
					this.$confirm(this.$t('button.confirmDelete'), this.$t('button.tip'), {
						confirmButtonText: this.$t('default.confirm'),
						cancelButtonText: this.$t('default.cancel'),
						type: 'warning'
					}).then(() => {
						DeleteCommunicateTestGroup(this.photoValue).then(res=>{
							this.$message({
								type: 'success',
								message: this.$t('button.success')
							});
							this.getCommunicateTestGroup()
							this.photoValue = ''
							this.createSMSData.uatmobile = ''
						})
					}).catch(() => {
						this.$message({
							type: 'info',
							message: this.$t('button.info')
						});
					});
			},
			// 测试账号中确认按钮
			createNewPhoto(){
				if(!this.isEditPhoto){
					CreateCommunicateTestGroup(this.communicateTestGroup).then(res=>{
						this.photoValue = res.data.id
						this.createSMSData.uatmobile = res.data.content
						this.getCommunicateTestGroup().then(()=>{
							this.$message({
								type: 'success',
								message: this.$t('button.success')
							});
							this.DialogCreatePhoto = false
						})
					})
				}else{
					EditCommunicateTestGroup(this.communicateTestGroup).then(res=>{
						this.photoValue = res.data.id
						this.createSMSData.uatmobile = res.data.content
						this.getCommunicateTestGroup().then(()=>{
							this.$message({
								type: 'success',
								message: this.$t('button.success')
							});
							this.DialogCreatePhoto = false
						})
					})
				}
			},
			async getCommunicateTestGroup(){
				let expression = 'zone eq ' + this.createSMSData.zoneId + ' AND tenant eq '+this.createSMSData.tentId
				GetCommunicateTestGroup({expression}).then(res=>{
					this.photoValues = res.data.content
				})
			},

			// -----分割线
			// 当添加删除时
      inputText(){
				this.calculateWordNumber()
        if( this.contentLength >= 900 && event.code != 'Backspace'){
          event.preventDefault();
          this.$message({
            showClose: true,
            message: '900 characters limited !',
            type: 'error',
          });
          this.$refs.templateTextArea.blur();
        }
			},
			// 计算统计字数
			calculateWordNumber(){
				this.contentLength = 0
				let spanConArr = document.getElementsByClassName('spanCon')
				for (let i = 0; i < spanConArr.length; i++) {
					spanConArr[i].innerText = ''
					this.contentLength += spanConArr[i].value.length
				}
				let contentArea = this.$refs.templateTextArea.innerText;
				this.contentLength += contentArea.length;
			},
      async changeType(type){
				let expression = 'zoneId eq '+ this.createSMSData.zoneId + ' AND (type eq '+ type +' AND status eq ENABLE)';
				this.createSMSData.channelId = ""
				const data = await getChannels({expression});
				this.channels = data.data
			},
			// 获取AudienceList
			async getAudience(){
				const data = await getAudienceList();
				this.audienceArr = data.data;
				if(this.audienceArr.length > 0 && !this.createSMSData.audience){
          this.createSMSData.audience = this.audienceArr[0].id;
          this.changeAudience(this.createSMSData.audience)
        }
			},
			async changeAudience(audienceLabel){
				let id = audienceLabel
				const data = await getFindAttributeField(id)
				this.datas = data.data;
				this.menuLiClickEvent()
			},

			// 插入数据
			insertHtmlAtCaret(html,code) {
        var sel, range, that = this;
        if (window.getSelection) {
					// IE9 and non-IE
					sel = window.getSelection();
					if (sel.getRangeAt && sel.rangeCount) {
						range = sel.getRangeAt(0);
						range.deleteContents();
						var inp = document.createElement("input");
								inp.setAttribute("disabled", 'true');
								inp.setAttribute("value", html);
								inp.setAttribute("class",'spanCon')
								inp.setAttribute("data-scon", code);
								inp.style.width = that.inputResize(html) + 'px';
						range.insertNode(inp);
						range = range.cloneRange();
						range.setStartAfter(inp);
						range.collapse(true);
						sel.removeAllRanges();
						sel.addRange(range);
					}
				} else if (document.selection && document.selection.type != "Control") {
					// IE < 9
					document.selection.createRange().pasteHTML(html);
				}
    	},
			// 改变背景颜色
			activesTyle(i){
				if(this.index === i){
					return 'color:#606266;background-color:rgb(204,204,204)'
				}
			},
			// 保存
			savaData(){
				let that = this;
				let boxDiv = document.getElementsByClassName('schreibenContent')[0];
				let boxDivClone = boxDiv.cloneNode(true)
				let spanConArr = boxDivClone.getElementsByClassName('spanCon')
				for (let i = 0; i < spanConArr.length; i++) {
					spanConArr[i].innerText = '${' + spanConArr[i].dataset.scon + '}'
				}

				this.createSMSData.content = boxDivClone.innerText.trim()
				this.createSMSData.htmlContent = boxDiv.innerHTML
				if(this.validationSMS()){
					if(this.isCreate){
						CreateCommunicateTemplateList(this.createSMSData).then( (res) => {
							window.localStorage.setItem('templateValue',res.data.id)
							this.$message({
								showClose: true,
								message: this.$t('button.success'),
								type: 'success',
							});
              this.goBack()
						})
					}else{
            EditCommunicateTemplateList(this.createSMSData).then( (res) => {
							window.localStorage.setItem('templateValue',res.data.id)
							this.$message({
								showClose: true,
								message: this.$t('button.success'),
								type: 'success',
							});
              this.goBack()
						})
					}
				}
			},
			goBack(){
			  if (this.type === 'route') {
          this.$router.back(-1);
        } else if (this.type === 'dialog') {
          // window.localStorage.setItem('templateValue','')
          this.$store.state.isShowTemplateCreateDiag = false
        }
			},
			inputResize(str){
				var width = 0;
				var inputWidth = document.createElement('span');
        inputWidth.innerText = str;
        inputWidth.className = 'getTextWidth';
        document.querySelector('body').appendChild(inputWidth);
        width = document.querySelector('.getTextWidth').offsetWidth;
				document.querySelector('.getTextWidth').remove();
				return width
			},
			async menuLiClickEvent(){
				var that = this
				setTimeout(function(){
					var boxDiv = document.getElementsByClassName('schreibenContent')[0]
					var menuLi = document.getElementsByClassName('menuLi')
					for (let i = 0; i < menuLi.length; i++) {
						menuLi[i].onclick = function(){
							if(that.isBoxOrMenu){
								that.index = i;
								let length = menuLi[i].innerText.length + that.contentLength;
								if(length < 900){
									boxDiv.focus();
									that.insertHtmlAtCaret(menuLi[i].innerText,that.datas[i].code)
									that.contentLength = length;
								}else{
									that.$message({
										showClose: true,
										message: '900 characters limited !',
										type: 'error',
									});
								}

							}
						}
					}
				},1000)
			}
		},
    // 新增 - 合并自addTemplate/SMS
    created(){
      if (this.type === 'dialog') {
        this.createSMSData.code = window.localStorage.getItem('taskId')
        this.createSMSData.refId = this.$route.query.id
      }
    },

    mounted() {
			var that = this
			this.getCommunicateTestGroup()
			this.getAudience()
      let id = ''
      // if (this.type === 'route') {
      //   id = this.$route.query.id
      // } else if (this.type === 'dialog') {
      //   id = window.localStorage.getItem('templateValue')
			// }
			if(this.$route.query.type){
				id = this.$route.query.id;
        this.isCreate = false
        GetCommunicateTemplateInfo(id).then( (res) => {
          if( res.data.type == 'SMS' || res.data.type == 'MMS' || res.data.type == 'EMAIL' ){
            this.changeType(res.data.type);
            this.createSMSData = res.data
            this.dataConHtmlSMS = res.data.htmlContent
            setTimeout(function(){
              that.calculateWordNumber()
            },1000)
          }
        })
        this.isnumerieren = true
			}else{
				id = window.localStorage.getItem('templateValue')
        if(this.$route.path !== '/market/manage/communicate/template/create') {
          if(id && id != 'null'){
            this.isCreate = false
            GetCommunicateTemplateInfo(id).then( (res) => {
              if( res.data.type == 'SMS' || res.data.type == 'MMS' || res.data.type == 'EMAIL' ){
                this.changeType(res.data.type);
                this.createSMSData = res.data
                this.dataConHtmlSMS = res.data.htmlContent
                setTimeout(function(){
                  that.calculateWordNumber()
                },1000)
              }
            })
            this.isnumerieren = true
          }
        }
			}


			this.$nextTick( () => {
				var that = this
				var boxDiv = document.getElementsByClassName('schreibenContent')[0]
				var menuoption = document.getElementsByClassName('menuoption')[0]
				// that.menuLiClickEvent()
				document.addEventListener('click', function(){
					if(document.activeElement == boxDiv){
						that.isBoxOrMenu = true
					}else if(document.activeElement == menuoption){
						return
					}else{
						that.isBoxOrMenu = false
					}
				});
      });
		},
  }
</script>
<style scoped lang="scss">
.row .testPhotoBox{
  width: auto;
}
.testPhotoBox	.testPhoto{
  vertical-align: baseline;
  display: inline-block;
  margin-right: 20px;
}
.testPhotoBox .photoBtnBox{
  display: inline-block;
  width: 200px;
  height: 117px;
  overflow-y:auto;
  overflow-x: hidden;
}
.testPhotoBox	.photoSelect{
  display: inline-block;
  height: 117px;
}
.row{
  overflow: hidden;
  margin:10px 0 15px 15px;
  line-height: 45px;
  .fl,.fr{
    float:left;
  }
  .fl{
    margin-right:30px;
    font-size: 14px;
    font-weight: bold;
    width: 155px;
    height: 45px;
    position:relative;
    text-align: right;
  }
  .red::before{
    position: relative;
    left: 0;
    content: "*";
    color: red;
    top: 5px;
    font-size: 20px;
  }
  .fr{
    width: auto;
    font-size: 14px;
    font-weight: bold;
    .el-select{
      width: 150px;
    }
    .el-input{
      width: 250px;
      margin-right: 10px;
    }
    .input-inline-short{
      width: 100px;
    }
    .el-textarea{
      width: 400px;
    }
  }
}
.SMScontent .contentLeft, .SMScontent .contentRight{
  float: left;
}
.contentRight{
  margin-left: 10px;
}
.schreibenContent{
  outline: none;
}

.menuoption{
  width: 200px;
  height: 200px;
  overflow-y:auto;
  overflow-x: hidden;
  list-style-type: none;
  margin: 0;
  padding: 0;
  font-size: 14px;
  background-color: #fff;
}
.menuoption .menuLi{
  width: 200px;
  height: 45px;
  text-align: center;
  color: rgb(130, 130, 130);
  cursor: pointer;
  background-color: #fff;
  border: 0;
  outline: none;
}
.SMScontent{
  padding: 15px;
  background-color: whitesmoke;
  width: auto!important;
  border-radius: 10px;
  outline: none;
}
.Main_content > div .wrapper .row .flCon::before{
  position: relative;
}
.Main_content > div .wrapper .row .flCon{
  width: 115px;
}
.Main_content > div .wrapper .row .fr {
  width: auto;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.schreibenContent{
  width: 400px;
  height: 200px;
  background-color: #fff;
  border: 1px solid #ddd;
  overflow-y: auto;
}
.SMScontent .contentBottom{
  text-align: center;
}
.clearfix::after{
  content: '';
  display: block;
  clear: both;
}
/* 滚动条整体部分 */
.menuoption::-webkit-scrollbar,.schreibenContent::-webkit-scrollbar,.photoBtnBox::-webkit-scrollbar{
  width: 5px;
}
/* 滚动条里面可以拖动的部分 */
.menuoption::-webkit-scrollbar-thumb,.schreibenContent::-webkit-scrollbar-track,.photoBtnBox::-webkit-scrollbar-thumb{
  background:#ddd;
  border-radius:4px;
}
.row .inputSelBox{
  height: 45px;
}
.diaglogRow{
  padding: 15px;
}
.diaglogRow .el-input{
  width: 250px;
}
.diaglogRow > .fl{
  font-weight: bold;
  display: inline-block;
  width: 70px;
  text-align: right;
}
.diaglogRow > .fr{
  display: inline-block;
}
</style>
<!--<style scoped>-->
	<!--.SMScontent .contentLeft, .SMScontent .contentRight{-->
		<!--float: left;-->
	<!--}-->
	<!--.create_product .row .leftDiv .testPhoto.el-textarea{-->
		<!--display: inline-block;-->
		<!--width: 400px;-->
	<!--}-->
	<!--.Main_content > div .wrapper .row .testPhotoBox{-->
		<!--width: auto;-->
	<!--}-->
  <!--.testPhotoBox	.testPhoto{-->
		<!--vertical-align: baseline;-->
		<!--display: inline-block;-->
		<!--margin-right: 20px;-->
	<!--}-->
	<!--.testPhotoBox .photoBtnBox{-->
		<!--display: inline-block;-->
		<!--width: 200px;-->
		<!--height: 117px;-->
		<!--overflow-y:auto;-->
		<!--overflow-x: hidden;-->
	<!--}-->
	<!--.testPhotoBox	.photoSelect{-->
		<!--display: inline-block;-->
		<!--height: 117px;-->
	<!--}-->
	<!--.contentRight{-->

		<!--margin-left: 10px;-->
	<!--}-->
	<!--.schreibenContent{-->
		<!--outline: none;-->
	<!--}-->

	<!--.menuoption{-->
		<!--width: 200px;-->
		<!--height: 200px;-->
		<!--overflow-y:auto;-->
		<!--overflow-x: hidden;-->
		<!--list-style-type: none;-->
		<!--margin: 0;-->
		<!--padding: 0;-->
		<!--font-size: 14px;-->
		<!--background-color: #fff;-->
	<!--}-->
	<!--.menuoption .menuLi{-->
		<!--width: 200px;-->
		<!--height: 45px;-->
		<!--text-align: center;-->
		<!--color: rgb(130, 130, 130);-->
		<!--cursor: pointer;-->
		<!--background-color: #fff;-->
		<!--border: 0;-->
		<!--outline: none;-->
	<!--}-->
	<!--.Main_content > div .wrapper .row .SMScontent{-->
		<!--padding: 15px;-->
		<!--background-color: whitesmoke;-->
		<!--width: auto;-->
		<!--border-radius: 10px;-->
		<!--outline: none;-->
	<!--}-->
	<!--.Main_content > div .wrapper .row .flCon::before{-->
		<!--position: relative;-->
	<!--}-->
	<!--.Main_content > div .wrapper .row .flCon{-->
		<!--width: 115px;-->
	<!--}-->
	<!--.schreibenContent{-->
		<!--width: 400px;-->
		<!--height: 200px;-->
		<!--background-color: #fff;-->
		<!--border: 1px solid #ddd;-->
		<!--overflow-y: auto;-->
	<!--}-->
	<!--.SMScontent .contentBottom{-->
		<!--text-align: center;-->
	<!--}-->
	<!--.clearfix::after{-->
		<!--content: '';-->
		<!--display: block;-->
		<!--clear: both;-->
	<!--}-->
	<!--/* 滚动条整体部分 */-->
	<!--.menuoption::-webkit-scrollbar,.schreibenContent::-webkit-scrollbar,.photoBtnBox::-webkit-scrollbar{-->
		<!--width: 5px;-->
	<!--}-->
	<!--/* 滚动条里面可以拖动的部分 */-->
	<!--.menuoption::-webkit-scrollbar-thumb,.schreibenContent::-webkit-scrollbar-track,.photoBtnBox::-webkit-scrollbar-thumb{-->
		<!--background:#ddd;-->
		<!--border-radius:4px;-->
	<!--}-->
	<!--.row .inputSelBox{-->
		<!--height: 45px;-->
	<!--}-->
  <!--.row > .fl{-->
		<!--display: inline-block;-->
    <!--width: 200px !important;-->
  <!--}-->
	<!--.diaglogRow{-->
		<!--padding: 15px;-->
	<!--}-->
	<!--.diaglogRow .el-input{-->
		<!--width: 250px;-->
	<!--}-->
	<!--.diaglogRow > .fl{-->
		<!--font-weight: bold;-->
		<!--display: inline-block;-->
		<!--width: 70px;-->
		<!--text-align: right;-->
	<!--}-->
	<!--.diaglogRow > .fr{-->
		<!--display: inline-block;-->
	<!--}-->
	<!--/* .photoSelect .photoBtn{-->

	<!--} */-->
<!--</style>-->
