<template>
  <div>
    <el-drawer :visible.sync="dialogVisible" :direction="direction" size="1000px" :before-close="handleClose">
      <div v-if="orderDatalist" v-loading="loading">
        <div class="detailHead">
          <div class="full">
            <div class="order_icon"><span class="iconfont icon-dingdan"></span></div>
            <div class="text">
              <div class="title">积分商品订单</div>
              <div>
                <span class="mr20">订单号：{{ orderDatalist.orderNo }}</span>
              </div>
            </div>
          </div>
          <ul class="list">
            <li class="item">
              <div class="title">订单状态</div>
              <div class="color-warning">
                <span>{{ orderDatalist.status | orderStatusFilter }}</span>
              </div>
            </li>
            <li class="item">
              <div class="title">实际支付</div>
              <div class="acea-row">
                ¥ {{ orderDatalist.payPrice || '0.0' }}
                <div v-if="orderDatalist.redeemIntegral" class="acea-row ml5">
                  + {{ orderDatalist.redeemIntegral }} 积分
                </div>
              </div>
            </li>
            <li class="item">
              <div class="title">支付方式</div>
              <div>{{ orderDatalist.payType | payTypeFilter }}</div>
            </li>
            <li class="item">
              <div class="title">支付时间</div>
              <div>{{ orderDatalist.payTime | filterEmpty }}</div>
            </li>
          </ul>
        </div>
        <el-tabs type="border-card" v-model="activeName">
          <el-tab-pane label="订单信息" name="detail">
            <div class="detailSection" style="border: none">
              <div class="title">用户信息</div>
              <ul class="list">
                <li class="item">
                  <div class="tips">用户名称：</div>
                  <div class="value">{{ orderDatalist.nikeName }} | {{ orderDatalist.uid }}</div>
                </li>
                <li class="item">
                  <div class="tips">用户电话：</div>
                  <div class="value">{{ orderDatalist.phone }}</div>
                </li>
              </ul>
            </div>
            <div v-show="orderDatalist.shippingType < 2" class="detailSection">
              <div class="title">收货信息</div>
              <ul class="list">
                <li class="item">
                  <div class="tips">收货人：</div>
                  <div class="value">
                    {{ orderDatalist.realName }}
                  </div>
                </li>
                <li class="item">
                  <div class="tips">收货电话：</div>
                  <div class="value">
                    {{ orderDatalist.userPhone }}
                  </div>
                </li>
                <li class="item">
                  <div class="tips">收货地址：</div>
                  <div class="value">
                    {{ orderDatalist.userAddress }}
                  </div>
                </li>
              </ul>
            </div>
            <div class="detailSection">
              <div class="title">买家留言</div>
              <ul class="list">
                <li class="item">
                  <div>{{ orderDatalist.userRemark | filterEmpty }}</div>
                </li>
              </ul>
            </div>
            <div class="detailSection">
              <div class="title">平台备注</div>
              <ul class="list">
                <li class="item">
                  <div>{{ orderDatalist.merchantRemark | filterEmpty }}</div>
                </li>
              </ul>
            </div>
          </el-tab-pane>
          <el-tab-pane label="商品信息" name="goods" class="tabBox">
            <el-table class="mt20 orderDetailList" :data="orderDatalist.orderDetailList" size="small">
              <el-table-column label="商品信息" min-width="400" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <div class="acea-row row-middle">
                    <div class="demo-image__preview mr15">
                      <el-image :src="scope.row.image" :preview-src-list="[scope.row.image]" />
                    </div>
                    <div style="width: 408px">
                      <div class="line1 mb10">{{ scope.row.productName }}</div>
                      <div class="line1 color-909399 line-heightOne">规格：{{ scope.row.sku }}</div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="兑换积分" min-width="90">
                <template slot-scope="scope">
                  <div class="acea-row row-middle">
                    <div class="line1">
                      {{ scope.row.redeemIntegral }}
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="兑换金额（元）" min-width="90">
                <template slot-scope="scope">
                  <div class="acea-row row-middle">
                    <div class="line1">
                      {{ scope.row.price }}
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="兑换数量" min-width="90">
                <template slot-scope="scope">
                  <div class="acea-row row-middle">
                    <div class="line1">
                      {{ scope.row.payNum }}
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane
            v-if="orderDatalist.status > 1 && orderDatalist.status < 9 && orderDatalist.secondType < 5"
            label="发货记录"
            name="delivery"
            class="tabBox"
          >
            <template v-for="item in InvoiceList">
              <div v-if="InvoiceList.length">
                <el-table class="mt20" :data="item.detailList" size="small" :key="item.id">
                  <el-table-column min-width="400">
                    <template slot="header" slot-scope="scope">
                      <template v-if="item.deliveryType === 'express'">
                        <span class="font-color">【快递配送】</span>
                        <span>{{ item.expressName + '：' + item.trackingNumber }}</span>
                        <span class="ml30">{{ item.createTime }}</span>
                      </template>
                      <template v-else-if="item.deliveryType === 'merchant'">
                        <span class="font-color">【商家送货】</span>
                        <span>{{ item.deliveryCarrier + '：' + item.carrierPhone }}</span>
                        <span class="ml30">{{ item.createTime }}</span>
                      </template>
                      <template v-else>
                        <span class="font-color">【无需配送】</span>
                        <span>{{ item.createTime }}</span>
                      </template>
                    </template>
                    <template slot-scope="scope">
                      <div class="acea-row row-middle">
                        <div class="demo-image__preview mr15">
                          <el-image :src="scope.row.image" :preview-src-list="[scope.row.image]" />
                        </div>
                        <div style="width: 408px">
                          <div class="line1 mb10 line-heightOne">{{ scope.row.productName }}</div>
                          <div class="line1 color-909399 line-heightOne">规格：{{ scope.row.sku }}</div>
                        </div>
                        <div class="acea-row row-middle ml30">
                          <div class="line1 font12 color-text">X {{ scope.row.num }}</div>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column width="400" fixed="right">
                    <template slot="header" slot-scope="scope">
                      <div class="flex mr10" style="justify-content: flex-end">
                        <a
                          @click="handleEditLogistics(item)"
                          style="line-height: 1; height: auto"
                          v-hasPermi="['platform:integral:order:invoice:update']"
                          >修改配送信息
                        </a>
                        <a
                          class="ml20"
                          @click="openLogistics(item.id)"
                          style="line-height: 1; height: auto"
                          v-if="
                            checkPermi(['platform:integral:order:logistics:info']) && item.deliveryType === 'express'
                          "
                          >查看物流
                        </a>
                      </div>
                    </template>
                    <template v-if="item.deliveryType === 'noNeed'" slot-scope="scope">
                      <div class="acea-row row-middle">
                        <div class="font12 color-text">发货备注：{{ item.deliveryMark }}</div>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </template>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-drawer>
    <el-dialog v-if="orderDatalist" title="提示" :visible.sync="modal2" width="600px">
      <div class="logistics acea-row row-top">
        <div class="logistics_img"><img src="@/assets/imgs/expressi.jpg" /></div>
        <div class="logistics_cent">
          <span class="mb10">物流公司：{{ resultInfo.expName }}</span>
          <span>物流单号：{{ resultInfo.number }}</span>
          <span v-show="resultInfo.courierPhone">快递站：{{ resultInfo.courierPhone }}</span>
          <span v-show="resultInfo.courierPhone">快递员电话：{{ resultInfo.courierPhone }}</span>
        </div>
      </div>
      <div class="acea-row row-column-around trees-coadd">
        <div class="scollhide">
          <el-timeline :reverse="reverse">
            <el-timeline-item v-for="(item, i) in result" :key="i">
              <p class="time" v-text="item.time"></p>
              <p class="content" v-text="item.status"></p>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="modal2 = false">关闭</el-button>
      </span>
    </el-dialog>

    <!-- 修改配送信息-->
    <editDelivery
      :visible="editDeliveryDialogVisible"
      :editData="editData"
      @onCloseVisible="onCloseVisible"
      @onSubmitSuccess="onSubmitSuccess"
    ></editDelivery>
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

