<template>
  <div class="divBox">
    <el-card class="box-card" :bordered="false" shadow="never" :body-style="{ padding: '40px 50px' }">
      <el-form
        v-hasPermi="['platform:system:config:seckill:style:get', 'platform:system:config:seckill:style:save']"
        :model="seckillStyleForm"
        ref="signForm"
        label-width="90px"
        class="demo-ruleForm"
      >
        <el-form-item label="秒杀样式：" prop="value">
          <el-radio-group v-model="seckillStyleForm.value">
            <el-radio label="1">样式1</el-radio>
            <el-radio label="2">样式2</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="样式展示：">
          <el-image v-if="seckillStyleForm.value === '1'" class="image" :src="imgage1" :preview-src-list="[imgage1]" />
          <el-image v-else :src="imgage2" :preview-src-list="[imgage2]" class="image" style="height: 445px" />
        </el-form-item>
        <el-form-item>
          <el-button v-if="checkPermi(['platform:system:config:seckill:style:save'])" type="primary" @click="submitForm"
            >提交</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { checkPermi } from '@/utils/permission';
import { getSeckillStyleApi, saveSeckillStyleApi, signBaseConfigApi } from '@/api/marketing';
import { Debounce } from '@/utils/validate';
export default {
  name: 'seckillStyleConfig',
  data() {
    return {
      seckillStyleForm: {
        value: '1',
      },
      imgage1: require('@/assets/imgs/miaosha1.png'),
      imgage2: require('@/assets/imgs/miaosha2.png'),
    };
  },
  mounted() {
    if (checkPermi(['platform:system:config:seckill:style:get'])) this.getSeckillStyleConfig();
  },
  methods: {
    checkPermi,
    //详情
    async getSeckillStyleConfig() {
      let data = await getSeckillStyleApi();
      if (data) this.seckillStyleForm.value = data.value;
    },
    //保存
    submitForm: Debounce(async function () {
      let data = await saveSeckillStyleApi({
        value: this.seckillStyleForm.value,
      });
      this.$message.success(data);
      await this.getSeckillStyleConfig();
    }),
  },
};
</script>

<style scoped>
.image {
  width: 239px;
  height: 480px !important;
}
</style>
