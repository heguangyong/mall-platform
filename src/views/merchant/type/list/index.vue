<template>
  <div class="divBox relative">
    <el-card class="box-card" shadow="never" :bordered="false">
      <el-button v-hasPermi="['platform:merchant:type:add']" type="primary" size="small" @click="handlerOpenEdit(0)"
        >添加店铺类型</el-button
      >
      <el-table
        v-loading="listLoading"
        :data="tableData.data"
        size="small"
        height="500px"
        :highlight-current-row="true"
        class="mt20"
      >
        <el-table-column prop="id" label="ID" min-width="50" />
        <el-table-column label="店铺类型名称" prop="name" min-width="150"> </el-table-column>
        <el-table-column prop="info" label="店铺类型要求" min-width="200" :show-overflow-tooltip="true" />
        <el-table-column label="添加时间" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="scope">
            <a @click="handlerOpenEdit(1, scope.row)" v-hasPermi="['platform:merchant:type:update']">编辑</a>
            <el-divider direction="vertical"></el-divider>
            <a @click="handlerOpenDel(scope.row)" v-hasPermi="['platform:merchant:type:delete']">删除</a>
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
import { checkPermi } from '@/utils/permission'; // 权限判断函数
export default {
  data() {
    return {
      tableFrom: {},
      tableData: {
        data: [],
        total: 0,
      },
      listLoading: false,
      editDialogConfig: {
        visible: false,
        editData: {},
      },
      keyNum: 0,
      id: 0,
    };
  },
  mounted() {
    if (checkPermi(['platform:merchant:type:all'])) this.getList();
  },
  methods: {
    checkPermi,
    // 列表
    getList() {
      this.listLoading = true;
      merchant
        .merchantTypeListApi()
        .then((res) => {
          this.tableData.data = res.list;
          this.tableData.total = res.total;
          this.listLoading = false;
        })
        .catch((res) => {
          this.listLoading = false;
          this.$message.error(res.message);
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
    handlerOpenEdit(isCreate, editDate) {
      const _this = this;
      this.id = editDate ? editDate.id : 0;
      this.$modalParserFrom(
        isCreate === 0 ? '店铺类型' : '编辑店铺类型',
        '店铺类型',
        isCreate,
        isCreate === 0 ? { id: 0, name: '', info: '' } : Object.assign({}, editDate),
        function (formValue) {
          _this.submit(formValue);
        },
        (this.keyNum += 3),
      );
    },
    submit(formValue) {
      const data = {
        id: this.id,
        name: formValue.name,
        info: formValue.info,
      };
      !this.id
        ? merchant
            .merchantTypeAddApi(data)
            .then((res) => {
              this.$message.success('操作成功');
              this.$msgbox.close();
              this.$store.commit('merchant/SET_MerchantType', []);
              this.getList();
            })
            .catch(() => {
              this.loading = false;
            })
        : merchant
            .merchantTypeUpdateApi(data)
            .then((res) => {
              this.$message.success('操作成功');
              this.$msgbox.close();
              this.$store.commit('product/SET_MerchantType', []);
              this.getList();
            })
            .catch(() => {
              this.loading = false;
            });
    },
    handlerOpenDel(rowData) {
      this.$modalSure('删除当前店铺类型吗？').then(() => {
        merchant.merchantTypeDeleteApi(rowData.id).then((data) => {
          this.$message.success('删除店铺类型成功');
          this.getList();
          this.$store.commit('product/SET_MerchantType', []);
        });
      });
    },
    hideEditDialog() {
      this.editDialogConfig.visible = false;
      this.handleGetRoleList();
    },
  },
};
</script>
