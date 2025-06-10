<template>
  <div>
    <template>
      <div class="divBox">
        <el-card class="box-card" :bordered="false" shadow="never">
          <div
            class="clearfix acea-row"
            v-hasPermi="['platform:product:category:add', 'platform:article:category:add']"
          >
            <el-button size="mini" type="primary" @click="handleAddMenu({ id: 0, name: '顶层目录' })"
              >新增{{ biztype.name }}
            </el-button>
            <el-alert
              v-show="biztype.value === 1"
              class="w100 mt20"
              title="平台分类必须要设置三级分类"
              type="warning"
              effect="light"
            >
            </el-alert>
          </div>
          <el-table
            ref="treeList"
            :data="dataList"
            size="mini"
            class="table mt20"
            highlight-current-row
            row-key="id"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          >
            <el-table-column v-if="biztype.value === 1" prop="name" label="名称" min-width="200">
              <template slot-scope="scope"> {{ scope.row.name }} | {{ scope.row.id }}</template>
            </el-table-column>
            <el-table-column v-else prop="name" label="名称" min-width="120">
              <template slot-scope="scope"> {{ scope.row.name }} | {{ scope.row.id }}</template>
            </el-table-column>
            <template v-if="!selectModel">
              <el-table-column label="分类图标" min-width="120">
                <template slot-scope="scope">
                  <div class="demo-image__preview line-heightOne">
                    <el-image :src="scope.row.icon" :preview-src-list="[scope.row.icon]" v-if="scope.row.icon" />
                    <img v-else :src="defaultImg" alt="" />
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="Url" min-width="250" v-if="biztype.value === 5" key="2">
                <template slot-scope="scope">
                  <span>{{ scope.row.url }}</span>
                </template>
              </el-table-column>
              <el-table-column label="排序" prop="sort" min-width="120" />
              <el-table-column label="状态" min-width="80" fixed="right" v-if="biztype.value === 2">
                <template slot-scope="scope">
                  <el-switch
                    v-if="checkPermi(['platform:article:category:switch'])"
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
              <el-table-column label="状态" min-width="120" fixed="right" v-if="biztype.value === 1">
                <template slot-scope="scope">
                  <el-switch
                    v-if="checkPermi(['platform:product:category:show:status'])"
                    v-model="scope.row.isShow"
                    :active-value="true"
                    :inactive-value="false"
                    active-text="显示"
                    inactive-text="隐藏"
                    @change="onchangeIsShow(scope.row)"
                  />
                  <div v-else>{{ scope.row.isShow ? '显示' : '隐藏' }}</div>
                </template>
              </el-table-column>
              <el-table-column label="操作" :width="biztype.value === 1 ? 180 : 110" fixed="right">
                <template slot-scope="scope">
                  <template
                    v-if="
                      biztype.value === 1 &&
                      scope.row.level < 3 &&
                      checkPermi(['platform:product:category:add', 'platform:article:category:add'])
                    "
                  >
                    <a @click="handleAddMenu(scope.row)">添加子目录 </a>
                    <el-divider direction="vertical"></el-divider>
                  </template>
                  <a
                    @click="handleEditMenu(scope.row)"
                    v-hasPermi="['platform:product:category:update', 'platform:article:category:update']"
                    >编辑
                  </a>
                  <el-divider direction="vertical"></el-divider>
                  <a
                    @click="handleDelete(scope.row)"
                    v-hasPermi="['platform:product:category:delete', 'platform:article:category:delete']"
                    >删除
                  </a>
                </template>
              </el-table-column>
            </template>
          </el-table>
        </el-card>
      </div>
    </template>
    <el-dialog
      :title="editDialogConfig.isCreate === 0 ? `创建${biztype.name}` : `编辑${biztype.name}`"
      :visible.sync="editDialogConfig.visible"
      destroy-on-close
      :close-on-click-modal="false"
      width="540px"
      class="dialog-bottom"
    >
      <edit
        v-if="editDialogConfig.visible"
        :prent="editDialogConfig.prent"
        :is-create="editDialogConfig.isCreate"
        :edit-data="editDialogConfig.data"
        :biztype="editDialogConfig.biztype"
        :all-tree-list="dataList"
        @hideEditDialog="hideEditDialog"
      />
    </el-dialog>
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
import * as articleApi from '@/api/article.js';
import * as storeApi from '@/api/product.js';
import info from './info';
import edit from './edit';
import * as selfUtil from '@/utils/ZBKJIutil.js';
import { checkPermi, checkRole } from '@/utils/permission';

