<template>
  <div class="divBox">
    <el-card class="box-card" :bordered="false" shadow="never" :body-style="{ padding: '40px 50px' }">
      <el-form
        ref="promoterForm"
        :model="promoterForm"
        :rules="rules"
        label-width="200px"
        class="demo-promoterForm"
        v-loading="loading"
      >
        <el-form-item prop="retailStoreSwitch">
          <span slot="label">
            <span>分销启用：</span>
            <el-tooltip class="item" effect="dark" content="商城分销功能开启关闭" placement="top-start">
              <i class="el-icon-warning-outline" />
            </el-tooltip>
          </span>
          <el-radio-group v-model="promoterForm.retailStoreSwitch">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="retailStoreLine">
          <span slot="label">
            <span>满额分销最低金额：</span>
            <el-tooltip class="item" effect="dark" content="满额分销满足金额开通分销权限" placement="top-start">
              <i class="el-icon-warning-outline" />
            </el-tooltip>
          </span>
          <el-input-number
            v-model.trim="promoterForm.retailStoreLine"
            placeholder="满额分销满足金额开通分销权限"
            :min="-1"
            :step="1"
            class="selWidth"
            @keydown.native="channelInputLimit"
          ></el-input-number>
        </el-form-item>
        <el-form-item prop="retailStoreBindingType">
          <span slot="label">
            <span>分销关系绑定：</span>
            <el-tooltip
              class="item"
              effect="dark"
              content="所有用户”指所有没有上级推广人的用户，“新用户”指新注册的用户"
              placement="top-start"
            >
              <i class="el-icon-warning-outline" />
            </el-tooltip>
          </span>
          <el-radio-group v-model="promoterForm.retailStoreBindingType">
            <el-radio :label="0">所有用户</el-radio>
            <el-radio :label="1">新用户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="retailStoreBrokerageFirstRatio">
          <span slot="label">
            <span>一级返佣比例：</span>
            <el-tooltip
              class="item"
              effect="dark"
              content="订单交易成功后给上级返佣的比例0 - 100,例:5 = 返订单金额的5%"
              placement="top-start"
            >
              <i class="el-icon-warning-outline" />
            </el-tooltip>
          </span>
          <el-input-number
            v-model.trim="promoterForm.retailStoreBrokerageFirstRatio"
            step-strictly
            :min="0"
            :max="100"
            class="selWidth"
            placeholder="订单交易成功后给上级返佣的比例0 - 100,例:5 = 返订单金额的5%"
          ></el-input-number>
          <span>%</span>
        </el-form-item>
        <el-form-item prop="retailStoreBrokerageSecondRatio">
          <span slot="label">
            <span>二级返佣比例：</span>
            <el-tooltip
              class="item"
              effect="dark"
              content="订单交易成功后给上级返佣的比例,例:5 = 返订单金额的5%，返佣比例之和不能大于项目文件配置的佣金返佣比例和上限"
              placement="top-start"
            >
              <i class="el-icon-warning-outline" />
            </el-tooltip>
          </span>
          <el-input-number
            v-model.trim="promoterForm.retailStoreBrokerageSecondRatio"
            step-strictly
            :min="0"
            :max="100"
            class="selWidth"
            placeholder="订单交易成功后给上级返佣的比例,例:5 = 返订单金额的5%，返佣比例之和不能大于项目文件配置的佣金返佣比例和上限"
          ></el-input-number>
          <span>%</span>
        </el-form-item>
        <el-form-item prop="retailStoreExtractMinPrice">
          <span slot="label">
            <span>提现最低金额：</span>
            <el-tooltip class="item" effect="dark" content="用户提现最低金额" placement="top-start">
              <i class="el-icon-warning-outline" />
            </el-tooltip>
          </span>
          <el-input-number
            v-model.trim="promoterForm.retailStoreExtractMinPrice"
            :min="0"
            :step="1"
            class="selWidth"
            placeholder="用户提现最低金额"
          ></el-input-number>
        </el-form-item>
        <el-form-item prop="retailStoreExtractBank">
          <span slot="label">
            <span>提现银行卡：</span>
            <el-tooltip class="item" effect="dark" content="提现银行卡，每个银行换行" placement="top-start">
              <i class="el-icon-warning-outline" />
            </el-tooltip>
          </span>
          <keyword @getLabelarr="getLabelarr" :labelarr="labelarr" style="width: 600px" :type="keywordType"></keyword>
        </el-form-item>
        <el-form-item prop="retailStoreBrokerageFreezingTime">
          <span slot="label">
            <span>开始冻结规则：</span>
            <el-tooltip class="item" effect="dark" content="从哪个状态开始计算冻结时间" placement="top-start">
              <i class="el-icon-warning-outline" />
            </el-tooltip>
          </span>
          <el-select v-model="promoterForm.retailStoreBrokerageShareNode" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="retailStoreBrokerageFreezingTime">
          <span slot="label">
            <span>冻结时长：</span>
            <el-tooltip class="item" effect="dark" content="冻结多久进行解冻" placement="top-start">
              <i class="el-icon-warning-outline" />
            </el-tooltip>
          </span>
          <el-input-number
            v-model.trim="promoterForm.retailStoreBrokerageFreezingTime"
            :min="0"
            :max="30"
            :step="1"
            step-strictly
            class="selWidth"
            placeholder="佣金冻结时间(天)"
          ></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            @click="submitForm('promoterForm')"
            v-hasPermi="['platform:retail:store:config:save']"
            >提交</el-button
          >
        </el-form-item>
      </el-form>
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
import { configApi, configUpdateApi, productCheckApi } from '@/api/distribution';
import * as selfUtil from '@/utils/ZBKJIutil.js';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
import { Debounce } from '@/utils/validate';
export default {
  name: 'Index',
  data() {
    return {
      options: [
        {
          value: 'pay',
          label: '订单支付后',
        },
        {
          value: 'receipt',
          label: '订单收货后',
        },
        {
          value: 'complete',
          label: '订单完成后',
        },
      ],
      keywordType: 'textarea',
      labelarr: [],
      promoterForm: {
        retailStoreBrokerageShareNode: 'complete',
        retailStoreBrokerageFreezingTime: 7,
      },
      loading: false,
      rules: {
        retailStoreSwitch: [{ required: true, message: '请选择是否启用分销', trigger: 'change' }],
        retailStoreBrokerageFirstRatio: [{ required: true, message: '请输入一级返佣比例', trigger: 'blur' }],
        retailStoreBrokerageSecondRatio: [{ required: true, message: '请输入二级返佣比例', trigger: 'blur' }],
        merchantShareFreezeTime: [{ required: true, message: '请输入冻结时间', trigger: 'blur' }],
      },
    };
  },
  mounted() {
    if (checkPermi(['platform:retail:store:config:get'])) this.getDetal();
  },
  methods: {
    checkPermi,
    getLabelarr(attr) {
      this.labelarr = attr;
    },
    channelInputLimit(e) {
      let key = e.key;
      // 不允许输入'e'和'.'
      if (key === 'e' || key === '.') {
        e.returnValue = false;
        return false;
      }
      return true;
    },
    getDetal() {
      this.loading = true;
      configApi()
        .then((res) => {
          this.loading = false;
          this.promoterForm = res;
          this.labelarr = res.retailStoreExtractBank ? res.retailStoreExtractBank.split(',') : [];
        })
        .catch((res) => {
          this.$message.error(res.message);
        });
    },
    submitForm: Debounce(function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (
            selfUtil.Add(
              this.promoterForm.retailStoreBrokerageFirstRatio,
              this.promoterForm.retailStoreBrokerageSecondRatio,
            ) > 100
          )
            return this.$message.warning('返佣比例相加不能超过100%');
          this.loading = true;
          this.promoterForm.retailStoreExtractBank = this.labelarr.join(',');
          configUpdateApi(this.promoterForm)
            .then((res) => {
              this.loading = false;
              this.$message.success('提交成功');
            })
            .catch((err) => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    }),
  },
};
</script>

<style scoped lang="scss"></style>
