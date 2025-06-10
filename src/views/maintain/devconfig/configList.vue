<template>
  <div class="components-container">
    <config-list :prent-data="prentData" />
  </div>
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
import configList from '@/components/FormGenerator/index/Home.vue';
export default {
  components: { configList },
  // name: "configList",
  props: {
    prentData: {
      type: Object,
      default: {},
    },
  },
};
</script>

<style scoped></style>
