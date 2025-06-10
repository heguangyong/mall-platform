<template>
  <div class="divBox">
    <div class="container_box">
      <pages-header
        ref="pageHeader"
        :title="$route.params.id ? '商品标签编辑' : '商品标签新增'"
        backUrl="/product/tag"
      ></pages-header>
      <el-card class="box-card box-body mt14" :bordered="false" shadow="never">
        <el-tabs v-model="activeName" class="list-tabs">
          <el-tab-pane label="基础设置" name="first"></el-tab-pane>
          <el-tab-pane label="使用范围" name="second"></el-tab-pane>
        </el-tabs>
        <el-form
          ref="dataForm"
          class="form-boder-padding"
          :model="dataForm"
          label-width="99px"
          :rules="rules"
          v-loading="loadingFrom"
        >
          <template v-if="activeName === 'first'">
            <el-form-item label="标签名称：" prop="tagName">
              <el-input
                v-model.trim="dataForm.tagName"
                type="text"
                placeholder="请输入标签名称"
                maxLength="5"
                class="from-ipt-width"
                :disabled="dataForm.owner === 0"
              />
            </el-form-item>
            <el-form-item label="标签说明：" prop="tagNote">
              <el-input
                class="from-ipt-width"
                v-model.trim="dataForm.tagNote"
                type="textarea"
                placeholder="请输入标签说明"
                :disabled="dataForm.owner === 0"
              />
            </el-form-item>
            <el-form-item label="排序：" prop="sort">
              <el-input-number
                class="from-ipt-width"
                v-model.trim="dataForm.sort"
                :min="1"
                :max="99999"
                :step="1"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="生效时间：" prop="timerange">
              <el-date-picker
                v-model="dataForm.timerange"
                size="small"
                class="from-ipt-width"
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
            <el-form-item>
              <el-button v-show="activeName == 'first'" size="small" type="primary" @click="activeName = 'second'"
                >下一步</el-button
              >
            </el-form-item>
          </template>
          <template v-if="activeName === 'second'">
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
                  <el-input-number
                    :min="1"
                    :max="9999"
                    :step="1"
                    v-model.trim="dataForm.playProducts"
                  ></el-input-number>
                  件，展示此标签。
                </div>
                <div v-if="dataForm.tagName === '自营'">商家有自营标签时，展示此标签。</div>
                <div v-if="dataForm.tagName === '热卖'">
                  最近30天用户评论数大于
                  <el-input-number
                    :min="1"
                    :max="9999"
                    :step="1"
                    v-model.trim="dataForm.playProducts"
                  ></el-input-number>
                  条，展示此标签。
                </div>
                <div v-if="dataForm.tagName === '优选'">
                  最近30天用户5星好评大于
                  <el-input-number
                    :min="1"
                    :max="9999"
                    :step="1"
                    v-model.trim="dataForm.playProducts"
                  ></el-input-number>
                  条，展示此标签。
                </div>
                <div v-if="dataForm.tagName === '包邮'">全国包邮商品，展示此标签。</div>
              </el-form-item>
            </div>
            <!--      自建标签规则可只用的条件-->
            <div v-if="dataForm.owner > 0 || !dataForm.id">
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
              <el-button
                v-show="activeName === 'second'"
                size="small"
                class="priamry_border"
                @click="activeName = 'first'"
                >上一步</el-button
              >
              <el-button
                type="primary"
                v-hasPermi="['platform:product:tag:save', 'platform:product:tag:update']"
                :loading="loading"
                @click="onsubmit('dataForm')"
                >保存
              </el-button>
            </el-form-item>
          </template>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
<script setup>
import productAssociationForm from '@/components/productAssociationForm/index.vue';
import merchantName from '@/components/merUseCategory/index.vue';
import { mapGetters } from 'vuex';
import * as storeApi from '@/api/product';
import { productTagInfoApi } from '@/api/product';

export default {
  name: 'editProductCateTag',
  components: { productAssociationForm, merchantName },
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
      activeName: 'first',
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
    if (this.$route.params.id) {
      this.initEditData();
    }
  },
  methods: {
    initEditData() {
      this.loading = true;
      productTagInfoApi(this.$route.params.id)
        .then((res) => {
          this.dataForm = { ...res, timerange: [] };
          if (res.startTime && res.endTime) {
            this.dataForm.timerange = [new Date(res.startTime), new Date(res.endTime)];
          }
          // 初始化根据条件加载对应商品的条件
          this.getRecommendedInfo();
          this.loading = false;
        })
        .catch((res) => {
          this.loading = false;
        });
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
                this.$message.success('编辑成功');
                this.$router.push({ path: `/product/tag` });
              })
              .catch((err) => {})
              .finally(() => {
                this.loading = false;
              });
          } else {
            storeApi
              .productTagAddApi(this.dataForm)
              .then(() => {
                this.$message.success('新增成功');
                this.$router.push({ path: `/product/tag` });
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
.box-body {
  ::v-deep.el-card__body {
    padding-top: 0px;
  }
}
</style>
