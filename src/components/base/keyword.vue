<template>
  <div class="keywordbox from-ipt-width">
    <el-tag
      v-for="(item, index) in labelarr"
      :key="index"
      type="success"
      closable
      class="mr5"
      :disable-transitions="false"
      @close="labelhandleClose(item)"
      >{{ item }}
    </el-tag>
    <el-input
      v-show="labelarr.length < 20"
      v-model.trim="val"
      size="small"
      class="keywordbox_ip"
      placeholder="输入后回车"
      maxlength="32"
      show-word-limit
      @change="addlabel"
      :disabled="isDisabled"
    />
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
  name: 'keyword',
  props: {
    isDisabled: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
    labelarr: {
      type: Array,
      default: function () {
        return [];
      },
    },
    type: {
      type: String,
      default: function () {
        return 'text';
      },
    },
  },
  data() {
    return {
      val: '',
    };
  },
  methods: {
    labelhandleClose(tag) {
      if (this.isDisabled) return;
      const index = this.labelarr.indexOf(tag);
      this.labelarr.splice(index, 1);
    },
    addlabel() {
      const count = this.labelarr.indexOf(this.val);
      if (count === -1) {
        this.labelarr.push(this.val);
      }
      this.val = '';
      this.$emit('getLabelarr', this.labelarr);
    },
  },
};
</script>

<style scoped>
.keywordbox {
  background-color: white;
  font-size: 12px;
  border-radius: 6px;
  margin-bottom: 0px;
  text-align: left;
  box-sizing: border-box;
}
</style>
