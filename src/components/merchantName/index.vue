<template>
  <div>
    <el-select
      @change="onChangeMerId"
      class="selWidth"
      size="small"
      clearable
      filterable
      v-model="merId"
      v-selectLoadMore="selectLoadMore"
      :loading="loading"
      remote
      :multiple="multiple"
      :remote-method="remoteMethod"
      placeholder="请选择商户"
    >
      <el-option v-for="user in merchantList" :key="user.id" :label="user.name" :value="user.id"></el-option>
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
import { checkPermi } from '@/utils/permission'; // 权限判断函数
export default {
  name: 'index',
  props: {
    multiple: {
      type: Boolean,
      default: false,
    },
    merIdChecked: {
      type: [Number, String, Boolean],
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
    merIdChecked(n) {
      this.merId = n ? n : null;
    },
  },
  data() {
    return {
      merchantList: [],
      merId: this.merIdChecked,
      loading: false,
      search: {
        limit: 10,
        page: 1,
        keywords: '',
      },
    };
  },
  mounted() {
    if (checkPermi(['platform:merchant:page:list'])) this.getMerList();
  },
  methods: {
    // 下拉加载更多
    selectLoadMore() {
      this.search.page = this.search.page + 1;
      if (this.search.page > this.totalPage) return;
      this.getMerList(); // 请求接口
    },
    // 远程搜索
    remoteMethod(query) {
      this.loading = true;
      this.search.keywords = query;
      this.search.page = 1;
      this.merchantList = [];
      setTimeout(() => {
        this.loading = false;
        this.getMerList(); // 请求接口
      }, 200);
    },
    // 列表
    getMerList() {
      merchant.merchantListApi(this.search).then((res) => {
        this.totalPage = res.totalPage;
        this.total = res.total;
        this.merchantList = this.merchantList.concat(res.list);
      });
    },
    onChangeMerId() {
      this.$emit('getMerId', this.merId);
    },
  },
};
</script>

<style scoped></style>
