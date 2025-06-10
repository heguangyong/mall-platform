<template>
  <div>
    <el-dialog title="提示" :visible.sync="visible" width="896px" :before-close="handleClose">
      <article-list
        v-if="visible"
        :handle="handle"
        :userIds="userIds"
        :couponId="couponId"
        @getArticle="getArticle"
        :keyNum="keyNum"
      ></article-list>
    </el-dialog>
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
import articleList from '../index.vue';
export default {
  name: 'CouponFrom',
  components: { articleList },
  data() {
    return {
      visible: false,
      callback: function () {},
      handle: '',
      keyNum: 0,
      couponId: [],
      userIds: '',
    };
  },
  watch: {
    // show() {
    //   this.visible = this.show
    // }
  },
  methods: {
    handleClose() {
      this.visible = false;
    },
    getArticle(couponObj) {
      this.callback(couponObj);
      this.visible = false;
    },
  },
};
</script>

<style scoped></style>
