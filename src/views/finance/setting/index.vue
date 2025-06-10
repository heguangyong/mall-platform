<template>
  <div class="divBox">
    <el-card class="box-card" shadow="never" :bordered="false" :body-style="{ padding: '40px 50px' }">
      <div class="form-data" v-loading="loading">
        <z-b-parser
          v-if="!loading && checkPermi(['platform:finance:merchant:closing:config'])"
          :is-create="isCreate"
          :form-conf="formConf"
          :edit-data="editData"
          :form-name="formName"
          :key-num="keyNum"
          @submit="handlerSubmit"
        />
      </div>
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
// import parser from '@/components/FormGenerator/components/parser/ZBParser'
import { closingEditApi, closingConfigApi } from '@/api/finance';
import { Debounce } from '@/utils/validate';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
export default {
  // components: { parser },
  data() {
    return {
      formConf: { fields: [] },
      loading: false,
      keyNum: 0,
      editData: {},
      isCreate: 0,
      formName: '商户结算设置',
      ruleForm: {
        merchantShareFreezeTime: 7,
        merchantShareNode: 'complete',
      },
    };
  },
  created() {
    //this.keyNum += 1
    this.getConfigInfo();
  },
  methods: {
    checkPermi,
    handlerSubmit: Debounce(function (formValue) {
      if (checkPermi(['platform:finance:merchant:closing:config:edit'])) {
        closingEditApi(formValue)
          .then((res) => {
            this.$message.success('操作成功');
            this.getConfigInfo();
          })
          .catch(() => {
            this.loading = false;
          });
      } else {
        this.$message.warning('暂无操作权限');
      }
    }),
    // 获取转账配置信息
    getConfigInfo() {
      this.keyNum += 1;
      this.loading = true;
      closingConfigApi()
        .then((res) => {
          for (var key in res) {
            if (res[key] === 'merchantShareNode') res[key] = parseFloat(res[key]);
          }
          this.editData = res;
          this.isCreate = 1;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
