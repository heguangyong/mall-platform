<template>
  <div>
    <div class="detailHead bdbtmSolid">
      <div class="acea-row row-between headerBox">
        <div class="full">
          <div class="order_icon"><span class="iconfont icon-shanghuliebiao"></span></div>
          <div class="text">
            <div class="acea-row">
              <div class="title mr10">{{ dataForm.name ? dataForm.name : '新增商户' }}</div>
              <div v-show="dataForm.isSelf" class="isSelf bg-prompt-color">自营</div>
              <div v-show="dataForm.typeId" class="ml8 bg-warning-color isSelf">
                {{ dataForm.typeId | merchantTypeFilter }}
              </div>
            </div>
            <div v-if="dataForm.addressDetail">
              <span class="mr20">{{ dataForm.addressDetail }}</span>
            </div>
          </div>
        </div>
        <div class="dialog-footer" v-if="!isDisabled">
          <el-button size="small" @click="handleClose">取消</el-button>
          <el-button
            type="primary"
            size="small"
            v-hasPermi="['platform:merchant:add', 'platform:merchant:update']"
            :loading="loading"
            @click="onsubmit('dataForm')"
            >保存</el-button
          >
        </div>
        <div v-show="isDisabled" class="right-align">
          <el-button
            type="primary"
            size="small"
            v-hasPermi="['platform:merchant:update']"
            :loading="loading"
            @click="handleChangeEdit"
            >编辑</el-button
          >
        </div>
      </div>
    </div>
    <div class="prompt">
      <el-alert title="商户登录账号为手机号，初始密码为000000，可从个人中心修改密码" type="warning" effect="light">
      </el-alert>
    </div>
    <el-form v-loading="loadingFrom" ref="dataForm" :model="dataForm" label-width="100px" :rules="rules">
      <el-form-item label="商户名称：" prop="name">
        <el-input
          class="from-ipt-width"
          v-model.trim="dataForm.name"
          :maxlength="isCn ? '16' : '16'"
          :disabled="isDisabled"
          placeholder="请输入商户名称"
        />
      </el-form-item>
      <el-form-item v-if="merId > 0 || isDisabled" label="商户账号：" required>
        <el-input
          v-model.trim="dataForm.account"
          :disabled="isDisabled || merId > 0"
          placeholder="请输入商户账号"
          class="from-ipt-width"
        />
      </el-form-item>
      <el-form-item label="商户手机号：" prop="phone">
        <el-input
          v-model.trim="dataForm.phone"
          :disabled="isDisabled || merId > 0"
          placeholder="请输入商户手机号"
          class="from-ipt-width"
        />
      </el-form-item>
      <el-form-item label="商户姓名：" prop="realName">
        <el-input
          v-model.trim="dataForm.realName"
          :disabled="isDisabled"
          placeholder="请输入商户姓名"
          class="from-ipt-width"
        />
      </el-form-item>
      <el-form-item label="商户分类：" prop="categoryId">
        <el-select
          class="from-ipt-width"
          v-model="dataForm.categoryId"
          placeholder="请选择商户分类"
          :disabled="isDisabled"
          @change="onChange(dataForm.categoryId)"
        >
          <el-option v-for="item in merchantClassify" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="手续费(%)：" prop="handlingFee">
        <el-input-number
          :disabled="isDisabled"
          v-model.trim="dataForm.handlingFee"
          :min="0"
          :precision="2"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="店铺类型：" prop="typeId">
        <el-select v-model="dataForm.typeId" placeholder="请选择店铺类型" :disabled="isDisabled" class="from-ipt-width">
          <el-option v-for="(item, index) in merchantType" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商户关键字：" prop="labelarr">
        <Keyword @getLabelarr="getLabelarr" :isDisabled="isDisabled" :labelarr="labelarr"></Keyword>
      </el-form-item>
      <el-form-item label="资质图片：" prop="sliderImages">
        <div class="acea-row">
          <div
            v-for="(item, index) in dataForm.sliderImages"
            :key="index"
            class="pictrue"
            draggable="true"
            @dragstart="handleDragStart($event, item)"
            @dragover.prevent="handleDragOver($event, item)"
            @dragenter="handleDragEnter($event, item)"
            @dragend="handleDragEnd($event, item)"
          >
            <img :src="item" />
            <i v-if="!isDisabled" class="el-icon-error btndel" @click="handleRemove(index)" />
          </div>
          <div v-if="dataForm.sliderImages.length < 10 && !isDisabled" class="upLoadPicBox" @click="modalPicTap(true)">
            <div class="upLoad">
              <i class="el-icon-camera cameraIconfont" />
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="备注：" prop="remark">
        <el-input
          v-model.trim="dataForm.remark"
          :disabled="isDisabled"
          type="textarea"
          placeholder="请输入备注"
          class="from-ipt-width"
        />
      </el-form-item>
      <el-form-item label="排序：" prop="sort">
        <el-input-number
          v-model.trim="dataForm.sort"
          :disabled="isDisabled"
          :min="$constants.NUM_Range.min"
          :max="$constants.NUM_Range.max"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="星级评分：" v-if="merId > 0" class="inline">
        <el-rate :disabled="merId > 0 && isDisabled" v-model="dataForm.starLevel" style="margin-top: 8px"></el-rate>
      </el-form-item>
      <el-form-item label="是否开启：" v-if="dataForm.isSwitch" class="inline">
        <el-switch
          v-model="dataForm.isSwitch"
          :disabled="isDisabled"
          :active-value="true"
          :inactive-value="false"
          active-text="显示"
          inactive-text="隐藏"
        ></el-switch>
      </el-form-item>
      <el-form-item label="是否推荐：" class="inline">
        <el-switch
          v-model="dataForm.isRecommend"
          :disabled="isDisabled"
          :active-value="true"
          :inactive-value="false"
          active-text="是"
          inactive-text="否"
        ></el-switch>
      </el-form-item>
      <el-form-item label="是否自营：" class="inline">
        <el-switch
          v-model="dataForm.isSelf"
          :disabled="isDisabled"
          :active-value="true"
          :inactive-value="false"
          active-text="是"
          inactive-text="否"
        ></el-switch>
      </el-form-item>
      <el-form-item label="商品审核：" class="inline">
        <el-switch
          v-model="dataForm.productSwitch"
          :disabled="isDisabled"
          :active-value="true"
          :inactive-value="false"
          active-text="开启"
          inactive-text="关闭"
        ></el-switch>
      </el-form-item>
    </el-form>
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
import * as merchant from '@/api/merchant';
import { mapGetters } from 'vuex';
import Keyword from '../../../components/base/keyword';
import { validatePhone } from '@/utils/toolsValidate';

