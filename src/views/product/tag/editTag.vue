<template>
  <div>
    <el-form
      ref="dataForm"
      class="tagForm"
      :model="dataForm"
      label-width="120px"
      :rules="rules"
      v-loading="loadingFrom"
    >
      <el-form-item label="标签名称：" prop="tagName">
        <el-input
          v-model.trim="dataForm.tagName"
          type="text"
          placeholder="请输入标签名称"
          maxLength="5"
          :disabled="dataForm.owner === 0"
        />
      </el-form-item>
      <el-form-item label="标签说明：" prop="tagNote">
        <el-input
          v-model.trim="dataForm.tagNote"
          type="textarea"
          placeholder="请输入标签说明"
          :disabled="dataForm.owner === 0"
        />
      </el-form-item>
      <el-form-item label="排序：" prop="sort">
        <el-input-number v-model.trim="dataForm.sort" :min="1" :max="99999" :step="1"></el-input-number>
      </el-form-item>
      <el-form-item label="生效时间：" prop="timerange">
        <el-date-picker
          v-model="dataForm.timerange"
          size="small"
          class="selWidth"
          type="daterange"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          @change="onchangeTime"
          :picker-options="pickerOptionsForEditCoupon"
        />
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-switch
          v-model="dataForm.status"
          :active-value="1"
          :inactive-value="0"
          active-text="显示"
          inactive-text="隐藏"
          @change="handleStatusChange"
        >
        </el-switch>
      </el-form-item>
      <el-form-item label="商城中的位置：" prop="position">
        <el-radio v-model="dataForm.position" :label="0">标题下</el-radio>
        <el-radio v-model="dataForm.position" :label="1">标题前</el-radio>
        <div class="from-tips">标题前最多展示1个标签，标题下最多展示3个标签；系统根据标签顺序进行展示</div>
      </el-form-item>
      <!--      系统标签规则-->
      <div v-if="dataForm.owner === 0">
        <el-form-item label="展示规则:" prop="playProducts">
          <div v-if="dataForm.tagName === '新品'">
            商品创建后
            <el-input-number :min="1" :max="30" :step="1" v-model.trim="dataForm.playProducts"></el-input-number>
            天内，展示此标签。
          </div>
          <div v-if="dataForm.tagName === '爆品'">
            最近30天销量大于
            <el-input-number :min="1" :max="9999" :step="1" v-model.trim="dataForm.playProducts"></el-input-number>
            件，展示此标签。
          </div>
          <div v-if="dataForm.tagName === '自营'">商家有自营标签时，展示此标签。</div>
          <div v-if="dataForm.tagName === '热卖'">
            最近30天用户评论数大于
            <el-input-number :min="1" :max="9999" :step="1" v-model.trim="dataForm.playProducts"></el-input-number>
            条，展示此标签。
          </div>
          <div v-if="dataForm.tagName === '优选'">
            最近30天用户5星好评大于
            <el-input-number :min="1" :max="9999" :step="1" v-model.trim="dataForm.playProducts"></el-input-number>
            条，展示此标签。
          </div>
          <div v-if="dataForm.tagName === '包邮'">全国包邮商品，展示此标签。</div>
        </el-form-item>
      </div>
      <!--      自建标签规则可只用的条件-->
      <div v-if="dataForm.owner > 0 || !editData.id">
        <div>
          <!--商品参与类型 0=指定商品，1=指定品牌，2=指定商户，3=指定商品分类-->
          <el-form-item label="商品参与类型：" prop="playType">
            <el-radio-group v-model="dataForm.playType" @input="handlePlayTypeChange">
              <el-radio label="product">指定商品参与</el-radio>
              <el-radio label="brand">指定品牌参与</el-radio>
              <el-radio label="category">指定分类参与</el-radio>
              <el-radio label="merchant">指定商户参与</el-radio>
            </el-radio-group>
            <!-- 选择商品加载方式-->
            <product-association-form
              class="mt14"
              :productAssociationType="dataForm.playType"
              :formValidate="dataForm"
              :multipleBrand="true"
              :multipleCategory="true"
              :isBatchDelete="false"
              @getProductAssociationData="getProductAssociationData"
            ></product-association-form>
          </el-form-item>
        </div>
      </div>
      <el-form-item>
        <el-button @click="handleClose('dataForm')">取消</el-button>
        <el-button
          type="primary"
          v-hasPermi="['platform:product:tag:save', 'platform:product:tag:update']"
          :loading="loading"
          @click="onsubmit('dataForm')"
          >保存
        </el-button>
        <!--        </span>-->
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
import * as storeApi from '@/api/product';
import { mapGetters } from 'vuex';
import merchantName from '@/components/merUseCategory/index.vue';
import productAssociationForm from '@/components/productAssociationForm/index.vue';

