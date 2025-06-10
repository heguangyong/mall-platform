<template>
  <div class="divBox relative">
    <el-card
      :bordered="false"
      shadow="never"
      class="ivu-mt"
      :body-style="{ padding: 0 }"
      v-hasPermi="['platform:groupbuy:activity:list']"
    >
      <div class="padding-add">
        <el-form size="small" label-position="right" inline @submit.native.prevent>
          <el-form-item label="活动名称：">
            <el-input v-model="formData.groupName" placeholder="请输入活动名称" class="selWidth" clearable></el-input>
          </el-form-item>
          <el-form-item label="活动进程：" class="inline">
            <el-select
              @change="selectChange"
              v-model="formData.groupProcess"
              clearable
              placeholder="请选择活动进程"
              class="selWidth"
            >
              <el-option label="未开始" value="0" />
              <el-option label="进行中" value="1" />
              <el-option label="已结束" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="活动日期：" class="inline">
            <el-date-picker
              @change="selectChange"
              class="selWidth"
              v-model="formData.startTime"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="活动状态：" class="inline">
            <el-select
              @change="selectChange"
              v-model="formData.activityStatus"
              clearable
              placeholder="请选择活动状态"
              class="selWidth"
            >
              <el-option label="开启" value="1" />
              <el-option label="关闭" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="商户分类：" class="inline">
            <el-select
              @change="selectChange"
              v-model="formData.categoryId"
              clearable
              size="small"
              placeholder="请选择"
              class="selWidth"
            >
              <el-option v-for="item in merchantClassify" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="商户名称：">
            <el-input v-model="formData.merName" placeholder="请输入商户名称" class="selWidth" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="search">查询</el-button>
            <el-button size="small" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card mt14" :body-style="{ padding: '0 20px 20px' }" shadow="never" :bordered="false">
      <el-tabs v-if="hedaList.length" @tab-click="getTabList" v-model="formData.groupStatus" class="list-tabs">
        <el-tab-pane :label="`已通过(${hedaList[2].count})`" name="4" />
        <el-tab-pane :label="`待审核(${hedaList[1].count})`" name="3" />
        <el-tab-pane :label="`已拒绝(${hedaList[0].count})`" name="1" />
      </el-tabs>
      <el-table :data="tableData" size="small" ref="multipleTable" row-key="id" class="mt20 tableSelection">
        <el-table-column label="ID" prop="id" width="60" />
        <el-table-column label="活动名称" prop="groupName" min-width="120" />
        <el-table-column label="活动时间" prop="time" min-width="150">
          <template slot-scope="scope">
            <span>{{ `${scope.row.startTime}至${scope.row.endTime}` }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建商户" prop="merName" />
        <el-table-column label="成团人数" prop="buyCount" />
        <el-table-column label="活动进程" prop="doing">
          <template slot-scope="scope">
            <span v-if="scope.row.groupProcess == 0">未开始</span>
            <span v-if="scope.row.groupProcess == 1">进行中</span>
            <span v-if="scope.row.groupProcess == 2">已结束</span>
          </template>
        </el-table-column>
        <el-table-column label="参与商品数" prop="productCount" />
        <el-table-column label="开团数" prop="totalActivityBegin" :render-header="totalActivityBeginHeader" />
        <el-table-column label="成团数" prop="totalActivityDone" :render-header="totalActivityDoneHeader" />
        <el-table-column
          label="参团订单数"
          prop="totalOrderBegin"
          min-width="100"
          :render-header="totalOrderBeginHeader"
        />
        <el-table-column
          label="成团订单数"
          prop="totalOrderDone"
          min-width="100"
          :render-header="totalOrderDoneHeader"
        />
        <el-table-column label="拒绝原因" prop="refusal" v-if="formData.groupStatus == 1" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.refusal || '平台强制关闭' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="活动状态" prop="status">
          <template slot-scope="scope">
            <span v-if="scope.row.activityStatus == 1">开启</span>
            <span v-if="scope.row.activityStatus == 0">关闭</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="operate" min-width="155">
          <template slot-scope="scope">
            <a @click="toDeatil(scope.row)" v-hasPermi="['platform:groupbuy:activity:info']">详情</a>
            <el-divider v-if="scope.row.groupStatus != 1" direction="vertical"></el-divider>
            <a
              v-if="scope.row.groupStatus == 4"
              @click="close(scope.row)"
              v-hasPermi="['platform:groupbuy:activity:review:close']"
              >强制关闭</a
            >
            <a
              v-if="scope.row.groupStatus == 3"
              @click="toDeatil(scope.row)"
              v-hasPermi="['platform:groupbuy:activity:review:pass']"
              >审核</a
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          background
          :page-size="formData.limit"
          :current-page="formData.page"
          :total="total"
          :page-sizes="[20, 40, 60, 80]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="pageChange"
        />
      </div>
    </el-card>
    <!-- 活动详情 -->
    <activityDetail ref="detail" @changeList="getTabList"></activityDetail>
  </div>
</template>

<script>
import { checkPermi } from '@/utils/permission'; // 权限判断函数
import { mapGetters } from 'vuex';
import activityDetail from './detail.vue';
import { groupActivityList, groupActivityCount, groupActivityInfo, groupActivityClose } from '@/api/group';
export default {
  components: {
    activityDetail,
  },
  data() {
    return {
      tableData: [],
      formData: {
        activityStatus: '',
        categoryId: '',
        groupName: '',
        groupProcess: '',
        groupStatus: '4',
        limit: 20,
        merName: '',
        page: 1,
        startTime: '',
      },
      hedaList: [],
      total: 0,
    };
  },
  computed: {
    ...mapGetters(['merchantClassify']),
  },
  created() {
    if (!this.merchantClassify.length) this.$store.dispatch('merchant/getMerchantClassify');
    if (checkPermi(['platform:groupbuy:activity:list'])) this.getList();
  },
  methods: {
    selectChange() {
      this.formData.page = 1;
      this.getList();
    },
    search() {
      this.formData.page = 1;
      this.getList();
    },
    totalOrderDoneHeader(h, { column }) {
      return this.headerText(
        h,
        column,
        '成团订单数：此拼团活动用户已经拼团成功的所有成功订单数统计（不包含未支付的订单数据）',
      );
    },
    totalOrderBeginHeader(h, { column }) {
      return this.headerText(h, column, '参团订单数：此拼团活动用户开团的所有订单数统计（不包含未支付的订单数据）');
    },
    totalActivityDoneHeader(h, { column }) {
      return this.headerText(h, column, '成团数：此拼团活动用户已经拼团成功的团次数统计');
    },
    // 开团提示
    totalActivityBeginHeader(h, { column }) {
      return this.headerText(h, column, '开团数：此拼团活动用户开团的次数统计');
    },
    headerText(h, column, text) {
      const serviceContent = [
        h(
          'div',
          {
            slot: 'content',
          },
          text,
        ),
      ];
      return h('div', [
        h('span', column.label),
        h(
          'el-tooltip',
          {
            props: {
              placement: 'top',
            },
          },
          [
            serviceContent,
            h('i', {
              class: 'el-icon-warning-outline',
              style: 'color:#999;margin-left:5px;',
            }),
          ],
        ),
      ]);
    },
    handleSizeChange(val) {
      this.formData.limit = val;
      this.getList();
    },
    pageChange(page) {
      this.formData.page = page;
      this.getList();
    },
    getHead() {
      groupActivityCount(this.formData).then((res) => {
        this.hedaList = res;
      });
    },
    getTabList() {
      this.formData.page = 1;
      this.getList();
    },
    getList() {
      groupActivityList(this.formData).then((res) => {
        this.tableData = res.list;
        this.total = res.total;
        this.getHead();
      });
    },
    //详情
    toDeatil(row) {
      groupActivityInfo(row.id).then((res) => {
        this.$refs.detail.activityInfo = res;
        this.$refs.detail.dialogVisible = true;
      });
    },
    //关闭
    close(row) {
      this.$modalSure('要将此活动强制关闭吗？').then(() => {
        groupActivityClose(row.id).then((res) => {
          this.$message({
            type: 'success',
            message: '关闭成功!',
          });
          this.getList();
        });
      });
    },
    //重置
    reset() {
      this.formData.activityStatus = '';
      this.formData.categoryId = '';
      this.formData.groupName = '';
      this.formData.groupProcess = '';
      this.formData.groupStatus = '4';
      this.formData.merName = '';
      this.formData.page = 1;
      this.formData.startTime = '';
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped></style>
