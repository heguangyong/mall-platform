<template>
  <div>
    <el-form ref="pram" :model="pram" :rules="rules" label-width="90px" @submit.native.prevent>
      <el-form-item required label="管理员密码：" prop="password">
        <el-input v-model.trim="pram.password" placeholder="管理员密码" clearable type="password" />
      </el-form-item>
      <el-form-item v-if="pram.password" required label="确认密码：" prop="confirmPassword">
        <el-input v-model.trim="pram.confirmPassword" type="password" placeholder="确认密码" clearable />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer-inner">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="handlerSubmit('pram')" v-hasPermi="['platform:admin:update:password']"
        >确定</el-button
      >
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
import * as roleApi from '@/api/role.js';
import * as systemAdminApi from '@/api/systemadmin.js';
import { Debounce } from '@/utils/validate';
import { editPassWordApi } from '@/api/systemadmin.js';
export default {
  // name: "edit"
  components: {},
  props: {
    adminId: {
      type: Number,
      required: 0,
    },
  },
  data() {
    const confirmvalidatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.pram.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入管理员密码'));
      } else {
        if (this.pram.confirmPassword !== '') {
          this.$refs.pram.validateField('confirmPassword');
        }
        callback();
      }
    };
    return {
      constants: this.$constants,
      pram: {
        password: '',
        confirmPassword: '',
        id: 0,
      },
      roleList: [],
      rules: {
        password: [
          { required: true, validator: validatePass, trigger: 'blur' },
          { required: true, min: 6, max: 20, message: '长度6-20个字符' },
        ],
        confirmPassword: [
          { required: true, message: '确认密码密码', validator: confirmvalidatePass, trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  methods: {
    close() {
      this.$emit('hideEditPassWordDialog');
    },
    handlerSubmit: Debounce(function (form) {
      this.$refs[form].validate((valid) => {
        if (!valid) return;
        this.handlerSave();
      });
    }),
    handlerSave() {
      this.pram.id = this.adminId;
      systemAdminApi.editPassWordApi(this.pram).then((data) => {
        this.$message.success('修改密码成功');
        this.$emit('hideEditPassWordDialog');
      });
    },
    rulesSelect(selectKeys) {
      this.pram.rules = selectKeys;
    },
  },
};
</script>

<style scoped></style>
