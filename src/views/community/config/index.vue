<template>
  <div class="divBox">
    <el-card class="box-card" :bordered="false" shadow="never" :body-style="{ padding: '40px 50px' }">
      <el-alert type="warning" class="mb35" :closable="false" show-icon>
        <slot name="title">
          <div class="acea-row">
            <div>社区状态在页面设计中进行开启/关闭；</div>
            <el-link type="primary" @click="handlerToLink">立即前往</el-link>
          </div>
        </slot>
      </el-alert>
      <div class="form-data" v-loading="loading">
        <z-b-parser
          v-if="!loading && checkPermi(['platform:community:get:config'])"
          :is-create="1"
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
import { communityConfigApi, communityConfigUpdateApi } from '@/api/community';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
export default {
  name: 'communityConfig',
  data() {
    return {
      formConf: { fields: [] },
      loading: false,
      keyNum: 0,
      editData: {},
      formName: 'communityConfig',
    };
  },
  created() {
    if (checkPermi(['platform:community:get:config'])) this.getConfigInfo();
  },
  methods: {
    checkPermi,
    //立即前往
    handlerToLink() {
      const { href } = this.$router.resolve({
        path: '/page/design/viewDesign',
      });
      window.open(href);
    },
    handlerSubmit(formValue) {
      if (checkPermi(['platform:community:update:config'])) {
        communityConfigUpdateApi(formValue)
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
    },
    // 获取配置信息
    getConfigInfo() {
      this.keyNum += 1;
      this.loading = true;
      communityConfigApi()
        .then((res) => {
          this.editData = res;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped>
.acea-row {
  align-items: baseline;
}
</style>
