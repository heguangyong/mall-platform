<template>
  <el-dialog
    :visible.sync="modals"
    :close-on-click-modal="false"
    title="发货"
    class="order_box"
    :before-close="handleClose"
    width="700px"
  >
    <el-form v-if="modals" ref="formItem" :model="formItem" label-width="75px" @submit.native.prevent :rules="rules">
      <el-form-item label="发货类型：" prop="deliveryType">
        <el-radio-group v-model="formItem.deliveryType" @change="changeRadio(formItem.deliveryType)">
          <el-radio label="express">快递配送</el-radio>
          <el-radio label="noNeed">无需发货</el-radio>
          <el-radio label="merchant">商家配送</el-radio>
        </el-radio-group>
      </el-form-item>
      <SendFrom :formItem="formItem" :isShowBtn="true"></SendFrom>
    </el-form>
    <div slot="footer" class="dialog-btn-top">
      <el-button @click="cancel('formItem')">取消</el-button>
      <el-button type="primary" @click="putSend('formItem')">提交</el-button>
    </div>
  </el-dialog>
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

import { checkPermi } from '@/utils/permission'; // 权限判断函数
import { Debounce } from '@/utils/validate';
import SendFrom from './sendFrom';
import { useLogistics } from '@/hooks/use-order';
import { postRules } from '../default';
import { intervalOrderSendApi } from '@/api/pointsMall';
const defaultObj = {
  deliveryType: 'express',
  deliveryMark: '',
  carrierPhone: '',
  deliveryCarrier: '',
  expressCode: '',
  expressNumber: '',
  orderNo: '',
  isSplit: false,
  expressRecordType: '1',
};
export default {
  name: 'orderSend',
  components: { SendFrom },
  props: {
    orderNo: String,
  },
  watch: {},
  data() {
    return {
      formItem: { ...defaultObj },
      modals: false,
      express: [],
      exportTempList: [],
      tempImg: '',
      rules: postRules,
    };
  },
  mounted() {},
  methods: {
    checkPermi,
    //决定这一行的 CheckBox 是否可以勾选
    selectable(row, index) {
      if (row.deliveryNum === row.payNum) {
        return false;
      } else {
        return true;
      }
    },
    limitCount(row, i) {
      if (row.num > row.payNum) row.num = row.payNum;
    },
    // 分单发货选择商品
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    changeRadio(o) {
      this.formItem = {
        ...defaultObj,
        deliveryType: o,
      };
      this.$nextTick(function () {
        this.$refs.formItem.clearValidate();
      });
    },
    // 提交
    putSend: Debounce(function (name) {
      this.formItem.orderNo = this.orderNo;
      this.$refs[name].validate((valid) => {
        if (valid) {
          intervalOrderSendApi(this.formItem).then((async) => {
            this.$message.success('发货成功');
            this.modals = false;
            this.$emit('submitFail');
            this.$refs[name].resetFields();
          });
        } else {
          this.$message.error('请填写信息');
        }
      });
    }),
    handleClose() {
      this.cancel();
    },
    cancel() {
      this.modals = false;
      if (this.formItem.deliveryType !== 'noNeed') this.$refs.formItem.resetFields();
      this.formItem = { ...defaultObj, expressCode: this.formItem.expressCode };
      //this.formItem.type = '1';
      // this.formItem.deliveryType = 'express';
    },
  },
};
</script>

<style scoped lang="scss">
.width8 {
  width: 80%;
}

.width9 {
  width: 70%;
}

.tempImgList {
  // opacity: 1;
  width: 38px !important;
  height: 30px !important;
  // margin-top: -30px;
  cursor: pointer;
  position: absolute;
  z-index: 11;
  img {
    width: 38px !important;
    height: 30px !important;
  }
}
.refundImg {
  display: flex;
  align-items: center;
}
.product-info-text {
  display: block;
  white-space: nowrap; /* 确保文本在一行内显示 */
  overflow: hidden; /* 超出容器部分隐藏 */
  text-overflow: ellipsis; /* 使用省略号表示被截断的文本 */
  margin-left: 5px;
}
</style>
