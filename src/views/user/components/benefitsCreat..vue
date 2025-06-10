<template>
  <el-drawer
    :visible.sync="drawerVisible"
    :wrapperClosable="false"
    direction="rtl"
    size="800px"
    :before-close="handleClose"
    class="showHeader"
  >
    <div slot="title" class="demo-drawer_title">会员权益设置</div>
    <div class="detailSection">
      <el-form :model="pram" ref="pram" label-width="75px" class="demo-ruleForm px35" :rules="rules">
        <el-form-item label="权益名称：">
          <div class="from-ipt-width el-input el-input--small" disabled>
            <span class="el-input__inner">
              {{ pram.name | filterMemberBenefits }}
            </span>
          </div>
        </el-form-item>
        <el-form-item label="展示名称：" prop="value">
          <el-input v-model="pram.value" maxlength="6" class="from-ipt-width"></el-input>
          <div class="from-tips">用于用户端-付费会员页面「权益名称」展示，最多支持6个字。</div>
        </el-form-item>
        <el-form-item label="权益图标：" prop="imageUrl">
          <div class="upLoadPicBox acea-row" @click="modalPicTap(false)">
            <div v-if="pram.imageUrl" class="pictrue"><img :src="pram.imageUrl" /></div>
            <div v-else class="upLoad">
              <i class="el-icon-camera cameraIconfont" />
            </div>
          </div>
          <div class="from-tips">用于用户端-付费会员页面「权益图标」展示，建议80*80PX，小于5KB。</div>
        </el-form-item>
        <el-form-item label="权益简介：" prop="message">
          <el-input class="from-ipt-width" v-model.trim="pram.message" maxlength="8" placeholder="请输入商品简介" />
          <div class="from-tips">用于用户端-付费会员页面「权益简介」展示，最多支持8个字。</div>
        </el-form-item>
        <template v-if="pram.name === 'integralDoubling' || pram.name === 'experienceDoubling'">
          <el-form-item label="倍数：" required>
            <el-input-number v-model.trim="pram.multiple" :min="1" :max="9" :step="1" placeholder="请输入排序" />
            <div class="from-tips">付费会员相对普通用户获得积分倍数，支持输入1～9正整数。</div>
          </el-form-item>
          <el-form-item label="翻倍渠道：" required>
            <el-checkbox-group v-model="pram.channelStrList" @change="checkedBoxChange">
              <template v-if="pram.name === 'integralDoubling'">
                <el-checkbox label="1">签到</el-checkbox>
                <el-checkbox label="2">购买商品</el-checkbox>
              </template>
              <template v-if="pram.name === 'experienceDoubling'">
                <el-checkbox label="1">签到</el-checkbox>
                <el-checkbox label="2">发布种草</el-checkbox>
              </template>
            </el-checkbox-group>
            <div class="from-tips">至少需要选中一项，未选中渠道付费会员进行此操作经验值不翻倍。</div>
          </el-form-item>
        </template>
        <el-form-item label="排序：" required>
          <el-input-number v-model.trim="pram.sort" :min="0" :max="10" :step="1" placeholder="请输入排序" />
          <div class="from-tips">数字越大，用户端及管理端列表，此权益的排序越靠前，支持输入0～10整数。</div>
        </el-form-item>
        <el-form-item label="状态：" required>
          <el-switch
            v-model="pram.status"
            active-text="开启"
            inactive-text="关闭"
            :active-value="true"
            :inactive-value="false"
          />
          <div class="from-tips">会员权益关闭之后，不会在用户端展示，付费会员也不能够享受此权益。</div>
        </el-form-item>
      </el-form>
    </div>
    <div class="demo-drawer__footer from-foot-btn btn-shadow drawer_fix">
      <div class="acea-row row-center">
        <el-button @click="handleClose">取 消</el-button>
        <el-button v-if="checkPermi(['platform:paid:member:benefits:edit'])" type="primary" v-debounceClick="submitForm"
          >确定</el-button
        >
      </div>
    </div>
  </el-drawer>
</template>
<script>
import { checkPermi } from '@/utils/permission';
import { menuMerAdd, menuMerUpdate } from '@/api/merchant';
import { memberBenefitsEditApi } from '@/api/user';

export default {
  name: 'benefitsEdit',
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
  data() {
    return {
      pram: {
        channelStrList: [],
        channelStr: '',
        expand: '',
        id: 0,
        imageUrl: '',
        message: '',
        multiple: 1,
        name: '',
        sort: 0,
        status: true,
        value: '',
      },
      rules: {
        value: [
          { required: true, message: '请输入展示名称', trigger: 'blur' },
          { min: 1, max: 6, message: '长度在 1 到 6 个字符', trigger: 'blur' },
        ],
        imageUrl: [{ required: true, message: '请上传权益图标', trigger: 'change' }],
        message: [{ required: true, message: '请输入权益简介', trigger: 'blur' }],
        channelStrList: [{ type: 'array', required: true, message: '请至少选择一个渠道', trigger: 'change' }],
      },
    };
  },
  mounted() {
    this.pram = Object.assign({}, this.pramInfo);
    this.pram.channelStrList = this.pram.channelStr ? [...this.pram.channelStr.split(',')] : [];
  },
  methods: {
    checkPermi,
    checkedBoxChange() {
      this.$forceUpdate(); //强制渲染多选框样式，否则值变了样式没有选中
    },
    handleClose() {
      this.$emit('onClosedrawerVisible');
    },
    modalPicTap(multiple) {
      const _this = this;
      this.$modalUpload(
        function (img) {
          if (!img) return;
          _this.pram.imageUrl = img[0].sattDir;
        },
        multiple,
        'content',
      );
    },
    submitForm() {
      this.$refs.pram.validate((valid) => {
        if (valid) {
          if (
            !this.pram.channelStrList.length &&
            (this.pram.name === 'integralDoubling' || this.pram.name === 'experienceDoubling')
          )
            return this.$modal.msgWarning('翻倍渠道至少需要选中一项');
          this.pram.channelStr = this.pram.channelStrList.join(',');
          memberBenefitsEditApi(this.pram).then((response) => {
            this.$modal.msgSuccess('保存成功');
            this.$forceUpdate();
            this.$emit('subSuccess');
          });
        }
      });
    },
  },
};
</script>
<style scoped lang="scss">
.detailSection form {
  padding-bottom: 80px;
}
</style>