export default {
  name: 'creatClassify',
  components: { Keyword },
  computed: {
    ...mapGetters(['merchantClassify', 'merchantType']),
  },
  props: {
    merId: {
      type: Number,
      default: 0,
    },
    //true是详情，false是编辑
    isDisabled: {
      type: Boolean,
      default: false,
    },
    //操作类型，编辑、详情
    handleType: {
      type: String,
      default: '',
    },
    indexKey: {
      type: Number,
      default: 0,
    },
  },
  data() {
    const validateVal = (rule, value, callback) => {
      if (this.labelarr.length === 0) {
        callback(new Error('请输入后回车'));
      } else {
        callback();
      }
    };
    return {
      dialogVisible: false,
      loading: false,
      loadingFrom: false,
      rules: {
        name: [{ required: true, message: '请输入商户名称', trigger: 'blur' }],
        categoryId: [{ required: true, message: '请选择商户分类', trigger: 'change' }],
        typeId: [{ required: true, message: '请选择店铺类型', trigger: 'change' }],
        realName: [{ required: true, message: '请输入商户姓名', trigger: 'blur' }],
        labelarr: [{ required: true, validator: validateVal, trigger: 'blur' }],
        phone: [{ required: true, validator: validatePhone, trigger: 'blur' }],
        handlingFee: [{ required: true, message: '请输入手续费', trigger: 'blur' }],
        sliderImages: [{ required: true, message: '请上传资质图片', type: 'array', trigger: 'change' }],
      },
      dataForm: {
        categoryId: null,
        handlingFee: 0,
        isRecommend: false,
        isSelf: false,
        isSwitch: false,
        keywords: '',
        name: '',
        phone: '',
        productSwitch: false,
        qualificationPicture: '',
        realName: '',
        remark: '',
        sort: 0,
        typeId: null,
        sliderImages: [],
        id: 0,
      },
      isCn: true,
      labelarr: [],
      merImg: require('@/assets/imgs/dianpu.png'),
    };
  },
  watch: {
    merId: {
      handler: function (val) {
        if (val > 0) this.onInfo();
      },
      deep: true,
    },
    'dataForm.name': function (val) {
      let pattern = new RegExp('[\u4E00-\u9FA5]+');
      let pattern2 = new RegExp('[A-Za-z]+');
      if (pattern.test(val)) {
        this.isCn = true;
      } else if (pattern2.test(val)) {
        this.isCn = false;
      }
    },
  },
  mounted() {
    if (!this.merchantClassify.length) this.$store.dispatch('merchant/getMerchantClassify');
    if (!this.merchantType.length) this.$store.dispatch('merchant/getMerchantType');
    if (this.merId > 0) this.onInfo();
  },
  methods: {
    //详情中点击编辑按钮
    handleChangeEdit() {
      this.$emit('onChangeEdit');
      this.loading = false;
    },
    getLabelarr(attr) {
      this.labelarr = attr;
    },
    onChange(id) {
      this.dataForm.handlingFee = this.merchantClassify.find((item) => item.id === id).handlingFee;
    },
    // 详情
    onInfo() {
      if (!this.merchantClassify.length) this.$store.dispatch('merchant/getMerchantClassify');
      if (!this.merchantType.length) this.$store.dispatch('merchant/getMerchantType');
      this.loadingFrom = true;
      merchant.merchantDetailApi(this.merId).then((res) => {
        this.$set(res, 'sliderImages', res.qualificationPicture ? JSON.parse(res.qualificationPicture) : []);
        this.dataForm = res;
        this.labelarr = res.keywords.split(',') || [];
        this.loadingFrom = false;
      });
    },
    // 点击商品图
    modalPicTap(multiple) {
      const _this = this;
      this.$modalUpload(
        function (img) {
          if (!img) return;
          if (img.length > 10) return this.$message.warning('最多选择10张图片！');
          if (img.length + _this.dataForm.sliderImages.length > 10) return this.$message.warning('最多选择10张图片！');
          img.map((item) => {
            _this.dataForm.sliderImages.push(item.sattDir);
          });
        },
        multiple,
        'store',
      );
    },
    handleRemove(i) {
      this.dataForm.sliderImages.splice(i, 1);
    },
    //取消
    handleClose() {
      if (this.merId > 0) {
        if (this.handleType === 'edit') {
          this.$emit('closeModel');
        } else {
          this.onInfo();
          this.handleChangeEdit();
        }
      } else {
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();
        });
        this.$emit('closeModel');
      }
    },
    //编辑、添加回调
    onClose() {
      this.$refs['dataForm'].resetFields();
      this.$emit('getList');
      this.loading = false;
    },
    onsubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.dataForm.qualificationPicture = JSON.stringify(this.dataForm.sliderImages);
          this.dataForm.keywords = this.labelarr.join(',');
          this.dataForm.id === 0
            ? merchant
                .merchantAddApi(this.dataForm)
                .then((res) => {
                  this.$message.success(`添加商户成功`);
                  this.onClose();
                })
                .catch(() => {
                  this.loading = false;
                })
            : merchant
                .merchantUpdateApi(this.dataForm)
                .then((res) => {
                  this.$message.success('操作成功');
                  if (this.handleType === 'edit') {
                    this.onClose();
                  } else {
                    this.onInfo();
                    this.handleChangeEdit();
                  }
                })
                .catch(() => {
                  this.loading = false;
                });
        } else {
          return false;
        }
      });
    },
    // 移动
    handleDragStart(e, item) {
      this.dragging = item;
    },
    handleDragEnd(e, item) {
      this.dragging = null;
    },
    handleDragOver(e) {
      e.dataTransfer.dropEffect = 'move';
    },
    handleDragEnter(e, item) {
      e.dataTransfer.effectAllowed = 'move';
      if (item === this.dragging) {
        return;
      }
      const newItems = [...this.dataForm.sliderImages];
      const src = newItems.indexOf(this.dragging);
      const dst = newItems.indexOf(item);
      newItems.splice(dst, 0, ...newItems.splice(src, 1));
      this.dataForm.sliderImages = newItems;
    },
  },
};
</script>

<style scoped lang="scss">
.isSelf {
  padding: 2px 4px;
  height: 16px;
  border-radius: 2px 2px 2px 2px;
  font-size: 13px;
  color: #ffffff;
  text-align: center;
  line-height: 1;
}
::v-deep .el-form {
  padding-left: 30px;
}
.right-align {
  text-align: right;
  box-sizing: border-box;
}
.prompt {
  width: 100%;
  padding: 20px 25px;
}
.el-alert {
  width: 100%;
  ::v-deep.el-form-item__content {
    width: 100%;
  }
}
.inline {
  ::v-deep.el-form-item__content,
  ::v-deep.el-input-number {
    width: 228px;
  }
  ::v-deep.el-select {
    width: 100%;
  }
}
</style>
