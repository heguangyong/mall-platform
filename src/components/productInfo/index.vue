<template>
  <div class="infoBox">
    <el-drawer
      :visible.sync="dialogVisibleInfoData"
      :title="isAtud ? '商品审核' : '商品详情'"
      :direction="direction"
      custom-class="demo-drawer"
      size="1000px"
      ref="drawer"
      class="infoBox"
      @close="onClose"
      :before-close="onClose"
    >
      <div v-loading="loading">
        <div class="detailHead">
          <div class="acea-row row-between headerBox">
            <div class="full">
              <img class="order_icon" :src="formValidate.image" alt="" />
              <div class="text">
                <div class="title">{{ formValidate.name }}</div>
                <div>
                  <span class="mr20">商品ID：{{ formValidate.id }}</span>
                </div>
              </div>
            </div>
            <div v-if="isAtud" class="acea-row justify-content">
              <el-button
                size="small"
                v-debounceClick="
                  () => {
                    onSubmit('fail');
                  }
                "
                style="margin-left: 0"
                >{{ loadingBtn ? '提交中 ...' : '审核拒绝' }}</el-button
              >
              <el-button
                size="small"
                type="primary"
                v-debounceClick="
                  () => {
                    onSubmit('success');
                  }
                "
                >{{ loadingBtn ? '提交中 ...' : '审核通过' }}</el-button
              >
            </div>
          </div>
          <ul class="list">
            <li v-show="formValidate.type >= 0" class="item">
              <div class="title">商品类型</div>
              <div>{{ formValidate.type | productTpyeFilter }}</div>
            </li>
            <li class="item">
              <div class="title">商品状态</div>
              <div class="color-warning">{{ formValidate.isShow ? '上架' : '下架' }}</div>
            </li>
            <li v-show="!formValidate.type && formValidate.type !== 0" class="item">
              <div class="title">兑换积分</div>
              <div>{{ formValidate.redeemIntegral }}</div>
            </li>
            <li class="item">
              <div class="title">
                {{ !formValidate.type && formValidate.type !== 0 ? '兑换金额（元）' : '商品售价' }}
              </div>
              <div>{{ formValidate.price }}元</div>
            </li>
            <li class="item">
              <div class="title">{{ !formValidate.type && formValidate.type !== 0 ? '已兑换数' : '销量' }}</div>
              <div>{{ formValidate.sales }}</div>
            </li>
            <li class="item">
              <div class="title">{{ formValidate.type >= 0 ? '库存' : '剩余库存' }}</div>
              <div>{{ formValidate.stock }}</div>
            </li>
            <li v-show="formValidate.type >= 0" class="item">
              <div class="title">创建时间</div>
              <div></div>
            </li>
          </ul>
        </div>
        <el-tabs type="border-card" v-model="currentTab" v-if="formValidate.id && isShow">
          <el-tab-pane label="基本信息" name="0">
            <div class="detailSection divBox">
              <ul class="list mt-16">
                <li v-show="formValidate.categoryId" class="item">
                  <div class="lang">平台商品分类：</div>
                  <div class="value">
                    <el-cascader
                      v-model="formValidate.categoryId"
                      :options="merPlatProductClassify"
                      :props="props1"
                      :show-all-levels="false"
                      :disabled="isDisabled"
                    />
                  </div>
                </li>
                <li v-show="formValidate.type >= 0" class="item">
                  <div class="lang">品牌：</div>
                  <div class="value">
                    {{ getListName(brandList, formValidate.brandId) }}
                  </div>
                </li>
                <li class="item">
                  <div class="lang">商品单位：</div>
                  <div class="value">{{ formValidate.unitName }}</div>
                </li>
                <li v-show="!formValidate.type && formValidate.type !== 0" class="item">
                  <div class="lang">兑换数量限制：</div>
                  <div class="value">{{ formValidate.exchangeNum }}</div>
                </li>
                <li v-show="!formValidate.type && formValidate.type !== 0" class="item">
                  <div class="lang">热门推荐：</div>
                  <div class="value">{{ formValidate.isHot == 1 ? '开启' : '关闭' }}</div>
                </li>
                <li class="item">
                  <div class="lang">排序：</div>
                  <div class="value">{{ formValidate.sort }}</div>
                </li>
                <li v-show="formValidate.type === 2" class="item">
                  <div class="lang">用户申请售后：</div>
                  <div class="value">{{ formValidate.refundSwitch ? '开启' : '关闭' }}</div>
                </li>
                <li v-if="(formValidate.type && formValidate.type !== 2) || formValidate.type === 0" class="item">
                  <div class="lang">配送方式：</div>
                  <template v-if="Number(formValidate.type) > 4">
                    <div class="value">自动发货</div>
                  </template>
                  <template v-else>
                    <div v-show="formValidate.deliveryMethod.includes('1')" style="color: #303133">商家配送</div>
                    <div
                      v-show="formValidate.deliveryMethod.includes('1') && formValidate.deliveryMethod.includes('2')"
                      style="color: #303133"
                    >
                      、
                    </div>
                    <div v-show="formValidate.deliveryMethod.includes('2')" style="color: #303133">到店自提</div>
                  </template>
                </li>
              </ul>
              <div class="list" style="display: block">
                <div class="item">
                  <div class="lang">关键字：</div>
                  <div class="value">{{ formValidate.keyword }}</div>
                </div>
                <div v-show="formValidate.guaranteeList" class="item">
                  <div class="lang line-heightOne">保障服务：</div>
                  <div class="value acea-row">
                    <div v-for="item in formValidate.guaranteeList" :key="item.id" class="mr20">
                      <span class="iconfont icon-ic-complete1 mr5 font14"></span>{{ item.name }}
                    </div>
                  </div>
                </div>
                <div class="item">
                  <div class="lang">商品简介：</div>
                  <div class="value">{{ formValidate.intro }}</div>
                </div>
                <div class="item">
                  <div class="acea-row row-middle">
                    <div class="lang">封面图：</div>
                    <div class="upLoadPicBox">
                      <el-image class="pictrue" :src="formValidate.image" :preview-src-list="[formValidate.image]" />
                    </div>
                  </div>
                </div>
                <div v-show="videoLink" class="item">
                  <div class="acea-row row-middle">
                    <div class="lang">主图视频：</div>
                    <div class="upLoadPicBox">
                      <video class="pictrue" :src="videoLink" controls="controls">您的浏览器不支持 video 标签。</video>
                    </div>
                  </div>
                </div>
                <div class="item">
                  <div class="acea-row row-middle">
                    <div class="lang">轮播图：</div>
                    <div v-for="(item, index) in formValidate.sliderImages" :key="index" class="pictrue">
                      <el-image class="pictrue" :src="item" :preview-src-list="formValidate.sliderImages" />
                    </div>
                  </div>
                </div>
                <div v-if="formValidate.couponList && formValidate.couponList.length" class="item">
                  <div class="acea-row row-middle">
                    <div class="lang">购买回馈券：</div>
                    <div class="acea-row" style="margin-top: -10px">
                      <el-tag
                        v-for="(tag, index) in formValidate.couponList"
                        :key="index"
                        class="mr10 mt10"
                        :closable="!isDisabled"
                        :disable-transitions="false"
                        effect="plain"
                      >
                        {{ tag.name }}
                      </el-tag>
                      <span v-if="formValidate.couponList.length === 0" class="mt10">无</span>
                    </div>
                  </div>
                </div>
                <div class="item" v-if="formValidate.systemFormValue">
                  <div class="acea-row row-middle">
                    <div class="lang">关联表单：</div>
                    <div>
                      <iframe
                        :src="`${getFrontDomainUrl()}/pages/goods/systemIframe/index?id=${formValidate.systemFormId}`"
                        style="width: 350px; height: 500px"
                        frameborder="0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="规格库存" name="1">
            <div class="detailSection divBox">
              <ul class="list mt-16">
                <li class="item">
                  <div class="tips tipsWidth">商品规格：</div>
                  <div class="value">{{ formValidate.specType ? '多规格' : '单规格' }}</div>
                </li>
                <li v-show="formValidate.type >= 0" class="item">
                  <div class="tips tipsWidth">佣金设置：</div>
                  <div class="value">{{ formValidate.isSub ? '单独设置' : '默认设置' }}</div>
                </li>
                <li v-show="formValidate.type >= 0" class="item">
                  <div class="tips tipsWidth">会员商品：</div>
                  <div class="value">{{ formValidate.isPaidMember ? '是' : '否' }}</div>
                </li>
              </ul>
              <div style="margin-top: 16px">
                <div class="tips tipsWidth mb10">商品属性：</div>
                <template>
                  <el-table :data="AttrValueList" class="tabNumWidth" size="small">
                    <template v-if="manyTabDate">
                      <el-table-column v-for="(item, iii) in manyTabDate" :key="iii" :label="manyTabTit[iii].title">
                        <template slot-scope="scope">
                          <span class="priceBox" v-text="scope.row[iii]" />
                        </template>
                      </el-table-column>
                    </template>
                    <el-table-column label="图片" width="60">
                      <template slot-scope="scope">
                        <div class="upLoadPicBox">
                          <div v-if="scope.row.image" class="pictrue tabPic">
                            <el-image :src="scope.row.image" :preview-src-list="[scope.row.image]"> </el-image>
                          </div>
                          <div v-else class="upLoad tabPic">
                            <i class="el-icon-camera cameraIconfont" />
                          </div>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      v-for="(item, iii) in tableAttrValue"
                      :key="iii"
                      :label="formThead[iii] && formThead[iii].title"
                    >
                      <template slot-scope="scope">
                        <span>{{ scope.row[iii] || '-' }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column v-if="formValidate.type >= 0" label="商品条码" width="100">
                      <template slot-scope="scope">
                        <span>{{ scope.row.itemNumber }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column v-if="formValidate.specType" label="默认选中" width="100">
                      <template slot-scope="scope">
                        <span>{{ scope.row.isDefault ? '是' : '否' }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column v-if="formValidate.specType" label="是否显示" width="100">
                      <template slot-scope="scope">
                        <span>{{ scope.row.isShow ? '显示' : '隐藏' }}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="商品详情" name="2">
            <div class="detailSection divBox">
              <div class="contentPic" v-html="formValidate.content || '无'"></div>
            </div>
          </el-tab-pane>
        </el-tabs>
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
import Tinymce from '@/components/Tinymce/index';
import { productAuditApi } from '@/api/product';
import { getListName, getFrontDomainUrl } from '@/utils/ZBKJIutil';
import product from '@/mixins/product';
import { defaultObj, objTitle } from '@/views/marketing/pointsMall/default';

export default {
  name: 'ProductProductAdd',
  props: {
    isShow: {
      type: Boolean,
      default: true,
    },
    isAtud: {
      type: Boolean,
      default: false,
    },
    productId: {
      type: [Number, String],
      default: () => null,
    },
    componentKey: {
      type: Number,
      default: () => 0,
    },
    dialogVisibleInfoData: {
      type: Boolean,
      default: false,
    },
    fromType: {
      type: String,
      default: () => '',
    },
  },
  components: { Tinymce },
  mixins: [product],
  watch: {
    'formValidate.attrList': {
      handler: function (val) {
        //  if (this.formValidate.specType) this.watCh(val); //重要！！！
      },
      immediate: false,
      deep: true,
    },
    componentKey: {
      handler: function (val) {
        this.currentTab = '0';
        this.dialogVisible = true;
      },
      immediate: false,
      deep: true,
    },
    dialogVisibleInfoData: {
      handler: function (val) {
        this.loading = true;
        this.AttrValueList = [];
        if (val) {
          if (this.fromType === 'product') {
            //普通商品详情
            this.getProductInfo(this.productId);
            setTimeout(() => {
              this.getTableAttrValue();
            }, 500);
          } else {
            //积分商品详情
            this.getPointsProductInfo(this.productId);
          }
        }
        this.loading = false;
      },
      immediate: false,
      deep: true,
    },
  },
  data() {
    return {
      manyTabTit: {},
      manyTabDate: {}, // 生成规格表格中的头部标题
      formThead: Object.assign({}, objTitle),
      OneattrValue: [Object.assign({}, defaultObj.attrValueList[0])], // 单规格
      ManyAttrValue: [Object.assign({}, defaultObj.attrValueList[0])], // 多规格
      tableAttrValue: {}, //商品规格
      rules: {
        auditStatus: [{ required: true, message: '请选择审核状态', trigger: 'change' }],
        reason: [{ required: true, message: '请填写拒绝原因', trigger: 'blur' }],
      },
      ruleForm: {
        reason: '',
        auditStatus: 'success',
        id: '',
      },
      direction: 'rtl',
      dialogVisible: false,
      isDisabled: true,
      props1: {
        children: 'childList',
        label: 'name',
        value: 'id',
        multiple: false,
        emitPath: false,
      },
      tabs: [],
      props: { multiple: true },
      currentTab: '0',
      isAttr: false,
      loadingBtn: false,
      frontDomain: localStorage.getItem('frontDomain'),
    };
  },
  created() {
    this.tempRoute = Object.assign({}, this.$route);
    this.currentTab = '0';
    if (this.$route.params.id && this.formValidate.specType) {
      //    this.$watch(this.formValidate.attrList, this.watCh);
    }
    if (!localStorage.getItem('merPlatProductClassify')) this.$store.dispatch('product/getAdminProductClassify');
  },
  mounted() {
    this.getTableAttrValue();
    if (this.productId) {
      this.currentTab = '0';
      this.setTagsViewTitle();
    }
  },
  methods: {
    getListName,
    getFrontDomainUrl,
    //表格内的数据
    getTableAttrValue() {
      let obj = Object.assign({}, defaultObj.attrValueList[0]);
      delete obj.image;
      delete obj.isShow;
      //普通商品去掉兑换积分
      if (this.fromType === 'product') {
        delete obj.redeemIntegral;
      } else {
        // 积分金额去掉otPrice
        delete obj.otPrice;
      }
      if (!this.formValidate.isSub) {
        delete obj.brokerage;
        delete obj.brokerageTwo;
      }
      if (!this.formValidate.isPaidMember) {
        delete obj.vipPrice;
      } else {
        obj.vipPrice = Object.assign({}, defaultObj.attrValueList[0]).vipPrice;
      }
      this.tableAttrValue = obj;
    },
    close() {
      this.dialogVisible = false;
      this.currentTab = '0';
    },
    //审核拒绝
    cancelForm() {
      this.$modalPrompt('textarea', '拒绝原因').then((V) => {
        this.ruleForm.reason = V;
        this.submit();
      });
    },
    // 审核提交
    onSubmit(type) {
      this.ruleForm.auditStatus = type;
      if (type === 'success') {
        this.$modalSure('审核通过该商品吗？').then(() => {
          this.submit();
        });
      } else {
        this.cancelForm();
      }
    },
    submit() {
      this.loadingBtn = true;
      this.ruleForm.id = this.productId;
      productAuditApi(this.ruleForm)
        .then((res) => {
          this.$message.success('操作成功');
          //this.dialogVisible = false;
          this.currentTab = '0';
          this.$emit('subSuccess');
          this.loadingBtn = false;
        })
        .catch((res) => {
          this.loadingBtn = false;
        });
    },
    changeNodes(data) {
      if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          if (!data[i].childList || data[i].childList.length < 1) {
            data[i].childList = undefined;
          } else {
            this.changeNodes(data[i].childList);
          }
        }
      }
      return data;
    },
    setTagsViewTitle() {
      const title = this.isDisabled ? '商品详情' : '编辑商品';
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.$route.params.id}` });
      this.$store.dispatch('tagsView/updateVisitedView', route);
    },
    // 表单验证
    validate(prop, status, error) {
      if (status === false) {
        this.$message.warning(error);
      }
    },
    onClose() {
      this.ruleForm.auditStatus = 'success';
      this.ruleForm.reason = '';
      this.$emit('onCloseInfo');
    },
  },
};
</script>
<style scoped lang="scss">
::v-deep .el-table th.el-table__cell > .cell,
::v-deep.el-table .cell,
.el-table--border .el-table__cell:first-child .cell {
  padding-left: 15px;
}

.detailSection {
  border: none !important;
}

.tipsWidth {
  width: 65px !important;
}

.tabNumWidth {
  margin-left: -15px;
}

.contentPic {
  ::v-deep img {
    max-width: 100% !important;
    height: auto;
  }
}

.demo-drawer__content {
  padding-bottom: 86px;
}

.spfont {
  color: #606266;
}

.from-foot-btn {
  width: 100%;
  padding: 20px;
}

.fix {
  z-index: 10;
  position: absolute;
  left: 0;
  bottom: 0px;
  padding-bottom: 10px;
  background: #fff;
}

.btn-shadow {
  box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.05);
}

.infoBox {
  ::v-deep.el-select__tags {
    line-height: inherit;
    left: -6px;
    top: 37%;
  }

  ::v-deep.el-tag.el-tag--info {
    background: none;
    border: none;
    color: #303133 !important;
    height: auto;
    line-height: inherit;
    cursor: none;
    font-size: 13px !important;
  }

  ::v-deep.el-input--medium {
    font-size: 13px;
  }

  ::v-deep.el-drawer__header {
    margin-bottom: 0;
    font-size: 20px;
  }

  ::v-deep .el-input.is-disabled .el-input__inner,
  ::v-deep .el-cascader {
    font-size: 13px;
    height: auto;
    background: none;
    cursor: none;
    color: #303133;
    display: inline-block;
    line-height: inherit;
  }

  ::v-deep.el-icon-arrow-down,
  ::v-deep .el-icon-arrow-up {
    display: none;
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
}

.disLabel {
  ::v-deep .el-form-item__label {
    margin-left: 36px !important;
  }
}

.disLabelmoren {
  ::v-deep.el-form-item__label {
    margin-left: 120px !important;
  }
}

.priamry_border {
  border: 1px solid var(--prev-color-primary);
  color: var(--prev-color-primary);
}

.color-item {
  height: 30px;
  line-height: 30px;
  padding: 0 10px;
  color: #fff;
  margin-right: 10px;
}

.color-list .color-item.blue {
  background-color: #1e9fff;
}

.color-list .color-item.yellow {
  background-color: rgb(254, 185, 0);
}

.color-list .color-item.green {
  background-color: #009688;
}

.color-list .color-item.red {
  background-color: #ed4014;
}

.proCoupon {
  ::v-deep .el-form-item__content {
    margin-top: 5px;
  }
}

.tabPic {
  width: 40px !important;
  height: 40px !important;

  img {
    width: 100%;
    height: 100%;
  }
}

.noLeft {
  ::v-deep .el-form-item__content {
    margin-left: 0 !important;
  }
}

.selWidth {
  width: 100%;
}

.selWidthd {
  width: 100px;
}

.button-new-tag {
  height: 28px;
  line-height: 26px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

.labeltop {
  ::v-deep .el-form-item__label {
    float: none !important;
    display: inline-block !important;
    width: auto !important;
  }
}

.iview-video-style {
  width: 300px;
  height: 180px;
  border-radius: 10px;
  background-color: #707070;
  margin: 0 120px 20px;
  position: relative;
  overflow: hidden;
}

.iview-video-style .iconv {
  color: #fff;
  line-height: 180px;
  width: 50px;
  height: 50px;
  display: inherit;
  font-size: 26px;
  position: absolute;
  top: -74px;
  left: 50%;
  margin-left: -25px;
}

.iview-video-style .mark {
  position: absolute;
  width: 100%;
  height: 30px;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
  text-align: center;
}
</style>
