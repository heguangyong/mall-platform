<template>
  <el-drawer
    :visible.sync="drawerVisible"
    :wrapperClosable="false"
    direction="rtl"
    size="1000px"
    :before-close="handleClose"
    class="showHeader"
  >
    <div slot="title" class="demo-drawer_title">权益说明</div>
    <div class="detailSection">
      <el-form :model="pram" ref="pram" label-width="75px" class="demo-ruleForm px35">
        <el-form-item label="权益名称：">
          <div class="from-ipt-width el-input el-input--small" disabled>
            <span class="el-input__inner">
              {{ pram.name | filterMemberBenefits }}
            </span>
          </div>
        </el-form-item>
        <el-form-item
          label="权益说明："
          prop="expand"
          :rules="[{ required: true, message: '请填写权益说明', trigger: ['blur', 'change'] }]"
        >
          <Tinymce v-model.trim="pram.expand"></Tinymce>
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="checkPermi(['platform:paid:member:benefits:statement:edit'])"
            type="primary"
            v-debounceClick="submitForm"
            >提交</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </el-drawer>
</template>
<script>
import Tinymce from '@/components/Tinymce/index.vue';
import { memberBenefitsEditApi, memberBenefitsStatementEditApi } from '@/api/user';
import { checkPermi } from '@/utils/permission';
export default {
  name: 'explainCreat',
  components: { Tinymce },
  props: {
    //是否显示隐藏
    drawerVisible: {
      type: Boolean,
      default: false,
    },
    pramInfo: {
      type: Object,
      default: null,
    },
  },
  mounted() {
    this.pram = Object.assign({}, this.pramInfo);
  },
  data() {
    return {
      pram: {
        expand: '',
        id: 0,
        name: '',
      },
    };
  },
  methods: {
    checkPermi,
    handleClose() {
      this.$emit('onClosedrawerVisible');
    },
    submitForm() {
      this.$refs.pram.validate((valid) => {
        if (valid) {
          memberBenefitsStatementEditApi(this.pram).then((response) => {
            this.$modal.msgSuccess('保存成功');
            this.$emit('subSuccess');
          });
        }
      });
    },
  },
};
</script>

<style scoped lang="scss"></style>
