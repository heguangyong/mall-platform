<template>
  <div>
    <el-form ref="editPram" :model="editPram" label-width="80px">
      <el-form-item
        label="分类名称："
        prop="name"
        :rules="[{ required: true, message: '请输入分类名称', trigger: ['blur', 'change'] }]"
      >
        <el-input v-model.trim="editPram.name" :maxlength="biztype.value === 1 ? 8 : 20" placeholder="分类名称" />
      </el-form-item>
      <el-form-item label="父级：" v-if="biztype.value !== 2">
        <el-cascader
          v-model="editPram.pid"
          :disabled="isCreate === 1"
          :options="allTreeList"
          filterable
          :props="categoryProps"
          style="width: 100%"
          ref="cascader"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item label="分类图标：">
        <div class="upLoadPicBox" @click="modalPicTap(false)">
          <div v-if="editPram.icon" class="pictrue">
            <img :src="editPram.icon" />
          </div>
          <div v-else class="upLoad">
            <i class="el-icon-camera cameraIconfont" />
          </div>
          <div class="from-tips">建议尺寸(180*180)</div>
        </div>
      </el-form-item>
      <el-form-item class="mb30" label="排序：">
        <el-input-number v-model.trim="editPram.sort" :min="0" />
      </el-form-item>
      <el-form-item label="扩展字段" v-if="biztype.value !== 1 && biztype.value !== 3 && biztype.value !== 5">
        <el-input v-model.trim="editPram.extra" type="textarea" placeholder="扩展字段" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer-inner">
      <el-button @click="close">取消</el-button>
      <el-button
        type="primary"
        :loading="loadingBtn"
        v-debounceClick="
          () => {
            handlerSubmit('editPram');
          }
        "
        v-hasPermi="[
          'platform:product:category:add',
          'platform:product:category:update',
          'platform:category:update',
          'platform:category:save',
        ]"
        >确定</el-button
      >
    </div>
  </div>
</template>
<!--创建和编辑公用一个组件-->
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
export default {
  // name: "edit"
  props: {
    prent: {
      type: Object,
      required: true,
    },
    isCreate: {
      type: Number,
      default: 0,
    },
    editData: {
      type: Object,
    },
    biztype: {
      type: Object,
      required: true,
    },
    allTreeList: {
      type: Array,
    },
  },
  data() {
    return {
      loadingBtn: false,
      constants: this.$constants,
      editPram: {
        icon: null,
        name: null,
        pid: null,
        sort: 0,
        // status: true,
        type: this.biztype.value,
        url: null,
        id: 0,
      },
      categoryProps: {
        value: 'id',
        label: 'name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true,
        emitPath: false,
      },
      parentOptions: [],
    };
  },
  mounted() {
    this.initEditData();
  },
  methods: {
    handleChange() {
      this.prent.level = this.$refs['cascader'].getCheckedNodes()[0].level;
    },
    // 点击图标
    addIcon() {
      const _this = this;
      _this.$modalIcon(function (icon) {
        _this.editPram.icon = icon;
      });
    },
    // 点击商品图
    modalPicTap(multiple) {
      const _this = this;
      const attr = [];
      this.$modalUpload(
        function (img) {
          if (!img) return;
          _this.editPram.icon = img[0].sattDir;
        },
        multiple,
        'store',
      );
    },
    close() {
      this.$emit('hideEditDialog');
    },
    initEditData() {
      this.parentOptions = [...this.allTreeList];
      this.addTreeListLabelForCasCard(this.parentOptions, 'child');
      const { icon, name, pid, sort, type, id, url, level } = this.editData;
      if (this.isCreate === 1) {
        this.editPram.icon = icon;
        this.editPram.name = name;
        this.editPram.pid = pid;
        this.editPram.sort = sort;
        this.editPram.type = type;
        this.editPram.url = url;
        this.editPram.id = id;
        this.editPram.level = level;
      } else {
        this.editPram.pid = this.prent.id;
        this.editPram.type = this.biztype.value;
        this.editPram.level = parseInt(this.prent.level) + 1;
      }
    },
    addTreeListLabelForCasCard(arr, child) {
      arr.forEach((item) => {
        this.treeListCheckLevelLT3ForDisabled(item.children);
      });
    },
    treeListCheckLevelLT3ForDisabled(children) {
      if (!children) return;
      children.forEach((j) => {
        if (j.level >= 3) {
          j.disabled = true;
        } else this.treeListCheckLevelLT3ForDisabled(j.children);
      });
    },
    handlerSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return;
        this.handlerSaveOrUpdate(this.isCreate === 0);
      });
    },
    handlerSaveOrUpdate(isSave) {
      if (isSave) {
        // this.editPram.pid = this.prent.id
        this.loadingBtn = true;
        if (this.biztype.value !== 2) {
          if (this.editPram.pid === 0) this.editPram.level = 1;
          if (!this.editPram.level) this.editPram.level = parseInt(this.prent.level) + 1;
          storeApi
            .productCategoryAddApi(this.editPram)
            .then((data) => {
              this.$emit('hideEditDialog');
              this.$message.success('创建目录成功');
              this.$store.commit('product/SET_AdminProductClassify', []);
              this.loadingBtn = false;
            })
            .catch(() => {
              this.loadingBtn = false;
            });
        } else {
          articleApi
            .articleCategoryAddApi(this.editPram)
            .then((data) => {
              this.$emit('hideEditDialog');
              this.$message.success('创建目录成功');
              localStorage.removeItem('articleClass');
              this.loadingBtn = false;
            })
            .catch(() => {
              this.loadingBtn = false;
            });
        }
      } else {
        this.loadingBtn = true;
        if (this.biztype.value !== 2) {
          if (this.editPram.pid === this.editData.id) return this.$message.warning('父级不能选当前分类');
          storeApi
            .productCategoryUpdateApi(this.editPram)
            .then((data) => {
              this.$emit('hideEditDialog');
              this.$message.success('更新目录成功');
              this.$store.commit('product/SET_AdminProductClassify', []);
              this.loadingBtn = false;
            })
            .catch(() => {
              this.loadingBtn = false;
            });
        } else {
          this.editPram.pid = Array.isArray(this.editPram.pid) ? this.editPram.pid[0] : this.editPram.pid;
          articleApi
            .articleCategoryUpdateApi(this.editPram)
            .then((data) => {
              this.$emit('hideEditDialog');
              this.$message.success('更新目录成功');
              localStorage.removeItem('articleClass');
              this.loadingBtn = false;
            })
            .catch(() => {
              this.loadingBtn = false;
            });
        }
      }
    },
  },
};
</script>

<style scoped lang="scss"></style>
