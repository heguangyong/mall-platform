<template>
  <div class="divBox">
    <el-card class="box-card" shadow="never" :bordered="false">
      <el-button size="small" type="primary" @click="openAdd(null)" v-hasPermi="['platform:user:tag:save']">
        添加用户标签
      </el-button>
      <el-table v-loading="listLoading" :data="tableData.data" class="mt20" size="small">
        <el-table-column label="ID" min-width="80" prop="id" />
        <el-table-column label="标签名称" min-width="180">
          <template slot-scope="{ row }">
            <span v-text="row.name"></span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template slot-scope="scope">
            <a @click="openAdd(scope.row)" v-hasPermi="['platform:user:tag:update']">编辑</a>
            <el-divider direction="vertical"></el-divider>
            <a @click="handleDelete(scope.row.id, scope.$index)" disable v-hasPermi="['platform:user:tag:delete']"
              >删除</a
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          background
          :page-sizes="[20, 40, 60, 80]"
          :page-size="tableFrom.limit"
          :current-page="tableFrom.page"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.total"
          @size-change="handleSizeChange"
          @current-change="pageChange"
        />
      </div>
    </el-card>
    <!--    添加标签-->
    <el-dialog
      :title="labelPram.id ? '编辑标签' : '添加标签'"
      :visible.sync="labelPram.dialogConfig.visible"
      width="540px"
      :close-on-click-modal="false"
    >
      <el-form :rules="rules" :model="labelPram" ref="ruleForm" label-width="70px" class="demo-dynamic">
        <el-form-item label="标签名称:" class="mb30" prop="name">
          <el-input v-model="labelPram.name" placeholder="请填写标签"></el-input>
        </el-form-item>
        <el-form-item class="form_submit_button_group"> </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="resetForm('ruleForm')">取消</el-button>
        <el-button type="primary" @click="onAdd('ruleForm')" v-hasPermi="['platform:user:update']">确认</el-button>
      </div>
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

import { tagListApi, tagDeleteApi, tagSaveApi, tagInfoApi, tagUpdateApi } from '@/api/user';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
import { Debounce } from '@/utils/validate';
import { handleDeleteTable } from '@/libs/public';
export default {
  name: 'UserGroup',
  data() {
    return {
      tableFrom: {
        page: 1,
        limit: 20,
      },
      tableData: {
        data: [],
        total: 0,
      },
      listLoading: true,
      labelPram: {
        id: null,
        name: null,
        dialogConfig: {
          visible: false,
        },
      },
      rules: {
        name: [{ required: true, message: '请输入用户标签', trigger: 'blur' }],
      },
    };
  },
  mounted() {
    if (checkPermi(['platform:user:tag:list'])) this.getList();
  },
  methods: {
    checkPermi,
    openAdd(row) {
      row ? (this.labelPram.id = row.id) : (this.labelPram.id = null);
      row ? (this.labelPram.name = row.name) : (this.labelPram.name = null);
      this.labelPram.dialogConfig.visible = true;
    },
    onAdd: Debounce(function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.labelPram.id
            ? tagUpdateApi({ id: this.labelPram.id, name: this.labelPram.name }).then(() => {
                this.$message.success('编辑成功');
                this.labelPram.dialogConfig.visible = false;
                this.getList();
              })
            : tagSaveApi({ name: this.labelPram.name }).then(() => {
                this.$message.success('新增成功');
                this.labelPram.dialogConfig.visible = false;
                this.getList();
              });
        } else {
          return false;
        }
      });
    }),
    // 列表
    getList() {
      this.listLoading = true;
      tagListApi(this.tableFrom)
        .then((res) => {
          this.tableData.data = res.list;
          this.tableData.total = res.total;
          this.listLoading = false;
        })
        .catch((res) => {
          this.listLoading = false;
        });
    },
    pageChange(page) {
      this.tableFrom.page = page;
      this.getList();
    },
    handleSizeChange(val) {
      this.tableFrom.limit = val;
      this.getList();
    },
    // 删除
    handleDelete(id, idx) {
      this.$modalSure('删除吗？所有用户已经关联的数据都会清除').then(() => {
        tagDeleteApi(id).then(() => {
          this.$message.success('删除成功');
          handleDeleteTable(this.tableData.data.length, this.tableFrom);
          this.getList();
        });
      });
    },
    resetForm(formName) {
      this.labelPram.dialogConfig.visible = false;
      this.$refs[formName].resetFields();
      this.$emit('resetForm');
    },
  },
};
</script>

<style scoped lang="scss"></style>
