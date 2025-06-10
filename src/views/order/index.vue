<template>
  <div class="divBox relative">
    <el-card
      :bordered="false"
      shadow="never"
      class="ivu-mt"
      :body-style="{ padding: 0 }"
      v-hasPermi="['platform:order:page:list']"
    >
      <div class="padding-add">
        <el-form size="small" inline label-position="right" @submit.native.prevent>
          <el-form-item label="订单编号：" label-width="66px">
            <el-input
              v-model.trim="tableFrom.orderNo"
              placeholder="请输入订单编号"
              class="selWidth"
              size="small"
              clearable
              @keyup.enter.native="handleSearchList"
            />
          </el-form-item>
          <el-form-item label="订单类型：">
            <el-select
              v-model="tableFrom.type"
              clearable
              size="small"
              placeholder="请选择"
              class="selWidth"
              @change="handleSearchList"
            >
              <el-option v-for="(item, i) in fromType" :key="i" :label="item.text" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="时间选择：">
            <el-date-picker
              v-model="timeVal"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              size="small"
              type="daterange"
              placement="bottom-end"
              placeholder="自定义时间"
              @change="onchangeTime"
              class="selWidth"
            />
          </el-form-item>
          <el-form-item label="用户搜索：" label-for="nickname">
            <UserSearchInput v-model="tableFrom" />
          </el-form-item>
          <el-form-item label="商户名称：">
            <merchant-name @getMerId="getMerId" :merIdChecked="tableFrom.merId"></merchant-name>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="handleSearchList">查询</el-button>
            <el-button size="small" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card mt14" :body-style="{ padding: '0 20px 20px' }" shadow="never" :bordered="false">
      <el-tabs class="list-tabs" v-model="tableFrom.status" @tab-click="handleSearchList">
        <el-tab-pane name="all" :label="`全部(${orderChartType.all || 0})`"></el-tab-pane>
        <el-tab-pane name="unPaid" :label="`未支付(${orderChartType.unPaid || 0})`"></el-tab-pane>
        <el-tab-pane name="notShipped" :label="`未发货(${orderChartType.notShipped || 0})`"></el-tab-pane>
        <el-tab-pane name="spike" :label="`待收货(${orderChartType.spike || 0})`"></el-tab-pane>
        <el-tab-pane name="awaitVerification" :label="`待核销(${orderChartType.verification || 0})`"></el-tab-pane>
        <el-tab-pane name="receiving" :label="`已收货(${orderChartType.receiving || 0})`"></el-tab-pane>
        <el-tab-pane name="complete" :label="`已完成(${orderChartType.complete || 0})`"></el-tab-pane>
        <el-tab-pane name="refunded" :label="`已退款(${orderChartType.refunded || 0})`"></el-tab-pane>
        <el-tab-pane name="cancel" :label="`已取消(${orderChartType.cancel || 0})`"></el-tab-pane>
        <el-tab-pane name="deleted" :label="`已删除(${orderChartType.deleted || 0})`"></el-tab-pane>
      </el-tabs>
      <div class="mt5">
        <el-button size="small" @click="exports" v-hasPermi="['platform:export:order:excel']">导出</el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :data="tableData.data"
        size="small"
        highlight-current-row
        :row-key="
          (row) => {
            return row.orderNo;
          }
        "
        class="mt20"
      >
        <el-table-column label="订单编号" min-width="220" v-if="checkedCities.includes('订单编号')">
          <template slot-scope="scope">
            <div class="acea-row">
              <font v-show="scope.row.type === 1" class="mr5">[秒杀]</font>
              <font v-show="scope.row.type === 2" class="mr5">[拼团]</font>
              <span
                style="display: block"
                v-text="scope.row.orderNo"
              />
            </div>
           <div class="flex">
              <span class="colorPrompt" v-show="parseInt(scope.row.refundStatus) > 0" style="display: block">{{
                  scope.row.refundStatus | orderRefundStatusFilter
                }}</span>
             <span v-show="scope.row.refundStatus==2" class="colorPrompt">{{ `（已退款 ${scope.row.refundNum} / 购买 ${scope.row.totalNum}）`}}</span>
           </div>
            <span v-show="scope.row.isUserDel" class="colorPrompt" style="display: block">用户已删除</span>
          </template>
        </el-table-column>
        <el-table-column prop="merName" label="商户名称" min-width="150" v-if="checkedCities.includes('商户名称')" />
        <el-table-column prop="nickName" label="用户昵称" min-width="150" v-if="checkedCities.includes('用户昵称')">
          <template slot-scope="scope">
            <span :class="scope.row.isLogoff == true ? 'colorPrompt' : ''">{{ scope.row.nickName }}</span>
            <span :class="scope.row.isLogoff == true ? 'colorPrompt' : ''" v-if="scope.row.isLogoff == true">|</span>
            <span v-if="scope.row.isLogoff == true" class="colorPrompt">(已注销)</span>
          </template>
        </el-table-column>
        <el-table-column prop="payPrice" label="实际支付" min-width="80" v-if="checkedCities.includes('实际支付')" />
        <el-table-column label="支付方式" min-width="80" v-if="checkedCities.includes('支付方式')">
          <template slot-scope="scope">
            <span>{{ scope.row.payType | payTypeFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单状态" min-width="100" v-if="checkedCities.includes('订单状态')">
          <template slot-scope="scope">
            <span class="textE93323 tag-background notStartTag tag-padding" v-if="scope.row.refundStatus === 3"
              >已退款</span
            >
            <span
              :class="scope.row.status < 5 ? 'doingTag' : 'endTag'"
              class="tag-background tag-padding"
              v-else-if="
                scope.row.groupBuyRecordStatus == 99 || scope.row.status == 9 || scope.row.groupBuyRecordStatus == 10
              "
              >{{ scope.row.status | orderStatusFilter }}</span
            >
            <span class="textE93323 tag-background notStartTag tag-padding" v-else>{{
              scope.row.groupBuyRecordStatus == 0 ? '拼团中' : '拼团失败'
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="下单时间" min-width="140" v-if="checkedCities.includes('下单时间')" />
        <el-table-column v-if="checkPermi(['platform:order:info'])" width="70" fixed="right">
          <template slot="header">
            <p>
              <span style="padding-right: 5px">操作</span>
              <i class="el-icon-setting" @click="handleAddItem"></i>
            </p>
          </template>
          <template slot-scope="scope">
            <a v-if="scope.row.groupBuyRecordStatus != 0" @click="onOrderDetails(scope.row.orderNo)"> 详情</a>
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
    <div class="card_abs" v-show="card_select_show">
      <template>
        <div class="cell_ht">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"
            >全选</el-checkbox
          >
          <el-button type="text" @click="checkSave()">保存</el-button>
        </div>
        <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="item in columnData" :label="item" :key="item" class="check_cell">{{ item }}</el-checkbox>
        </el-checkbox-group>
      </template>
    </div>

    <!--详情-->
    <details-from ref="orderDetail" :orderNo="orderNo" />
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
import { orderStatusNumApi, orderListApi, orderExcelApi } from '@/api/order';
import detailsFrom from '@/components/OrderDetail';
import merchantName from '@/components/merchantName';
import { isWriteOff } from '@/utils';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
export default {
  name: 'orderlistDetails',
  components: {
    detailsFrom,
    merchantName,
  },
  data() {
    return {
      options: [
        {
          value: 0,
          label: '全部',
        },
        {
          value: 2,
          label: '商城订单',
        },
        {
          value: 1,
          label: '视频号订单',
        },
      ],
      RefuseVisible: false,
      RefuseData: {},
      orderNo: '',
      refundVisible: false,
      refundData: {},
      dialogVisibleJI: false,
      tableDataLog: {
        data: [],
        total: 0,
      },
      tableFromLog: {
        page: 1,
        limit: 10,
        orderNo: 0,
      },
      LogLoading: false,
      isCreate: 1,
      editData: null,
      dialogVisible: false,
      tableData: {
        data: [],
        total: 0,
      },
      listLoading: true,
      tableFrom: {
        status: 'all',
        dateLimit: '',
        orderNo: '',
        page: 1,
        limit: 20,
        merId: null,
        type: '',
        searchType: 'all',
        content: '',
      },
      orderChartType: {},
      timeVal: [],
      fromList: this.$constants.fromList,
      fromType: [
        { value: '', text: '全部' },
        { value: '0', text: '普通' },
        { value: '1', text: '秒杀' },
        { value: '2', text: '拼团' },
      ],
      selectionList: [],
      ids: '',
      orderids: '',
      cardLists: [],
      isWriteOff: isWriteOff(),
      proType: 0,
      active: false,
      card_select_show: false,
      checkAll: false,
      checkedCities: ['订单编号', '商户名称', '用户昵称', '实际支付', '支付方式', '订单状态', '下单时间'],
      columnData: ['订单编号', '商户名称', '用户昵称', '实际支付', '支付方式', '订单状态', '下单时间'],
      isIndeterminate: true,
    };
  },
  mounted() {
    if (checkPermi(['platform:order:page:list'])) this.getList();
    if (checkPermi(['platform:order:status:num'])) this.getOrderStatusNum();
  },
  methods: {
    checkPermi,
    getMerId(id) {
      this.tableFrom.merId = id;
      this.handleSearchList();
    },
    resetForm(formValue) {
      this.dialogVisible = false;
    },
    handleReset() {
      this.tableFrom.content = '';
      this.tableFrom.searchType = 'all';
      this.tableFrom.status = 'all';
      this.tableFrom.dateLimit = '';
      this.tableFrom.orderNo = '';
      this.tableFrom.page = 1;
      this.tableFrom.merId = null;
      this.tableFrom.type = '';
      this.tableFrom.searchType = 'all';
      this.tableFrom.content = '';
      this.timeVal = [];
      this.handleSearchList();
    },
    handleSearchList() {
      this.tableFrom.page = 1;
      this.getList();
      this.getOrderStatusNum();
    },
    // 详情
    onOrderDetails(id) {
      this.orderNo = id;
      this.$refs.orderDetail.getDetail(id);
      this.$refs.orderDetail.getOrderInvoiceList(id);
      this.$refs.orderDetail.dialogVisible = true;
    },
    handleClose() {
      this.dialogVisible = false;
    },
    // 选择时间
    selectChange(tab) {
      this.timeVal = [];
      this.tableFrom.page = 1;
      this.getList();
      this.getOrderStatusNum();
    },
    // 具体日期
    onchangeTime(e) {
      this.timeVal = e;
      this.tableFrom.dateLimit = e ? this.timeVal.join(',') : '';
      this.tableFrom.page = 1;
      this.getList();
      this.getOrderStatusNum();
    },
    // 列表
    getList() {
      this.listLoading = true;
      orderListApi(this.tableFrom)
        .then((res) => {
          this.tableData.data = res.list || [];
          this.tableData.total = res.total;
          this.listLoading = false;
          this.checkedCities = this.$cache.local.has('order_stroge')
            ? this.$cache.local.getJSON('order_stroge')
            : this.checkedCities;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    // 获取各状态数量
    getOrderStatusNum() {
      let data = Object.assign({}, this.tableFrom);
      delete data.page;
      delete data.limit;
      delete data.status;
      orderStatusNumApi(data).then((res) => {
        this.orderChartType = res;
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
    exports() {
      let data = {
        dateLimit: this.tableFrom.dateLimit,
        orderNo: this.tableFrom.orderNo,
        status: this.tableFrom.status,
        type: this.tableFrom.type,
        merId: this.tableFrom.merId,
      };
      orderExcelApi(data).then((res) => {
        window.open(res.fileName);
      });
    },
    handleAddItem() {
      if (this.card_select_show) {
        this.$set(this, 'card_select_show', false);
      } else if (!this.card_select_show) {
        this.$set(this, 'card_select_show', true);
      }
    },
    handleCheckAllChange(val) {
      this.checkedCities = val ? this.columnData : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.columnData.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.columnData.length;
    },
    checkSave() {
      this.card_select_show = false;
      this.$modal.loading('正在保存到本地，请稍候...');
      this.$cache.local.setJSON('order_stroge', this.checkedCities);
      setTimeout(this.$modal.closeLoading(), 1000);
    },
  },
};
</script>
<style lang="scss" scoped>
font {
  color: var(--prev-color-primary);
}

.ml5 {
  margin-left: 5px;
}

.el-table__body {
  width: 100%;
  table-layout: fixed !important;
}

.demo-table-expand {
  ::v-deeplabel {
    width: 83px !important;
  }
}

.refunding {
  span {
    display: block;
  }
}

.el-icon-arrow-down {
  font-size: 12px;
}

.tabBox_tit {
  font-size: 12px !important;
  /*margin: 0 2px 0 10px;*/
  letter-spacing: 1px;
  /*padding: 5px 0;*/
  box-sizing: border-box;
}

.text_overflow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 400px;
}

.pup_card {
  width: 200px;
  border-radius: 5px;
  padding: 5px;
  box-sizing: border-box;
  font-size: 12px;
  line-height: 16px;
}

.flex-column {
  display: flex;
  flex-direction: column;
}

.relative {
  position: relative;
}

.card_abs {
  position: absolute;
  padding-bottom: 15px;
  top: 300px;
  right: 40px;
  width: 200px;
  background: #fff;
  z-index: 99999;
  box-shadow: 0px 0px 14px 0px rgba(0, 0, 0, 0.1);
}

.cell_ht {
  height: 50px;
  padding: 15px 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #eeeeee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.check_cell {
  width: 100%;
  padding: 15px 20px 0;
}

::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #606266;
}

.tag-background {
  padding: 3px 8px;
}
</style>
