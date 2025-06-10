<template>
  <div class="divBox">
    <el-card
      class="box-card"
      v-hasPermi="['platform:system:group:list']"
      :body-style="{ padding: 0 }"
      :bordered="false"
      shadow="never"
    >
      <div class="padding-add">
        <el-form inline @submit.native.prevent label-position="right">
          <el-form-item label="数据搜索：">
            <el-input
              v-model.trim="keywords"
              placeholder="请输入组合数据名称"
              class="selWidth"
              size="small"
              clearable
              @keyup.enter.native="handlerSearch"
            ></el-input>
          </el-form-item>
          <el-form-item class="search-form-sub">
            <el-button type="primary" size="small" @click="handlerSearch">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card mt14" :body-style="{ padding: '20px' }" shadow="never" :bordered="false">
      <el-button size="mini" type="primary" @click="handlerOpenEdit({}, 0)" v-hasPermi="['platform:system:group:save']"
        >添加数据组</el-button
      >
      <el-table :data="dataList.list" class="mt20" size="small" highlight-current-row>
        <el-table-column label="数据组名称" prop="name" min-width="150" />
        <el-table-column label="简介" prop="info" min-width="150" />
        <el-table-column label="操作" fixed="right" width="170">
          <template slot-scope="scope">
            <a @click="handleDataList(scope.row)" v-hasPermi="['platform:system:group:data:list']">数据列表</a>
            <el-divider direction="vertical"></el-divider>
            <a @click="handlerOpenEdit(scope.row, 1)" v-hasPermi="['platform:system:group:update']">编辑</a>
            <el-divider direction="vertical"></el-divider>
            <a @click="handleDelete(scope.row)" v-hasPermi="['platform:system:group:delete']">删除</a>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :current-page="listPram.page"
        :page-sizes="constants.page.limit"
        :layout="constants.page.layout"
        :total="dataList.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
    <el-dialog
      :title="editDialogConfig.isCreate === 0 ? '创建数据组' : '编辑数据组'"
      :visible.sync="editDialogConfig.visible"
      class="dialog-bottom"
    >
      <edit
        v-if="editDialogConfig.visible"
        :is-create="editDialogConfig.isCreate"
        :edit-data="editDialogConfig.editData"
        @hideDialog="handlerHideDialog"
        @closeDialog="closeDialog"
      />
    </el-dialog>
    <el-dialog title="组合数据列表" :visible.sync="comDataListConfig.visible">
      <cm-data-list v-if="comDataListConfig.visible" :form-data="comDataListConfig.formData" />
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
import edit from '@/views/maintain/devconfig/combinedDataEdit';
import * as systemGroupApi from '@/api/systemGroup';
import cmDataList from './combineDataList';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
export default {
  // name: "combinedData"
  components: { edit, cmDataList },
  data() {
    return {
      constants: this.$constants,
      dataList: {
        list: [],
        total: 0,
      },
      keywords: '',
      listPram: {
        keywords: null,
        page: 1,
        pageSize: this.$constants.page.limit[0],
      },
      editDialogConfig: {
        visible: false,
        isCreate: 0, // 0=创建 1=编辑
        editData: {},
      },
      comDataListConfig: {
        visible: false,
        formData: {},
      },
    };
  },
  mounted() {
    if (checkPermi(['platform:system:group:list'])) this.handlerGetList(this.listPram);
  },
  methods: {
    checkPermi,
    closeDialog() {
      this.editDialogConfig.visible = false;
    },
    handlerSearch() {
      this.listPram.page = 1;
      this.handlerGetList(this.listPram);
    },
    handlerOpenEdit(editData, isCreate) {
      isCreate === 0 ? (this.editDialogConfig.editData = {}) : (this.editDialogConfig.editData = editData);
      this.editDialogConfig.isCreate = isCreate;
      this.editDialogConfig.visible = true;
    },
    handlerGetList(pram) {
      pram.keywords = encodeURIComponent(this.keywords);
      systemGroupApi.groupList(pram).then((data) => {
        this.dataList = data;
      });
    },
    handleDataList(rowData) {
      if (rowData.formId <= 0) return this.$message.error('请先关联表单');
      this.comDataListConfig.formData = rowData;
      this.comDataListConfig.visible = true;
    },
    handleDelete(rowData) {
      this.$modalSure('删除当前数据吗').then(() => {
        systemGroupApi.groupDelete(rowData).then((data) => {
          this.$message.success('删除数据成功');
          setTimeout(() => {
            this.handlerGetList(this.listPram);
          }, 800);
        });
      });
    },
    handleSizeChange(val) {
      this.listPram.limit = val;
      this.handlerGetList(this.listPram);
    },
    handleCurrentChange(val) {
      this.listPram.page = val;
      this.handlerGetList(this.listPram);
    },
    handlerHideDialog() {
      setTimeout(() => {
        this.editDialogConfig.visible = false;
        this.handlerGetList(this.listPram);
      }, 800);
    },
  },
};
</script>

<style scoped></style>
