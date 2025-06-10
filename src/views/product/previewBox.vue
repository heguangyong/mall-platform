<template>
  <div class="goods_detail">
    <div class="goods_detail_wrapper" :class="url ? 'on' : ''">
      <iframe v-if="url" :src="url" style="width: 100%; height: 600px" frameborder="0" />
    </div>
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
export default {
  name: 'PreviewBox',
  props: {
    frontDomainUrl: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      url: this.frontDomainUrl,
    };
  },
};
</script>

<style scoped lang="scss">
.goods_detail {
  .goods_detail_wrapper {
    z-index: 200;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 375px;
    background: #f0f2f5;
    &.on {
      position: fixed;
    }
  }
}
</style>
