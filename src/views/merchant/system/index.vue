<template>
  <div class="divBox">
    <el-card
      :bordered="false"
      shadow="never"
      class="ivu-mt"
      :body-style="{ padding: 0 }"
      v-show="showSearch && checkPermi(['platform:merchant:menu:list'])"
    >
      <div class="padding-add">
        <el-form :model="queryParams" ref="queryForm" inline label-position="right" @submit.native.prevent>
          <el-form-item label="菜单名称：">
            <el-input
              v-model.trim="name"
              placeholder="请输入菜单名称"
              clearable
              size="small"
              class="selWidth bottomChange"
            />
          </el-form-item>
          <el-form-item label="菜单类型：" prop="menuType">
            <el-select v-model.trim="queryParams.menuType" placeholder="类型" clearable size="small" class="selWidth">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="handleQuery">查询</el-button>
            <el-button size="small" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card mt14" :body-style="{ padding: '20px' }" shadow="never" :bordered="false">
      <div class="acea-row">
        <el-button type="primary" size="small" @click="handleAdd" v-hasPermi="['platform:merchant:menu:add']"
          >新增</el-button
        >
        <el-button type="info" plain size="mini" @click="toggleExpandAll">展开/折叠</el-button>
      </div>
      <el-table
        v-if="refreshTable"
        v-loading="listLoading"
        :data="menuList"
        row-key="id"
        size="small"
        :default-expand-all="isExpandAll"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        class="mt20"
      >
        <el-table-column prop="name" label="菜单名称" :show-overflow-tooltip="true" min-width="160"></el-table-column>
        <el-table-column prop="icon" label="图标" width="100">
          <template slot-scope="scope">
            <i :class="'el-icon-' + scope.row.icon" style="font-size: 20px" />
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="60"></el-table-column>
        <el-table-column prop="perms" label="权限标识" :show-overflow-tooltip="true" min-width="170"></el-table-column>
        <el-table-column
          prop="component"
          label="组件路径"
          :show-overflow-tooltip="true"
          min-width="170"
        ></el-table-column>
        <el-table-column prop="isShow" label="状态" width="80">
          <template slot-scope="scope">
            <el-tag :type="scope.row.isShow ? '' : 'danger'">{{ scope.row.isShow ? '显示' : '隐藏' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="menuType" label="类型" width="80">
          <template slot-scope="scope">
            <span class="type_tag one" v-if="scope.row.menuType == 'M'">目录</span>
            <span class="type_tag two" v-else-if="scope.row.menuType == 'C'">菜单</span>
            <span class="type_tag three" v-else type="info">按钮</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template slot-scope="scope">
            <a @click="handleUpdate(scope.row)" v-hasPermi="['platform:merchant:menu:update']">修改</a>
            <el-divider direction="vertical"></el-divider>
            <a size="mini" type="text" @click="handleAdd(scope.row)" v-hasPermi="['platform:merchant:menu:add']"
              >新增</a
            >
            <el-divider direction="vertical"></el-divider>
            <a size="mini" type="text" @click="handleDelete(scope.row)" v-hasPermi="['platform:merchant:menu:delete']"
              >删除</a
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加或修改菜单对话框 -->
      <el-dialog :title="title" :visible.sync="open" width="900px" append-to-body :close-on-click-modal="false">
        <el-form ref="form" :model="form" :rules="rules" label-width="95px">
          <el-form-item label="上级菜单：">
            <treeselect
              v-model="form.pid"
              :options="menuOptions"
              :normalizer="normalizer"
              :show-count="true"
              placeholder="选择上级菜单"
            />
          </el-form-item>
          <el-form-item label="菜单类型：" prop="menuType">
            <el-radio-group v-model="form.menuType">
              <el-radio label="M">目录</el-radio>
              <el-radio label="C">菜单</el-radio>
              <el-radio label="A">按钮</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="form.menuType != 'A'" label="菜单图标：">
            <el-form-item>
              <el-input placeholder="请选择菜单图标" v-model.trim="form.icon">
                <el-button slot="append" icon="el-icon-circle-plus-outline" @click="addIcon"></el-button>
              </el-input>
            </el-form-item>
          </el-form-item>
          <el-form-item label="菜单名称：" prop="name">
            <el-input v-model.trim="form.name" placeholder="请输入菜单名称" />
          </el-form-item>
          <el-form-item prop="component" v-if="form.menuType !== 'A'">
            <span slot="label">
              <el-tooltip content="访问的组件路径，如：`system/user/index`，默认在`views`目录下" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>
              组件路径：
            </span>
            <el-input v-model.trim="form.component" placeholder="请输入组件路径" />
          </el-form-item>
          <el-form-item label="显示排序：" prop="sort">
            <el-input-number v-model.trim="form.sort" :min="$constants.NUM_Range.min" :max="$constants.NUM_Range.max" />
          </el-form-item>
          <el-form-item v-if="form.menuType === 'A'">
            <el-input v-model.trim="form.perms" placeholder="请输入权限标识" maxlength="100" />
            <span slot="label">
              <el-tooltip
                content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)"
                placement="top"
              >
                <i class="el-icon-question"></i>
              </el-tooltip>
              权限字符：
            </span>
          </el-form-item>
          <el-form-item class="mb30" v-if="form.menuType != 'A'">
            <span slot="label">
              <el-tooltip content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>
              显示状态：
            </span>
            <el-radio-group v-model="form.isShow">
              <el-radio v-for="item in showStatus" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="submitForm" v-hasPermi="['platform:paid:member:benefits:edit']"
            >保存</el-button
          >
        </span>
      </el-dialog>
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
import { menuMerListApi, menuMerInfo, menuMerUpdate, menuMerAdd, menuMerDelete } from '@/api/merchant';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import { Debounce } from '@/utils/validate';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
export default {
  name: 'Menu',
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      listLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 菜单表格树数据
      menuList: [],
      // 菜单树选项
      menuOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部折叠
      isExpandAll: false,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        name: '',
        menuType: '',
      },
      name: '',
      // 表单参数
      form: {},
      //请求到的menu数据
      menuDataList: [],
      // 表单校验
      rules: {
        name: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
        sort: [{ required: true, message: '菜单顺序不能为空', trigger: 'blur' }],
      },
      statusOptions: [
        { value: 'M', label: '目录' },
        { value: 'C', label: '菜单' },
        { value: 'A', label: '按钮' },
      ],
      showStatus: [
        { label: '显示', value: true },
        { label: '隐藏', value: false },
      ],
    };
  },
  created() {
    if (checkPermi(['platform:merchant:menu:list'])) this.getList();
  },
  methods: {
    checkPermi,
    // 点击图标
    addIcon() {
      const _this = this;
      _this.$modalIcon(function (icon) {
        _this.form.icon = icon;
      });
    },
    /** 查询菜单列表 */
    getList() {
      this.listLoading = true;
      this.queryParams.name = encodeURIComponent(this.name);
      menuMerListApi(this.queryParams).then((res) => {
        let obj = {},
          menuList = [];
        res.forEach((item) => {
          obj = item;
          obj.parentId = item.pid;
          obj.children = [];
          menuList.push(obj);
        });
        this.menuDataList = menuList;
        this.menuList = this.handleTree(menuList, 'menuId');
        this.getTreeselect();
        this.listLoading = false;
      });
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id ? node.id : 0,
        label: node.name ? node.name : '主目录',
        children: node.children,
      };
    },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      this.menuOptions = [];
      const menu = { menuId: 0, menuName: '主类目', children: [] };
      menu.children = this.handleTree(this.menuDataList, 'menuId');
      this.menuOptions.push(menu);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        menuId: '',
        parentId: 0,
        name: '',
        icon: '',
        menuType: 'M',
        sort: 0,
        isShow: true,
        component: '',
        perms: '',
      };
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.name = '';
      this.queryParams = { name: '', menuType: '' };
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      if (row != null && row.id) {
        this.form.pid = row.id;
      } else {
        this.form.pid = 0;
      }
      this.open = true;
      this.title = '添加菜单';
      this.getTreeselect();
    },
    /** 展开/折叠操作 */
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
      });
      this.reset();
      this.getTreeselect();
      menuMerInfo(row.id).then((response) => {
        this.form = response;
        this.open = true;
        this.title = '修改菜单';
        loading.close();
      });
    },
    /** 提交按钮 */
    submitForm: Debounce(function () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            menuMerUpdate(this.form).then((response) => {
              this.$modal.msgSuccess('修改成功');
              this.open = false;
              this.getList();
            });
          } else {
            menuMerAdd(this.form).then((response) => {
              this.$modal.msgSuccess('新增成功');
              this.open = false;
              this.getList();
            });
          }
        }
      });
    }),
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal
        .confirm('是否确认删除名称为"' + row.name + '"的数据项？')
        .then(function () {
          return menuMerDelete(row.id);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess('删除成功');
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang="scss" scoped>
.mb8 {
  margin-bottom: 8px;
}

.type_tag {
  display: inline-block;
  height: 32px;
  padding: 0 10px;
  line-height: 30px;
  font-size: 12px;
  border-radius: 4px;
  box-sizing: border-box;
  white-space: nowrap;
}

.two {
  background: rgba(239, 156, 32, 0.1);
  color: rgba(239, 156, 32, 1);
}

.one {
  background: rgba(75, 202, 213, 0.1);
  color: rgba(75, 202, 213, 1);
}

.three {
  color: rgba(120, 128, 160, 1);
  background: rgba(120, 128, 160, 0.1);
}

::v-deep.bottomChange {
  margin-bottom: 0 !important;
}

.el-form-item__content {
  .el-form-item.el-form-item--small {
    margin-bottom: 0 !important;
  }
}

::v-deep .vue-treeselect__control:hover {
  border-color: var(--prev-color-primary);
}

::v-deep .vue-treeselect__x-container:hover {
  color: var(--prev-color-primary);
}

::v-deep .vue-treeselect__option--selected {
  color: var(--prev-color-primary);
}

::v-deep .vue-treeselect--focused:not(.vue-treeselect--open) .vue-treeselect__control {
  border-color: var(--prev-color-primary);
}

::v-deep .vue-treeselect:not(.vue-treeselect--disabled):not(.vue-treeselect--focused) .vue-treeselect__control:focus {
  border-color: var(--prev-color-primary);
}
</style>
