<template>
  <el-drawer
    :visible.sync="drawerVisible"
    :wrapperClosable="false"
    direction="rtl"
    size="800px"
    :before-close="handleClose"
    class="showHeader"
  >
    <div slot="title" class="demo-drawer_title">{{ pram.id ? '编辑会员卡' : '新增会员卡' }}</div>
    <div class="detailSection">
      <el-form :model="pram" ref="pram" label-width="88px" class="demo-ruleForm px35" :rules="rules">
        <el-form-item label="会员卡名称：" prop="name">
          <div class="from-ipt-width el-input el-input--small" disabled>
            <el-input
              v-model="pram.name"
              maxlength="10"
              class="from-ipt-width"
              placeholder="请输入会员卡名称"
            ></el-input>
            <div class="from-tips">用于用户端-付费会员页面「会员卡名称」展示，最多支持10个字。</div>
          </div>
        </el-form-item>
        <el-form-item label="标签文字：">
          <el-input v-model="pram.label" placeholder="请输入标签文字" maxlength="6" class="from-ipt-width"></el-input>
          <div class="from-tips">
            用于用户端-付费会员页面会员卡片上「标签」文字，标签为空时在用户端不展示，最多支持6个字。
          </div>
        </el-form-item>
        <el-form-item label="会员卡类型：" required>
          <el-radio-group v-model="pram.type" :disabled="pram.id ? true : false">
            <el-radio :label="0">试用</el-radio>
            <el-radio :label="1">期限</el-radio>
            <el-radio :label="2">永久</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="pram.type < 2" label="会员卡期限：" required>
          <el-input-number v-model.trim="pram.deadlineDay" :min="1" :max="2000" :step="1" placeholder="期限" />
          <div class="from-tips">此会员的使用期限（天），支持输入1～2000正整数。</div>
        </el-form-item>
        <el-form-item label="会员卡原价：" required>
          <el-input-number
            v-model.trim="pram.originalPrice"
            :min="0.01"
            :max="99999.99"
            :precision="2"
            :step="0.1"
            placeholder="会员卡原价"
          />
          <div class="from-tips">用于用户购买会员时展示此划线价（元），支持输入0.01～99999.99。</div>
        </el-form-item>
        <el-form-item label="会员卡售价：" required>
          <el-input-number
            v-model.trim="pram.price"
            :min="0.01"
            :max="99999.99"
            :precision="2"
            :step="0.1"
            placeholder="售价"
          />
          <div class="from-tips">实际出售价格（元），支持输入0.01～99999.99。</div>
        </el-form-item>
        <el-form-item label="赠送余额：" required>
          <el-input-number
            v-model.trim="pram.giftBalance"
            :min="0"
            :max="999.99"
            :precision="2"
            :step="0.1"
            placeholder="赠送余额"
          />
          <el-checkbox v-model="pram.isFirstChargeGive" class="ml15">仅首充赠送</el-checkbox>
          <div class="from-tips">开通此会员，赠送给用户的余额值（元），支持输入0.00～999.99。</div>
        </el-form-item>
        <el-form-item label="排序：">
          <el-input-number
            v-model.trim="pram.sort"
            :min="0"
            :max="999"
            :step="1"
            step-strictly
            label="排序"
          ></el-input-number>
          <div class="from-tips">数字越大，用户端及管理端列表，此会员卡的排序越靠前，支持输入0～999整数。</div>
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
        <el-button @click="handleClose">取消</el-button>
        <el-button
          v-if="checkPermi(['platform:paid:member:card:add', 'platform:paid:member:card:edit'])"
          type="primary"
          v-debounceClick="submitForm"
          >确定</el-button
        >
      </div>
    </div>
  </el-drawer>
</template>
<script>
import { checkPermi } from '@/utils/permission';
import { menuMerAdd, menuMerUpdate } from '@/api/merchant';
import { memberBenefitsEditApi, memberCardAddApi, memberCardEditApi, memberCardListApi } from '@/api/user';

export default {
  name: 'cardCreat',
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
        deadlineDay: 0,
        giftBalance: 0,
        id: 0,
        isFirstChargeGive: true,
        label: '',
        name: '',
        originalPrice: 0,
        price: 0,
        sort: 0,
        status: true,
        type: 0,
      },
      rules: {
        name: [
          { required: true, message: '请输入会员卡名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' },
        ],
      },
    };
  },
  mounted() {
    this.pram = Object.assign({}, this.pramInfo);
  },
  methods: {
    checkPermi,
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
      this.$refs.pram.validate(async (valid) => {
        if (valid) {
          try {
            this.pram.id ? await memberCardEditApi(this.pram) : await memberCardAddApi(this.pram);
            this.$modal.msgSuccess('保存成功');
            this.$emit('subSuccess');
          } catch (e) {}
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
