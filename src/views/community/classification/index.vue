<template>
  <div class="divBox relative">
    <el-card
      v-hasPermi="['platform:community:category:page:list']"
      :bordered="false"
      shadow="never"
      class="ivu-mt"
      :body-style="{ padding: 0 }"
    >
      <div class="padding-add">
        <el-form :inline="true" @submit.native.prevent>
          <el-form-item label="分类名称：">
            <el-input
              v-model.trim="name"
              @keyup.enter.native="getList(1)"
              placeholder="请输入分类名称"
              class="selWidth"
              size="small"
              clearable
            />
          </el-form-item>
          <el-form-item label="显示状态：">
            <el-select v-model="tableFrom.isShow" placeholder="请选择显示状态" size="small" class="selWidth" clearable>
              <el-option label="显示" value="1"></el-option>
              <el-option label="隐藏" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="getList(1)">查询</el-button>
            <el-button size="small" @click="reset()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card mt14" :body-style="{ padding: '20px' }" :bordered="false" shadow="never">
      <div class="acea-row">
        <el-button
          type="primary"
          size="small"
          v-hasPermi="['platform:community:category:add']"
          @click="handlerOpenEdit(0)"
          >添加社区分类</el-button
        >
      </div>
      <el-table v-loading="listLoading" :data="tableData.data" size="small" :highlight-current-row="true" class="mt20">
        <el-table-column prop="id" label="ID" min-width="50" />
        <el-table-column label="分类名称" prop="name" min-width="100" :show-overflow-tooltip="true"> </el-table-column>
        <el-table-column prop="sort" label="排序" min-width="100" />
        <el-table-column label="添加时间" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否开启" fixed="right" min-width="90">
          <template slot-scope="scope">
            <el-switch
              v-if="checkPermi(['platform:community:category:show:switch'])"
              v-model="scope.row.isShow"
              :active-value="1"
              :inactive-value="0"
              active-text="开启"
              inactive-text="关闭"
              @click.native="onchangeIsShow(scope.row)"
            />
            <div v-else>{{ scope.row.isShow ? '开启' : '关闭' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="scope">
            <a @click="handlerOpenEdit(1, scope.row)" v-hasPermi="['platform:community:category:update']">编辑</a>
            <el-divider direction="vertical"></el-divider>
            <a @click="handlerOpenDel(scope.row)" v-hasPermi="['platform:community:category:delete']">删除</a>
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
import * as community from '@/api/community';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
export default {
  data() {
    return {
      tableFrom: {
        page: 1,
        limit: 20,
        name: '',
        isShow: '',
      },
      name: '',
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
    if (checkPermi(['platform:community:category:page:list'])) this.getList();
  },
  methods: {
    checkPermi,
    onchangeIsShow(row) {
      community.communityCategoryShowApi(row.id).then((res) => {
        this.$message.success('操作成功');
        this.getList();
      });
    },
    // 列表
    getList(num) {
      this.tableFrom.page = num ? num : this.tableFrom.page;
      this.tableFrom.name = encodeURIComponent(this.name);
      this.listLoading = true;
      community
        .communityCategoryListApi(this.tableFrom)
        .then((res) => {
          this.tableData.data = res.list;
          this.tableData.total = res.total;
          this.listLoading = false;
        })
        .catch((res) => {
          this.listLoading = false;
        });
    },
    reset() {
      this.tableFrom.name = '';
      this.tableFrom.isShow = '';
      this.name = '';
      this.getList(1);
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
        'communityClassification',
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
          _this.resetForm(formValue);
        },
        (this.keyNum += 1),
      );
    },
    submit(formValue) {
      const data = {
        id: this.id,
        name: formValue.name,
        isShow: formValue.isShow,
        sort: formValue.sort,
      };
      !this.id
        ? community
            .communityCategoryAddApi(data)
            .then((res) => {
              this.$message.success('操作成功');
              this.$msgbox.close();
              this.getList();
            })
            .catch(() => {
              this.loading = false;
            })
        : community
            .communityCategoryUpdateApi(data)
            .then((res) => {
              this.$message.success('操作成功');
              this.$msgbox.close();
              this.getList();
            })
            .catch(() => {
              this.loading = false;
            });
    },
    handlerOpenDel(rowData) {
      this.$modalSure(
        '删除当前分类吗？删除之后，移动端页面分类筛选不展示此分类，移动端再次发表图文时，也不能够选择此分类。',
      ).then(() => {
        community.communityCategoryDelApi(rowData.id).then((data) => {
          this.$message.success('删除分类成功');
          if (this.tableData.data.length === 1 && this.tableFrom.page > 1)
            this.tableFrom.page = this.tableFrom.page - 1;
          this.getList();
        });
      });
    },
  },
};
</script>
<style>
.alert_title {
  margin-right: 10px;
}
</style>
