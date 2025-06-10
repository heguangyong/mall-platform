<template>
  <div class="divBox">
    <el-card class="box-card" :bordered="false" shadow="never" :body-style="{ padding: '40px 50px' }">
      <el-form
        v-hasPermi="['platform:sign:get:config', 'platform:sign:edit:base:config']"
        :model="signForm"
        :rules="rules"
        ref="signForm"
        label-width="90px"
        class="demo-ruleForm"
      >
        <el-form-item label="每日签到奖励：" prop="integral">
          <div class="acea-row">
            <el-checkbox v-model="signForm.isIntegral">赠送积分值</el-checkbox>
            <el-input-number
              v-model.trim="signForm.integral"
              :min="0"
              :max="9999"
              :step="1"
              label="积分值"
              class="ml40"
            ></el-input-number>
          </div>
        </el-form-item>
        <el-form-item prop="experience">
          <div class="acea-row">
            <el-checkbox v-model="signForm.isExperience">赠送经验值</el-checkbox>
            <el-input-number
              v-model.trim="signForm.experience"
              :min="0"
              :max="9999"
              :step="1"
              label="经验值"
              class="ml40"
            ></el-input-number>
          </div>
        </el-form-item>
        <el-form-item label="签到规则说明：" prop="name" class="operation">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            style="width: 460px"
            v-model="signForm.signRuleDescription"
          >
          </el-input>
          <el-button class="btn" size="small" type="text" @click="signForm.signRuleDescription = defaultDescription"
            >使用默认说明</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="checkPermi(['platform:sign:edit:base:config'])"
            type="primary"
            @click="submitForm('signForm')"
            >提交</el-button
          >
        </el-form-item>
      </el-form>
      <el-button
        v-if="checkPermi(['platform:sign:get:config', 'platform:sign:add:config'])"
        type="primary"
        @click="addSign"
        class="mt20"
        >新增连续签到奖励</el-button
      >
      <div class="from-tips mt14 mb20">连续签到奖励断签后会重新计算连续签到天数，达到连续天数后即可获得连续奖励</div>
      <el-table :data="signConfigList" border>
        <el-table-column label="连续天数" width="130">
          <template slot-scope="scope">
            <el-input v-show="scope.row.show" placeholder="请输入内容" v-model.trim="scope.row.day"></el-input>
            <span v-show="!scope.row.show">{{ scope.row.day }}</span>
          </template>
        </el-table-column>
        <el-table-column label="连续奖励" min-width="680">
          <template slot-scope="scope">
            <div class="acea-row row-center-wrapper">
              <el-checkbox v-model="scope.row.isIntegral" :disabled="!scope.row.show">赠送积分值</el-checkbox>
              <el-input-number
                :disabled="!scope.row.show"
                v-model.trim="scope.row.integral"
                :min="0"
                :max="9999"
                :step="1"
                label="积分值"
                class="mr20"
              ></el-input-number>
              <el-checkbox v-model="scope.row.isExperience" class="ml40 mr20" :disabled="!scope.row.show"
                >赠送经验值</el-checkbox
              >
              <el-input-number
                :disabled="!scope.row.show"
                v-model.trim="scope.row.experience"
                :min="0"
                :max="9999"
                :step="1"
                label="经验值"
              ></el-input-number>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <a v-if="checkPermi(['platform:sign:edit:award:config'])" type="text" @click="editSign(scope.row)">编辑</a>
            <el-divider direction="vertical"></el-divider>
            <a
              v-if="checkPermi(['platform:sign:add:config', 'platform:sign:edit:award:config'])"
              type="text"
              @click="saveSign(scope.row)"
              >保存</a
            >
            <el-divider direction="vertical"></el-divider>
            <a v-if="checkPermi(['platform:sign:delete:config'])" type="text" @click="delSign(scope.row)">删除</a>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
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
import {
  signBaseConfigApi,
  signeGetConfigApi,
  signAddConfigApi,
  signeEditConfigApi,
  signeDelConfigApi,
} from '@/api/marketing';
import { checkPermi } from '@/utils/permission';
import { Debounce } from '@/utils/validate'; // 权限判断函数
const signObj = {
  day: 0,
  experience: 0,
  integral: 0,
  id: 0,
  isExperience: true,
  isIntegral: true,
  show: true,
};
export default {
  name: 'index',
  data() {
    return {
      signForm: {
        day: 0,
        experience: 0,
        id: 0,
        integral: 0,
        isExperience: true,
        isIntegral: true,
        signRuleDescription: '',
      },
      defaultDescription: '1.每天签到可以获得每天签到奖励',
      rules: {
        isIntegral: [{ required: true, message: '请输入积分值', trigger: 'blur' }],
        experience: [{ required: true, message: '请输入经验值', trigger: 'blur' }],
      },
      signConfigList: [],
      showTab: false,
    };
  },
  mounted() {
    if (checkPermi(['platform:sign:get:config'])) this.getSignConfig();
  },
  methods: {
    checkPermi,
    getSignConfig() {
      signeGetConfigApi().then((res) => {
        this.signForm = res.baseSignConfig;
        this.$set(this, 'signConfigList', res.signConfigList);
        this.$set(this.signForm, 'signRuleDescription', res.signRuleDescription);
      });
    },
    submitForm: Debounce(function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          signBaseConfigApi(this.signForm).then(() => {
            this.$message.success('操作成功');
            this.getSignConfig();
          });
        } else {
          return false;
        }
      });
    }),
    addSign() {
      this.signConfigList.push(Object.assign({}, signObj));
    },
    editSign(row) {
      this.$set(row, 'show', true);
    },
    delSign(row) {
      this.$modalSure('删除当前数据?').then(() => {
        signeDelConfigApi(row.id).then((data) => {
          this.$message.success('删除成功');
          this.getSignConfig();
        });
      });
    },
    saveSign(row) {
      row.id
        ? signeEditConfigApi(row).then(() => {
            this.$set(row, 'show', false);
            this.$message.success('操作成功');
            this.getSignConfig();
          })
        : signAddConfigApi(row).then(() => {
            this.$set(row, 'show', false);
            this.$message.success('操作成功');
            this.getSignConfig();
          });
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .el-table {
  width: 970px;
}
.btn {
  position: relative;
  top: -15px;
  left: 12px;
}
.title {
  ::v-deep.el-alert {
    padding: 0 16px !important;
  }
}
</style>