import { getLogisticsInfoApi } from '@/api/pointsMall';
import { orderRefundStatusFilter } from '@/filters';
import editDelivery from './editDelivery';
import { checkPermi } from '@/utils/permission';
import { intervalOrderDetailApi, orderInvoiceListApi } from '@/api/pointsMall'; // 权限判断函数
export default {
  name: 'OrderDetail',
  components: {
    editDelivery,
  },
  props: {
    orderNo: {
      type: String,
      default: 0,
    },
  },
  data() {
    return {
      activeName: 'detail',
      direction: 'rtl',
      reverse: true,
      dialogVisible: false,
      orderDatalist: {},
      loading: false,
      modal2: false,
      result: [],
      resultInfo: {},
      InvoiceList: [],
      editDeliveryDialogVisible: false,
      editData: {},
      orderExtend: [], //系统表单数据
    };
  },
  watch: {
    // orderData: {
    //   handler(newVal, oldVal) {
    //     this.orderDatalist = newVal;
    //   },
    //   deep: true, // 对象内部属性的监听，关键。
    // },
  },
  mounted() {},
  methods: {
    checkPermi,
    orderRefundStatusFilter,
    //修改物流信息
    handleEditLogistics(row) {
      this.editDeliveryDialogVisible = true;
      this.editData = row;
    },
    //修改物流信息成功
    onSubmitSuccess() {
      this.getOrderInvoiceList(this.orderNo);
      this.onCloseVisible();
    },
    //关闭配送信息
    onCloseVisible() {
      this.editDeliveryDialogVisible = false;
    },
    handleClose() {
      this.dialogVisible = false;
    },
    openLogistics(id) {
      this.getOrderData(id);
      this.modal2 = true;
    },
    // 获取订单物流信息
    getOrderData(id) {
      getLogisticsInfoApi(id).then(async (res) => {
        this.resultInfo = res;
        this.result = res.list;
      });
    },
    // 获取订单发货单列表
    getOrderInvoiceList(id) {
      this.InvoiceList = [];
      orderInvoiceListApi(id)
        .then((res) => {
          this.InvoiceList = [...res];
        })
        .catch(() => {});
    },
    getDetail(id) {
      this.loading = true;
      intervalOrderDetailApi(id)
        .then((res) => {
          this.orderDatalist = res;
          this.orderExtend = res.orderExtend ? JSON.parse(res.orderExtend) : [];
          this.activeName = 'detail';
          this.loading = false;
        })
        .catch(() => {
          this.orderDatalist = null;
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .el-tabs__content {
  padding: 0 20px !important;
}
.detailSection {
  padding: 25px 15px !important;
}
::v-deep .el-table th.el-table__cell > .cell,
::v-deep.el-table .cell,
.el-table--border .el-table__cell:first-child .cell {
  padding-left: 15px;
}
.InvoiceList {
  ::v-deep.el-collapse-item__header {
    font-size: 12px;
    color: #606266;
  }
}

.wrapper {
  background-color: #fff;
  margin-top: 7px;
  padding: 10px 12px;
  &-num {
    font-size: 10px;
    color: #999999;
  }

  &-title {
    color: #666666;
    font-size: 12px;
  }

  &-img {
    width: 60px;
    height: 60px;
    margin-right: 10px;
    border-radius: 7px;
    overflow: hidden;
    margin-bottom: 10px;

    image {
      width: 100%;
      height: 100%;
    }

    &:nth-child(5n) {
      margin-right: 0;
    }
  }
}

.title {
  font-size: 36px;
}

.demo-drawer__content {
  padding: 0 30px;
}

.demo-image__preview {
  display: inline-block;
  .el-image {
    width: 50px;
    height: 50px;
  }
}

.logistics {
  align-items: center;
  padding: 10px 0px;
  .logistics_img {
    width: 45px;
    height: 45px;
    margin-right: 12px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .logistics_cent {
    span {
      display: block;
      font-size: 12px;
    }
  }
}

.trees-coadd {
  width: 100%;
  height: 400px;
  border-radius: 4px;
  overflow: hidden;
  .scollhide {
    width: 100%;
    height: 100%;
    overflow: auto;
    margin-left: 18px;
    padding: 10px 0 10px 0;
    box-sizing: border-box;
    .content {
      font-size: 12px;
    }

    .time {
      font-size: 12px;
      color: #2d8cf0;
    }
  }
}

.title {
  margin-bottom: 14px;
  color: #303133;
  font-weight: 500;
  font-size: 14px;
}

.description {
  &-term {
    display: table-cell;
    padding-bottom: 5px;
    line-height: 20px;
    width: 50%;
    font-size: 12px;
    color: #606266;
  }
  ::v-deep .el-divider--horizontal {
    margin: 12px 0 !important;
  }
}
</style>
