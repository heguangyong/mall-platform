<template>
  <div class="divBox relative">
    <el-card
      :bordered="false"
      shadow="never"
      class="ivu-mt"
      :body-style="{ padding: 0 }"
      v-hasPermi="['platform:coupon:page:list']"
    >
      <div class="padding-add">
        <el-form size="small" label-position="right" label-width="78px" @submit.native.prevent inline>
          <el-form-item label="优惠券名：">
            <el-input
              v-model.trim="name"
              @keyup.enter.native="getList(1)"
              placeholder="请输入优惠券名称"
              clearable
              class="selWidth"
            ></el-input>
          </el-form-item>
          <el-form-item label="开启状态：">
            <el-select v-model="tableFrom.status" placeholder="请选择开启状态" clearable class="selWidth">
              <el-option label="开启" :value="1"></el-option>
              <el-option label="关闭" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="领取方式：">
            <el-select v-model="tableFrom.receiveType" clearable placeholder="请选择领取方式" class="selWidth">
              <el-option label="用户领取" :value="1"></el-option>
              <el-option label="平台活动使用" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="使用范围：">
            <el-select
              v-model="tableFrom.category"
              clearable
              placeholder="请选择使用范围"
              @change="getList(1)"
              class="selWidth"
            >
              <el-option label="商品" :value="2"></el-option>
              <el-option label="通用" :value="3"></el-option>
              <el-option label="品类" :value="4"></el-option>
              <el-option label="品牌" :value="5"></el-option>
              <el-option label="跨店" :value="6"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="getList(1)">查询</el-button>
            <el-button size="small" @click="reset()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card mt14" :body-style="{ padding: '20px' }" shadow="never" :bordered="false">
      <router-link v-hasPermi="['platform:coupon:add']" :to="{ path: '/marketing/platformCoupon/creatCoupon' }">
        <el-button size="small" type="primary" class="mr10">添加优惠券</el-button>
      </router-link>
      <el-table v-loading="listLoading" :data="tableData.data" size="small" ref="multipleTable" class="mt20">
        <el-table-column prop="id" label="ID" min-width="50" />
        <el-table-column prop="name" :show-overflow-tooltip="true" label="优惠券名称" min-width="150" />
        <el-table-column prop="category" label="使用范围" min-width="90">
          <template slot-scope="scope">
            <span>{{ scope.row.category | couponCategory }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="money" label="面值" min-width="90" />
        <el-table-column prop="minPrice" label="使用门槛" min-width="90" />
        <el-table-column prop="issuedNum" label="使用/发放数量" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.usedNum }}/{{ scope.row.issuedNum }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="isLimited" label="发布数量" min-width="90">
          <template slot-scope="scope">
            <span>{{ !scope.row.isLimited ? '不限量' : scope.row.total }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="receiveType" label="领取方式" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.receiveType | receiveType }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="receiveStartTime" label="领取日期" min-width="150">
          <template slot-scope="scope">
            <div v-if="scope.row.receiveEndTime">
              {{ scope.row.receiveStartTime }} -<br />
              {{ scope.row.receiveEndTime }}
            </div>
            <span v-else>不限时</span>
          </template>
        </el-table-column>
        <el-table-column label="是否开启" fixed="right" min-width="90">
          <template slot-scope="scope">
            <el-switch
              v-if="checkPermi(['platform:coupon:switch'])"
              v-model="scope.row.status"
              active-text="开启"
              inactive-text="关闭"
              @change="onchangeIsShow(scope.row)"
            />
            <div v-else>{{ scope.row.status ? '开启' : '关闭' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template slot-scope="scope">
            <a v-if="checkPermi(['platform:coupon:detail'])" @click="look(scope.row.id)">详情</a>
            <el-divider direction="vertical"></el-divider>
            <el-dropdown trigger="click">
              <span class="el-dropdown-link"> 更多<i class="el-icon-arrow-down el-icon--right" /> </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-hasPermi="['platform:coupon:detail', 'platform:coupon:update']">
                  <router-link :to="{ path: '/marketing/platformCoupon/creatCoupon/' + scope.row.id }">
                    编辑
                  </router-link>
                </el-dropdown-item>
                <el-dropdown-item v-hasPermi="['platform:coupon:detail', 'platform:coupon:add']">
                  <router-link :to="{ path: '/marketing/platformCoupon/creatCoupon/' + scope.row.id + '/' + 1 }">
                    复制
                  </router-link>
                </el-dropdown-item>
                <el-dropdown-item @click.native="handleDelete(scope.row.id)" v-hasPermi="['platform:coupon:delete']">
                  删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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

    <!--优惠券详情-->
    <el-drawer title="优惠券详情" size="1000px" :visible.sync="showInfo" direction="rtl" :before-close="handleClose">
      <div v-loading="loading">
        <div class="detailHead" :class="!showTab ? 'bdbtmSolid' : ''">
          <div class="full">
            <div class="order_icon"><span class="iconfont icon-youhuiquan"></span></div>
            <div class="text">
              <div class="title">{{ cell.name }}</div>
              <div>
                <span class="mr20">优惠券面值：{{ cell.money }}元</span>
              </div>
            </div>
          </div>
        </div>
        <el-tabs type="border-card" v-model="activeNames" v-if="showTab">
          <el-tab-pane label="基础信息" name="one"></el-tab-pane>
          <el-tab-pane :label="tabPaneName" name="two"></el-tab-pane>
        </el-tabs>
        <div class="px35" v-if="activeNames == 'one'">
          <div class="detailSection" style="border: none">
            <div class="title">优惠券信息</div>
            <ul class="list">
              <li class="item">
                <div class="tips">使用门槛：</div>
                <div class="value">{{ cell.minPrice }}元</div>
              </li>
              <li class="item">
                <div class="tips">领取时间：</div>
                <div class="value">
                  {{ cell.isTimeReceive ? cell.receiveStartTime + ' - ' + cell.receiveEndTime : '不限时' }}
                </div>
              </li>
              <li class="item">
                <div class="tips">领取方式：</div>
                <div class="value">
                  {{ cell.receiveType | receiveType }}
                </div>
              </li>
              <li class="item">
                <div class="tips">使用范围：</div>
                <div class="value">{{ cell.category | couponCategory }}</div>
              </li>
              <li class="item">
                <div class="tips">重复领取：</div>
                <div class="value">{{ cell.isRepeated ? '可重复领取' : '不可重复领取' }}</div>
              </li>
              <li class="item">
                <div class="tips">发布数量：</div>
                <div class="value">{{ !cell.isLimited ? '不限量' : cell.total }}</div>
              </li>

              <li class="item">
                <div class="tips">是否开启：</div>
                <div class="value">{{ cell.status ? '开启' : '关闭' }}</div>
              </li>
              <li class="item">
                <div class="tips">使用有效期：</div>
                <div class="value">
                  {{
                    cell.isFixedTime
                      ? cell.useStartTime + ' - ' + cell.useEndTime + ' 有效'
                      : '领取后' + cell.day + '天内有效'
                  }}
                </div>
              </li>
            </ul>
          </div>
          <div class="detailSection">
            <div class="title">优惠券情况</div>
            <ul class="list">
              <li class="item">
                <div class="tips">已发放数量：</div>
                <div class="value">{{ cell.issuedNum }}</div>
              </li>
              <li class="item">
                <div class="tips">已使用数量：</div>
                <div class="value">{{ cell.usedNum }}</div>
              </li>
            </ul>
          </div>
        </div>
        <div class="px35" v-if="cell.category == 2 && activeNames == 'two'">
          <el-table ref="tableList" v-loading="listLoading" :data="cell.productList" class="mt20" size="small">
            <el-table-column prop="id" label="ID" width="55"> </el-table-column>
            <el-table-column label="商品图" min-width="80">
              <template slot-scope="scope">
                <div class="demo-image__preview line-heightOne">
                  <el-image :src="scope.row.image" :preview-src-list="[scope.row.image]" />
                </div>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="name" label="商品名称" min-width="150" />
            <el-table-column prop="price" label="售价" min-width="90" />
            <el-table-column prop="stock" label="库存" min-width="70" />
          </el-table>
        </div>
        <div class="px35" v-if="cell.category == 6 && activeNames == 'two'">
          <el-table ref="tableList" :data="cell.merchantList" class="mt20" size="small">
            <el-table-column prop="categoryId" label="ID" min-width="55"> </el-table-column>
            <el-table-column label="商户头像" min-width="80">
              <template slot-scope="scope">
                <div class="demo-image__preview line-heightOne">
                  <el-image :src="scope.row.avatar" :preview-src-list="[scope.row.avatar]" />
                </div>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="name" label="商户名称" min-width="150" />
            <el-table-column label="商户类别" min-width="80">
              <template slot-scope="scope">
                <span>{{ scope.row.isSelf | selfTypeFilter }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-drawer>
    <el-dialog title="删除" :visible.sync="delShow" width="430px" :before-close="handleClose">
      <div>
        <el-radio v-model="loseEfficacyStatus" :label="0">已领取的优惠券仍可正常使用</el-radio><br />
        <el-radio v-model="loseEfficacyStatus" :label="1" class="mt20"
          >同步删除已领取的优惠券，已领取的优惠券展示为已失效</el-radio
        >
      </div>
      <div class="acea-row row-right mt20 btnBottom">
        <el-button size="small" @click="delShow = false">取消</el-button>
        <el-button size="small" type="primary" @click="confirmDelete()">删除</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { couponDeleteApi, couponInfoApi, couponStatusApi, platformCouponListApi } from '@/api/marketing';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
export default {
  name: 'platformCoupon',
  data() {
    return {
      listLoading: false,
      tableData: {
        data: [],
        total: 0,
      },
      tableFrom: {
        page: 1,
        limit: 20,
        category: '',
        name: '',
        status: '',
        receiveType: '',
      },
      name: '',
      fromList: this.$constants.fromList,
      showInfo: false,
      delShow: false,
      cell: {},
      loseEfficacyStatus: 0,
      tabPaneName: '更多',
      activeNames: 'one',
      showTab: false,
      loading: false,
    };
  },
  filters: {
    receiveType(val) {
      const typeObj = {
        1: '用户领取',
        2: '商品赠送券',
        3: '平台活动使用',
      };
      return typeObj[val];
    },
  },
  mounted() {
    if (checkPermi(['platform:coupon:page:list'])) this.getList(1);
    if (!localStorage.getItem('merPlatProductClassify')) this.$store.dispatch('product/getAdminProductClassify');
  },
  methods: {
    checkPermi,
    onchangeIsShow(row) {
      couponStatusApi(row.id)
        .then(async () => {
          this.$message.success('修改成功');
        })
        .catch(() => {
          row.status = !row.status;
        });
    },
    look(id) {
      this.showTab = false;
      this.activeNames = 'one';
      this.loading = true;
      couponInfoApi(id)
        .then((res) => {
          if (res.category == 6) {
            this.tabPaneName = '商户列表';
            this.showTab = true;
          } else if (res.category == 2) {
            this.tabPaneName = '商品列表';
            this.showTab = true;
          }
          this.cell = res;
          this.showInfo = true;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 删除
    handleDelete(id) {
      this.rowId = id;
      this.delShow = true;
    },
    // 列表
    getList(num) {
      this.tableFrom.page = num ? num : this.tableFrom.page;
      this.tableFrom.name = encodeURIComponent(this.name);
      this.listLoading = true;
      platformCouponListApi(this.tableFrom)
        .then((res) => {
          this.tableData.data = res.list;
          this.tableData.total = res.total;
          this.listLoading = false;
        })
        .catch((res) => {
          this.listLoading = false;
        });
    },
    reset() {
      this.tableFrom.category = '';
      this.tableFrom.name = '';
      this.tableFrom.status = '';
      this.tableFrom.receiveType = '';
      this.name = '';
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
    handleClose() {
      this.showInfo = false;
      this.delShow = false;
    },
    confirmDelete() {
      couponDeleteApi({
        id: this.rowId,
        loseEfficacyStatus: this.loseEfficacyStatus,
      }).then(() => {
        this.$message.success('删除成功');
        this.delShow = false;
        if (this.tableData.data.length === 1 && this.tableFrom.page > 1) this.tableFrom.page = this.tableFrom.page - 1;
        this.getList(1);
      });
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep.el-drawer__header {
  display: block !important;
}
::v-deep .el-table th.el-table__cell > .cell,
::v-deep.el-table .cell,
.el-table--border .el-table__cell:first-child .cell {
  padding-left: 15px;
}
.section {
  padding: 25px 0;
  border-bottom: 1px dashed #eeeeee;
  .title {
    padding-left: 10px;
    border-left: 3px solid #1890ff;
    font-size: 15px;
    line-height: 15px;
    font-weight: bold;
    color: #333;
  }
  .cell {
    font-size: 14px;
    color: #333;
    margin-top: 20px;
  }
}
::v-deep .el-tabs__content {
  display: none;
}
</style>
