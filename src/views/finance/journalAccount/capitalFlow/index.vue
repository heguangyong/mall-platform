<template>
  <div class="divBox">
    <el-card
      :bordered="false"
      shadow="never"
      class="ivu-mt"
      :body-style="{ padding: 0 }"
      v-hasPermi="['platform:finance:funds:flow']"
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
          <el-form-item label="流水搜索：" label-width="66px">
            <el-input v-model.trim="tableFrom.orderNo" placeholder="请输入订单号/退款单号" class="selWidth" />
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" @click="getList()">查询</el-button>
            <el-button size="small" @click="reset()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card mt14" shadow="never" :bordered="false">
      <el-table v-loading="listLoading" :data="tableData.data" style="width: 100%" size="small">
        <el-table-column prop="id" label="ID" min-width="80" />
        <el-table-column prop="orderNo" label="订单号" min-width="180" />
        <el-table-column prop="nickName" label="对方信息" min-width="150" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span v-if="scope.row.nickName">{{ scope.row.nickName }} | {{ scope.row.uid }}</span>
            <span v-else-if="scope.row.merName">{{ scope.row.merName }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="交易类型" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.type | transactionTypeFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="金额" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.pm === 1 ? scope.row.amount : -scope.row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mark" label="备注" min-width="180" :show-overflow-tooltip="true" />
        <el-table-column prop="createTime" label="交易时间" min-width="150" :show-overflow-tooltip="true" />
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

    <!--导出订单列表-->
    <!--<file-list ref="exportList" />-->
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
import { capitalFlowLstApi, capitalFlowExportApi } from '@/api/finance';
//import detailsFrom from '@/views/order/orderDetail'
import { checkPermi } from '@/utils/permission'; // 权限判断函数
export default {
  filters: {
    transactionTypeFilter(status) {
      const statusMap = {
        pay_order: '订单支付',
        refund_order: '订单退款',
        recharge_user: '用户充值',
        yue_pay: '余额支付',
        merchant_collect: '商户分账',
        brokerage: '分佣',
        system: '系统',
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      orderId: '',
      tableData: {
        data: [],
        total: 0,
      },
      listLoading: true,
      tableFrom: {
        orderNo: '',
        dateLimit: '',
        page: 1,
        limit: 20,
      },
      timeVal: [],
      fromList: this.$constants.fromList,
      selectionList: [],
      ids: '',
      tableFromLog: {
        page: 1,
        limit: 10,
      },
      tableDataLog: {
        data: [],
        total: 0,
      },
      LogLoading: false,
      dialogVisible: false,
      evaluationStatusList: [
        { value: 1, label: '已回复' },
        { value: 0, label: '未回复' },
      ],
      cardLists: [],
      orderDatalist: null,
    };
  },
  mounted() {
    if (checkPermi(['platform:finance:funds:flow'])) this.getList();
  },
  methods: {
    checkPermi,
    // 选择时间
    selectChange(tab) {
      this.tableFrom.dateLimit = tab;
      this.timeVal = [];
      this.getList(1);
    },
    // 具体日期
    onchangeTime(e) {
      this.timeVal = e;
      this.tableFrom.dateLimit = e ? this.timeVal.join(',') : '';
      this.getList(1);
    },
    // 导出
    exportRecord() {
      capitalFlowExportApi(this.tableFrom)
        .then((res) => {
          const h = this.$createElement;
          this.$msgbox({
            title: '提示',
            message: h('p', null, [
              h('span', null, '文件正在生成中，请稍后点击"'),
              h('span', { style: 'color: teal' }, '导出记录'),
              h('span', null, '"查看~ '),
            ]),
            confirmButtonText: '我知道了',
          }).then((action) => {});
        })
        .catch((res) => {
          this.$message.error(res.message);
        });
    },
    // 导出列表
    getExportFileList() {
      this.$refs.exportList.exportFileList();
    },
    // 列表
    getList(num) {
      this.listLoading = true;
      this.tableFrom.page = num ? num : this.tableFrom.page;
      capitalFlowLstApi(this.tableFrom)
        .then((res) => {
          this.tableData.data = res.list;
          this.tableData.total = res.total;
          this.listLoading = false;
        })
        .catch((res) => {
          this.$message.error(res.message);
          this.listLoading = false;
        });
    },
    reset() {
      this.tableFrom = {
        orderNo: '',
        dateLimit: '',
        page: 1,
        limit: 20,
      };
      this.getList();
    },
    pageChange(page) {
      this.tableFrom.page = page;
      this.getList();
    },
    handleSizeChange(val) {
      this.tableFrom.limit = val;
      this.getList(1);
    },
  },
};
</script>

<style lang="scss" scoped>
.el-icon-arrow-down {
  font-size: 12px;
}
.tabBox_tit {
  width: 60%;
  font-size: 12px !important;
  margin: 0 2px 0 10px;
  letter-spacing: 1px;
  padding: 5px 0;
  box-sizing: border-box;
}
.demo-image__preview {
  position: relative;
  padding-left: 40px;
}
.demo-image__preview .el-image,
.el-image__error {
  position: absolute;
  left: 0;
}
.maxw180 {
  display: inline-block;
  max-width: 180px;
}
</style>
