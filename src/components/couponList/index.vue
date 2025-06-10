<template>
  <div class="divBox">
    <div class="header clearfix">
      <div class="container">
        <el-form inline size="small" @submit.native.prevent>
          <el-form-item label="优惠劵名称：">
            <el-input
              v-model="tableFrom.keywords"
              @keyup.enter.native="getList(1)"
              clearable
              placeholder="请输入优惠券名称"
              class="selWidth"
              size="small"
            />
          </el-form-item>
          <el-form-item label-width="0">
            <el-button type="primary" size="small" @click="getList(1)">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table
      class="mb20"
      ref="table"
      v-loading="listLoading"
      :data="tableData.data"
      style="width: 100%"
      size="mini"
      max-height="400"
      tooltip-effect="dark"
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column v-if="handle === 'wu'" type="selection" width="45" />
      <el-table-column prop="id" label="ID" min-width="50" />
      <el-table-column prop="name" label="优惠券名称" min-width="120" :show-overflow-tooltip="true" />
      <el-table-column prop="name" label="使用范围" min-width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.category | couponCategory }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="money" label="面值（元）" min-width="90" />
      <el-table-column prop="minPrice" label="使用门槛（元）" min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.minPrice === 0 ? '不限制' : scope.row.minPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="有效期限" min-width="220" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{
            scope.row.isFixedTime ? scope.row.useStartTime + ' 一 ' + scope.row.useEndTime : scope.row.day + '天'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="剩余数量" min-width="90">
        <template slot-scope="scope">
          <span>{{ !scope.row.isLimited ? '不限量' : scope.row.lastTotal }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="handle === 'send'" label="操作" width="120" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            class="mr10"
            @click="sendGrant(scope.row.id)"
            v-hasPermi="['admin:coupon:user:receive']"
            >发送</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="acea-row row-right row-middle mb20">
      <el-pagination
        :page-sizes="[10, 20, 30, 40]"
        :page-size="tableFrom.limit"
        :current-page="tableFrom.page"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total"
        @size-change="handleSizeChange"
        @current-change="pageChange"
      />
    </div>
    <div v-if="handle === 'wu'" slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" class="fr mb20" @click="ok">确定</el-button>
    </div>
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

import { canSendListApi } from '@/api/marketing';
import { productCouponListApi } from '@/api/product';
export default {
  name: 'CouponList',
  props: {
    handle: {
      type: String,
      default: '',
    },
    couponData: {
      type: Array,
      default: () => [],
    },
    keyNum: {
      type: Number,
      default: 0,
    },
    userIds: {
      type: String,
      default: '',
    },
    userType: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      listLoading: true,
      tableData: {
        data: [],
        total: 0,
      },
      tableFrom: {
        page: 1,
        limit: 10,
        keywords: '',
      },
      multipleSelection: [],
      multipleSelectionAll: [],
      idKey: 'id',
      nextPageFlag: false,
      attr: [],
    };
  },
  watch: {
    keyNum: {
      deep: true,
      handler(val) {
        this.multipleSelectionAll = [...this.couponData];
        this.getList();
      },
    },
  },
  mounted() {
    this.multipleSelectionAll = [...this.couponData];
    this.tableFrom.page = 1;
    this.getList();
  },
  methods: {
    close() {
      this.multipleSelection = [];
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      setTimeout(() => {
        this.$selfUtil.changePageCoreRecordData(
          this.multipleSelectionAll,
          this.multipleSelection,
          this.tableData.data,
          (e) => {
            this.multipleSelectionAll = e;
          },
        );
      }, 50);
    },
    // 设置选中的方法
    setSelectRow() {
      if (!this.multipleSelectionAll || this.multipleSelectionAll.length <= 0) {
        return;
      }
      // 标识当前行的唯一键的名称
      const idKey = this.idKey;
      const selectAllIds = [];
      this.multipleSelectionAll.forEach((row) => {
        selectAllIds.push(row[idKey]);
      });
      this.$refs.table.clearSelection();
      for (var i = 0; i < this.tableData.data.length; i++) {
        if (selectAllIds.indexOf(this.tableData.data[i][idKey]) >= 0) {
          // 设置选中，记住table组件需要使用ref="table"
          this.$refs.table.toggleRowSelection(this.tableData.data[i], true);
        }
      }
    },
    ok() {
      if (this.multipleSelection.length > 0) {
        let couponList = [...this.multipleSelectionAll];
        this.$emit('getCouponId', couponList);
        this.close();
      } else {
        this.$message.warning('请先选择优惠劵');
      }
    },
    // 列表
    getList(num) {
      this.listLoading = true;
      this.tableFrom.page = num ? num : this.tableFrom.page;
      canSendListApi(this.tableFrom)
        .then((res) => {
          this.visibleCoupon = true;
          this.tableData.data = res.list;
          this.tableData.total = res.total;
          this.$nextTick(function () {
            this.setSelectRow(); //调用跨页选中方法
          });
          this.listLoading = false;
        })
        .catch((res) => {
          this.listLoading = false;
        });
    },
    pageChange(page) {
      this.$selfUtil.changePageCoreRecordData(
        this.multipleSelectionAll,
        this.multipleSelection,
        this.tableData.data,
        (e) => {
          this.multipleSelectionAll = e;
        },
      );
      this.tableFrom.page = page;
      this.getList();
    },
    handleSizeChange(val) {
      this.$selfUtil.changePageCoreRecordData(
        this.multipleSelectionAll,
        this.multipleSelection,
        this.tableData.data,
        (e) => {
          this.multipleSelectionAll = e;
        },
      );
      this.tableFrom.limit = val;
      this.getList();
    },
    // 发送
    sendGrant(id) {
      this.$modalSure('发送优惠劵吗').then(() => {
        couponUserApi({ couponId: id, uid: this.userIds }).then(() => {
          this.$message.success('发送成功');
          this.getList();
        });
      });
    },
  },
};
</script>

<style scoped lang="scss">
.seachTiele {
  line-height: 35px;
}
.fr {
  float: right;
}
::v-deep .el-table-column--selection .cell {
  padding-left: 10px !important;
}
</style>
