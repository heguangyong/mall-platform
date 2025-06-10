<template>
  <div class="box">
    <el-drawer
      :visible.sync="dialogVisible"
      :title="isSHOW ? '商户入驻审核' : '商户详情'"
      :direction="direction"
      @close="close"
      size="1000px"
    >
      <div v-if="dialogVisible">
        <div class="detailHead bdbtmSolid">
          <div class="acea-row row-between headerBox">
            <div class="full">
              <div class="order_icon"><span class="iconfont icon-shanghuliebiao"></span></div>
              <div class="text">
                <div class="title">商户</div>
                <span class="mr20">{{ dataForm.name }}</span>
              </div>
            </div>
            <div v-if="isSHOW">
              <el-button
                v-debounceClick="
                  () => {
                    onSubmit(3);
                  }
                "
                style="margin-left: 0"
                >{{ loadingBtn ? '提交中 ...' : '审核拒绝' }}</el-button
              >
              <el-button
                type="primary"
                v-debounceClick="
                  () => {
                    onSubmit(2);
                  }
                "
                >{{ loadingBtn ? '提交中 ...' : '审核通过' }}</el-button
              >
            </div>
          </div>
        </div>
        <div class="detailSection padBox">
          <div class="title">商户详情</div>
          <ul class="list">
            <li class="item">
              <div class="tips">商户账号：</div>
              <div class="value">{{ dataForm.phone }}</div>
            </li>
            <li class="item">
              <div class="tips">商户分类：</div>
              <div class="value">{{ dataForm.categoryId | merCategoryFilter }}</div>
            </li>
            <li class="item">
              <div class="tips">店铺类型：</div>
              <div class="value">{{ dataForm.typeId | merchantTypeFilter }}</div>
            </li>
            <li v-show="dataForm.password" class="item">
              <div class="tips">登录密码：</div>
              <div class="value">{{ dataForm.password }}</div>
            </li>
            <li class="item">
              <div class="tips">商户姓名：</div>
              <div class="value">{{ dataForm.realName }}</div>
            </li>
            <li class="item">
              <div class="tips">商户手机号：</div>
              <div class="value">{{ dataForm.phone | filterEmpty }}</div>
            </li>
            <li class="item">
              <div class="tips">手续费(%)：</div>
              <div class="value">{{ dataForm.handlingFee }}</div>
            </li>
          </ul>
          <div class="ivu-mt-16 acea-row">
            <div class="tips">简介：</div>
            <div class="value">{{ dataForm.keywords || '无' }}</div>
          </div>
          <div class="ivu-mt-16 acea-row">
            <div class="tips">备注：</div>
            <div class="value">{{ dataForm.remark || '无' }}</div>
          </div>
          <div class="ivu-mt-16 acea-row">
            <div class="tips">资质图片：</div>
            <div class="acea-row">
              <div v-for="(item, index) in dataForm.qualificationPictureData" :key="index" class="pictrue">
                <el-image :src="item" :preview-src-list="dataForm.qualificationPictureData"> </el-image>
              </div>
            </div>
          </div>
        </div>
        <!--        <div class="demo-drawer__footer">-->
        <!--          <div v-if="isSHOW" class="from-foot-btn drawer_fix">-->
        <!--            <div class="acea-row justify-content">-->
        <!--              <el-button-->
        <!--                v-debounceClick="-->
        <!--                  () => {-->
        <!--                    onSubmit(3);-->
        <!--                  }-->
        <!--                "-->
        <!--                style="margin-left: 0"-->
        <!--                >{{ loadingBtn ? '提交中 ...' : '审核拒绝' }}</el-button-->
        <!--              >-->
        <!--              <el-button-->
        <!--                type="primary"-->
        <!--                v-debounceClick="-->
        <!--                  () => {-->
        <!--                    onSubmit(2);-->
        <!--                  }-->
        <!--                "-->
        <!--                >{{ loadingBtn ? '提交中 ...' : '审核通过' }}</el-button-->
        <!--              >-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </div>-->
      </div>
    </el-drawer>
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
import { merApplyAuditApi } from '@/api/merchant';
import { mapGetters } from 'vuex';
import { filterEmpty } from '@/filters';
export default {
  name: 'audit',
  data() {
    return {
      merImg: require('@/assets/imgs/dianpu.png'),
      dialogVisible: false,
      direction: 'rtl',
      isDisabled: true,
      rules: {
        auditStatus: [{ required: true, message: '请选择审核状态', trigger: 'change' }],
        denialReason: [{ required: true, message: '请填写拒绝原因', trigger: 'blur' }],
      },
      ruleForm: {
        denialReason: '',
        auditStatus: 2,
        id: '',
      },
      loadingBtn: false,
    };
  },
  props: {
    merData: {
      type: Object,
      default: () => null,
    },
    isSHOW: {
      type: String,
      default: () => '',
    },
  },
  computed: {
    ...mapGetters(['merchantClassify', 'merchantType']),
  },
  watch: {
    merData: {
      handler: function (val) {
        if (val.qualificationPicture) val.qualificationPictureData = JSON.parse(val.qualificationPicture);
        this.dataForm = { ...val };
      },
      deep: true,
    },
  },
  methods: {
    filterEmpty,
    close() {
      this.dialogVisible = false;
      this.ruleForm = {
        denialReason: '',
        auditStatus: 2,
      };
    },
    //审核拒绝
    cancelForm() {
      this.$modalPrompt('textarea', '拒绝原因').then((V) => {
        this.ruleForm.denialReason = V;
        this.submit();
      });
    },
    // 审核提交
    onSubmit(type) {
      this.ruleForm.auditStatus = type;
      if (type === 2) {
        this.$modalSure('审核通过该商户吗？').then(() => {
          this.submit();
        });
      } else {
        this.cancelForm();
      }
    },
    submit() {
      this.loadingBtn = true;
      this.ruleForm.id = this.dataForm.id;
      merApplyAuditApi(this.ruleForm)
        .then((res) => {
          this.$message.success('操作成功');
          this.dialogVisible = false;
          this.$emit('subSuccess');
          this.loadingBtn = false;
        })
        .catch((res) => {
          this.loadingBtn = false;
        });
    },
  },
};
</script>

<style scoped lang="scss">
.demo-drawer__content {
  padding-bottom: 86px;
}
.box {
  ::v-deep.el-drawer__header {
    margin-bottom: 0 !important;
    font-size: 20px;
  }
}
.demo-drawer__content {
  min-height: 600px;
}
.widths {
  width: 169px;
  display: inline-block;
  color: #606266;
}
.langcent {
  display: inline-block;
  color: #606266;
  width: 100%;
}
.lang {
  width: 100%;
  ::v-deep.el-form-item__content {
    width: 79%;
  }
}
.divBox {
  ::v-deep .el-input__inner:hover,
  ::v-deep.el-input > input,
  ::v-deep.el-textarea > textarea {
    border: none;
    padding: 0;
  }
  ::v-deep.el-card__body {
    padding: 5px;
  }
  ::v-deep .el-input.is-disabled .el-input__inner {
    background: none;
    cursor: none;
    color: #606266;
  }
}
::v-deep .el-image {
  width: 60px;
  height: 60px;
}
</style>
