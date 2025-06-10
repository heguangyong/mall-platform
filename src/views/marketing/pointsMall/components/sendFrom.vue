<template>
  <div>
    <el-form-item label="发货类型：" v-if="formItem.deliveryType === 'express'">
      <el-radio-group v-model="formItem.expressRecordType">
        <el-radio label="1">手动填写</el-radio>
        <el-radio label="2" :disabled="true">电子面单打印</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item v-if="formItem.deliveryType === 'express'" label="快递公司：" prop="expressCode">
      <ChangeLogistics v-model="formItem.expressCode"></ChangeLogistics>
    </el-form-item>
    <el-form-item v-if="formItem.deliveryType === 'express'" label="快递单号：" prop="expressNumber">
      <el-input v-model.trim="formItem.expressNumber" placeholder="请输入快递单号"></el-input>
    </el-form-item>
    <el-form-item v-if="formItem.deliveryType === 'noNeed'" label="发货备注：">
      <el-input
        v-model.trim="formItem.deliveryMark"
        show-word-limit
        :autosize="{ minRows: 4 }"
        maxlength="200"
        type="textarea"
        placeholder="请输入备注信息，最多可输入250字"
      ></el-input>
    </el-form-item>
    <el-form-item v-if="formItem.deliveryType === 'merchant'" label="配送人员：" prop="deliveryCarrier">
      <el-input v-model.trim="formItem.deliveryCarrier" placeholder="请输入配送人员"></el-input>
    </el-form-item>
    <el-form-item v-if="formItem.deliveryType === 'merchant'" label="手机号码：" prop="carrierPhone">
      <el-input v-model.trim="formItem.carrierPhone" placeholder="请输入配送人员手机号码"></el-input>
    </el-form-item>
  </div>
</template>

<script>
import { useLogistics } from '@/hooks/use-order';
import ChangeLogistics from '@/components/ChangeLogistics';
export default {
  name: 'sendFrom',
  components: {
    ChangeLogistics,
  },
  data() {
    return {
      express: [],
    };
  },
  props: {
    formItem: {
      type: Object,
      default: null,
    },
    isShowBtn: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped></style>
