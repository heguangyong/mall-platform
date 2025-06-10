<template>
  <div class="divBox">
    <el-card
      :bordered="false"
      shadow="never"
      class="ivu-mt"
      :body-style="{ padding: 0 }"
      v-hasPermi="['platform:integral:page:list']"
    >
      <div class="padding-add">
        <el-form size="small" inline @submit.native.prevent>
          <el-form-item label="时间选择：">
            <el-date-picker
              v-model="timeVal"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              size="small"
              type="daterange"
              placement="bottom-end"
              placeholder="自定义时间"
              style="width: 260px"
              @change="onchangeTime"
            />
          </el-form-item>
          <el-form-item label="用户搜索：" label-for="nickname">
            <UserSearchInput v-model="tableFrom" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="getList(1)">查询</el-button>
            <el-button size="small" @click="reset()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card mt20" :bordered="false" shadow="never">
      <el-table v-loading="listLoading" :data="tableData.data" size="small" class="table" highlight-current-row>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="title" label="标题" min-width="180" />
        <el-table-column label="用户昵称" min-width="120" prop="nickName" :show-overflow-tooltip="true" />
        <el-table-column
          sortable
          label="明细数字"
          min-width="120"
          prop="integral"
          :sort-method="
            (a, b) => {
              return a.integral - b.integral;
            }
          "
        >
          <template slot-scope="scope">
            <span>{{ scope.row.type === 1 ? '+' : '-' }}{{ scope.row.integral }}</span>
          </template>
        </el-table-column>
        <el-table-column label="关联号" min-width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.linkId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="关联类型">
          <template slot-scope="scope">
            <span>{{ scope.row.linkType | integralLinkTypeFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span>{{ scope.row.status | integralStatusFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.mark | filterEmpty }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="	添加时间" min-width="150" />
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
// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
import { integralListApi } from '@/api/marketing';
import cardsData from '@/components/cards/index';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
export default {
  components: { cardsData },
  data() {
    return {
      loading: false,
      options: [],
      fromList: this.$constants.fromList,
      listLoading: false,
      tableData: {
        data: [],
        total: 0,
      },
      tableFrom: {
        page: 1,
        limit: 20,
        dateLimit: '',
        searchType: 'all',
        content: '',
      },
      userIdList: [],
      userList: [],
      timeVal: [],
      values: [],
    };
  },
  mounted() {
    if (checkPermi(['platform:integral:page:list'])) this.getList();
  },
  methods: {
    checkPermi,
    seachList() {
      this.tableFrom.page = 1;
      this.getList();
    },
    reset() {
      this.tableFrom.dateLimit = '';
      this.tableFrom.searchType = 'all';
      this.tableFrom.content = '';
      this.timeVal = [];
      this.getList(1);
    },
    // 选择时间
    selectChange(tab) {
      this.tableFrom.dateLimit = tab;
      this.tableFrom.page = 1;
      this.timeVal = [];
      this.getList();
    },
    // 具体日期
    onchangeTime(e) {
      this.timeVal = e;
      this.tableFrom.dateLimit = e ? this.timeVal.join(',') : '';
      this.tableFrom.page = 1;
      this.getList();
    },
    // 列表
    getList(num) {
      this.listLoading = true;
      this.tableFrom.page = num ? num : this.tableFrom.page;
      integralListApi(this.tableFrom)
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
  },
};
</script>

<style lang="sass" scoped></style>
