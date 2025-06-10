<template>
  <el-dialog
    :close-on-click-modal="false"
    title="赠送会员"
    :visible.sync="dialogVisibleMember"
    width="540px"
    :before-close="handleResetForm"
  >
    <el-form
      ref="formValidate"
      class="formValidate"
      :model="formValidate"
      :rules="rules"
      @submit.native.prevent
      label-width="80px"
    >
      <el-form-item label="会员卡：" required prop="cardId">
        <el-select
          v-model="formValidate.cardId"
          placeholder="请选择系统会员卡"
          filterable
          clearable
          style="width: 100%"
        >
          <el-option v-for="item in tableDataMember" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <div class="from-tips">平台赠送的会员卡，不进行会员卡设置的余额赠送</div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleResetForm">取 消</el-button>
      <el-button type="primary" @click="handleSure" :loading="loadingBtn">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { giftPaidMemberApi } from '@/api/user';

export default {
  props: {
    tableDataMember: {
      formData: {
        type: Array,
        required: [],
      },
    },
    dialogVisibleMember: {
      formData: {
        type: Boolean,
        required: false,
      },
    },
    checkedIds: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      dialogVisible: false,
      formValidate: {
        cardId: null,
        ids: '',
      },
      loadingBtn: false,
      rules: {
        cardId: [{ required: true, message: '请选择系统会员卡', trigger: 'change' }],
      },
    };
  },
  mounted() {
    this.formValidate.ids = this.checkedIds;
  },
  methods: {
    //取消
    handleResetForm() {
      this.$emit('handlerSuccessClose');
      this.$refs.formValidate.resetFields();
    },
    // 提交
    handleSure() {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          this.formValidate.ids;
          giftPaidMemberApi(this.formValidate)
            .then(async (res) => {
              this.$message.success('赠送成功');
              this.$emit('handlerSuccessSubmit');
              this.loadingBtn = false;
            })
            .catch((res) => {
              this.loadingBtn = false;
            });
        }
      });
    },
  },
};
</script>
<style scoped lang="scss"></style>
