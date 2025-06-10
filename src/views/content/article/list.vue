<template>
  <div class="divBox">
    <el-card
      :bordered="false"
      shadow="never"
      class="ivu-mt"
      :body-style="{ padding: 0 }"
      v-hasPermi="['platform:article:list']"
    >
      <div class="padding-add">
        <el-form inline size="small" label-position="right" @submit.native.prevent>
          <el-form-item label="文章分类：">
            <el-select
              v-model="listPram.cid"
              clearable
              class="selWidth"
              placeholder="请选择文章分类"
              @change="handerSearch"
            >
              <el-option v-for="item in categoryTreeData" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文章标题：">
            <el-input
              v-model.trim="title"
              @keyup.enter.native="handerSearch"
              placeholder="请输入文章标题"
              class="selWidth"
              size="small"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="文章作者：">
            <el-input
              v-model.trim="author"
              @keyup.enter.native="handerSearch"
              placeholder="请输入文章作者"
              class="selWidth"
              size="small"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="handerSearch()">查询</el-button>
            <el-button size="small" @click="reset()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card mt14" :body-style="{ padding: '20px' }" shadow="never" :bordered="false">
      <router-link :to="{ path: '/marketing/content/articleCreat' }">
        <el-button size="small" type="primary" class="mr10" v-hasPermi="['platform:article:save']">添加文章</el-button>
      </router-link>
      <el-table v-loading="listLoading" :data="listData.list" size="small" highlight-current-row class="mt20">
        <el-table-column prop="id" label="ID" min-width="50" />
        <el-table-column label="图片" min-width="80">
          <template slot-scope="scope">
            <div class="demo-image__preview line-heightOne">
              <el-image :src="scope.row.cover" :preview-src-list="[scope.row.cover]" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="文章标题" min-width="220" :show-overflow-tooltip="true" />
        <el-table-column prop="visit" label="文章分类" min-width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.cid | articleTypeFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="visit" label="浏览量" min-width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.visit }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="author" label="文章作者" min-width="180" />
        <el-table-column prop="sort" label="排序" show-overflow-tooltip min-width="80" />
        <el-table-column prop="createTime" label="创建时间" min-width="150" />
        <el-table-column label="状态" fixed="right">
          <template slot-scope="scope">
            <el-switch
              v-if="checkPermi(['platform:article:switch'])"
              v-model="scope.row.status"
              :active-value="true"
              :inactive-value="false"
              active-text="启用"
              inactive-text="禁用"
              @change="handleStatusChange(scope.row)"
            >
            </el-switch>
            <div v-else>{{ scope.row.status ? '启用' : '禁用' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="scope">
            <router-link :to="{ path: '/marketing/content/articleCreat/' + scope.row.id }">
              <a v-hasPermi="['platform:article:update']">编辑</a>
            </router-link>
            <el-divider direction="vertical"></el-divider>
            <a @click="handlerDelete(scope.row)" v-hasPermi="['platform:article:delete']">删除</a>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :current-page="listPram.page"
        :page-sizes="constants.page.limit"
        :layout="constants.page.layout"
        :total="listData.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
    <el-dialog
      :visible.sync="editDialogConfig.visible"
      :title="editDialogConfig.isEdit === 0 ? '创建文章' : '编辑文章'"
      top="1vh"
      width="900px"
      destroy-on-close
      :modal="false"
      :close-on-click-modal="false"
      class="articleModal"
    >
      <edit
        v-if="editDialogConfig.visible"
        :is-edit="editDialogConfig.isEdit"
        :edit-data="editDialogConfig.editData"
        @hideDialog="handlerHideDialog"
      />
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
import * as articleApi from '@/api/article.js';
import edit from './edit';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
export default {
  components: { edit },
  data() {
    return {
      constants: this.$constants,
      listPram: {
        author: null,
        cid: null,
        page: 1,
        title: '',
        limit: this.$constants.page.limit[0],
      },
      author: '',
      title: '',
      listData: { list: [], total: 0 },
      editDialogConfig: {
        visible: false,
        data: {},
        isEdit: 0, // 0=add 1=edit
      },
      listLoading: true,
      categoryTreeData: [],
      categoryProps: {
        value: 'id',
        label: 'name',
        children: 'child',
        expandTrigger: 'hover',
        checkStrictly: true,
        emitPath: false,
      },
    };
  },
  created() {
    if (localStorage.getItem('articleClass')) {
      this.categoryTreeData = JSON.parse(localStorage.getItem('articleClass'));
    } else {
      if (checkPermi(['platform:article:category:list'])) this.handlerGetTreeList();
    }
    if (checkPermi(['platform:article:list'])) this.handlerGetListData(this.listPram);
  },
  methods: {
    checkPermi,
    //修改状态
    handleStatusChange(row) {
      articleApi.articleSwitchApi(row.id).then((res) => {
        this.$message.success('更新状态成功');
        this.handlerGetTreeList();
      });
    },
    handlerGetTreeList() {
      articleApi.articleCategoryListApi().then((data) => {
        this.categoryTreeData = data;
        let list = data.filter((item) => {
          return item.status;
        });
        localStorage.setItem('articleClass', JSON.stringify(list));
      });
    },
    handerSearch() {
      this.listPram.page = 1;
      this.handlerGetListData(this.listPram);
    },
    handlerGetListData(pram) {
      this.listLoading = true;
      this.listPram.title = encodeURIComponent(this.title);
      this.listPram.author = encodeURIComponent(this.author);
      articleApi.ListArticle(pram).then((data) => {
        this.listData = data;
        this.listLoading = false;
      });
    },
    handlerOpenEdit(isEdit, editData) {
      // 0=add 1=edit
      if (isEdit === 1) {
        this.editDialogConfig.isEdit = 1;
        this.editDialogConfig.editData = editData;
      } else {
        this.editDialogConfig.isEdit = 0;
      }
      this.editDialogConfig.visible = true;
    },
    handlerHideDialog() {
      this.handlerGetListData(this.listPram);
      this.editDialogConfig.visible = false;
    },
    handlerDelete(rowData) {
      this.$modalSure('删除当前文章', '提示').then((result) => {
        articleApi.DelArticle(rowData.id).then((data) => {
          this.$message.success('删除数据成功');
          this.handlerGetListData(this.listPram);
        });
      });
    },
    handleSizeChange(val) {
      this.listPram.limit = val;
      this.handlerGetListData(this.listPram);
    },
    handleCurrentChange(val) {
      this.listPram.page = val;
      this.handlerGetListData(this.listPram);
    },
    reset() {
      this.author = '';
      this.title = '';
      this.listPram = {
        author: null,
        cid: null,
        page: 1,
        title: '',
        limit: this.$constants.page.limit[0],
      };
      this.handlerGetListData(this.listPram);
    },
  },
};
</script>

<style scoped lang="scss">
.articleModal {
  z-index: 333 !important;
}
</style>
