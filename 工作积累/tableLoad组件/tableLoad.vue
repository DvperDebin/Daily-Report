<!-- 一个简单的二次封装组件
 1.使用方法: 父组件 引入，映射，使用
 2.字段:
   tableData: table 列表数据
   showCol: {
     label: 表头显示字段
     value: 读取数据字段
     width: 自定义宽度 可选
     type: 自定义类型 目前只支持img，默认string
   }
   deleteAPI: 删除方法的API，
   getInitialData: 渲染页面list方法
   path: 创建/编辑 路由地址
   searchOpts:{    查询相关
      type: 'input/date/select',
      placeholder: '提示语',
      value: '查询字段',
      bindVal: '绑定值'
      operator: '谓词：eq/like...',
      data: {  select 下拉框数据
        label: '',
        value: ''
      }
    isSelectionShow: 选择框是否显示 true/false，
    operatorOpts: [  操作栏
      {
        icon: 'icon 的class name'，
        method (rowId, path) { // 前两个参数为ID值 和 path
          操作逻辑
        }
      }
     ],
     cellClick(row,col,cell) {  // 点击table
      // 执行逻辑
     }
     buttonOperates: [
      {
        text: 'button 显示字段',
        type: 'primary/info...' 和element一样
        method: 逻辑函数
      }
     ]
  }
-->
<template>
  <div class="custom_table">
    <header class="search_row">
      <div class="search" v-for="(each,idx) in searchData" :key="idx">
        <el-input v-show="each.type === 'input'" v-model="each.bindVal" :placeholder="each.placeholder"></el-input>
        <el-select v-show="each.type === 'select'" v-model="each.bindVal" :placeholder="each.placeholder">
          <el-option
            v-for="item in each.data"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-date-picker
          v-show="each.type === 'date'"
          v-model="each.bindVal"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </div>
      <el-button type="primary" icon="el-icon-search" @click="getSearchData" v-show="searchData && searchData.length > 0"></el-button>
      <div class="buttons">
        <el-button type="primary" @click="create" v-if="isCreateButton"> + 创建</el-button>
        <el-button :type="buttonConfig.type" @click="dynamicButton(buttonConfig.method)" v-for="(buttonConfig, idx) in buttonOperates" :key="idx" v-show="buttonOperates && buttonOperates.length > 0"> {{buttonConfig.text}} </el-button>
      </div>
    </header>
    <hr>
    <el-table
      class="main_table"
      :header-cell-style="headerStyle"
      :cell-style="cellStyle"
      tooltip-effect="dark"
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      @cell-click="handleCellClick">
      <el-table-column
        v-if="isSelectionShow"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column v-for="(col, index) in showCol" :key="index"  :label="col.label" :width="col.width?col.width: 'auto' ">
        <template slot-scope="scope">
          <span v-show="!col.type">{{scope.row[col.value]}}</span>
          <span v-show="col.type && col.type === 'img'">
            <img :src="scope.row[col.value]" alt="avatar" class="inTableImg">
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.operate')">
        <template slot-scope="scope">
          <i class="btn el-icon-edit-outline" @click="editItem(scope.row.id,path)" v-if="isEditDelete"></i>
          <i class="btn el-icon-delete" @click="deleteItem(scope.row.id)"   v-if="isEditDelete"></i>
          <i v-for="(each,idx) in operatorOpts" :key="idx" :class="each.icon + ' btn'" v-show="operatorOpts && operatorOpts.length > 0" @click="dynamicMethod(each.method,scope.row.id,path)"></i>
        </template>
      </el-table-column>
    </el-table>
    <footer class="change_page">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageParams.page"
        :page-sizes="[3, 10, 20, 30]"
        :page-size="pageParams.size"
        layout="total, sizes,jumper, next, pager, prev"
        :total="totalNum">
      </el-pagination>
    </footer>
  </div>
</template>

<script src="./tableLoad.js">

</script>

<style scoped lang="scss" src="./tableLoad.scss">

</style>
