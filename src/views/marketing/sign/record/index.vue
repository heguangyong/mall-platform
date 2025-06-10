<template>
  <div class="divBox relative">
    <el-card
      :bordered="false"
      shadow="never"
      class="ivu-mt"
      :body-style="{ padding: 0 }"
      v-hasPermi="['platform:sign:user:record:list']"
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
      <el-table
        v-loading="listLoading"
        :data="tableData.data"
        style="width: 100%"
        size="small"
        :highlight-current-row="true"
      >
        <el-table-column prop="id" label="ID" min-width="50" />
        <el-table-column label="头像" min-width="80">
          <template slot-scope="scope">
            <div class="demo-image__preview line-heightOne">
              <el-image :src="scope.row.avatar" :preview-src-list="[scope.row.avatar]" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="昵称" min-width="150" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.nickname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号" prop="phone" min-width="100" :show-overflow-tooltip="true"> </el-table-column>
        <el-table-column label="连续签到天数" prop="day" min-width="100" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="experience" label="签到经验" min-width="100" />
        <el-table-column prop="integral" label="签到积分" min-width="100" />
        <el-table-column prop="awardExperience" label="连续签获经验" min-width="100" />
        <el-table-column prop="awardIntegral" label="连续签获积分" min-width="100" />
        <el-table-column label="签到日期" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.date }}</span>
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
import { signeRecordListApi } from '@/api/marketing';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
export default {
  data() {
    return {
      tableFrom: {
        page: 1,
        limit: 20,
        dateLimit: '',
        searchType: 'all',
        content: '',
      },
      timeVal: [],
      tableData: {
        data: [],
        total: 0,
      },
      listLoading: false,
    };
  },
  mounted() {
    if (checkPermi(['platform:sign:user:record:list'])) this.getList();
  },
  methods: {
    checkPermi,
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
      signeRecordListApi(this.tableFrom)
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