export default {
  name: 'editProductCateTag',
  components: { productAssociationForm, merchantName },
  props: {
    editData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  computed: {
    ...mapGetters(['merPlatProductClassify']),
  },
  data() {
    // 自定义组件校验规则
    let validatePlayTypeAndPlayProducts = (rule, value, callback) => {
      if (value === '' || this.dataForm.playProducts.length === 0) {
        callback(new Error('请选择参与类型和对应规则'));
      } else {
        callback();
      }
    };
    return {
      categoryProps: {
        value: 'id',
        label: 'name',
        children: 'childList',
        expandTrigger: 'hover',
        checkStrictly: false,
        emitPath: false,
        multiple: true,
      },
      treeList: [],
      loading: false,
      loadingFrom: false,
      rules: {
        // 表单验证参数
        tagName: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
        timerange: [{ required: true, message: '请选择生效时间区间', trigger: 'change' }],
        sort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
        playType: [
          {
            required: true,
            message: '请选择参与类型和对应规则',
            trigger: 'blur',
            validator: validatePlayTypeAndPlayProducts,
          },
        ],
      },
      // 初始化表单数据
      dataForm: {
        tagName: '',
        timerange: [],
        sort: 0,
        playType: 'product',
        playProducts: '',
        position: 0,
        proBrandList: [],
      },
      pickerOptionsForEditCoupon: {
        // 时间有效校验
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      formValidate: {
        products: null,
        proBrandList: [],
        proCategorylist: [],
        merIds: [],
      },
      playValues: null, // 待添加的商品参与类型
    };
  },
  created() {
    this.initEditData();
  },
  methods: {
    initEditData() {
      if (this.editData.id) {
        this.dataForm = { ...this.editData, timerange: [] };
        if (this.editData.startTime && this.editData.endTime) {
          this.dataForm.timerange = [new Date(this.editData.startTime), new Date(this.editData.endTime)];
        }
        // 初始化根据条件加载对应商品的条件
        this.getRecommendedInfo();
      }
    },
    // 点击商品图
    modalPicTap(multiple) {
      const _this = this;
      this.$modalUpload(
        function (img) {
          if (!img) return;
          _this.dataForm.icon = img[0].sattDir;
        },
        multiple,
        'product',
      );
    },
    handleClose() {
      this.$refs['dataForm'].resetFields();
      this.$emit('onCloseHandle');
    },
    onClose() {
      this.$emit('onCloseHandle');
    },
    handleStatusChange(op) {},
    onchangeTime(e) {
      this.dataForm.startTime = e ? e[0] : '';
      this.dataForm.endTime = e ? e[1] : '';
    },
    onsubmit(formName) {
      // 组装当前根据类型参数的业务id
      if (!this.dataForm.owner || this.dataForm.owner > 0) {
        if (this.playValues) {
          // 如果编辑过数据那么再转换格式
          if (this.dataForm.playType === 'product') {
            this.dataForm.playProducts = this.playValues.map((item) => item.id).join(',');
          } else {
            this.dataForm.playProducts = this.playValues.join(',');
          }
        }
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.dataForm.id) {
            storeApi
              .productTagUpdateApi(this.dataForm)
              .then(() => {
                this.$message.success('操作成功');
                this.onClose();
              })
              .catch((err) => {})
              .finally(() => {
                this.loading = false;
              });
          } else {
            storeApi
              .productTagAddApi(this.dataForm)
              .then(() => {
                this.$message.success('操作成功');
                this.onClose();
              })
              .catch((err) => {})
              .finally(() => {
                this.loading = false;
              });
          }
        } else {
          return false;
        }
      });
    },
    //模板数据
    getRecommendedInfo() {
      switch (this.dataForm.playType) {
        case 'product':
          this.dataForm.data = this.dataForm.playProducts;
          break;
        case 'brand':
          this.dataForm.proBrandList = this.dataForm.playProducts.includes(',')
            ? this.dataForm.playProducts.split(',').map((item) => Number(item))
            : [Number(this.dataForm.playProducts)];
          break;
        case 'category':
          this.dataForm.proCategorylist = this.dataForm.playProducts.split(',').map((item) => Number(item));
          break;
        case 'merchant':
          if (this.dataForm.playProducts) {
            this.dataForm.merIds = this.dataForm.playProducts.split(',').map((item) => Number(item));
          }
          break;
      }
    },
    getProductAssociationData(res) {
      this.playValues = res;
      this.dataForm.playProducts = this.playValues.join(',');
      this.dataForm.proBrandList = JSON.parse(JSON.stringify(this.playValues));
    },
    handlePlayTypeChange() {
      this.playValues = '';
      this.dataForm.playProducts = '';
      this.dataForm.data = '';
      this.dataForm.proBrandList = [];
      this.dataForm.proCategorylist = [];
      this.dataForm.merIds = [];
    },
  },
};
</script>

<style scoped lang="scss">
.lang {
  width: 100%;

  ::v-deep.el-form-item__content {
    width: 79%;
  }
}

.tagForm {
  margin: 20px;
}
</style>
