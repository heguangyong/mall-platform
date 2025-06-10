<template>
  <div class="divBox">
    <el-card class="box-card" :bordered="false" shadow="never">
      <div slot="header" class="clearfix">
        <el-form inline>
          <el-form-item label="用户搜索：" label-for="nickname">
            <UserSearchInput v-model="userFrom" />
          </el-form-item>
          <el-form-item class="search-form-sub">
            <el-button type="primary" size="small" @click="getList(1)">搜索</el-button>
          </el-form-item>
<!--          <el-form-item label="昵称搜索：">-->
<!--            <el-input v-model.trim="keywords" placeholder="请输入用户名称" class="selWidth"> </el-input>-->
<!--            <el-button class="search-btn" type="primary" @click="search">查询</el-button>-->
<!--          </el-form-item>-->
        </el-form>
      </div>
      <el-table v-loading="loading" :data="tableData.data" width="800px" size="small">
        <el-table-column label="" width="30">
          <template slot-scope="scope">
            <el-radio
              v-model="templateRadio"
              :label="scope.row.id"
              @change.native="getTemplateRow(scope.$index, scope.row)"
              >&nbsp;</el-radio
            >
          </template>
        </el-table-column>
        <el-table-column prop="id" label="ID" min-width="60" />
        <el-table-column label="姓名" min-width="160">
          <template slot-scope="scope">
            <span :class="scope.row.isLogoff == true ? 'textE93323' : ''"
              >{{ scope.row.nickname | filterEmpty }} | {{ scope.row.sex | sexFilter }}</span
            >
            <span :class="scope.row.isLogoff ? 'textE93323' : ''" v-if="scope.row.isLogoff">|</span>
            <span v-if="scope.row.isLogoff" class="textE93323">(已注销)</span>
          </template>
        </el-table-column>
        <el-table-column label="用户头像" min-width="80">
          <template slot-scope="scope">
            <div class="demo-image__preview line-heightOne">
              <el-image class="tabImage" :src="scope.row.avatar" :preview-src-list="[scope.row.avatar]" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="性别" min-width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.sex | sexFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="地区" min-width="130">
          <template slot-scope="scope">
            <span>{{ scope.row.province + scope.row.city || '-' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="bottom">
        <el-pagination
          :page-sizes="[10, 20, 30, 40]"
          :page-size="userFrom.limit"
          :current-page="userFrom.page"
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
import { userListApi } from '@/api/user';
export default {
  name: 'UserList',
  filters: {
    sexFilter(status) {
      const statusMap = {
        0: '未知',
        1: '男',
        2: '女',
        3: '保密',
      };
      return statusMap[status];
    },
    statusFilter(status) {
      const statusMap = {
        wechat: '微信用户',
        routine: '小程序用户',
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      templateRadio: 0,
      loading: false,
      tableData: {
        data: [],
        total: 0,
      },
      userFrom: {
        payCount: '',
        sex: '',
        identity: '',
        registerType: '',
        page: 1,
        limit: 20,
        searchType: 'all',
        content: '',
      },
      // userFrom: {
      //   payCount: '',
      //   sex: '',
      //   identity: '',
      //   registerType: '',
      //   page: 1,
      //   limit: 20,
      //   searchType: 'all',
      //   content: '',
      // },
      keywords: '',
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getTemplateRow(idx, row) {
      this.$emit('getTemplateRow', row);
    },
    // 列表
    getList(num) {
      this.loading = true;
      this.userFrom.page = num ? num : this.userFrom.page;
      userListApi(this.userFrom)
        .then((res) => {
          this.tableData.data = res.list;
          this.tableData.total = res.total;
          this.loading = false;
        })
        .catch((res) => {
          this.$message.error(res.message);
          this.loading = false;
        });
    },
    search() {
      this.getList(this.keywords);
    },
    pageChange(page) {
      this.userFrom.page = page;
      this.getList();
    },
    handleSizeChange(val) {
      this.userFrom.limit = val;
      this.getList();
    },
  },
};
</script>

<style scoped lang="scss">
.divBox {
  height: 720px;

  ::v-deep .el-card__header {
    padding: 0 !important;
  }

  .el-pagination {
    padding: 0 !important;
    margin: 0 !important;
  }

  .bottom {
    padding-top: 30px;
  }
}

.search-btn {
  margin-left: 10px;
}
</style>
