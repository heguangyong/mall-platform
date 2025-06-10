<template>
  <div class="divBox">
    <el-card
      class="box-card"
      shadow="never"
      :bordered="false"
      v-hasPermi="['platform:express:list']"
      :body-style="{ padding: 0 }"
    >
      <div class="padding-add">
        <el-form ref="form" inline :model="form" @submit.native.prevent>
          <el-form-item label="关键字：">
            <el-input
              v-model.trim="form.keywords"
              @keyup.enter.native="handlerSearch"
              placeholder="请输入关键字"
              class="selWidth"
              size="small"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="handlerSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card mt14" :body-style="{ padding: '20px' }" shadow="never" :bordered="false">
      <el-button type="primary" size="small" @click="addExpress" v-hasPermi="['platform:express:sync']"
        >同步物流公司</el-button
      >
      <el-table class="mt20" v-loading="loading" size="small" :data="tableData.list">
        <el-table-column prop="id" label="ID" min-width="180" />
        <el-table-column label="物流公司名称" min-width="150" prop="name" />
        <el-table-column min-width="200" label="编码" prop="code" />
        <el-table-column min-width="100" label="排序" prop="sort" sortable />
        <el-table-column label="是否显示" min-width="100">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isShow"
              class="demo"
              :active-value="true"
              :inactive-value="false"
              active-text="开启"
              inactive-text="关闭"
              @change="bindStatus(scope.row)"
              v-if="checkPermi(['platform:express:update:show'])"
            />
            <div v-else>{{ scope.row.isShow ? '开启' : '关闭' }}</div>
          </template>
        </el-table-column>
        <el-table-column v-hasPermi="['platform:express:update']" prop="address" fixed="right" width="70" label="操作">
          <template slot-scope="scope">
            <a @click="bindEdit(scope.row)">编辑</a>
          </template>
        </el-table-column> </el-table
      >`
      <div class="block-pagination">
        <el-pagination
          background
          :page-sizes="[20, 40, 60, 80]"
          :page-size="tableData.limit"
          :current-page="tableData.page"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.total"
          @current-change="pageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>
    <el-dialog title="编辑物流公司" :visible.sync="dialogVisible" width="540px" :before-close="handleClose">
      <el-form :model="formData" :rules="rules" ref="formData" label-width="65px" class="demo-ruleForm">
        <el-form-item label="月结账号" prop="account" v-if="formData.partnerId">
          <el-input v-model.trim="formData.account" placeholder="请输入月结账号"></el-input>
        </el-form-item>
        <el-form-item label="月结密码" prop="password" v-if="formData.partnerKey">
          <el-input v-model.trim="formData.password" placeholder="请输入月结密码"></el-input>
        </el-form-item>
        <el-form-item label="网点名称" prop="netName" v-if="formData.net">
          <el-input v-model.trim="formData.netName" placeholder="请输入网点名称"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model.trim="formData.sort" :min="0" :max="9999" label="排序"></el-input-number>
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="false">关闭</el-radio>
            <el-radio :label="true">开启</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit('formData')" v-hasPermi="['platform:express:update']">确定</el-button>
      </span>
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
import parser from '@/components/FormGenerator/components/parser/Parser';
import * as logistics from '@/api/logistics.js';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
import { Debounce } from '@/utils/validate';
export default {
  name: 'CompanyList',
  components: { parser },
  data() {
    return {
      constants: this.$constants,
      // 表单
      formConf: { fields: [] },
      form: {
        keywords: '',
      },
      tableData: {},
      page: 1,
      limit: 20,
      loading: false,
      dialogVisible: false,
      fromType: 'add',
      formData: {
        status: false,
      },
      isCreate: 0,
      formShow: false,
      editId: 0,
      rules: {
        sort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
        account: [{ required: true, message: '请输入月结账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入月结密码', trigger: 'blur' }],
        netName: [{ required: true, message: '请输入网点名称', trigger: 'blur' }],
      },
    };
  },
  created() {
    if (checkPermi(['platform:express:list'])) this.getExpressList();
  },
  methods: {
    checkPermi,
    handlerSearch() {
      this.page = 1;
      this.getExpressList();
    },
    //  获取物流公司列表
    getExpressList() {
      this.loading = true;
      logistics
        .expressList({
          page: this.page,
          limit: this.limit,
          keywords: this.form.keywords,
        })
        .then((res) => {
          this.loading = false;
          this.tableData = res;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 物流开关
    bindStatus(item) {
      logistics
        .expressUpdateShow({
          account: item.account,
          code: item.code,
          id: item.id,
          isShow: item.isShow,
          name: item.name,
          sort: item.sort,
        })
        .then((res) => {
          this.$message.success('操作成功');
          // this.getExpressList()
        })
        .catch(() => {
          item.isShow = !item.isShow;
        });
    },
    // 分页
    pageChange(e) {
      this.page = e;
      this.getExpressList();
    },
    handleSizeChange(e) {
      this.limit = e;
      this.getExpressList();
    },
    // 添加物流公司
    addExpress() {
      logistics.expressSyncApi().then((res) => {
        this.$message.success('同步物流公司成功');
        this.page = 1;
        this.getExpressList();
      });
    },
    // 删除物流公司
    bindDelete(item) {
      this.$modalSure().then(() => {
        logistics.expressDelete({ id: item.id }).then((res) => {
          this.$message.success('删除成功');
          this.getExpressList();
        });
      });
    },
    // 表单提交
    submit: Debounce(function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          logistics.expressUpdate(this.formData).then((res) => {
            this.$message.success('操作成功');
            this.handleClose();
            this.getExpressList();
          });
        } else {
          return false;
        }
      });
    }),
    //  关闭模态框
    handleClose(done) {
      this.formShow = false;
      // this.formData = {}
      this.formConf.fields = [];
      this.dialogVisible = false;
      this.isCreate = 0;
    },
    // 编辑
    bindEdit(item) {
      this.dialogVisible = true;
      this.editId = item.id;
      logistics.expressInfo({ id: item.id }).then((res) => {
        this.formData = res;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-icon-plus {
  margin-right: 5px;
}

.formBox {
  .el-input-number--medium {
    width: 100px;
  }
}
</style>
