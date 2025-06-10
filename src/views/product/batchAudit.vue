<template>
  <el-dialog
    v-if="dialogVisible"
    title="商品审核"
    :visible.sync="dialogVisible"
    :append-to-body="isAppend"
    width="540px"
    :before-close="handleClose"
    class="projectInfo"
  >
    <el-form ref="formData" :model="formData" :rules="rules" label-width="80px" class="demo-formData">
      <el-form-item label="审核状态" prop="auditStatus">
        <el-radio-group v-model="formData.auditStatus">
          <el-radio label="success">通过</el-radio>
          <el-radio label="fail">拒绝</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="formData.auditStatus === 'fail'" label="原因" prop="reason">
        <el-input v-model="formData.reason" type="textarea" placeholder="请输入原因" />
      </el-form-item>
      <el-form-item>
        <div class="dialog-footer-inner">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm('formData')">提交</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script setup>
import Debounce from '@/libs/debounce';
import { productBatchAuditApi, productBatchVirtualSalesApi } from '@/api/product';

export default {
  name: 'batchAudit',
  props: {
    idList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      formData: {
        reason: '',
        auditStatus: 'success',
        idList: [],
      },
      dialogVisible: false,
      rules: {
        auditStatus: [{ required: true, message: '请选择审核状态', trigger: 'change' }],
        reason: [{ required: true, message: '请填写拒绝原因', trigger: 'blur' }],
      },
      isAppend: true,
    };
  },
  methods: {
    handleClose() {
      this.dialogVisible = false;
      this.formData = {
        reason: '',
        auditStatus: 'success',
        idList: [],
      };
    },
    /** 提交按钮 */
    submitForm: Debounce(function (formData) {
      this.$refs[formData].validate((valid) => {
        if (valid) {
          this.formData.idList = this.idList;
          productBatchAuditApi(this.formData).then((response) => {
            this.$modal.msgSuccess('操作成功');
            this.handleClose();
            this.$emit('subBatchAuditSuccess');
          });
        }
      });
    }),
  },
};
</script>
<style scoped lang="scss"></style>
