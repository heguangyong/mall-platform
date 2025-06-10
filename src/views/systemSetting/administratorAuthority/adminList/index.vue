<template>
  <div class="divBox">
    <el-card
      class="box-card"
      :body-style="{ padding: 0 }"
      :bordered="false"
      shadow="never"
      v-hasPermi="['platform:admin:list']"
    >
      <div class="padding-add">
        <el-form inline size="small" @submit.native.prevent>
          <el-form-item label="管理员身份：">
            <el-select v-model="listPram.roles" placeholder="请选择管理员身份" clearable class="selWidth">
              <el-option v-for="item in roleList.list" :key="item.id" :label="item.roleName" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="管理员状态：">
            <el-select v-model="listPram.status" placeholder="管理员状态" clearable class="selWidth">
              <el-option
                placeholder="请选择管理员状态"
                v-for="item in constants.roleListStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="管理员搜索：">
            <el-input
              v-model.trim="realName"
              @keyup.enter.native="handleSearch"
              placeholder="请输入姓名或者账号"
              clearable
              class="selWidth"
            />
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" @click="handleSearch">查询</el-button>
            <el-button size="small" @click="reset()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card mt14" :body-style="{ padding: '20px' }" shadow="never" :bordered="false">
      <el-button size="mini" type="primary" @click="handlerOpenEdit(0)">添加管理员</el-button>
      <el-table v-loading="listLoading" class="operation mt20" :data="listData.list" size="small">
        <el-table-column prop="id" label="ID" width="50" />
        <el-table-column label="姓名" prop="realName" min-width="120" />
        <el-table-column label="账号" prop="account" min-width="120" />
        <el-table-column label="手机号" prop="lastTime" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.phone | filterEmpty }}</span>
          </template>
        </el-table-column>
        <el-table-column label="身份" prop="realName" min-width="230">
          <template slot-scope="scope" v-if="scope.row.roleNames">
            <el-tag
              size="small"
              type="info"
              v-for="(item, index) in scope.row.roleNames.split(',')"
              :key="index"
              class="mr5"
              >{{ item }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="最后登录时间" prop="lastTime" min-width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.lastTime | filterEmpty }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最后登录IP" prop="lastIp" min-width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.lastIp | filterEmpty }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="100">
          <template slot-scope="scope">
            <el-switch
              v-if="checkPermi(['platform:admin:update:status'])"
              v-model="scope.row.status"
              :active-value="true"
              :inactive-value="false"
              active-text="开启"
              inactive-text="关闭"
              :disabled="scope.row.roles === '1'"
              @change="onchangeIsShow(scope.row)"
            />
            <div v-else>{{ scope.row.status ? '开启' : '关闭' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="接收短信" min-width="100" fixed="right">
          <template slot-scope="scope">
            <el-switch
                v-if="checkPermi(['platform:admin:update:receive:sms'])"
                v-model="scope.row.isSms"
                :active-value="true"
                :inactive-value="false"
                active-text="开启"
                inactive-text="关闭"
                @change="onchangeReceiveSmsIsShow(scope.row)"
            />
            <div v-else>{{ scope.row.isSms ? '开启' : '关闭' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <template v-if="scope.row.isDel">
              <span>-</span>
            </template>
            <template v-else>
              <el-button
                :disabled="scope.row.roles === '1'"
                type="text"
                size="mini"
                @click="handlerOpenEditPassWord(scope.row)"
                v-hasPermi="['platform:admin:update:password']"
                >修改密码</el-button
              >
              <el-divider direction="vertical"></el-divider>
              <el-button
                :disabled="scope.row.roles === '1'"
                type="text"
                size="mini"
                @click="handlerOpenEdit(1, scope.row)"
                v-hasPermi="['platform:admin:update', 'platform:admin:info']"
                >编辑</el-button
              >
              <el-divider direction="vertical"></el-divider>
              <el-button
                type="text"
                size="mini"
                :disabled="scope.row.roles === '1'"
                @click="handlerOpenDel(scope.row)"
                v-hasPermi="['platform:admin:delete']"
                >删除</el-button
              >
            </template>
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
    <!--编辑-->
    <el-dialog
      :visible.sync="editDialogConfig.visible"
      :title="editDialogConfig.isCreate === 0 ? '创建管理员' : '编辑管理员'"
      destroy-on-close
      :close-on-click-modal="false"
      width="700px"
      class="dialog-bottom"
    >
      <edit
        v-if="editDialogConfig.visible"
        :is-create="editDialogConfig.isCreate"
        :edit-data="editDialogConfig.editData"
        @hideEditDialog="hideEditDialog"
      />
    </el-dialog>
    <!--修改密码-->
    <el-dialog
      :visible.sync="editPassWordDialogConfig.visible"
      title="修改密码"
      destroy-on-close
      :close-on-click-modal="false"
      width="540px"
      class="dialog-bottom"
    >
      <edit-pass-word
        :adminId="adminId"
        v-if="editPassWordDialogConfig.visible"
        @hideEditPassWordDialog="hideEditPassWordDialog"
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
import * as systemAdminApi from '@/api/systemadmin.js';
import * as roleApi from '@/api/role.js';
import edit from './edit';
import editPassWord from './editPassWord.vue';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
export default {
  // name: "index"
  components: { edit, editPassWord },
  data() {
    return {
      constants: this.$constants,
      listData: { list: [] },
      listPram: {
        account: null,
        addTime: null,
        lastIp: null,
        lastTime: null,
        level: null,
        loginCount: null,
        realName: null,
        roles: null,
        status: null,
        page: 1,
        limit: this.$constants.page.limit[0],
      },
      realName: '',
      roleList: [],
      menuList: [],
      editDialogConfig: {
        visible: false,
        isCreate: 0, // 0=创建，1=编辑
        editData: {},
      },
      //修改密码
      editPassWordDialogConfig: {
        visible: false,
        editData: {},
      },
      adminId: 0, //管理员id
      listLoading: false,
    };
  },
  mounted() {
    if (checkPermi(['platform:admin:list'])) this.handleGetAdminList();
    if (checkPermi(['platform:admin:role:list'])) this.handleGetRoleList();
  },
  methods: {
    checkPermi,
    //接收短信状态修改
    onchangeReceiveSmsIsShow(row) {
      systemAdminApi
          .updateReceiveSmsApi(row.id)
          .then(async () => {
            this.$message.success('修改成功');
            this.handleGetAdminList();
          })
          .catch(() => {
            row.isSms = !row.isSms;
          });
    },
    //关闭修改密码弹窗
    hideEditPassWordDialog() {
      this.editPassWordDialogConfig.visible = false;
    },
    //修改密码
    handlerOpenEditPassWord(row) {
      this.adminId = row.id;
      this.editPassWordDialogConfig.visible = true;
    },
    onchangeIsShow(row) {
      systemAdminApi
        .updateStatusApi({ id: row.id, status: row.status })
        .then(async () => {
          this.$message.success('修改成功');
          this.handleGetAdminList();
        })
        .catch(() => {
          row.status = !row.status;
        });
    },
    handleSearch() {
      this.listPram.page = 1;
      this.handleGetAdminList();
    },
    handleSizeChange(val) {
      this.listPram.limit = val;
      this.handleGetAdminList();
      this.handleGetRoleList(this.listPram);
    },
    handleCurrentChange(val) {
      this.listPram.page = val;
      this.handleGetAdminList();
      this.handleGetRoleList(this.listPram);
    },
    handleGetRoleList() {
      const _pram = {
        page: 1,
        limit: this.constants.page.limit[4],
      };
      roleApi.getRoleList(_pram).then((data) => {
        this.roleList = data;
      });
    },
    handlerOpenDel(rowData) {
      this.$confirm('确认删除当前数据').then(() => {
        const _pram = { id: rowData.id };
        systemAdminApi.adminDel(_pram).then((data) => {
          this.$message.success('删除数据成功');
          this.listPram.page = 1;
          this.handleGetAdminList();
        });
      });
    },
    //重置
    reset() {
      this.listPram.realName = '';
      this.realName = '';
      this.listPram.page = 1;
      this.listPram.roles = null;
      this.listPram.status = null;
      this.handleGetAdminList();
    },
    handleGetAdminList() {
      this.listLoading = true;
      this.listPram.realName = encodeURIComponent(this.realName);
      systemAdminApi
        .adminList(this.listPram)
        .then((data) => {
          this.listData = data;
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    handlerOpenEdit(isCreate, editDate) {
      this.editDialogConfig.editData = editDate;
      this.editDialogConfig.isCreate = isCreate;
      this.editDialogConfig.visible = true;
    },
    hideEditDialog() {
      this.editDialogConfig.visible = false;
      this.handleGetAdminList();
    },
  },
};
</script>

<style scoped lang="scss"></style>
