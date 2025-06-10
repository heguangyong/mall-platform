<template>
  <div class="divBox">
    <el-card class="box-card" shadow="never" :bordered="false">
      <el-form inline v-hasPermi="['platform:category:save']">
        <el-form-item>
          <el-button size="mini" type="primary" @click="handlerOpenAdd({ id: 0, name: '顶层目录' })"
            >添加分类</el-button
          >
        </el-form-item>
      </el-form>
      <el-alert
        title="温馨提示"
        type="warning"
        effect="light"
        description="添加一级分类以后，务必添加二级分类并配置表单，否则会出现渲染错误"
      >
      </el-alert>
      <el-table
        ref="treeList"
        :data="treeList"
        style="width: 100%"
        row-key="id"
        size="small"
        class="table mt20"
        highlight-current-row
        :tree-props="{ children: 'child', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="name" label="分类昵称" min-width="300">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="英文名称" show-overflow-tooltip min-width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.url }}</span>
          </template>
        </el-table-column>
        <el-table-column label="已关联的表单" show-overflow-tooltip min-width="130">
          <template slot-scope="scope">
            <span>{{ scope.row.extra }}</span>
          </template>
        </el-table-column>
        <el-table-column label="启用状态" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.status | filterYesOrNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template slot-scope="scope">
            <template v-if="scope.row.pid === 0 && checkPermi(['platform:category:save'])">
              <a @click="handlerOpenAdd(scope.row)">添加子目录</a>
              <el-divider direction="vertical"></el-divider>
            </template>
            <a v-hasPermi="['platform:category:update']" @click="handleEditMenu(scope.row)">编辑</a>
            <el-divider direction="vertical"></el-divider>
            <a v-hasPermi="['platform:category:list']" @click="handlerOpenFormConfig(scope.row)">配置列表</a>
            <el-divider direction="vertical"></el-divider>
            <a v-hasPermi="['platform:category:delete']" @click="handleDelMenu(scope.row)">删除</a>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      :title="editDialogConfig.isCreate === 0 ? '添加分类' : '编辑分类'"
      :visible.sync="editDialogConfig.visible"
      destroy-on-close
      :close-on-click-modal="false"
      width="700"
      class="dialog-bottom"
    >
      <edit
        v-if="editDialogConfig.visible"
        :prent="editDialogConfig.prent"
        :is-create="editDialogConfig.isCreate"
        :edit-data="editDialogConfig.data"
        :biztype="editDialogConfig.biztype"
        :all-tree-list="treeList"
        @hideEditDialog="hideEditDialog"
      />
    </el-dialog>
    <el-dialog title="选择已配置的表单" :visible.sync="configFormSelectedDialog.visible" width="800px">
      <span class="color-red">注意：表单不能重复关联</span>
      <form-config-list
        v-if="configFormSelectedDialog.visible"
        select-model
        @selectedRowData="handlerSelectedRowData"
      />
      <el-form>
        <el-form-item v-hasPermi="['platform:category:update']">
          <el-button type="primary" style="width: 100%" @click="handlerAddFormExtra">关联</el-button>
        </el-form-item>
      </el-form>
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
import * as categoryApi from '@/api/categoryApi.js';
import edit from '@/views/maintain/devconfig/configCategotyEdit.vue';
import * as selfUtil from '@/utils/ZBKJIutil.js';
import configList from './configList';
import formConfigList from '@/views/maintain/formConfig';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
export default {
  // name: "configCategroy"
  components: { edit, configList, formConfigList },
  props: {},
  data() {
    return {
      constants: this.$constants,
      searchPram: {
        status: null,
        type: null,
      },
      editDialogConfig: {
        visible: false,
        isCreate: 0, // 0=创建，1=编辑
        prent: {}, // 父级对象
        data: {},
      },
      treeList: [],
      listPram: {
        pid: 0,
        type: this.$constants.categoryType[5].value,
        status: null,
        name: null,
        page: this.$constants.page.page,
        limit: this.$constants.page.limit[1],
      },
      configFormSelectedDialog: {
        visible: false,
        currentData: {},
      },
    };
  },
  mounted() {
    if (checkPermi(['platform:category:list:tree'])) this.handlerGetTreeList();
  },
  methods: {
    checkPermi,
    handlerOpenFormConfig(rowData) {
      this.configFormSelectedDialog.currentData = rowData;
      this.configFormSelectedDialog.visible = true;
    },
    handlerOpenAdd(rowData) {
      this.editDialogConfig.isCreate = 0;
      this.editDialogConfig.prent = rowData;
      this.editDialogConfig.data = {};
      this.editDialogConfig.biztype = this.biztype;
      this.editDialogConfig.visible = true;
    },
    handleEditMenu(rowData) {
      this.editDialogConfig.isCreate = 1;
      this.editDialogConfig.data = rowData;
      this.editDialogConfig.prent = rowData;
      this.editDialogConfig.visible = true;
    },
    handleDelMenu(rowData) {
      this.$modalSure('删除当前数据吗').then(() => {
        categoryApi.deleteCategroy(rowData.id).then((data) => {
          this.handlerGetTreeList();
          this.$message.success('删除成功');
        });
      });
    },
    hideEditDialog() {
      setTimeout(() => {
        this.editDialogConfig.prent = {};
        this.editDialogConfig.type = 0;
        this.editDialogConfig.visible = false;
        this.handlerGetTreeList();
      }, 200);
    },
    handlerGetTreeList() {
      // status: this.selectModel?1:-1
      const _pram = { type: this.constants.categoryType[5].value, status: -1 };
      categoryApi.treeCategroy(_pram).then((data) => {
        this.treeList = this.handleAddArrt(data);
      });
    },
    handleAddArrt(treeData) {
      // let _result = this.addTreeListLabel(treeData)
      const _result = selfUtil.addTreeListLabel(treeData);
      return _result;
    },
    handlerSelectedRowData(rowData) {
      this.configFormSelectedDialog.currentData.extra = rowData.name;
    },
    handlerAddFormExtra() {
      categoryApi.updateCategroy(this.configFormSelectedDialog.currentData).then((data) => {
        this.$message.success('关联表单成功');
        setTimeout(() => {
          this.configFormSelectedDialog.visible = false;
          this.handlerGetTreeList();
        }, 800);
      });
    },
  },
};
</script>

<style scoped></style>
