<template>
  <el-dialog
    v-if="dialogVisible"
    :title="dataForm.id ? `编辑积分区间` : `添加积分区间`"
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
      <el-form-item label="区间名称：" prop="name">
        <el-input v-model.trim="dataForm.name" maxlength="16" placeholder="请输入区间名称" />
        <div class="from-tips">区间名称用于用户端的积分筛选标签展示</div>
      </el-form-item>
      <div>
        <div class="app-container home flex">
          <el-form-item label="区间范围：" prop="minNum">
            <el-input-number
              v-model.trim="dataForm.minNum"
              :min="0"
              :max="999998"
              :step="1"
              step-strictly
            ></el-input-number>
          </el-form-item>
          <div class="symbol">一</div>
          <el-form-item prop="maxNum" label-width="0">
            <el-input-number
              v-model.trim="dataForm.maxNum"
              :min="1"
              :max="999999"
              :step="1"
              step-strictly
            ></el-input-number>
          </el-form-item>
        </div>
        <div class="from-tips symbol-tips">用户端点击对应的区间名称会根据此积分范围筛选展示</div>
      </div>

      <el-form-item label="排序：" prop="sort">
        <el-input-number v-model.trim="dataForm.sort" :min="0" :max="99" :step="1" step-strictly></el-input-number>
        <div class="from-tips">请输入0~99的数字，数字越大越靠前</div>
      </el-form-item>
      <el-form-item label="区间状态：">
        <el-switch
          v-model="dataForm.status"
          active-text="显示"
          inactive-text="隐藏"
          :active-value="true"
          :inactive-value="false"
        />
        <div class="from-tips">关闭之后，此区间在用户端不展示</div>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="handleClose('dataForm')">取消</el-button>
      <el-button
        type="primary"
        v-hasPermi="['platform:integral:interval:save', 'platform:integral:interval:update']"
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
import { mapGetters } from 'vuex';
const defaultObj = {
  id: 0,
  name: '',
  sort: 0,
  status: true,
  value: '',
};
import { intervalSaveApi, intervalUpdateApi } from '@/api/pointsMall';
export default {
  name: 'creatSection',
  props: {
    editData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      loadingFrom: false,
      rules: {
        name: [{ required: true, message: '请输入区间名称', trigger: 'blur' }],
        minNum: [
          { required: true, message: '必填项，请维护', trigger: 'blur' },
          { validator: this.validateCom, trigger: 'blur' },
          { validator: this.validateMin, trigger: 'blur' },
        ],
        maxNum: [
          { required: true, message: '必填项，请维护', trigger: 'blur' },
          { validator: this.validateCom, trigger: 'blur' },
          { validator: this.validateMax, trigger: 'blur' },
        ],
      },
      dataForm: { ...this.editData },
      minNum: 0, //最小值
      maxNum: 999999, //最大值
    };
  },
  watch: {
    editData: {
      handler: function (val) {
        this.dataForm = {
          ...val,
          sort: val.sort ? val.sort : 0,
          minNum: val.value ? val.value.split('-')[0] : '',
          maxNum: val.value ? val.value.split('-')[1] : '',
        };
      },
      deep: true,
    },
  },
  methods: {
    // 基础判断：1、输入值符合 0<num<100,且为正整数的规则
    validateCom(rule, value, callback) {
      const num = Number(value);
      if (Number.isInteger(num)) {
        if (num < this.minNum) {
          return callback(new Error('输入值必须大于0'));
        } else if (num > this.maxNum) {
          return callback(new Error('输入值必须小于999999'));
        }
        return callback();
      }
      return callback(new Error('输入值必须为正整数'));
    },
    // 最小值判断：不得大于最大值
    validateMin(rule, value, callback) {
      const num = Number(value);
      const max = Number(this.dataForm.maxNum);
      if (!max || num < max) {
        return callback();
      }
      return callback(new Error('输入值不得大于最大值'));
    },
    // 最小值判断：不得小于最小值
    validateMax(rule, value, callback) {
      const num = Number(value);
      const min = Number(this.dataForm.minNum);
      if (!min || num > min) {
        return callback();
      }
      return callback(new Error('输入值不得小于最小值'));
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
    },
    onsubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.dataForm.value = `${this.dataForm.minNum}-${this.dataForm.maxNum}`;
          !this.dataForm.id
            ? intervalSaveApi(this.dataForm)
                .then((res) => {
                  this.$message.success('操作成功');
                  this.onClose();
                })
                .catch(() => {
                  this.loading = false;
                })
            : intervalUpdateApi(this.dataForm)
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
.symbol-tips {
  margin-left: 75px;
  margin-top: -6px;
  margin-bottom: 21px;
}
.symbol {
  width: 100px;
  line-height: 31px;
  text-align: center;
}
.lang {
  width: 100%;

  ::v-deep.el-form-item__content {
    width: 79%;
  }
}
</style>
