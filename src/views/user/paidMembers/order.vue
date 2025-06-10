<template>
  <div class="divBox">
    <el-card
      :bordered="false"
      shadow="never"
      class="ivu-mt"
      :body-style="{ padding: 0 }"
      v-hasPermi="['platform:paid:member:order:page:list']"
    >
      <div class="padding-add">
        <el-form size="small" label-position="right" inline @submit.native.prevent>
          <el-form-item label="支付时间：">
            <el-date-picker
              v-model="timeVal"
              size="small"
              type="daterange"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="onchangeTime"
              class="selWidth"
            />
          </el-form-item>
          <el-form-item label="支付方式：">
            <el-select
              v-model.trim="tableFrom.payType"
              clearable
              size="small"
              placeholder="请选择"
              class="selWidth"
              @change="getList(1)"
            >
              <el-option label="微信" value="weixin" />
              <el-option label="支付宝" value="alipay" />
              <el-option label="余额" value="yue" />
              <el-option label="平台赠送" value="give" />
            </el-select>
          </el-form-item>
          <el-form-item label="支付状态：">
            <el-select
              v-model.trim="tableFrom.payStatus"
              clearable
              size="small"
              placeholder="请选择"
              class="selWidth"
              @change="getList(1)"
            >
              <el-option label="未支付" value="0" />
              <el-option label="已支付" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="订单编号：">
            <el-input
              v-model.trim="orderNoSeach"
              @keyup.enter.native="getList(1)"
              size="small"
              clearable
              placeholder="请输入订单编号"
              class="selWidth"
            />
          </el-form-item>
          <el-form-item label="会员卡名：">
            <el-input
              v-model.trim="cardName"
              @keyup.enter.native="getList(1)"
              size="small"
              clearable
              placeholder="请输入会员卡名"
              class="selWidth"
            />
          </el-form-item>
          <el-form-item label="用户搜索：" label-for="nickname">
            <UserSearchInput v-model="tableFrom" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="getList(1)">查询</el-button>
            <el-button size="small" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card mt14" :body-style="{ padding: '0 20px 20px' }" shadow="never" :bordered="false">
      <el-table
        v-loading="listLoading"
        :data="tableData.data"
        style="width: 100%"
        size="small"
        highlight-current-row
        class="mt20"
      >
        <el-table-column prop="id" label="ID" min-width="60" />
        <el-table-column prop="orderNo" label="订单号" min-width="180" :show-overflow-tooltip="true" />
        <el-table-column label="用户昵称/ID" min-width="120">
          <template slot-scope="scope">
            <span class="spBlock">{{ scope.row.userNickname + '/' + scope.row.uid }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="userPhone" label="手机号" min-width="150" />
        <el-table-column prop="cardName" label="会员卡名称" min-width="150" />
        <el-table-column prop="price" label="支付金额(元)" min-width="110" />
        <el-table-column prop="payType" label="支付状态" min-width="110">
          <template slot-scope="scope">
            <span class="spBlock">{{ scope.row.paid | paidFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="payType" label="支付方式" min-width="110">
          <template slot-scope="scope">
            <span class="spBlock">{{ scope.row.payType | filterCardPayType }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="payTime" label="支付时间" min-width="150" />
        <el-table-column prop="cardExpirationTime" label="到期时间" min-width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 2" class="spBlock">永久</span>
            <span v-else class="spBlock">{{ scope.row.cardExpirationTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" fixed="right">
          <template slot-scope="scope">
            <a @click="handleInfo(scope.row.orderNo)" v-hasPermi="['platform:paid:member:order:info']">详情 </a>
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
    <!-- 订单详情-->
    <order-detail ref="orderDetail"></order-detail>
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
import { memberOrderListApi } from '@/api/user';
import OrderDetail from '../components/OrderDetail.vue';
import { checkPermi } from '@/utils/permission';
import { paidFilter } from '@/filters';
export default {
  name: 'paidMembersOrder',
  components: { OrderDetail },
  data() {
    return {
      tableFrom: {
        cardName: '',
        dateLimit: '',
        page: 1,
        limit: 20,
        orderNo: '',
        payType: null,
        payStatus: null,
        userNickname: '',
        searchType: 'all',
        content: '',
      },
      cardName: '',
      userNickname: '',
      orderNoSeach: '',
      timeVal: [],
      listLoading: false,
      tableData: {
        data: [],
        total: 0,
      },
    };
  },
  mounted() {
    if (checkPermi(['platform:paid:member:order:page:list'])) this.getList();
  },
  methods: {
    paidFilter,
    //详情
    handleInfo(id) {
      this.$refs.orderDetail.getDetail(id);
      this.$refs.orderDetail.dialogVisible = true;
    },
    /**
     *  具体日期
     */
    onchangeTime(e) {
      this.timeVal = e;
      this.tableFrom.dateLimit = this.timeVal ? this.timeVal.join(',') : '';
      this.getList(1);
    },
    /**
     *  列表
     */
    getList(num) {
      this.listLoading = true;
      this.tableFrom.cardName = encodeURIComponent(this.cardName);
      this.tableFrom.userNickname = encodeURIComponent(this.userNickname);
      this.tableFrom.orderNo = encodeURIComponent(this.orderNoSeach);
      this.tableFrom.page = num ? num : this.tableFrom.page;
      memberOrderListApi(this.tableFrom)
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
    reset() {
      this.tableFrom.content = '';
      this.tableFrom.searchType = 'all';
      this.tableFrom.cardName = '';
      this.tableFrom.dateLimit = '';
      this.tableFrom.page = 1;
      this.tableFrom.limit = 20;
      this.tableFrom.orderNo = '';
      this.tableFrom.payType = null;
      this.tableFrom.payStatus = null;
      this.tableFrom.userNickname = '';
      this.timeVal = [];
      this.cardName = '';
      this.orderNoSeach = '';
      this.userNickname = '';
      this.getList(1);
    },
    pageChange(page) {
      this.tableFrom.page = page;
      this.getList('');
    },
    handleSizeChange(val) {
      this.tableFrom.limit = val;
      this.getList(1);
    },
  },
};
</script>

<style scoped lang="scss"></style>
