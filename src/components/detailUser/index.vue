<template>
  <div>
    <el-drawer ref="userDetailFrom" :visible.sync="dialogUserDetail" size="1100px" @close="handleClose">
      <div slot="title" class="demo-drawer_title">
        <div class="con-head">
          <img :src="userDetailData.avatar" alt="" />
          <span class="nickname">{{ userDetailData.nickname }}</span>
        </div>
        <div class="acea-row info-row">
          <div class="info-row-item">
            <div class="info-row-item-title">余额</div>
            <div>{{ userDetailData.nowMoney }}</div>
          </div>
          <div class="info-row-item">
            <div class="info-row-item-title">积分</div>
            <div>{{ userDetailData.integral }}</div>
          </div>
          <div class="info-row-item">
            <div class="info-row-item-title">经验</div>
            <div>{{ userDetailData.experience }}</div>
          </div>
          <div class="info-row-item">
            <div class="info-row-item-title">等级</div>
            <div>{{ userDetailData.grade }}</div>
          </div>
          <div class="info-row-item">
            <div class="info-row-item-title">佣金</div>
            <div>{{ userDetailData.brokeragePrice }}</div>
          </div>
          <div class="info-row-item">
            <div class="info-row-item-title">消费次数</div>
            <div>{{ userDetailData.payCount }}</div>
          </div>
          <div class="info-row-item">
            <div class="info-row-item-title">连续签到</div>
            <div>{{ userDetailData.signNum }}</div>
          </div>
        </div>
      </div>
      <div class="demo-drawer__content">
        <div class="description" v-if="userDetailData">
          <!-- Tabs -->
          <el-tabs type="border-card" v-model="tabsVal">
            <!-- 用户信息 -->
            <el-tab-pane name="1" label="用户信息">
              <div class="user-info">
                <div class="section">
                  <div class="section-hd">基本信息</div>
                  <div class="section-bd">
                    <div class="item">
                      <div>用户ID：</div>
                      <div class="value">{{ userDetailData.id }}</div>
                    </div>
                    <div class="item">
                      <div>真实姓名：</div>
                      <div class="value">{{ userDetailData.realName || '-' }}</div>
                    </div>
                    <div class="item">
                      <div>用户账号：</div>
                      <div class="value">{{ userDetailData.account || '-' }}</div>
                    </div>
                    <div class="item">
                      <div>用户电话：</div>
                      <div class="value">{{ userDetailData.phone }}</div>
                    </div>
                    <div class="item">
                      <div>生日：</div>
                      <div class="value">{{ userDetailData.birthday || '-' }}</div>
                    </div>
                    <div class="item">
                      <div>性别：</div>
                      <div class="value">
                        {{
                          userDetailData.sex == 0
                            ? '未知'
                            : userDetailData.sex == 1
                            ? '男'
                            : userDetailData.sex == 2
                            ? '女'
                            : '保密'
                        }}
                      </div>
                    </div>
                    <div class="item">
                      <div>国家：</div>
                      <div class="value">{{ userDetailData.country == 'CN' ? '中国' : '其他' || '-' }}</div>
                    </div>
                    <div class="item">
                      <div>用户地址：</div>
                      <div class="value">
                        {{
                          userDetailData.province +
                            userDetailData.city +
                            userDetailData.district +
                            userDetailData.address || '-'
                        }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="user-info">
                <div class="section">
                  <div class="section-hd">付费会员信息</div>
                  <div class="section-bd">
                    <div class="item">
                      <div>付费会员：</div>
                      <div class="value">{{ userDetailData.isPaidMember ? '是' : '否' }}</div>
                    </div>
                    <div v-show="userDetailData.isPaidMember" class="item">
                      <div>会员到期时间：</div>
                      <div class="value">
                        {{
                          userDetailData.isPermanentPaidMember ? '永久会员' : userDetailData.paidMemberExpirationTime
                        }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="user-info">
                <div class="section">
                  <div class="section-hd-other">用户概况</div>
                  <div class="section-bd">
                    <div class="item">
                      <div>创建ip：</div>
                      <div class="value">{{ userDetailData.addIp || '-' }}</div>
                    </div>
                    <div class="item">
                      <div>注册类型：</div>
                      <div class="value">
                        {{
                          userDetailData.registerType == 'wechat'
                            ? '公众号'
                            : userDetailData.registerType == 'routine'
                            ? '小程序'
                            : userDetailData.registerType == 'h5'
                            ? 'H5'
                            : userDetailData.registerType == 'iosWx'
                            ? '微信ios'
                            : userDetailData.registerType == 'androidWx'
                            ? '微信安卓'
                            : 'ios' || '-'
                        }}
                      </div>
                    </div>
                    <div class="item">
                      <div>添加时间：</div>
                      <div class="value">{{ userDetailData.createTime || '-' }}</div>
                    </div>
                    <div class="item">
                      <div>状态：</div>
                      <div class="value">{{ userDetailData.status == true ? '正常' : '禁止' || '-' }}</div>
                    </div>
                    <div class="item">
                      <div>标签：</div>
                      <div class="value">{{ userDetailData.tagId || '-' | tagFilter }}</div>
                    </div>
                    <div class="item">
                      <div>是否关联ios：</div>
                      <div class="value">{{ userDetailData.isBindingIos == true ? '是' : '否' || '-' }}</div>
                    </div>
                    <div class="item">
                      <div>是否注销：</div>
                      <div class="value">{{ userDetailData.isLogoff == true ? '是' : '否' || '-' }}</div>
                    </div>
                    <div class="item">
                      <div>是否关联微信android：</div>
                      <div class="value">{{ userDetailData.isWechatAndroid == true ? '是' : '否' || '-' }}</div>
                    </div>
                    <div class="item">
                      <div>是否关联微信ios：</div>
                      <div class="value">{{ userDetailData.isWechatIos == true ? '是' : '否' || '-' }}</div>
                    </div>
                    <div class="item">
                      <div>是否关联公众号：</div>
                      <div class="value">{{ userDetailData.isWechatPublic == true ? '是' : '否' || '-' }}</div>
                    </div>
                    <div class="item">
                      <div>是否关联小程序：</div>
                      <div class="value">{{ userDetailData.isWechatRoutine == true ? '是' : '否' || '-' }}</div>
                    </div>
                    <div class="item">
                      <div>最后一次登录ip：</div>
                      <div class="value">{{ userDetailData.lastIp || '-' }}</div>
                    </div>
                    <div class="item">
                      <div>最后一次登录时间：</div>
                      <div class="value">{{ userDetailData.lastLoginTime || '-' }}</div>
                    </div>
                    <div class="item">
                      <div>注销时间：</div>
                      <div class="value">{{ userDetailData.logoffTime || '-' }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="user-info">
                <div class="section">
                  <div class="section-hd">推广信息</div>
                  <div class="section-bd">
                    <div class="item">
                      <div>是否为推广员：</div>
                      <div class="value">{{ userDetailData.isPromoter == true ? '是' : '否' || '-' }}</div>
                    </div>
                    <div class="item">
                      <div>下级人数：</div>
                      <div class="value">{{ userDetailData.spreadCount || '-' }}</div>
                    </div>
                    <div class="item">
                      <div>成为分销员时间：</div>
                      <div class="value">{{ userDetailData.promoterTime || '-' }}</div>
                    </div>
                    <div class="item">
                      <div>上级推广员昵称：</div>
                      <div class="value">{{ userDetailData.spreadName || '-' }}</div>
                    </div>
                    <div class="item">
                      <div>上级推广员ID：</div>
                      <div class="value">{{ userDetailData.spreadUid || '-' }}</div>
                    </div>
                    <div class="item">
                      <div>绑定上级推广员时间：</div>
                      <div class="value">{{ userDetailData.spreadTime || '-' }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="user-info">
                <div class="section">
                  <div class="section-hd">用户备注</div>
                  <div class="section-bd">
                    <div class="item">
                      <div>备注：</div>
                      <div class="value">{{ userDetailData.mark || '-' }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <!-- 余额变更 -->
            <el-tab-pane name="2" label="余额变更">
              <el-table :data="balanceRecordData" size="small" class="mt20">
                <el-table-column prop="linkId" label="关联单号" min-width="100">
                  <template slot-scope="scope">
                    {{ scope.row.linkId == '0' ? '-' : scope.row.linkId }}
                  </template>
                </el-table-column>
                <el-table-column prop="type" label="类型">
                  <template slot-scope="scope">
                    {{ scope.row.type == 1 ? '增加' : '扣除' }}
                  </template>
                </el-table-column>
                <el-table-column prop="amount" label="金额" />
                <el-table-column prop="remark" label="备注" />
                <el-table-column prop="createTime" label="添加时间" />
              </el-table>
            </el-tab-pane>
            <!-- 佣金记录 -->
            <el-tab-pane name="3" label="佣金记录">
              <el-table :data="brokerageRecordData" size="small" class="mt20">
                <el-table-column prop="linkNo" label="关联单号" min-width="100">
                  <template slot-scope="scope">
                    {{ scope.row.linkNo == '0' ? '-' : scope.row.linkNo }}
                  </template>
                </el-table-column>
                <el-table-column prop="title" label="标题" />
                <el-table-column prop="price" label="金额">
                  <template slot-scope="scope"> {{ scope.row.type == 1 ? '+' : '-' }}{{ scope.row.price }} </template>
                </el-table-column>
                <el-table-column prop="status" label="状态">
                  <template slot-scope="scope">
                    {{
                      scope.row.status == 1
                        ? '订单创建'
                        : scope.row.status == 2
                        ? '冻结期'
                        : scope.row.status == 3
                        ? '完成'
                        : scope.row.status == 4
                        ? '失效'
                        : '提现申请'
                    }}
                  </template>
                </el-table-column>
                <el-table-column prop="mark" label="备注" />
                <el-table-column prop="createTime" label="添加时间" />
              </el-table>
            </el-tab-pane>
            <!-- 积分明细 -->
            <el-tab-pane name="5" label="积分明细">
              <el-table :data="integralRecordData" size="small" class="mt20">
                <el-table-column prop="linkId" label="关联单号" min-width="100">
                  <template slot-scope="scope">
                    {{ scope.row.linkId == '0' ? '-' : scope.row.linkId }}
                  </template>
                </el-table-column>
                <el-table-column prop="title" label="标题" min-width="120" />
                <el-table-column prop="integral" label="积分">
                  <template slot-scope="scope">
                    {{ scope.row.type == 1 ? '+' : '-' }}{{ scope.row.integral }}
                  </template>
                </el-table-column>
                <el-table-column prop="status" label="状态">
                  <template slot-scope="scope">
                    {{
                      scope.row.status == 1
                        ? '订单创建'
                        : scope.row.status == 2
                        ? '冻结期'
                        : scope.row.status == 3
                        ? '完成'
                        : '失效'
                    }}
                  </template>
                </el-table-column>
                <el-table-column prop="mark" label="备注" />
                <el-table-column prop="createTime" label="添加时间" />
              </el-table>
            </el-tab-pane>
            <!-- 经验记录 -->
            <el-tab-pane name="4" label="经验记录">
              <el-table :data="experienceRecordData" size="small" class="mt20">
                <el-table-column prop="type" label="类型">
                  <template slot-scope="scope">
                    {{ scope.row.type == 1 ? '增加' : '扣除' }}
                  </template>
                </el-table-column>
                <el-table-column prop="experience" label="经验" />
                <el-table-column prop="mark" label="备注" />
                <el-table-column prop="createTime" label="添加时间" />
              </el-table>
            </el-tab-pane>
            <!-- 签到记录 -->
            <el-tab-pane name="6" label="签到记录">
              <el-table :data="signRecordData" size="small" class="mt20">
                <el-table-column prop="date" label="签到时间" />
                <el-table-column prop="day" label="连续签到天数" />
                <el-table-column prop="mark" label="备注" />
              </el-table>
            </el-tab-pane>
          </el-tabs>
          <div class="block" v-if="tabsVal != '1'">
            <el-pagination
              :page-size="paginationData.limit"
              :total="paginationData.total"
              :current-page="paginationData.page"
              @size-change="handleSizeChange"
              @current-change="pageChange"
              background
              :page-sizes="[10, 20, 30, 40]"
              layout="total, sizes, prev, pager, next, jumper"
            />
          </div>
        </div>
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
import {
  userDetailApi,
  userBalanceRecord,
  userBrokerageRecord,
  userExperienceRecord,
  userIntegralRecord,
  userSignRecord,
} from '@/api/user';

export default {
  name: 'detailUser',
  props: {
    userNo: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      dialogUserDetail: false,
      userDetailData: {},
      tabsVal: '1',
      balanceRecordData: [],
      brokerageRecordData: [],
      experienceRecordData: [],
      integralRecordData: [],
      signRecordData: [],
      paginationData: {
        page: 1,
        limit: 10,
        total: 0,
      },
    };
  },
  watch: {
    tabsVal(val) {
      this.paginationData.page = 1;
      this.getList(val);
    },
  },
  methods: {
    getList(val) {
      switch (val) {
        case '2':
          this.getBalabceRecord();
          break;
        case '3':
          this.getBrokerageRecord();
          break;
        case '4':
          this.getExperienceRecord();
          break;
        case '5':
          this.getIntegralRecord();
          break;
        case '6':
          this.getSignRecord();
          break;
      }
    },
    //获取签到记录列表
    getSignRecord() {
      userSignRecord({
        userId: this.userDetailData.id,
        page: this.paginationData.page,
        limit: this.paginationData.limit,
      }).then((res) => {
        this.signRecordData = res.list;
        this.paginationData.total = res.total;
      });
    },
    //获取积分记录列表
    getIntegralRecord() {
      userIntegralRecord({
        userId: this.userDetailData.id,
        page: this.paginationData.page,
        limit: this.paginationData.limit,
      }).then((res) => {
        this.integralRecordData = res.list;
        this.paginationData.total = res.total;
      });
    },
    //获取经验记录列表
    getExperienceRecord() {
      userExperienceRecord({
        userId: this.userDetailData.id,
        page: this.paginationData.page,
        limit: this.paginationData.limit,
      }).then((res) => {
        this.experienceRecordData = res.list;
        this.paginationData.total = res.total;
      });
    },
    //获取佣金记录列表
    getBrokerageRecord() {
      userBrokerageRecord({
        userId: this.userDetailData.id,
        page: this.paginationData.page,
        limit: this.paginationData.limit,
      }).then((res) => {
        this.brokerageRecordData = res.list;
        this.paginationData.total = res.total;
      });
    },
    //获取余额记录列表
    getBalabceRecord() {
      userBalanceRecord({
        userId: this.userDetailData.id,
        page: this.paginationData.page,
        limit: this.paginationData.limit,
      }).then((res) => {
        this.balanceRecordData = res.list;
        this.paginationData.total = res.total;
      });
    },
    handleSizeChange(val) {
      this.paginationData.limit = val;
      this.getList(this.tabsVal);
    },
    pageChange(val) {
      this.paginationData.page = val;
      this.getList(this.tabsVal);
    },
    handleClose() {
      this.dialogUserDetail = false;
      this.tabsVal = '1';
    },
    getUserDetail(id) {
      userDetailApi(id).then((res) => {
        this.userDetailData = res;
      });
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .el-drawer__header {
  display: flex !important;
  align-items: flex-start !important;
  margin: 0 !important;
  padding: 15px 15px 0 15px !important;
}
::v-deep .demo-drawer_title {
  width: 90%;
}
::v-deep .el-drawer__body{
  padding: 0 0 30px 0 !important;
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
  // padding: 0 30px;
  overflow: hidden;
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
.description-term img {
  width: 60px;
  height: 60px;
}
.description-term {
  display: flex;
  align-items: center;
}
.con-head {
  padding: 0 30px;
  display: flex;
  align-items: center;
  img {
    width: 60px;
    height: 60px;
    margin-right: 15px;
    border-radius: 50%;
  }
  .nickname {
    font-weight: 500;
    font-size: 16px;
    line-height: 16px;
    color: rgba(0, 0, 0, 0.85);
  }
}

.info-row {
  flex-wrap: nowrap;
  padding: 20px 35px 24px 30px;
  border-bottom: 1px dashed #eee;

  &-item {
    flex: none;
    width: 155px;
    font-size: 14px;
    line-height: 14px;
    color: rgba(0, 0, 0, 0.85);

    &-title {
      margin-bottom: 12px;
      font-size: 13px;
      line-height: 13px;
      color: #666666;
    }
  }
}
.user-info {
  .section {
    padding: 25px 0;

    &-hd {
      padding-left: 10px;
      border-left: 3px solid var(--prev-color-primary);
      font-weight: 500;
      font-size: 14px;
      line-height: 16px;
      color: #303133;
    }

    &-bd {
      display: flex;
      flex-wrap: wrap;
    }

    .item {
      width: 30%;
      // flex: 0 0 calc(~"(100% - 60px) / 3");
      display: flex;
      margin: 16px 30px 0 0;
      font-size: 13px;
      color: #606266;

      &:nth-child(3n + 3) {
        margin: 16px 0 0;
      }
    }

    .value {
      flex: 1;
    }
    .avatar {
      width: 60px;
      height: 60px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
.section-hd-other {
  padding-left: 10px;
  border-left: 3px solid var(--prev-color-primary);
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #303133;
}
::v-deep .el-tabs__content {
  padding: 0 30px !important;
}
</style>
