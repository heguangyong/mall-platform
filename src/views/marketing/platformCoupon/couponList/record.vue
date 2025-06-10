<template>
  <div class="divBox">
    <el-card
      v-hasPermi="['platform:coupon:user:page:list']"
      :bordered="false"
      shadow="never"
      class="ivu-mt"
      :body-style="{ padding: 0 }"
    >
      <div class="padding-add">
        <el-form inline size="small" label-position="right" @submit.native.prevent>
          <el-form-item label="优惠券名：">
            <el-input
              v-model.trim="name"
              @keyup.enter.native="getList(1)"
              placeholder="请输入优惠券名称"
              class="selWidth"
              clearable
            />
          </el-form-item>
          <el-form-item label="用户搜索：" label-for="nickname">
            <UserSearchInput v-model="tableFrom" />
          </el-form-item>
          <el-form-item label="使用状态：">
            <el-select
              v-model="tableFrom.status"
              placeholder="请选择使用状态"
              @change="getList(1)"
              clearable
              class="selWidth"
            >
              <el-option label="已使用" :value="1"></el-option>
              <el-option label="未使用" :value="0"></el-option>
              <el-option label="已失效" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="getList(1)">查询</el-button>
            <el-button size="small" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card mt14" :body-style="{ padding: '20px' }" :bordered="false" shadow="never">
      <el-table v-loading="listLoading" :data="tableData.data" style="width: 100%" size="small">
        <el-table-column prop="id" label="优惠券ID" min-width="80" />
        <el-table-column prop="name" label="优惠券名称" min-width="150" :show-overflow-tooltip="true" />
        <el-table-column prop="user" label="用户信息" min-width="140">
          <template slot-scope="scope">
            <div>{{ scope.row.nickname }}/{{ scope.row.uid }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="money" label="面值" min-width="90" />
        <el-table-column prop="minPrice" label="最低消费额" min-width="120" />
        <el-table-column prop="startTime" label="使用有效期" min-width="150">
          <template slot-scope="scope">
            <div v-if="scope.row.startTime">
              {{ scope.row.startTime }} -<br />
              {{ scope.row.endTime }}
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="使用范围" min-width="90">
          <template slot-scope="scope">
            <span>{{ scope.row.category | couponCategory }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="receiveType" label="领取方式" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.receiveType | receiveType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="领取时间" min-width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="使用状态" min-width="90">
          <template slot-scope="scope">
            <el-tag class="endTag tag-background" v-if="scope.row.status == 1">已使用</el-tag>
            <el-tag class="doingTag tag-background" v-else-if="scope.row.status == 0">未使用</el-tag>
            <el-tag class="notStartTag tag-background" v-else>已失效</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="使用时间" min-width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.useTime | filterEmpty }}</span>
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
import { couponUserListApi } from '@/api/marketing';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
export default {
  name: 'couponRecord',
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
        status: '',
        nickname: '',
        name: '',
        searchType: 'all',
        content: '',
      },
      name: '',
      nickname: '',
      props: { emitPath: false },
      categoryList: [],
      productId: 0,
      timeVal: [],
      cardLists: [],
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
    if (checkPermi(['platform:coupon:user:page:list'])) this.getList('');
  },
  methods: {
    checkPermi,
    onchangeTime(e) {
      this.timeVal = e;
      this.tableFrom.pay_time = e ? this.timeVal.join('-') : '';
    },
    //重置
    reset() {
      this.tableFrom.page = 1;
      this.tableFrom.status = '';
      this.tableFrom.nickname = '';
      this.tableFrom.name = '';
      this.tableFrom.searchType = 'all';
      this.tableFrom.content = '';
      this.name = '';
      this.nickname = '';
      // this.timeVal = [];
      this.getList();
    },
    // 列表
    getList(num) {
      this.listLoading = true;
      this.tableFrom.name = encodeURIComponent(this.name);
      this.tableFrom.nickname = encodeURIComponent(this.nickname);
      this.tableFrom.page = num ? num : this.tableFrom.page;
      couponUserListApi(this.tableFrom)
        .then((res) => {
          this.tableData.data = res.list;
          this.tableData.total = res.total;
          this.listLoading = false;
        })
        .catch((res) => {
          this.listLoading = false;
          this.$message.error(res.message);
        });
    },
    pageChange(page) {
      this.tableFrom.page = page;
      this.getList('');
    },
    handleSizeChange(val) {
      this.tableFrom.limit = val;
      this.getList(1);
    },
  },
};
</script>
<style scoped lang="scss"></style>
