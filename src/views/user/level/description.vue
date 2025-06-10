<template>
  <div class="divBox">
    <el-card class="box-card" shadow="never" :bordered="false">
      <h3 class="title">等级规则说明</h3>
      <Tinymce v-model="formValidate.rule" :key="keyIndex" class="mb20"></Tinymce>
      <el-button type="primary" plain class="submission" size="small" @click="previewProtol">预览</el-button>
      <el-button
        type="primary"
        class="submission"
        v-hasPermi="['platform:system:user:level:rule:update']"
        size="small"
        v-debounceClick="
          () => {
            handleSubmit('formValidate');
          }
        "
        >提交</el-button
      >
    </el-card>
    <div class="Box">
      <el-dialog
        v-if="modals"
        :visible.sync="modals"
        title=""
        height="30%"
        custom-class="dialog-scustom"
        class="addDia"
      >
        <div class="agreement">
          <h3>等级规则说明</h3>
          <div class="content">
            <div v-html="formValidate.rule"></div>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce/index';
import { systemUserLevelRuleApi, systemUserLevelUpdateRuleApi } from '@/api/user';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
export default {
  name: 'description',
  components: { Tinymce },
  data() {
    return {
      agreement: '',
      formValidate: {
        rule: '',
      },
      keyIndex: Math.random(),
      fullscreenLoading: false,
      modals: false,
    };
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      this.fullscreenLoading = true;
      systemUserLevelRuleApi()
        .then((res) => {
          this.formValidate = {
            rule: res,
          };
          this.fullscreenLoading = false;
        })
        .catch((res) => {
          this.fullscreenLoading = false;
        });
    },

    // 提交
    handleSubmit() {
      if (this.formValidate.rule === '' || !this.formValidate.rule) {
        return this.$message.warning('请输入规则信息！');
      } else {
        this.fullscreenLoading = true;
        systemUserLevelUpdateRuleApi(this.formValidate)
          .then(async (res) => {
            this.fullscreenLoading = false;
            this.$message.success('提交成功');
          })
          .catch((res) => {
            this.fullscreenLoading = false;
          });
      }
    },
    previewProtol() {
      this.modals = true;
    },
  },
};
</script>

<style scoped lang="scss">
.dialog-scustom,
.addDia {
  min-width: 400px;
  height: 900px;
  .el-dialog {
    width: 400px;
  }
  h3 {
    color: #333;
    font-size: 16px;
    text-align: center;
    font-weight: bold;
    margin: 0;
  }
}
.title {
  font-weight: bold;
  font-size: 18px;
  width: 1000px;
  margin-bottom: 20px;
}
.agreement {
  width: 350px;
  margin: 0 auto;
  box-shadow: 1px 5px 5px 2px rgba(0, 0, 0, 0.2);
  padding: 26px;
  border-radius: 15px;
  .content {
    height: 600px;
    overflow-y: scroll;
    ::v-deep p {
      font-size: 13px;
      line-height: 22px;
    }
  }
  ::v-deep img {
    max-width: 100%;
  }
  p {
    text-align: justify;
  }
}
/*css主要部分的样式*/
/*定义滚动条宽高及背景，宽高分别对应横竖滚动条的尺寸*/

::-webkit-scrollbar {
  width: 10px; /*对垂直流动条有效*/
  height: 10px; /*对水平流动条有效*/
}

/*定义滚动条的轨道颜色、内阴影及圆角*/
::-webkit-scrollbar-track {
  /*-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);*/
  background-color: transparent;
  border-radius: 3px;
}
</style>
