<template>
  <div class="divBox relative">
    <el-card :bordered="false" shadow="never" class="ivu-mt" :body-style="{ padding: 0 }">
      <div class="padding-add">
        <el-form size="small" label-position="right" inline @submit.native.prevent>
          <el-form-item label="开团日期：" class="inline">
            <el-date-picker
              v-model="time"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              size="small"
              type="daterange"
              placement="bottom-end"
              placeholder="自定义时间"
              class="selWidth"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="timeChange"
            />
          </el-form-item>
          <el-form-item label="活动名称：">
            <el-input
              v-model="formData.groupActivityName"
              placeholder="请输入活动名称"
              class="selWidth"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="商品搜索：">
            <el-input v-model="formData.productName" placeholder="请输入商品名称" class="selWidth" clearable></el-input>
          </el-form-item>
          <el-form-item label="团长搜索：">
            <UserSearchInput v-model="formData" class="selWidth" />
          </el-form-item>
          <el-form-item label="商户搜索：">
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
      <el-tabs @tab-click="handleClick" v-model="formData.recordStatus" class="list-tabs">
        <el-tab-pane :label="`已成功(${hedaList.successNum || 0})`" name="10" />
        <el-tab-pane :label="`拼团中(${hedaList.ingNum || 0})`" name="0" />
        <el-tab-pane :label="`已失败(${hedaList.failNum || 0})`" name="-1" />
      </el-tabs>
      <el-table :data="tableData" size="small" ref="multipleTable" row-key="id" class="mt20 tableSelection">
        <el-table-column label="ID" prop="groupBuyingId" width="50" />
        <el-table-column label="活动名称" prop="groupName" min-width="120" />
        <el-table-column label="创建商户" prop="merName" min-width="120" />
        <el-table-column label="团长信息" prop="creater" min-width="150">
          <template slot-scope="scope">
            <div class="acea-row">
              <div>{{ scope.row.groupLeaderNickname }}</div>
              <span>|</span>
              <div>{{ scope.row.groupLeaderUid }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="商品信息" prop="product" min-width="300">
          <template slot-scope="scope">
            <div class="acea-row al-c">
              <img :src="scope.row.productImage" alt="" />
              <div :style="{ marginLeft: '10px' }">
                <div class="line1">{{ scope.row.productName }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="拼团时间" prop="time" min-width="200">
          <template slot-scope="scope">
            <div>
              <div>开团时间：{{ scope.row.createTime }}</div>
              <div>结束时间：{{ scope.row.endTime }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="成团人数" prop="buyingCountNum" />
        <el-table-column label="已参团人数" prop="yetBuyingNum" />
        <el-table-column label="操作" prop="operate" min-width="155">
          <template slot-scope="scope">
            <a @click="toDeatil(scope.row)">详情</a>
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
    <activityDetail ref="detail"></activityDetail>
  </div>
</template>

<script>
import { checkPermi } from '@/utils/permission'; // 权限判断函数
import activityDetail from './detail.vue';
import { groupRecordList, groupRecordCount, groupRecordInfo } from '@/api/group';
export default {
  components: {
    activityDetail,
  },
  data() {
    return {
      tableData: [],
      formData: {
        groupActivityName: '',
        productName: '',
        merName: '',
        recordStatus: '10',
        startTime: '',
        endTime: '',
        limit: 20,
        page: 1,
        content: '',
        searchType: 'all',
      },
      total: 0,
      hedaList: [],
      time: '',
    };
  },
  created() {
    if (checkPermi(['platform:groupbuy:record:list'])) this.getList();
  },
  methods: {
    search() {
      this.formData.page = 1;
      this.getList();
    },
    handleClick(tab, event) {
      this.formData.page = 1;
      this.getList();
    },
    timeChange(e) {
      this.formData.page = 1;
      if (e) {
        this.formData.startTime = e[0];
        this.formData.endTime = e[1];
      } else {
        this.formData.startTime = '';
        this.formData.endTime = '';
      }
      this.getList();
    },
    getList() {
      groupRecordList(this.formData).then((res) => {
        this.tableData = res.list;
        this.total = res.total;
        this.getCount();
      });
    },
    getCount() {
      groupRecordCount(this.formData).then((res) => {
        this.hedaList = res;
      });
    },
    //详情
    toDeatil(row) {
      groupRecordInfo(row.groupBuyingId).then((res) => {
        this.$refs.detail.data = res;
        this.$refs.detail.dialogVisible = true;
      });
    },
    handleSizeChange(val) {
      this.formData.limit = val;
      this.getList();
    },
    pageChange(page) {
      this.formData.page = page;
      this.getList();
    },
    //重置
    reset() {
      this.formData.groupActivityName = '';
      this.formData.productName = '';
      this.formData.merName = '';
      this.formData.startTime = '';
      this.formData.endTime = '';
      this.formData.page = 1;
      this.formData.content = '';
      this.formData.searchType = 'all';
      this.time = '';
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
.line1 {
  width: 200px;
}

.sku {
  font-weight: 400;
}

.al-c {
  align-items: center;
}
</style>
