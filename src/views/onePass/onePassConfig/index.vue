<template>
  <div class="divBox">
    <el-card class="box-card" shadow="never" :bordered="false" :body-style="{ padding: '40px 50px' }">
      <z-b-parser
        :form-name="formName"
        :is-create="isCreate"
        :edit-data="editData"
        @submit="handlerSubmit"
        @resetForm="resetForm"
        v-if="isShow && checkPermi(['platform:one:pass:app:get', 'platform:one:pass:app:save'])"
      />
    </el-card>
  </div>
</template>

<script>
import { passAppSaveApi, passAppInfoApi } from '@/api/systemConfig.js';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
export default {
  name: 'onePassConfig',
  data() {
    return {
      isShow: true,
      isCreate: 0,
      editData: {},
      formName: 'onePassConfig', //一号通配置
    };
  },
  mounted() {
    if (checkPermi(['platform:one:pass:app:get'])) this.getPassAppInfo();
  },
  methods: {
    checkPermi,
    resetForm(formValue) {
      this.isShow = false;
    },
    handlerSubmit(data) {
      passAppSaveApi(data).then((res) => {
        this.getPassAppInfo();
        this.$message.success('操作成功');
      });
    },
    //获取配置详情
    getPassAppInfo() {
      passAppInfoApi().then((res) => {
        this.isShow = false;
        this.editData = res;
        this.isCreate = 1;
        setTimeout(() => {
          // 让表单重复渲染待编辑数据
          this.isShow = true;
        }, 80);
      });
    },
  },
};
</script>

<style scoped></style>
