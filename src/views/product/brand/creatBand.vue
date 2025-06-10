<template>
  <el-dialog
    v-if="dialogVisible"
    title="品牌"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    :closeOnClickModal="false"
    width="540px"
  >
    <el-form
      ref="dataForm"
      :model="dataForm"
      label-width="75px"
      v-if="dialogVisible"
      :rules="rules"
      v-loading="loadingFrom"
    >
      <el-form-item label="品牌名称：" prop="name">
        <el-input v-model.trim="dataForm.name" placeholder="请输入品牌名称" />
      </el-form-item>
      <el-form-item label="商品分类：" prop="categoryIdData">
        <el-cascader
          ref="cascader"
          v-model="dataForm.categoryIdData"
          :options="merPlatProductClassify"
          :props="categoryProps"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="品牌图标：">
        <div class="upLoadPicBox" @click="modalPicTap(false)">
          <div v-if="dataForm.icon" class="pictrue">
            <img :src="dataForm.icon" />
          </div>
          <div v-else class="upLoad">
            <i class="el-icon-camera cameraIconfont" />
          </div>
          <div class="from-tips">建议尺寸(90*36)</div>
        </div>
      </el-form-item>
      <el-form-item label="排序：" prop="sort">
        <el-input-number
          v-model.trim="dataForm.sort"
          :min="$constants.NUM_Range.min"
          :max="$constants.NUM_Range.max"
        ></el-input-number>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="handleClose('dataForm')">取消</el-button>
      <el-button
        type="primary"
        v-hasPermi="['platform:product:brand:add', 'platform:product:brand:update']"
        :loading="loading"
        @click="onsubmit('dataForm')"
        >保存</el-button
      >
    </span>
  </el-dialog>
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
import * as storeApi from '@/api/product';
import { mapGetters } from 'vuex';
export default {
  name: 'creatClassify',
  props: {
    editData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  computed: {
    ...mapGetters(['merPlatProductClassify']),
  },
  data() {
    return {
      categoryProps: {
        value: 'id',
        label: 'name',
        children: 'childList',
        expandTrigger: 'hover',
        checkStrictly: false,
        emitPath: false,
        multiple: true,
      },
      dialogVisible: false,
      treeList: [],
      loading: false,
      loadingFrom: false,
      rules: {
        name: [{ required: true, message: '请输入品牌名称', trigger: 'blur' }],
        categoryIdData: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
      },
      dataForm: { ...this.editData },
    };
  },
  watch: {
    editData: {
      handler: function (val) {
        if (val.categoryIds) val.categoryIdData = val.categoryIds.split(',');
        val.sort = val.sort ? val.sort : 0;
        val.icon = val.icon ? val.icon : '';
        this.dataForm = { ...val };
      },
      deep: true,
    },
  },
  methods: {
    // 点击商品图
    modalPicTap(multiple) {
      const _this = this;
      this.$modalUpload(
        function (img) {
          if (!img) return;
          _this.dataForm.icon = img[0].sattDir;
        },
        multiple,
        'product',
      );
    },
    handleClose() {
      this.$refs['dataForm'].resetFields();
      this.$nextTick(() => {
        this.dialogVisible = false;
      });
    },
    onClose() {
      this.$refs['dataForm'].resetFields();
      this.$nextTick(() => {
        this.dialogVisible = false;
      });
      this.loading = false;
      this.$emit('getList');
      localStorage.removeItem('productBrand');
    },
    onsubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.dataForm.categoryIds = this.dataForm.categoryIdData.toString();
          !this.dataForm.id
            ? storeApi
                .brandAddApi(this.dataForm)
                .then((res) => {
                  this.$message.success('操作成功');
                  this.onClose();
                })
                .catch(() => {
                  this.loading = false;
                })
            : storeApi
                .brandUpdateApi(this.dataForm)
                .then((res) => {
                  this.$message.success('操作成功');
                  this.onClose();
                })
                .catch(() => {
                  this.loading = false;
                });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.lang {
  width: 100%;

  ::v-deep.el-form-item__content {
    width: 79%;
  }
}
</style>