export default {
  // name: "list"
  components: { info, edit },
  props: {
    biztype: {
      // 类型，1 产品分类，2 文章分类
      type: Object,
      default: { value: -1 },
      validator: (obj) => {
        return obj.value > 0;
      },
    },
    pid: {
      type: Number,
      default: 0,
      validator: (value) => {
        return value >= 0;
      },
    },
    selectModel: {
      // 是否选择模式
      type: Boolean,
      default: false,
    },
    selectModelKeys: {
      type: Array,
    },
    rowSelect: {},
  },
  data() {
    return {
      selectModelKeysNew: this.selectModelKeys,
      loading: false,
      constants: this.$constants,
      treeProps: {
        label: 'name',
        children: 'child',
        // expandTrigger: 'hover',
        // checkStrictly: false,
        // emitPath: false
      },
      // treeCheckedKeys:[],// 选择模式下的属性结构默认选中
      multipleSelection: [],
      editDialogConfig: {
        visible: false,
        isCreate: 0, // 0=创建，1=编辑
        prent: {}, // 父级对象
        data: {},
        biztype: this.biztype, // 统一主业务中的目录类型
      },
      dataList: [],
      listPram: {
        pid: this.pid,
        type: this.biztype.value,
        status: -1,
        name: '',
        page: this.$constants.page.page,
        limit: this.$constants.page.limit[0],
      },
      viewInfoConfig: {
        data: null,
        visible: false,
      },
      defaultImg: require('@/assets/imgs/moren.jpg'),
    };
  },
  mounted() {
    if (this.biztype.value === 2) {
      if (checkPermi(['platform:article:category:list'])) this.handlerGetList();
    } else {
      if (checkPermi(['platform:product:page:list'])) this.handlerGetTreeList();
    }
  },
  methods: {
    checkPermi, //权限控制
    onchangeIsShow(row) {
      if (this.biztype.value === 2) {
        articleApi
          .articleCategorySwitchApi(row.id)
          .then(() => {
            this.$message.success('修改成功');
            localStorage.removeItem('articleClass');
            this.handlerGetList();
          })
          .catch(() => {
            row.status = !row.status;
          });
      } else {
        storeApi
          .productCategoryShowApi(row.id)
          .then(() => {
            this.$message.success('修改成功');
            this.$store.commit('product/SET_AdminProductClassify', []);
            this.handlerGetTreeList();
          })
          .catch(() => {
            row.isShow = !row.isShow;
          });
      }
    },
    handleEditMenu(rowData) {
      this.editDialogConfig.isCreate = 1;
      this.editDialogConfig.data = rowData;
      this.editDialogConfig.prent = rowData;
      this.editDialogConfig.visible = true;
    },
    handleAddMenu(rowData) {
      this.editDialogConfig.isCreate = 0;
      this.editDialogConfig.prent = rowData;
      this.editDialogConfig.data = {};
      this.editDialogConfig.biztype = this.biztype;
      this.editDialogConfig.visible = true;
    },
    getCurrentNode(data) {
      let node = this.$refs.tree.getNode(data);
      this.childNodes(node);
      // this.parentNodes(node);
      //是否编辑的表示
      // this.ruleForm.isEditorFlag = true;
      //编辑时候使用
      this.$emit('rulesSelect', this.$refs.tree.getCheckedKeys());
      // this.selectModelKeys = this.$refs.tree.getCheckedKeys();
      //无论编辑和新增点击了就传到后台这个值
      // this.$emit('rulesSelect', this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys()));
      // this.ruleForm.menuIdsisEditor = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys());
    },
    //具体方法可以看element官网api
    childNodes(node) {
      let len = node.childNodes.length;
      for (let i = 0; i < len; i++) {
        node.childNodes[i].checked = node.checked;
        this.childNodes(node.childNodes[i]);
      }
    },
    parentNodes(node) {
      if (node.parent) {
        for (let key in node) {
          if (key == 'parent') {
            node[key].checked = true;
            this.parentNodes(node[key]);
          }
        }
      }
    },
    handleDelete(rowData) {
      this.$modalSure(this.biztype.value === 2 ? '删除当前数据?' : '删除品类吗？该品类优惠券将同步删除。').then(() => {
        if (this.biztype.value === 2) {
          articleApi.articleCategoryDelApi(rowData).then((data) => {
            this.handlerGetList();
            localStorage.removeItem('articleClass');
            this.$message.success('删除成功');
          });
        } else {
          storeApi.productCategoryDeleteApi(rowData.id).then((data) => {
            this.handlerGetTreeList();
            this.$message.success('删除成功');
          });
        }
      });
    },
    handlerGetList() {
      articleApi.articleCategoryListApi().then((data) => {
        this.dataList = data;
        let list = data.filter((item) => {
          return item.status;
        });
        localStorage.setItem('articleClass', JSON.stringify(list));
      });
    },
    handlerGetTreeList() {
      storeApi
        .productCategoryListApi()
        .then((res) => {
          let obj = {},
            dataList = [];
          res.forEach((item) => {
            obj = item;
            obj.parentId = item.pid;
            obj.children = [];
            dataList.push(obj);
          });
          this.dataList = this.handleTree(dataList, 'menuId');
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handlerGetInfo(id) {
      this.viewInfoConfig.data = id;
      this.viewInfoConfig.visible = true;
    },
    handleNodeClick(data) {},
    handleAddArrt(treeData) {
      const _result = selfUtil.addTreeListLabel(treeData);
      return _result;
    },
    hideEditDialog() {
      setTimeout(() => {
        this.editDialogConfig.prent = {};
        this.editDialogConfig.type = 0;
        this.editDialogConfig.visible = false;
        if (this.biztype.value === 2) {
          this.handlerGetList();
        } else {
          this.handlerGetTreeList();
        }
      }, 200);
    },
    handleSelectionChange(d1, { checkedNodes, checkedKeys, halfCheckedNodes, halfCheckedKeys }) {
      // this.multipleSelection =  checkedKeys.concat(halfCheckedKeys)
      this.multipleSelection = checkedKeys;
      this.$emit('rulesSelect', this.multipleSelection);
    },
  },
};
</script>

<style scoped lang="scss">
.alert_title {
  margin-left: 20px;
  width: 240px;
}
</style>
