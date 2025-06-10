<template>
  <div class="divBox">
    <el-tabs type="border-card">
      <el-tab-pane label="类目申请">
        <category-list></category-list>
      </el-tab-pane>
      <el-tab-pane label="品牌申请">
        <brand-list></brand-list>
      </el-tab-pane>
    </el-tabs>
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
import CategoryList from '@/views/videoChannel/weChatcategoryAndBrand/categoryList';
import BrandList from '@/views/videoChannel/weChatcategoryAndBrand/brandList';
export default {
  name: 'weChatcategoryAndBrand',
  components: { BrandList, CategoryList },
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>

<style scoped>
.el-table__body {
  width: 100%;
  table-layout: fixed !important;
}
.text_overflow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 400px;
}
.pup_card {
  width: 200px;
  border-radius: 5px;
  padding: 5px;
  box-sizing: border-box;
  font-size: 12px;
  line-height: 16px;
}
</style>
