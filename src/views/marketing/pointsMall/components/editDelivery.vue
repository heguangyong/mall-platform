<template>
  <el-dialog
    title="修改配送信息"
    :visible.sync="dvisible"
    width="540px"
    :before-close="handleClose"
    class="dialog-bottom"
  >
    <el-form ref="formItem" :model="formItem" label-width="75px" @submit.native.prevent :rules="rules">
      <SendFrom :formItem="formItem" :isShowBtn="false" v-if="dvisible"></SendFrom>
    </el-form>
    <div slot="footer">
      <el-button
        :loading="loadingBtn"
        size="smalll"
        type="primary"
        @click="handleSubmit('formItem')"
        v-hasPermi="['platform:integral:order:invoice:update']"
        >提交</el-button
      >
      <el-button size="mini" @click="handleClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Debounce } from '@/utils/validate';
import { orderInvoiceUpdateApi } from '@/api/pointsMall';
import { postRules } from '../default';
import SendFrom from './sendFrom';

export default {
  name: 'editDelivery',
  props: {
    visible: {
      type: Boolean,
      required: false,
    },
    editData: {
      type: Object,
      required: null,
    },
  },
  components: { SendFrom },
  data() {
    return {
      formItem: {
        carrierPhone: '',
        deliveryCarrier: '',
        deliveryMark: '',
        expressCode: '',
        expressNumber: '',
        id: 0,
      },
      rules: postRules,
      logistics: [],
      loadingBtn: false,
      dvisible: false,
    };
  },
  watch: {
    visible: {
      handler: function (val) {
        this.dvisible = val;
        if (val)
          this.formItem = {
            ...this.editData,
            expressNumber: this.editData.expressNumber ? this.editData.expressNumber : this.editData.trackingNumber,
          };
      },
      deep: true,
    },
  },
  methods: {
    handleClose() {
      this.$emit('onCloseVisible');
      this.$refs.formItem.resetFields();
    },
    handleSubmitSuccess() {
      this.$emit('onSubmitSuccess');
      this.loadingBtn = false;
      this.$refs.formItem.resetFields();
    },
    //提交
    handleSubmit: Debounce(function (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.loadingBtn = true;
          const { carrierPhone, deliveryCarrier, deliveryMark, expressCode, expressNumber, id } = this.formItem;
          let data = {
            carrierPhone: carrierPhone,
            deliveryCarrier: deliveryCarrier,
            deliveryMark: deliveryMark,
            expressCode: expressCode,
            expressNumber: expressNumber,
            id: id,
          };
          orderInvoiceUpdateApi(data)
            .then((res) => {
              this.$message.success('修改发货单配送信息成功');
              this.handleSubmitSuccess();
            })
            .catch((res) => {
              this.loadingBtn = false;
            });
        }
      });
    }),
  },
};
</script>

<style scoped></style>
