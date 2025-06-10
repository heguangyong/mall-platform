<script setup>
import { pcBaseConfigEditApi, pcBaseConfigGetApi } from '@/api/systemPcConfig';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
export default {
  name: 'basicSettings',
  data() {
    return {
      fullscreenLoading: false,
      ruleValidate: {
        goodStoreImage: [{ required: true, message: '请上传品牌好店广告图', trigger: 'change' }],
        leftTopLogo: [{ required: true, message: '请上传左上角logo', trigger: 'change' }],
        goPhoneQrCodeTypeList: [
          { type: 'array', required: true, message: '请选择手机体验购买二维码类型', trigger: 'change' },
        ],
      },
      formValidate: {
        goPhoneQrCodeTypeList: [],
        goodStoreImage: '',
        leftTopLogo: '',
        goPhoneQrCodeType: '',
        merchantApplySwitch: "1"
      },
    };
  },
  mounted() {
    if (checkPermi(['platform:pc:shopping:base:config:get'])) this.getBaseConfig();
  },
  methods: {
    checkPermi,
    //上传图片
    modalPicTap(multiple, name) {
      const _this = this;
      this.$modalUpload(
        function (img) {
          if (!img) return;
          if (name === 'leftTopLogo') {
            _this.formValidate.leftTopLogo = img[0].sattDir;
          } else {
            _this.formValidate.goodStoreImage = img[0].sattDir;
          }
        },
        multiple,
        'imageUrl',
      );
    },
    //保存
    handleBaseConfigSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loadingBtn = true;
          this.formValidate.goPhoneQrCodeType = this.formValidate.goPhoneQrCodeTypeList.join(',');
          pcBaseConfigEditApi(this.formValidate)
            .then((res) => {
              this.$message.success('保存成功');
              this.loadingBtn = false;
              this.getBaseConfig();
            })
            .catch(() => {
              this.loadingBtn = false;
            });
        } else {
          return false;
        }
      });
    },
    getBaseConfig() {
      pcBaseConfigGetApi().then((res) => {
        Object.assign(this.formValidate, res);
        this.formValidate.goPhoneQrCodeTypeList = res.goPhoneQrCodeType ? res.goPhoneQrCodeType.split(',') : [];
      });
    },
  },
};
</script>

<template>
  <div class="divBox">
    <el-card class="box-card" :body-style="{ padding: '40px 50px' }" shadow="never" :bordered="false">
      <el-form
        ref="formValidate"
        v-loading="fullscreenLoading"
        class="formValidate"
        :rules="ruleValidate"
        :model="formValidate"
        label-width="180px"
        @submit.native.prevent
      >
        <el-form-item label="PC商城左上角logo(100*36)：" prop="leftTopLogo">
          <div class="upLoadPicBox" @click="modalPicTap(false, 'leftTopLogo')">
            <div v-if="formValidate.leftTopLogo" class="pictrue"><img :src="formValidate.leftTopLogo" /></div>
            <div v-else class="upLoad">
              <i class="el-icon-camera cameraIconfont" />
            </div>
          </div>
        </el-form-item>
        <el-form-item label="品牌好店广告图(288*422)：" prop="goodStoreImage">
          <div class="upLoadPicBox" @click="modalPicTap(false, 'goodStoreImage')">
            <div v-if="formValidate.goodStoreImage" class="pictrue"><img :src="formValidate.goodStoreImage" /></div>
            <div v-else class="upLoad">
              <i class="el-icon-camera cameraIconfont" />
            </div>
          </div>
        </el-form-item>
        <el-form-item label="手机体验：">
          <el-checkbox-group v-model="formValidate.goPhoneQrCodeTypeList">
            <el-checkbox label="1">小程序</el-checkbox>
            <el-checkbox label="2">公众号/H5</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="商户入驻入口：">
          <el-switch
            v-model="formValidate.merchantApplySwitch"
            active-value="1"
            inactive-value="0"
            active-text="开启"
            inactive-text="关闭"
          />
        </el-form-item>
        <el-form-item v-hasPermi="['platform:pc:shopping:base:config:edit']">
          <el-button
            size="small"
            type="primary"
            v-debounceClick="
              () => {
                handleBaseConfigSave('formValidate');
              }
            "
            >保存</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped lang="scss"></style>
