<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="65px">
      <el-form-item label="用户编号:">
        <el-input v-model.trim="ruleForm.id" disabled></el-input>
      </el-form-item>
      <el-form-item label="用户地址:">
        <el-input v-model.trim="ruleForm.province + ruleForm.city" disabled></el-input>
      </el-form-item>
      <el-form-item label="用户备注:">
        <el-input v-model.trim="ruleForm.mark" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="生日:">
        <el-date-picker
          v-model="ruleForm.birthday"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          type="date"
          placeholder="选择日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="用户标签:">
        <el-select v-model="labelData" placeholder="请选择" clearable filterable multiple>
          <el-option :value="item.id" v-for="(item, index) in labelLists" :key="index" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="推广员:">
        <el-radio-group v-model="ruleForm.isPromoter">
          <el-radio :label="true">开启</el-radio>
          <el-radio :label="false">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="状态:" class="mb30">
        <el-radio-group v-model="ruleForm.status">
          <el-radio :label="true">开启</el-radio>
          <el-radio :label="false">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer-inner">
      <el-button @click="resetForm('ruleForm')">取消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')" v-hasPermi="['platform:user:update']">确认</el-button>
    </div>
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
import { groupListApi, levelListApi, tagListApi, userInfoApi, userUpdateApi } from '@/api/user';
import { Debounce } from '@/utils/validate';
const defaultObj = {
  // birthday: '',
  // cardId: '',
  id: null,
  mark: '',
  //  phone: '',
  // realName: '',
  addres: '',
  groupId: '',
  level: '',
  isPromoter: false,
  status: false,
};
export default {
  name: 'UserEdit',
  props: {
    userInfo: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      ruleForm: Object.assign({}, defaultObj),
      groupData: [],
      labelData: [],
      rules: {},
      labelLists: [],
    };
  },
  mounted() {
    if (this.userInfo) this.ruleForm = JSON.parse(JSON.stringify(this.userInfo));
    this.labelLists = JSON.parse(localStorage.getItem('tagAllList')) || [];
    this.labelData = this.userInfo.tagId ? this.userInfo.tagId.split(',').map(Number) : [];
  },
  methods: {
    submitForm: Debounce(function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ruleForm.tagId = this.labelData.join(',');
          userUpdateApi({ id: this.ruleForm.id }, this.ruleForm).then(async (res) => {
            this.$message.success('编辑成功');
            this.$parent.$parent.visible = false;
            this.$parent.$parent.getList();
          });
        } else {
          return false;
        }
      });
    }),
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$emit('resetForm');
    },
  },
};
</script>

<style scoped>
.selWidth {
  width: 90%;
}
</style>
