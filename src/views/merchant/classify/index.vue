<template>
  <div class="divBox relative">
    <el-card class="box-card" shadow="never" :bordered="false">
      <el-button
        type="primary"
        class="mr20"
        size="small"
        v-hasPermi="['platform:merchant:category:add']"
        @click="handlerOpenEdit(0)"
        >添加商户分类</el-button
      >
      <el-table
        v-loading="listLoading"
        :data="tableData.data"
        style="width: 100%"
        size="small"
        :highlight-current-row="true"
        class="mt20"
      >
        <el-table-column prop="id" label="ID" min-width="50" />
        <el-table-column label="分类名称" prop="name" min-width="100" :show-overflow-tooltip="true"> </el-table-column>
        <el-table-column prop="handlingFee" label="手续费" min-width="100" />
        <el-table-column label="添加时间" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="scope">
            <a @click="handlerOpenEdit(1, scope.row)" v-hasPermi="['platform:merchant:category:update']">编辑</a>
            <el-divider direction="vertical"></el-divider>
            <a @click="handlerOpenDel(scope.row)" v-hasPermi="['platform:merchant:category:delete']">删除</a>
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
import * as merchant from '@/api/merchant';
import store from '@/store';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
export default {
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
      listLoading: false,
      keyNum: 0,
      id: 0,
    };
  },
  mounted() {
    if (checkPermi(['platform:merchant:category:list'])) this.getList();
  },
  methods: {
    checkPermi,
    // 列表
    getList(num) {
      this.tableFrom.page = num ? num : this.tableFrom.page;
      this.listLoading = true;
      merchant
        .merchantCategoryListApi(this.tableFrom)
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
      this.getList(1);
    },
    handlerOpenEdit(isCreate, editDate) {
      const _this = this;
      this.id = editDate ? editDate.id : 0;
      this.$modalParserFrom(
        isCreate === 0 ? '新建分类' : '编辑分类',
        '商户分类',
        isCreate,
        isCreate === 0
          ? {
              id: 0,
              name: '',
              handlingFee: '',
            }
          : Object.assign({}, editDate),
        function (formValue) {
          _this.submit(formValue);
        },
        (this.keyNum += 2),
      );
    },
    submit(formValue) {
      const data = {
        id: this.id,
        name: formValue.name,
        handlingFee: formValue.handlingFee,
      };
      !this.id
        ? merchant
            .merchantCategoryAddApi(data)
            .then((res) => {
              this.$message.success('操作成功');
              this.$msgbox.close();
              this.$store.commit('merchant/SET_MerchantClassify', []);
              this.getList();
            })
            .catch(() => {
              this.loading = false;
            })
        : merchant
            .merchantCategoryUpdateApi(data)
            .then((res) => {
              this.$message.success('操作成功');
              this.$msgbox.close();
              this.$store.commit('merchant/SET_MerchantClassify', []);
              this.getList();
            })
            .catch(() => {
              this.loading = false;
            });
    },
    handlerOpenDel(rowData) {
      this.$modalSure('删除当前分类吗').then(() => {
        merchant.merchantCategoryDeleteApi(rowData.id).then((data) => {
          this.$message.success('删除分类成功');
          this.getList(1);
          this.$store.commit('merchant/SET_MerchantClassify', []);
        });
      });
    },
  },
};
</script>
