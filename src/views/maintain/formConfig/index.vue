<template>
  <div class="divBox">
    <el-card
      class="box-card"
      :body-style="{ padding: '0 0 20px' }"
      :bordered="false"
      shadow="never"
      v-hasPermi="['platform:system:form:list']"
    >
      <div class="padding-add">
        <el-form inline size="small" @submit.native.prevent>
          <el-form-item label="关键字：">
            <el-input
              v-model.trim="listPram.keywords"
              placeholder="请输入id，名称，描述"
              clearable
              class="selWidth"
              size="small"
              @keyup.enter.native="handlerSearch"
            ></el-input>
          </el-form-item>
          <el-form-item class="search-form-sub">
            <el-button type="primary" size="small" @click="handlerSearch">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card mt14" :body-style="{ padding: '20px 20px 30px' }" shadow="never" :bordered="false">
      <div class="mb20">
        <el-button
          size="small"
          type="primary"
          @click="handlerEditData({}, 0)"
          v-if="!selectModel && checkPermi(['platform:system:form:save'])"
          >创建表单</el-button
        >
        <el-button v-if="selectModel" type="primary" :disabled="!selectedConfigData.id" @click="handlerConfimSelect"
          >确定选择</el-button
        >
      </div>
      <el-table
        :data="dataList.list"
        highlight-current-row
        row-key="id"
        size="small"
        class="table"
        @current-change="handleCurrentRowChange"
      >
        <el-table-column label="ID" prop="id" width="80" />
        <el-table-column label="名称" prop="name" min-width="180" />
        <el-table-column label="描述" prop="info" min-width="220" />
        <el-table-column label="更新时间" prop="updateTime" min-width="200" />
        <el-table-column
          v-if="!selectModel && checkPermi(['platform:system:form:update'])"
          label="操作"
          width="70"
          fixed="right"
        >
          <template slot-scope="scope">
            <a @click="handlerEditData(scope.row, 1)">编辑</a>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :current-page="listPram.page"
        :page-sizes="[10, 20, 30, 40]"
        :layout="constants.page.layout"
        :total="dataList.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
    <el-dialog
      :visible.sync="editDialogConfig.visible"
      fullscreen
      :title="editDialogConfig.isCreate === 0 ? '创建表单' : '编辑表单'"
      destroy-on-close
      :close-on-click-modal="false"

    >
<!--      class="el-dialog__body_for_FromGen"-->
      <edit
        v-if="editDialogConfig.visible"
        :is-create="editDialogConfig.isCreate"
        :edit-data="editDialogConfig.editData"
        @hideDialog="handlerHide"
      />
    </el-dialog>
  </div>
</template>

<script>
// +---------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +---------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +---------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +---------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +---------------------------------------------------------------------
import * as systemFormConfigApi from '@/api/systemFormConfig.js';
import edit from './edit';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
export default {
  // name: "index"
  components: { edit },
  props: {
    selectModel: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      constants: this.$constants,
      listPram: {
        keywords: null,
        page: 1,
        limit: 10,
      },
      editDialogConfig: {
        visible: false,
        editData: {},
        isCreate: 0,
      },
      dataList: { list: [], total: 0 },
      selectedConfigData: {},
    };
  },
  mounted() {
    if (checkPermi(['platform:system:form:list'])) this.handlerGetList(this.listPram);
  },
  methods: {
    checkPermi,
    handlerSearch() {
      this.listPram.page = 1;
      this.handlerGetList(this.listPram);
    },
    handlerGetList(pram) {
      systemFormConfigApi.getFormConfigList(pram).then((data) => {
        this.dataList = data;
      });
    },
    handlerEditData(rowData, isCreate) {
      if (isCreate === 0) {
        this.editDialogConfig.editData = {};
      } else {
        this.editDialogConfig.editData = rowData;
      }
      this.editDialogConfig.isCreate = isCreate;
      this.editDialogConfig.visible = true;
    },
    handlerHide() {
      this.editDialogConfig.editData = {};
      this.editDialogConfig.isCreate = 0;
      this.editDialogConfig.visible = false;
      this.handlerGetList(this.listPram);
    },
    handleSizeChange(val) {
      this.listPram.limit = val;
      this.handlerGetList(this.listPram);
    },
    handleCurrentChange(val) {
      this.listPram.page = val;
      this.handlerGetList(this.listPram);
    },
    handleCurrentRowChange(rowData) {
      this.selectedConfigData = rowData;
    },
    handlerConfimSelect() {
      this.$emit('selectedRowData', this.selectedConfigData);
    },
  },
};
</script>
<style scoped lang="scss">
::v-deep .el-form--inline {
  height: 35px;
}
::v-deep .el-dialog__body {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: none !important;
  padding: 15px !important;
}
</style>
