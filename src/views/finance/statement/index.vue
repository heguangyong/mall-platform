<template>
  <div class="divBox">
    <el-card
      v-hasPermi="['platform:finance:daily:statement:page:list', 'platform:finance:month:statement:page:list']"
      :bordered="false"
      shadow="never"
      class="ivu-mt"
      :body-style="{ padding: 0 }"
    >
      <div class="padding-add">
        <el-form size="small" inline label-width="80" @submit.native.prevent>
          <el-form-item label="时间选择：">
            <el-date-picker
              v-model="timeVal"
              align="right"
              unlink-panels
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="daterange"
              placement="bottom-end"
              placeholder="自定义时间"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              class="selWidth"
              :picker-options="pickerOptions"
              @change="onchangeTime"
              v-if="activeName === 'day'"
            />
            <el-date-picker
              v-model="timeVal"
              type="monthrange"
              align="right"
              unlink-panels
              value-format="yyyy-MM"
              format="yyyy-MM"
              @change="onchangeTime"
              start-placeholder="开始月份"
              end-placeholder="结束月份"
              class="selWidth"
              :picker-options="pickerOptionsYear"
              v-else
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card mt14" :body-style="{ padding: '0 20px 20px' }" shadow="never" :bordered="false">
      <div>
        <el-tabs class="list-tabs" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane
            v-hasPermi="['platform:finance:daily:statement:page:list']"
            label="日账单"
            name="day"
          ></el-tab-pane>
          <el-tab-pane
            v-hasPermi="['platform:finance:month:statement:page:list']"
            label="月账单"
            name="month"
          ></el-tab-pane>
        </el-tabs>
      </div>
      <el-table v-loading="listLoading" :data="tableData.data" class="mt5" size="small" highlight-current-row>
        <el-table-column prop="id" label="ID" min-width="90" />
        <el-table-column prop="dataDate" :label="activeName === 'day' ? '日期' : '月份'" min-width="150" />
        <el-table-column
          prop="currentDayBalance"
          :label="activeName === 'day' ? '当日结余' : '当月结余'"
          min-width="100"
        />
        <el-table-column prop="brokerage" label="佣金" min-width="100" />
        <el-table-column prop="orderReceivable" label="订单应收金额" min-width="100" />
        <el-table-column prop="payNum" label="订单应收笔数" min-width="100" />
        <el-table-column prop="orderRefundable" label="订单应退金额" min-width="120" />
        <el-table-column prop="refundNum" label="订单应退笔数" min-width="120" />
        <el-table-column prop="merchantTransferAmount" label="商家分账" min-width="150" />
        <el-table-column
          label="操作"
          width="70"
          fixed="right"
          v-hasPermi="['platform:finance:daily:statement:page:list', 'platform:finance:month:statement:page:list']"
        >
          <template slot-scope="scope">
            <a @click="onDetails(scope.row)">详情</a>
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
    <el-dialog
      :title="activeName === 'day' ? '日账单详情' : '月账单详情'"
      :visible.sync="dialogVisible"
      id="statement_detail_dialog"
      width="1200px"
      :before-close="handleClose"
      center
    >
      <el-row align="middle" class="ivu-mt mt20">
        <el-col :span="3">
          <el-menu default-active="0" class="el-menu-vertical-demo">
            <el-menu-item :name="accountDetails.dataDate">
              <span class="statement_date">{{ accountDetails.dataDate }}</span>
            </el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span="21">
          <el-col :span="10">
            <div class="grid-content">
              <span class="card_title">实际收入</span>
              <span class="card_title_price">
                {{ Number(accountDetails.realIncome) >= 0 ? '' : '-' }}
                ￥{{ Math.abs(accountDetails.realIncome) }}</span
              >
              <!--<span class="count font-red">{{ accountDetails.totalOrderNum }}笔</span>-->
              <div class="list">
                <el-card
                  class="mb10"
                  body-style="background-color: #F9F9F9;padding: 20px 15px;"
                  shadow="never"
                  :bordered="false"
                >
                  <div slot="header" class="acea-row row-between-wrapper">
                    <span class="header_title">订单实收</span>
                    <div class="card_title">￥{{ accountDetails.orderRealIncome }}</div>
                  </div>
                  <div class="text item">
                    <el-row class="item mb20">
                      <el-col :span="13" class="name">订单应收</el-col>
                      <el-col :span="11" class="cost mb10">
                        <span class="cost_price">￥{{ accountDetails.orderReceivable }}</span>
                      </el-col>
                      <el-col :span="13" class="name">&nbsp;&nbsp;&nbsp;</el-col>
                      <el-col :span="11" class="cost">
                        <span class="cost_num">{{ accountDetails.payNum }}笔</span>
                      </el-col>
                    </el-row>
                    <el-row class="item mb20">
                      <el-col :span="13" class="name">平台优惠券补贴</el-col>
                      <el-col :span="11" class="cost">
                        <span class="cost_price">-￥{{ accountDetails.platCouponPrice }}</span>
                      </el-col>
                    </el-row>
                    <el-row class="item">
                      <el-col :span="13" class="name">平台积分补贴</el-col>
                      <el-col :span="11" class="cost">
                        <span class="cost_price">-￥{{ accountDetails.integralPrice }}</span>
                      </el-col>
                    </el-row>
                  </div>
                </el-card>
                <el-card body-style="background-color: #F9F9F9;padding: 20px 15px;" shadow="never" :bordered="false">
                  <div slot="header" class="acea-row row-between-wrapper">
                    <span class="header_title">订单实退</span>
                    <div class="card_title">-￥{{ accountDetails.orderRealRefund }}</div>
                  </div>
                  <el-row class="item mb20">
                    <el-col :span="13" class="name">订单应退</el-col>
                    <el-col :span="11" class="cost mb10">
                      <span class="cost_price">-￥{{ accountDetails.orderRefundable }}</span>
                    </el-col>
                    <el-col :span="13" class="name">&nbsp;&nbsp;&nbsp;</el-col>
                    <el-col :span="11" class="cost">
                      <span class="cost_num">{{ accountDetails.refundNum }}笔</span>
                    </el-col>
                  </el-row>
                  <el-row class="item mb20">
                    <el-col :span="13" class="name">退还平台优惠券补贴</el-col>
                    <el-col :span="11" class="cost">
                      <span class="cost_price">￥{{ accountDetails.refundPlatCouponPrice }}</span>
                    </el-col>
                  </el-row>
                  <el-row class="item">
                    <el-col :span="13" class="name">退还平台积分补贴</el-col>
                    <el-col :span="11" class="cost">
                      <span class="cost_price">￥{{ accountDetails.refundIntegralPrice }}</span>
                    </el-col>
                  </el-row>
                </el-card>
              </div>
            </div>
            <el-divider direction="vertical" />
          </el-col>
          <el-col :span="10">
            <div class="grid-content">
              <span class="card_title">实际支出</span>
              <span class="card_title_price">
                {{ Number(accountDetails.actualExpenditure) >= 0 ? '' : '-' }}
                ￥{{ Math.abs(accountDetails.actualExpenditure) }}
              </span>
              <!--<span class="count font-red">{{ accountDetails.totalOrderNum }}笔</span>-->
              <div class="list">
                <el-card
                  body-style="background-color: #F9F9F9;padding: 20px 15px;"
                  class="mb10"
                  shadow="never"
                  :bordered="false"
                >
                  <div slot="header" class="acea-row row-between-wrapper">
                    <span class="header_title">商家分账</span>
                    <div class="card_title">
                      {{ Number(accountDetails.merchantTransferAmount) >= 0 ? '' : '-' }}
                      ￥{{ Math.abs(accountDetails.merchantTransferAmount) }}
                    </div>
                  </div>
                  <el-row class="item mb20">
                    <el-col :span="13" class="name">支付分账</el-col>
                    <el-col :span="11" class="cost">
                      <span class="cost_price">￥{{ accountDetails.payTransfer }}</span>
                    </el-col>
                  </el-row>
                  <el-row class="item">
                    <el-col :span="13" class="name">退款分账</el-col>
                    <el-col :span="11" class="cost">
                      <span class="cost_price">-￥{{ accountDetails.refundTransfer }}</span>
                    </el-col>
                  </el-row>
                </el-card>
                <el-card
                  body-style="background-color: #F9F9F9;padding: 20px 15px;"
                  class="mb10"
                  shadow="never"
                  :bordered="false"
                >
                  <div slot="header" class="acea-row row-between-wrapper">
                    <span class="header_title">佣金</span>
                    <div class="card_title">
                      {{ Number(accountDetails.brokerage) >= 0 ? '' : '-' }}
                      ￥{{ Math.abs(accountDetails.brokerage) }}
                    </div>
                  </div>
                  <el-row class="item mb20">
                    <el-col :span="13" class="name">支付佣金</el-col>
                    <el-col :span="11" class="cost">
                      <span class="cost_price">￥{{ accountDetails.brokeragePrice }}</span>
                    </el-col>
                  </el-row>
                  <el-row class="item mb20">
                    <el-col :span="13" class="name">退还佣金</el-col>
                    <el-col :span="11" class="cost">
                      <span class="cost_price">-￥{{ accountDetails.refundBrokeragePrice }}</span>
                    </el-col>
                  </el-row>
                  <el-row class="item">
                    <el-col :span="13" class="name">退款佣金代扣</el-col>
                    <el-col :span="11" class="cost">
                      <span class="cost_price">￥{{ accountDetails.refundReplaceBrokerage }}</span>
                    </el-col>
                  </el-row>
                </el-card>
                <el-card body-style="background-color: #F9F9F9;padding: 20px 15px;" shadow="never" :bordered="false">
                  <div slot="header" class="acea-row row-between-wrapper">
                    <span class="header_title">运费</span>
                    <div class="card_title">
                      {{ Number(accountDetails.freight) >= 0 ? '' : '-' }}
                      ￥{{ Math.abs(accountDetails.freight) }}
                    </div>
                  </div>
                  <el-row class="item mb20">
                    <el-col :span="13" class="name">支付运费</el-col>
                    <el-col :span="11" class="cost">
                      <span class="cost_price">￥{{ accountDetails.freightFee }}</span>
                    </el-col>
                  </el-row>
                  <el-row class="item">
                    <el-col :span="13" class="name">退还运费</el-col>
                    <el-col :span="11" class="cost">
                      <span class="cost_price">-￥{{ accountDetails.refundFreightFee }}</span>
                    </el-col>
                  </el-row>
                </el-card>
              </div>
            </div>
            <el-divider direction="vertical" />
          </el-col>
          <el-col :span="4">
            <div class="grid-content center">
              <div class="title mb20">{{ activeName === 'day' ? '当日结余' : '当月结余' }}</div>
              <div class="color_gray">
                {{ Number(accountDetails.currentDayBalance) >= 0 ? '' : '-' }}
                ￥{{ Math.abs(accountDetails.currentDayBalance) }}
              </div>
            </div>
          </el-col>
        </el-col>
      </el-row>
      <span slot="footer">
        <el-button type="primary" size="small" @click="dialogVisible = false">我知道了</el-button>
      </span>
    </el-dialog>
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
import { monthStatementApi, dayStatementApi } from '@/api/finance';
import yearOptions from '@/libs/yearOptions';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
export default {
  name: 'statement',
  data() {
    return {
      activeNames: [],
      timeVal: [],
      activeName: 'day',
      listLoading: true,
      tableData: {
        data: [],
        total: 0,
      },
      tableFrom: {
        page: 1,
        limit: 20,
        dateLimit: '',
      },
      dialogVisible: false,
      accountDetails: {},
      pickerOptions: this.$timeOptions,
      pickerOptionsYear: yearOptions,
    };
  },
  mounted() {
    if (checkPermi(['platform:finance:daily:statement:page:list', 'platform:finance:month:statement:page:list']))
      this.getList(1);
  },
  methods: {
    checkPermi,
    // 具体日期
    onchangeTime(e) {
      this.timeVal = e;
      this.tableFrom.dateLimit = e ? this.timeVal.join(',') : '';
      this.getList(1);
    },
    handleClick() {
      this.tableFrom.dateLimit = '';
      this.timeVal = [];
      this.getList(1);
    },
    onDetails(date) {
      this.dialogVisible = true;
      this.accountDetails = date;
    },
    seachList() {
      this.handleClose();
      this.getList(1);
    },
    // 列表
    getList(num) {
      this.listLoading = true;
      this.tableFrom.page = num ? num : this.tableFrom.page;
      this.activeName === 'day'
        ? dayStatementApi(this.tableFrom)
            .then((res) => {
              this.tableData.data = res.list;
              this.tableData.total = res.total;
              this.listLoading = false;
            })
            .catch(() => {
              this.listLoading = false;
            })
        : monthStatementApi(this.tableFrom)
            .then((res) => {
              this.tableData.data = res.list;
              this.tableData.total = res.total;
              this.listLoading = false;
            })
            .catch(() => {
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
    handleClose() {
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep.el-divider {
  background-color: #f5f5f5;
}
.center {
  text-align: center;
  .color_gray {
    color: #e93323 !important;
    line-height: 20px;
    font-weight: 600;
    font-size: 20px;
  }
}
.header_title {
  color: #606266;
  font-size: 14px;
}
.divBox #statement_detail_dialog {
  ::v-deep.el-card__header {
    padding: 15px 0;
    border-bottom: 0;
  }
}
.statement_date {
  font-size: 14px;
  font-weight: 400;
  color: #303133;
  line-height: 14px;
}
.card_title {
  padding: 3px 0;
  font-weight: 600;
  color: #606060;
  line-height: 15px;
  font-size: 15px;
}
.card_title_price {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  float: right;
}
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
.el-menu-item {
  font-weight: bold;
  color: #333;
}
//::v-deep.el-dialog__header {
//  text-align: left;
//}
::v-deep .el-tabs__item {
  height: 54px !important;
  line-height: 54px !important;
}
.el-col {
  position: relative;
  .el-divider--vertical {
    position: absolute;
    height: 100%;
    right: 0;
    top: 0;
    margin: 0;
  }
}
.grid-content {
  padding: 0 25px;
  display: block;
  height: 561px;
  .title {
    color: #606266;
    font-size: 16px;
  }
  .color_red {
    color: red;
    font-weight: bold;
  }
  .color_gray {
    color: #333;
    font-weight: bold;
  }
  .count {
    font-size: 12px;
  }
  .list {
    margin-top: 20px;
    .item {
      overflow: hidden;
    }
    .name {
      color: #909399;
    }
    .name,
    .cost {
      line-height: 20px;
    }
    .cost {
      text-align: right;
      span {
        display: block;
      }
    }
    .name,
    .cost_count {
      font-size: 14px;
    }
    .cost_price,
    .cost_num {
      font-size: 14px;
      color: #606266;
    }
  }
}
</style>
