<template>
  <div class="divBox">
    <el-card class="box-card" :bordered="false" shadow="never" :body-style="{ padding: 0 }">
      <div class="padding-add">
        <el-form inline size="small" @submit.native.prevent>
          <el-form-item label="角色昵称：">
            <el-input
              v-model.trim="listPram.roleName"
              @keyup.enter.native="handleGetRoleList"
              placeholder="请输入角色昵称"
              clearable
              class="selWidth"
            />
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" @click.native="handleGetRoleList">查询</el-button>
            <el-button size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card mt14" :body-style="{ padding: '20px' }" shadow="never" :bordered="false">
      <el-form inline @submit.native.prevent>
        <el-form-item>
          <el-button size="mini" type="primary" @click="handlerOpenEdit(0)" v-hasPermi="['platform:admin:role:save']"
            >添加角色</el-button
          >
        </el-form-item>
      </el-form>
      <el-table
        :data="listData.list"
        size="small"
        :header-cell-style="{ fontWeight: 'bold', background: '#f8f8f9', color: '#515a6e', height: '40px' }"
      >
        <el-table-column label="角色编号" prop="id" width="120"></el-table-column>
        <el-table-column label="角色昵称" prop="roleName" min-width="130" />
        <el-table-column label="创建时间" prop="createTime" min-width="150" />
        <el-table-column label="更新时间" prop="updateTime" min-width="150" />
        <el-table-column label="状态" prop="status" fixed="right" min-width="100">
          <template slot-scope="scope">
            <el-switch
              v-if="checkPermi(['platform:admin:role:update:status'])"
              v-model="scope.row.status"
              :active-value="true"
              :inactive-value="false"
              active-text="开启"
              inactive-text="关闭"
              @change="handleStatusChange(scope.row)"
            ></el-switch>
            <div v-else>{{ scope.row.status ? '开启' : '关闭' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="scope">
            <a @click="handlerOpenEdit(1, scope.row)" v-hasPermi="['platform:admin:role:update']">编辑</a>
            <el-divider direction="vertical"></el-divider>
            <a @click="handlerOpenDel(scope.row)" v-hasPermi="['platform:admin:role:delete']">删除</a>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :current-page="listPram.page"
        :page-sizes="constants.page.limit"
        :layout="constants.page.layout"
        :total="listData.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
    <el-dialog
      :visible.sync="editDialogConfig.visible"
      :title="editDialogConfig.isCreate === 0 ? '创建身份' : '编辑身份'"
      destroy-on-close
      :close-on-click-modal="false"
      width="500px"
      class="dialog-bottom"
    >
      <edit
        v-if="editDialogConfig.visible"
        :is-create="editDialogConfig.isCreate"
        :edit-data="editDialogConfig.editData"
        @hideEditDialog="hideEditDialog"
        ref="editForm"
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
import * as roleApi from '@/api/role.js';
import edit from './edit';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
export default {
  // name: "index"
  components: { edit },
  data() {
    return {
      constants: this.$constants,
      listData: { list: [] },
      listPram: {
        createTime: null,
        updateTime: null,
        level: null,
        page: 1,
        limit: this.$constants.page.limit[0],
        roleName: null,
        rules: null,
        status: null,
      },
      menuList: [],
      editDialogConfig: {
        visible: false,
        isCreate: 0, // 0=创建，1=编辑
        editData: {},
      },
    };
  },
  mounted() {
    this.handleGetRoleList();
  },
  methods: {
    checkPermi,
    handlerOpenDel(rowData) {
      this.$modalSure('确认删除当前数据').then(() => {
        roleApi.delRole(rowData.id).then((data) => {
          this.$message.success('删除数据成功');
          this.handleGetRoleList();
        });
      });
    },
    handleGetRoleList() {
      roleApi.getRoleList(this.listPram).then((data) => {
        this.listData = data;
      });
    },
    handlerOpenEdit(isCreate, editDate) {
      isCreate === 1 ? (this.editDialogConfig.editData = editDate) : (this.editDialogConfig.editData = {});
      this.editDialogConfig.isCreate = isCreate;
      this.editDialogConfig.visible = true;
    },
    hideEditDialog() {
      this.editDialogConfig.visible = false;
      this.handleGetRoleList();
    },
    handleSizeChange(val) {
      this.listPram.limit = val;
      this.handleGetRoleList(this.listPram);
    },
    handleCurrentChange(val) {
      this.listPram.page = val;
      this.handleGetRoleList(this.listPram);
    },
    //修改状态
    handleStatusChange(row) {
      roleApi.updateRoleStatus(row).then((res) => {
        this.$message.success('更新状态成功');
        this.handleGetRoleList();
      });
    },
    resetQuery() {
      this.listPram = {
        createTime: null,
        updateTime: null,
        level: null,
        page: 1,
        limit: this.$constants.page.limit[0],
        roleName: null,
        rules: null,
        status: null,
      };
      this.handleGetRoleList();
    },
  },
};
</script>

<style scoped lang="scss"></style>
