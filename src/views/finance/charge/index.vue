<template>
  <div class="divBox">
    <el-card
      v-hasPermi="['platform:recharge:order:list']"
      :bordered="false"
      shadow="never"
      class="ivu-mt"
      :body-style="{ padding: 0 }"
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
              class="selWidth"
              @change="onchangeTime"
            />
          </el-form-item>
          <el-form-item label="用户搜索：" label-for="nickname">
            <UserSearchInput v-model="tableFrom" />
          </el-form-item>
          <el-form-item label="订单编号：" label-width="66px">
            <el-input
              v-model="tableFrom.keywords"
              placeholder="请输入订单号"
              class="selWidth"
              size="small"
              @keyup.enter.native="getList(1)"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="getList(1)">查询</el-button>
            <el-button size="small" @click="reset()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card mt14" :body-style="{ padding: '20px' }" shadow="never" :bordered="false">
      <el-table
        v-loading="listLoading"
        :data="tableData.data"
        style="width: 100%"
        size="small"
        class="table"
        highlight-current-row
      >
        <el-table-column prop="uid" label="用户ID" width="60" />
        <el-table-column label="头像" min-width="80">
          <template slot-scope="scope">
            <div class="demo-image__preview line-heightOne">
              <el-image :src="scope.row.avatar" :preview-src-list="[scope.row.avatar]" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="用户昵称" min-width="150" :show-overflow-tooltip="true" />
        <el-table-column prop="orderNo" label="订单编号" min-width="180" />
        <el-table-column
          sortable
          label="支付金额"
          min-width="120"
          :sort-method="
            (a, b) => {
              return a.price - b.price;
            }
          "
          prop="price"
        />
        <el-table-column
          sortable
          label="赠送金额"
          min-width="120"
          prop="givePrice"
          :sort-method="
            (a, b) => {
              return a.givePrice - b.givePrice;
            }
          "
        />
        <el-table-column label="支付方式" min-width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.payType === 'weixin' ? '微信' : '支付宝' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="支付渠道" min-width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.payChannel | rechargeTypeFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="支付时间" min-width="150">
          <template slot-scope="scope">
            <span class="spBlock">{{ scope.row.payTime || '无' }}</span>
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
import { rechargeLstApi } from '@/api/finance';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
export default {
  name: 'AccountsBill',
  data() {
    return {
      editData: {},
      isCreate: 1,
      cardLists: [],
      timeVal: [],
      tableData: {
        data: [],
        total: 0,
      },
      listLoading: true,
      tableFrom: {
        uid: '',
        dateLimit: '',
        keywords: '',
        page: 1,
        limit: 20,
        searchType: 'all',
        content: '',
      },
      fromList: this.$constants.fromList,
      dialogVisible: false,
    };
  },
  mounted() {
    if (checkPermi(['platform:recharge:order:list'])) this.getList();
  },
  methods: {
    checkPermi,
    // 选择时间
    selectChange(tab) {
      this.tableFrom.dateLimit = tab;
      this.timeVal = [];
      this.tableFrom.page = 1;
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
      rechargeLstApi(this.tableFrom)
        .then((res) => {
          this.tableData.data = res.list;
          this.tableData.total = res.total;
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    reset() {
      this.tableFrom.uid = '';
      this.tableFrom.dateLimit = '';
      this.tableFrom.keywords = '';
      this.tableFrom.searchType = 'all';
      this.tableFrom.content = '';
      this.timeVal = [];
      this.getList(1);
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

<style scoped></style>
