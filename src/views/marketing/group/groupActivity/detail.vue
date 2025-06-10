<template>
  <div>
    <el-drawer :visible.sync="dialogVisible" :direction="direction" size="1000px" :before-close="handleClose">
      <div>
        <div class="detailHead">
          <div class="full">
            <div class="order_icon"><span class="iconfont icon-dingdan"></span></div>
            <div class="text">
              <div class="title">
                <span>{{ activityInfo.groupName }}</span>
                <el-tag
                  size="mini"
                  effect="plain"
                  :type="
                    activityInfo.groupProcess == 0 ? 'success' : activityInfo.groupProcess == 1 ? 'warning' : 'info'
                  "
                  >{{ groupProcessArr[activityInfo.groupProcess] }}</el-tag
                >
              </div>
              <div>
                <span class="mr20">{{ `${activityInfo.startTime}至${activityInfo.endTime}` }}</span>
              </div>
            </div>
            <div>
              <el-button
                v-if="activityInfo.groupStatus == 4"
                size="small"
                type="primary"
                @click="close(activityInfo.id)"
                >强制关闭</el-button
              >
              <el-button v-if="activityInfo.groupStatus == 3" size="small" @click="refuse(activityInfo.id)"
                >审核拒绝</el-button
              >
              <el-button v-if="activityInfo.groupStatus == 3" size="small" type="primary" @click="pass(activityInfo.id)"
                >审核通过</el-button
              >
            </div>
          </div>
          <ul class="list">
            <li class="item">
              <div class="title">审核状态</div>
              <div class="color-warning">
                <span>{{ groupStatusArr[activityInfo.groupStatus] }}</span>
              </div>
            </li>
            <li class="item">
              <div class="title">开团数</div>
              <div>{{ activityInfo.totalActivityBegin }}</div>
            </li>
            <li class="item">
              <div class="title">成团数</div>
              <div>{{ activityInfo.totalActivityDone }}</div>
            </li>
            <li class="item">
              <div class="title">参团订单数</div>
              <div>{{ activityInfo.totalOrderBegin }}</div>
            </li>
            <li class="item">
              <div class="title">成团订单数</div>
              <div>{{ activityInfo.totalOrderDone }}</div>
            </li>
          </ul>
        </div>
        <el-tabs type="border-card" v-model="activeName">
          <el-tab-pane label="活动信息" name="detail">
            <div class="detailSection" style="border: none">
              <div class="title">基础信息</div>
              <ul class="list">
                <li class="item">
                  <div class="tips">活动标签：</div>
                  <div class="value">{{ activityInfo.buyCount }}人团</div>
                </li>
                <li class="item">
                  <div class="tips">成团人数：</div>
                  <div class="value">{{ activityInfo.buyCount }}</div>
                </li>
                <li class="item">
                  <div class="tips">成团有效期：</div>
                  <div class="value">{{ activityInfo.validHour }}小时</div>
                </li>
                <li class="item">
                  <div class="tips">活动限购：</div>
                  <div class="value">{{ activityInfo.allQuota == -1 ? '不限' : activityInfo.allQuota }}</div>
                </li>
                <li class="item">
                  <div class="tips">单次限购：</div>
                  <div class="value">{{ activityInfo.oncQuota == -1 ? '不限' : activityInfo.oncQuota }}</div>
                </li>
                <li class="item">
                  <div class="tips">创建商户：</div>
                  <div class="value">{{ activityInfo.merName }}</div>
                </li>
              </ul>
            </div>
            <div class="detailSection">
              <div class="title">高级设置</div>
              <ul class="list">
                <li class="item">
                  <div class="tips">凑团：</div>
                  <div class="value">{{ activityInfo.showGroup == 0 ? '关闭' : '开启' }}</div>
                </li>
                <li class="item">
                  <div class="tips">虚拟成团：</div>
                  <div class="value">{{ activityInfo.fictiStatus == 0 ? '关闭' : '开启' }}</div>
                </li>
              </ul>
            </div>
          </el-tab-pane>
          <el-tab-pane label="商品信息" name="goods">
            <div>
              <div
                class="table-box"
                v-for="(item, index) in activityInfo.groupBuyActivityProductResponseList"
                :key="index"
              >
                <div class="detailHead">
                  <div class="full">
                    <i
                      class="iconfont iconChange"
                      :class="item.visible ? 'icon-xuanze' : 'icon-xiala1'"
                      @click="openClose(item)"
                    ></i>
                    <img :src="item.image" alt="" />
                    <div class="text table-text">
                      <div class="title line1" :title="item.productName">{{ item.productName }}</div>
                    </div>
                  </div>
                </div>
                <div class="tablelHead text-title" v-if="!item.groupBuyActivitySkuResponses.length">
                  该商品已下架，无法进行拼团购买！
                </div>
                <div class="tablelHead" v-if="item.groupBuyActivitySkuResponses.length">
                  <el-table
                    :data="item.groupBuyActivitySkuResponses"
                    class="orderDetailList"
                    size="small"
                    v-if="!item.visible"
                  >
                    <el-table-column label="图片">
                      <template slot-scope="scope">
                        <img :src="scope.row['attrValue'][0].image" alt="" />
                      </template>
                    </el-table-column>
                    <el-table-column label="规格" prop="sku">
                      <template slot-scope="scope">
                        <span>{{ scope.row['attrValue'][0].sku }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="商品编码" prop="barCode">
                      <template slot-scope="scope">
                        <span>{{ scope.row['attrValue'][0].barCode || '--' }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="售价（元）" prop="price">
                      <template slot-scope="scope">
                        <span>{{ scope.row['attrValue'][0].price }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="剩余库存" prop="stock">
                      <template slot-scope="scope">
                        <span>{{ scope.row['attrValue'][0].stock }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="拼团价（元）" prop="activePrice"></el-table-column>
                    <el-table-column label="拼团限量" prop="quota"></el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-drawer>
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
import { groupActivityClose, groupActivityPass, groupActivityRefuse } from '@/api/group';
export default {
  props: {},
  data() {
    return {
      activeName: 'detail',
      direction: 'rtl',
      dialogVisible: false,
      activityInfo: {},
      groupStatusArr: ['初始化', '已拒绝', '已撤销', '待审核', '已通过'],
      groupProcessArr: ['未开始', '进行中', '已结束'],
    };
  },
  watch: {},
  mounted() {
    this.activeName = 'detail';
  },
  methods: {
    openClose(item) {
      if (item.visible) {
        this.$set(item, 'visible', false);
      } else {
        this.$set(item, 'visible', true);
      }
    },
    handleClose() {
      this.dialogVisible = false;
    },
    //强制关闭
    close(id) {
      this.$modalSure('要将此活动强制关闭吗？').then(() => {
        groupActivityClose(id).then((res) => {
          this.$message({
            type: 'success',
            message: '关闭成功!',
          });
          this.$emit('changeList');
          this.dialogVisible = false;
        });
      });
    },
    //审核通过
    pass(id) {
      this.$modalSure('要将此活动审核通过吗？').then(() => {
        groupActivityPass(id).then((res) => {
          this.$message({
            type: 'success',
            message: '审核成功!',
          });
          this.$emit('changeList');
          this.dialogVisible = false;
        });
      });
    },
    //审核拒绝
    refuse(id) {
      this.$modalPrompt('textarea', '拒绝原因').then((V) => {
        groupActivityRefuse({ id: id, reason: V }).then((res) => {
          this.$message({
            type: 'success',
            message: '审核成功!',
          });
          this.$emit('changeList');
          this.dialogVisible = false;
        });
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

.table-box {
  margin-top: 15px;
  border: 1px solid #ebeef5;
  border-radius: 6px;

  .detailHead {
    padding: 15px 20px !important;
  }

  .tablelHead {
    padding: 0 20px 15px;
  }

  .full {
    img {
      width: 40px;
      height: 40px;
      border-radius: 10px;
    }
  }

  .title.line1 {
    width: 600px;
  }
}

.table-text {
  .title {
    margin-bottom: 0 !important;
    font-size: 13px !important;
  }
}
.text-title {
  font-size: 12px;
  color: red;
}
.iconChange {
  font-size: 16px !important;
  color: #999 !important;
  cursor: pointer;
}
</style>
