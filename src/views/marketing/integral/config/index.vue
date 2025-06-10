<template>
  <div class="divBox">
    <el-card
      class="box-card"
      v-loading="loading"
      :bordered="false"
      shadow="never"
      :body-style="{ padding: '40px 50px' }"
    >
      <z-b-parser
        :form-name="formName"
        :is-create="isCreate"
        :edit-data="editData"
        @submit="handlerSubmit"
        v-if="isShow && checkPermi(['platform:integral:get:config', 'platform:integral:update:config'])"
      ></z-b-parser>
    </el-card>
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
import { integralSetConfigApi, integralGetConfigApi } from '@/api/systemConfig.js';
import { Debounce } from '@/utils/validate';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
export default {
  name: 'integralconfig',
  data() {
    return {
      isShow: false,
      isCreate: 0,
      editData: {},
      formName: '积分配置',
      loading: false,
    };
  },
  mounted() {
    if (checkPermi(['platform:integral:get:config'])) this.getFormInfo();
  },
  methods: {
    checkPermi,
    handlerSubmit: Debounce(function (data) {
      integralSetConfigApi(data).then((res) => {
        this.getFormInfo();
        this.$message.success('操作成功');
      });
    }),
    // 获取表单详情
    getFormInfo() {
      this.loading = true;
      integralGetConfigApi().then((res) => {
        this.isShow = false;
        Object.assign(this.editData, res);
        // this.editData = {
        //   freezeIntegralDay: res.freezeIntegralDay,
        //   integralDeductionMoney: res.integralDeductionMoney,
        //   integralDeductionRatio: res.integralDeductionRatio,
        //   integralDeductionStartMoney: res.integralDeductionStartMoney,
        //   integralDeductionSwitch: res.integralDeductionSwitch,
        //   orderGiveIntegral: res.orderGiveIntegral,
        //   integralFreezeNode: res.integralFreezeNode,
        // };
        this.isCreate = 1;
        setTimeout(() => {
          // 让表单重复渲染待编辑数据
          this.isShow = true;
        }, 20);
        this.loading = false;
      });
    },
  },
};
</script>

<style scoped></style>
