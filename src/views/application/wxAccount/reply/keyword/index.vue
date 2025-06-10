<template>
  <div class="divBox">
    <el-card
      v-hasPermi="['platform:wechat:public:keywords:reply:list']"
      class="box-card"
      :bordered="false"
      shadow="never"
      :body-style="{ padding: 0 }"
    >
      <div class="padding-add">
        <el-form size="small" :inline="true" v-hasPermi="['platform:wechat:public:keywords:reply:list']">
          <el-form-item label="回复类型：">
            <el-select v-model="tableFrom.type" placeholder="请选择类型" @change="seachList" class="selWidth" clearable>
              <el-option label="文本消息" value="text"></el-option>
              <el-option label="图片消息" value="image"></el-option>
              <el-option label="图文消息" value="news"></el-option>
              <el-option label="音频消息" value="voice"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="回复搜索：">
            <el-input v-model="keywords" placeholder="请输入关键字" class="selWidth" size="small" clearable> </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="seachList">搜索</el-button>
            <el-button size="small" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card mt14" :body-style="{ padding: '20px' }" shadow="never" :bordered="false">
      <router-link
        v-hasPermi="['platform:wechat:public:keywords:reply:save']"
        :to="{ path: '/operation/application/publicAccount/wxReply/keyword/save' }"
      >
        <el-button size="small" type="primary">添加关键字</el-button>
      </router-link>
      <el-table
        v-loading="listLoading"
        class="mt20"
        :data="tableData.data"
        style="width: 100%"
        size="small"
        highlight-current-row
      >
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="keywords" label="关键字" min-width="150" />
        <el-table-column label="回复类型" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.type | keywordStatusFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="是否显示" min-width="100">
          <template slot-scope="scope">
            <el-switch
              v-if="checkPermi(['admin:wechat:keywords:reply:status'])"
              v-model="scope.row.status"
              :active-value="true"
              :inactive-value="false"
              active-text="显示"
              inactive-text="隐藏"
              @change="onchangeIsShow(scope.row)"
            />
            <div v-else>{{ scope.row.status ? '显示' : '隐藏' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <template
              v-if="
                scope.row.keywords !== 'subscribe' &&
                scope.row.keywords !== 'default' &&
                checkPermi(['platform:wechat:public:keywords:reply:update'])
              "
            >
              <router-link :to="{ path: '/operation/application/publicAccount/wxReply/keyword/save/' + scope.row.id }">
                <a>编辑</a>
              </router-link>
              <el-divider direction="vertical"></el-divider>
            </template>
            <a
              @click="handleDelete(scope.row.id, scope.$index)"
              v-hasPermi="['platform:wechat:public:keywords:reply:delete']"
              >删除</a
            >
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
// +---------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +---------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +---------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +---------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +---------------------------------------------------------------------
import { wechatReplyListApi, wechatReplyDeleteApi, wechatReplyUpdateApi, wechatReplyStatusApi } from '@/api/wxApi';
import { getToken } from '@/utils/auth';
import { checkPermi } from '@/utils/permission';
import { handleDeleteTable } from '@/libs/public';
export default {
  name: 'WechatKeyword',
  data() {
    return {
      tableData: {
        data: [],
        total: 0,
      },
      tableFrom: {
        page: 1,
        limit: 20,
        keywords: '',
        type: '',
      },
      keywords: '',
      listLoading: false,
    };
  },
  created() {
    if (checkPermi(['platform:wechat:public:keywords:reply:list'])) this.getList(1);
  },
  methods: {
    checkPermi,
    /** 重置按钮操作 */
    resetQuery() {
      this.tableFrom.keywords = '';
      this.tableFrom.type = '';
      this.keywords = '';
      this.seachList();
    },
    seachList() {
      this.getList(1);
    },
    onchangeIsShow(row) {
      wechatReplyStatusApi(row.id)
        .then(() => {
          this.$message.success('修改成功');
          this.getList(1);
        })
        .catch(() => {
          row.status = !row.status;
        });
    },
    // 列表
    getList(num) {
      this.tableFrom.keywords = encodeURIComponent(this.keywords);
      this.tableFrom.page = num ? num : this.tableFrom.page;
      this.listLoading = true;
      wechatReplyListApi(this.tableFrom)
        .then((res) => {
          this.tableData.data = res.list;
          this.tableData.total = res.total;
          this.listLoading = false;
        })
        .catch((res) => {
          this.listLoading = false;
        });
    },
    pageChange(page) {
      this.tableFrom.page = page;
      this.getList();
    },
    handleSizeChange(val) {
      this.tableFrom.limit = val;
      this.getList(1);
    },
    // 删除
    handleDelete(id, idx) {
      this.$modalSure().then(() => {
        wechatReplyDeleteApi(id).then(() => {
          this.$message.success('删除成功');
          handleDeleteTable(this.tableData.data.length, this.tableFrom);
          this.getList();
        });
      });
    },
  },
};
</script>

<style scoped></style>
