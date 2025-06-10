<template>
  <div>
    <el-select
      @change="handleChange"
      size="small"
      class="width100"
      clearable
      filterable
      v-model="logisticsCode"
      v-selectLoadMore="selectLoadMore"
      :loading="loading"
      remote
      :multiple="multiple"
      :remote-method="remoteMethod"
      placeholder="请选择快递公司"
    >
      <el-option v-for="user in logisticsList" :key="user.code" :label="user.name" :value="user.code"> </el-option>
    </el-select>
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
import * as merchant from '@/api/merchant';
import { checkPermi } from '@/utils/permission';
import { expressList } from '@/api/logistics'; // 权限判断函数
export default {
  name: 'index',
  props: {
    multiple: {
      type: Boolean,
      default: false,
    },
    value: {
      type: [Number, String],
      default: null,
    },
  },
  directives: {
    // 计算是否滚动到最下面
    selectLoadMore: {
      bind(el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap');
        SELECTWRAP_DOM.addEventListener(
          'scroll',
          function () {
            if (this.scrollHeight - this.scrollTop < this.clientHeight + 1) {
              binding.value();
            }
          },
          { passive: true },
        );
      },
    },
  },
  watch: {
    value(n) {
      this.logisticsCode = n ? n : null;
    },
  },
  data() {
    return {
      logisticsCode: this.value,
      logisticsList: [],
      loading: false,
      search: {
        limit: 10,
        page: 1,
        keywords: '',
      },
    };
  },
  mounted() {
    if (checkPermi(['platform:express:list'])) this.getExpressList();
  },
  methods: {
    handleChange() {
      this.$emit('input', this.logisticsCode);
    },
    // 下拉加载更多
    selectLoadMore() {
      this.search.page = this.search.page + 1;
      if (this.search.page > this.totalPage) return;
      this.getExpressList(); // 请求接口
    },
    // 远程搜索
    remoteMethod(query) {
      this.loading = true;
      this.search.keywords = query;
      this.search.page = 1;
      this.logisticsList = [];
      setTimeout(() => {
        this.loading = false;
        this.getExpressList(); // 请求接口
      }, 200);
    },
    // 列表
    getExpressList() {
      expressList(this.search).then((res) => {
        this.totalPage = res.totalPage;
        this.total = res.total;
        this.logisticsList = this.logisticsList.concat(res.list);
      });
    },
  },
};
</script>

<style scoped></style>
