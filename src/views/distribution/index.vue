<template>
  <div class="divBox">
    <el-card
      :bordered="false"
      shadow="never"
      class="ivu-mt"
      :body-style="{ padding: 0 }"
      v-hasPermi="['platform:retail:store:people:list']"
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
    <el-card class="box-card mt14" :body-style="{ padding: '20px' }" shadow="never" :bordered="false">
      <el-table
        v-loading="listLoading"
        :data="tableData.data"
        style="width: 100%"
        size="small"
        class="table"
        highlight-current-row
      >
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column label="头像" min-width="80">
          <template slot-scope="scope">
            <div class="demo-image__preview line-heightOne">
              <el-image :src="scope.row.avatar" :preview-src-list="[scope.row.avatar]" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="用户信息" min-width="130" :show-overflow-tooltip="true" />
        <el-table-column
          sortable
          prop="spreadCount"
          label="推广用户(一级)数量"
          :sort-method="
            (a, b) => {
              return a.spreadCount - b.spreadCount;
            }
          "
          min-width="150"
        />
        <el-table-column
          sortable
          label="推广订单数量"
          prop="spreadOrderNum"
          :sort-method="
            (a, b) => {
              return a.spreadOrderNum - b.spreadOrderNum;
            }
          "
          min-width="120"
        />
        <el-table-column
          sortable
          label="推广订单金额"
          min-width="120"
          :sort-method="
            (a, b) => {
              return a.spreadOrderTotalPrice - b.spreadOrderTotalPrice;
            }
          "
          prop="spreadOrderTotalPrice"
        />
        <el-table-column
          sortable
          label="佣金总金额"
          min-width="120"
          :sort-method="
            (a, b) => {
              return a.totalBrokeragePrice - b.totalBrokeragePrice;
            }
          "
          prop="totalBrokeragePrice"
        />
        <el-table-column
          sortable
          label="已提现金额"
          min-width="120"
          :sort-method="
            (a, b) => {
              return a.extractCountPrice - b.extractCountPrice;
            }
          "
          prop="extractCountPrice"
        />
        <el-table-column
          sortable
          label="已提现次数"
          min-width="120"
          :sort-method="
            (a, b) => {
              return a.extractCountNum - b.extractCountNum;
            }
          "
          prop="extractCountNum"
        />
        <el-table-column
          sortable
          label="未提现金额"
          min-width="120"
          :sort-method="
            (a, b) => {
              return a.brokeragePrice - b.brokeragePrice;
            }
          "
          prop="brokeragePrice"
        />
        <el-table-column
          sortable
          label="冻结中佣金"
          min-width="120"
          :sort-method="
            (a, b) => {
              return a.freezeBrokeragePrice - b.freezeBrokeragePrice;
            }
          "
          prop="freezeBrokeragePrice"
        />
        <el-table-column prop="promoterTime" label="成为推广员时间" min-width="150" />
        <el-table-column prop="spreadNickname" label="上级推广人" min-width="150" />
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <a @click="onSpread(scope.row.id, 'man', '推广人')" v-hasPermi="['platform:retail:store:sub:user:list']"
              >推广人</a
            >
            <el-divider direction="vertical"></el-divider>
            <a
              @click="onSpreadOrder(scope.row.id, 'order', '推广订单')"
              v-hasPermi="['platform:retail:store:promotion:order:list']"
              >推广订单</a
            >
            <template
              v-if="
                scope.row.spreadNickname &&
                scope.row.spreadNickname !== '无' &&
                checkPermi(['platform:retail:store:clean:user:spread'])
              "
            >
              <el-divider direction="vertical"></el-divider>
              <a @click="clearSpread(scope.row)">清除上级</a>
            </template>
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

    <!--推广人、推广订单-->
    <el-dialog :title="titleName + '列表'" :visible.sync="dialogVisible" width="900px" :before-close="handleClose">
      <div class="container">
        <el-form size="small" inline @submit.native.prevent>
          <el-form-item key="1" label="时间选择：">
            <el-date-picker
              v-model="timeValSpread"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              size="small"
              type="daterange"
              placement="bottom-end"
              placeholder="自定义时间"
              style="width: 260px"
              @change="onchangeTimeSpread"
            />
          </el-form-item>
          <el-form-item label="用户类型：">
            <el-radio-group v-model="spreadFrom.type" size="small" @change="onChanges">
              <el-radio-button label="0">全部</el-radio-button>
              <el-radio-button label="1">一级推广人</el-radio-button>
              <el-radio-button label="2">二级推广人</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="关键字：" label-width="72px">
            <el-input
              v-model.trim="keywords"
              :placeholder="onName === 'order' ? '请输入订单号' : '请输入姓名、电话、用户ID'"
              class="selWidth"
              size="small"
              @keyup.enter.native="onChanges"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="onChanges">查询</el-button>
            <el-button size="small" @click="spreadReset()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        v-if="onName === 'man'"
        key="men"
        v-loading="spreadLoading"
        :data="spreadData.data"
        style="width: 100%"
        size="small"
        class="table"
        highlight-current-row
      >
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column label="头像" min-width="80">
          <template slot-scope="scope">
            <div class="demo-image__preview line-heightOne">
              <el-image :src="scope.row.avatar" :preview-src-list="[scope.row.avatar]" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="用户信息" min-width="130" />
        <el-table-column prop="is_promoter" label="是否推广员" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.isPromoter | filterYesOrNo }}</span>
          </template>
        </el-table-column>
        <el-table-column sortable label="推广人数" min-width="120" prop="spreadCount" />
        <el-table-column sortable label="订单数" min-width="120" prop="payCount" />
      </el-table>
      <el-table
        v-if="onName === 'order'"
        key="order"
        v-loading="spreadLoading"
        :data="spreadData.data"
        style="width: 100%"
        size="small"
        class="table"
        highlight-current-row
      >
        <el-table-column prop="orderNo" label="订单ID" min-width="120" />
        <el-table-column label="用户信息" min-width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.nickname }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="时间" min-width="150" />
        <el-table-column sortable label="返佣金额" min-width="120" prop="price" />
      </el-table>
      <div class="block">
        <el-pagination
          background
          :page-sizes="[10, 20, 30, 40]"
          :page-size="spreadFrom.limit"
          :current-page="spreadFrom.page"
          layout="total, sizes, prev, pager, next, jumper"
          :total="spreadData.total"
          @size-change="handleSizeChangeSpread"
          @current-change="pageChangeSpread"
        />
      </div>
    </el-dialog>
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
import { promoterListApi, spreadListApi, spreadOrderListApi, spreadClearApi } from '@/api/distribution';
import cardsData from '@/components/cards/index';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
export default {
  name: 'AccountsUser',
  components: { cardsData },
  data() {
    return {
      cardLists: [],
      timeVal: [],
      tableData: {
        data: [],
        total: 0,
      },
      listLoading: false,
      tableFrom: {
        dateLimit: '',
        keywords: '',
        page: 1,
        limit: 20,
        searchType: 'all',
        content: '',
      },
      promoterKeywords: '',
      fromList: this.$constants.fromList,
      dialogVisible: false,
      spreadData: {
        data: [],
        total: 0,
      },
      spreadFrom: {
        page: 1,
        limit: 10,
        dateLimit: '',
        type: 0,
        keywords: '',
        uid: '',
      },
      keywords: '',
      timeValSpread: [],
      spreadLoading: false,
      uid: '',
      onName: '',
      titleName: '',
    };
  },
  mounted() {
    if (checkPermi(['platform:retail:store:people:list'])) this.getList();
  },
  methods: {
    checkPermi,
    seachList() {
      this.getList(1);
    },
    // 清除
    clearSpread(row) {
      this.$modalSure('解除【' + row.nickname + '】的上级推广人吗').then(() => {
        spreadClearApi(row.id).then((res) => {
          this.$message.success('清除成功');
          this.getList(1);
        });
      });
    },
    onSpread(uid, n, p) {
      this.onName = n;
      this.titleName = p;
      this.uid = uid;
      this.dialogVisible = true;
      this.spreadFrom = {
        page: 1,
        limit: 10,
        dateLimit: '',
        type: 0,
        keywords: '',
        uid: uid,
      };
      this.keywords = '';
      this.getListSpread();
    },
    handleClose() {
      this.dialogVisible = false;
    },
    // 选择时间
    selectChangeSpread(tab) {
      this.timeValSpread = [];
      this.spreadFrom.dateLimit = tab;
      this.spreadFrom.page = 1;
      this.onName === 'man' ? this.getListSpread() : this.getSpreadOrderList();
    },
    // 具体日期
    onchangeTimeSpread(e) {
      this.timeValSpread = e;
      this.spreadFrom.dateLimit = e ? this.timeValSpread.join(',') : '';
      this.spreadFrom.page = 1;
      this.onName === 'man' ? this.getListSpread() : this.getSpreadOrderList();
    },
    onChanges() {
      this.spreadFrom.page = 1;
      this.onName === 'man' ? this.getListSpread() : this.getSpreadOrderList();
    },
    //重置推广人订单、列表
    spreadReset() {
      this.timeValSpread = [];
      this.spreadFrom.dateLimit = '';
      this.spreadFrom.type = 0;
      this.spreadFrom.keywords = '';
      this.spreadFrom.page = 1;
      this.keywords = '';
      this.onName === 'man' ? this.getListSpread() : this.getSpreadOrderList();
    },
    // 推广人列表
    getListSpread() {
      this.spreadLoading = true;
      this.spreadFrom.keywords = encodeURIComponent(this.keywords);
      spreadListApi(this.spreadFrom)
        .then((res) => {
          this.spreadData.data = res.list;
          this.spreadData.total = res.total;
          this.spreadLoading = false;
        })
        .catch(() => {
          this.spreadLoading = false;
        });
    },
    pageChangeSpread(page) {
      this.spreadFrom.page = page;
      this.onName === 'man' ? this.getListSpread(this.uid) : this.getSpreadOrderList(this.uid);
    },
    handleSizeChangeSpread(val) {
      this.spreadFrom.limit = val;
      this.onName === 'man' ? this.getListSpread(this.uid) : this.getSpreadOrderList(this.uid);
    },
    // 推广订单
    onSpreadOrder(uid, n, p) {
      this.uid = uid;
      this.onName = n;
      this.titleName = p;
      this.dialogVisible = true;
      this.spreadFrom = {
        page: 1,
        limit: 10,
        dateLimit: '',
        type: 0,
        keywords: '',
        uid: uid,
      };
      this.keywords = '';
      this.getSpreadOrderList();
    },
    getSpreadOrderList() {
      this.spreadLoading = true;
      this.spreadFrom.keywords = encodeURIComponent(this.keywords);
      spreadOrderListApi(this.spreadFrom)
        .then((res) => {
          this.spreadData.data = res.list;
          this.spreadData.total = res.total;
          this.spreadLoading = false;
        })
        .catch(() => {
          this.spreadLoading = false;
        });
    },
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
    // 列表
    getList(num) {
      this.listLoading = true;
      this.tableFrom.page = num ? num : this.tableFrom.page;
      this.tableFrom.keywords = encodeURIComponent(this.promoterKeywords);
      promoterListApi(this.tableFrom)
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
      this.tableFrom.dateLimit = '';
      this.tableFrom.keywords = '';
      this.tableFrom.searchType = 'all';
      this.tableFrom.content = '';
      this.promoterKeywords = '';
      this.timeVal = [];
      this.getList(1);
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

<style scoped>
.el-icon-arrow-down {
  font-size: 12px;
}

.block {
  padding-bottom: 20px;
  padding-top: 5px;
}
</style>
