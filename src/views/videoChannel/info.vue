<template>
  <div class="infoBox">
    <el-drawer
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :title="isAtud ? '商品审核' : '商品详情'"
      :direction="direction"
      custom-class="demo-drawer"
      size="1000px"
      :wrapperClosable="isAtud ? false : true"
      :modal-append-to-body="false"
      class="infoBox"
    >
      <div class="demo-drawer__content">
        <div class="divBox" v-if="formValidate">
          <div slot="header" class="clearfix">
            <el-tabs v-model="currentTab">
              <el-tab-pane label="商品信息" name="0"></el-tab-pane>
              <el-tab-pane label="商品详情" name="1"></el-tab-pane>
            </el-tabs>
          </div>
          <el-form
            ref="formValidate"
            v-loading="loading"
            class="formValidate"
            :model="formValidate"
            label-width="111px"
            @submit.native.prevent
          >
            <el-row v-show="currentTab === '0'" :gutter="24">
              <!-- 商品信息-->
              <el-col :span="24">
                <el-form-item label="商品名称：" prop="title">
                  <span class="spfont">{{ formValidate.title }}</span>
                </el-form-item>
              </el-col>
              <!--<el-col v-bind="grid2">-->
              <!--<el-form-item label="商品分类：">-->
              <!--<el-cascader-->
              <!--v-model="formValidate.categoryId"-->
              <!--:options="merPlatProductClassify"-->
              <!--:props="props1"-->
              <!--class="selWidth"-->
              <!--:show-all-levels="false"-->
              <!--:disabled="isDisabled"-->
              <!--/>-->
              <!--</el-form-item>-->
              <!--</el-col>-->
              <!--<el-col v-bind="grid2">-->
              <!--<el-form-item label="品牌：" prop="brandId">-->
              <!--<el-select-->
              <!--class="selWidth"-->
              <!--filterable-->
              <!--v-model="formValidate.brandId"-->
              <!--:loading="loading"-->
              <!--remote-->
              <!--:disabled="isDisabled"-->
              <!--placeholder="请选择品牌"-->
              <!--&gt;-->
              <!--<el-option v-for="user in brandList" :key="user.id" :label="user.name" :value="user.id">-->
              <!--</el-option>-->
              <!--</el-select>-->
              <!--</el-form-item>-->
              <!--</el-col>-->
              <!--<el-col v-bind="grid2">-->
              <!--<el-form-item label="商品关键字：" prop="keyword">-->
              <!--<span class="spfont">{{ formValidate.keyword }}</span>-->
              <!--</el-form-item>-->
              <!--</el-col>-->
              <el-col v-bind="grid2">
                <el-form-item label="单位：" prop="unitName">
                  <el-input v-model="formValidate.unitName" placeholder="请输入单位" :readonly="isDisabled" />
                </el-form-item>
              </el-col>
              <!--<el-col v-bind="grid2">-->
              <!--<el-form-item label="商品简介：" prop="storeInfo">-->
              <!--<span class="spfont">{{ formValidate.storeInfo }}</span>-->
              <!--</el-form-item>-->
              <!--</el-col>-->
              <el-col v-bind="grid2">
                <el-form-item label="微信商品类目：" prop="thirdCatIdList">
                  <span v-for="(item, i) in formValidate.thirdCatIdList">
                    {{ item }} <span v-show="i < formValidate.thirdCatIdList.length - 1">/</span>
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="商品轮播图：">
                  <div class="acea-row">
                    <div v-for="(item, index) in formValidate.images" :key="index" class="pictrue">
                      <img :src="item" />
                    </div>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="24" v-if="productQualificationType > 0">
                <el-form-item label="商品资质图：">
                  <div class="acea-row">
                    <div
                      v-for="(item, index) in formValidate.qualificationPicsList"
                      :key="index"
                      class="pictrue"
                      draggable="true"
                      @dragstart="handleDragStart($event, item, 'qualificationPics')"
                      @dragover.prevent="handleDragOver($event, item, 'qualificationPics')"
                      @dragenter="handleDragEnter($event, item, 'qualificationPics')"
                      @dragend="handleDragEnd($event, item, 'qualificationPics')"
                    >
                      <img :src="item" />
                      <i class="el-icon-error btndel" @click="handleRemove(index, 'qualificationPics')" />
                    </div>
                    <div
                      v-if="formValidate.qualificationPicsList.length < 5"
                      class="upLoadPicBox"
                      @click="modalPicTap(true)"
                    >
                      <div class="upLoad">
                        <i class="el-icon-camera cameraIconfont" />
                      </div>
                    </div>
                  </div>
                  <div class="textE93323">
                    资质类型说明：{{ productQualification }}。{{
                      productQualificationType === 1 ? '必填项！' : '选填项！'
                    }}
                  </div>
                </el-form-item>
              </el-col>
              <el-col v-bind="grid2">
                <el-form-item label="商品规格：" props="specType">
                  <span class="spfont">{{ formValidate.specType ? '多规格' : '单规格' }}</span>
                </el-form-item>
              </el-col>
              <el-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24" class="mt10">
                <template>
                  <el-table :data="ManyAttrValue" border class="tabNumWidth" size="small">
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
                          <div v-if="scope.row.image" class="pictrue tabPic"><img :src="scope.row.image" /></div>
                          <!--<div v-else class="upLoad tabPic">-->
                          <!--<i class="el-icon-camera cameraIconfont" />-->
                          <!--</div>-->
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column v-for="(item, iii) in attrValue" :key="iii" :label="formThead[iii].title">
                      <template slot-scope="scope">
                        <span>{{ scope.row[iii] }}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </el-col>
            </el-row>
            <!-- 商品详情-->
            <el-row v-show="currentTab === '1' && !isDisabled">
              <el-col :span="24">
                <el-form-item label="商品详情：">
                  <div class="contentPic" v-html="formValidate.content" />
                  <!--<Tinymce v-model=".content"></Tinymce>-->
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-show="currentTab === '1' && isDisabled">
              <el-col :span="24">
                <el-form-item label="商品详情：">
                  <span v-html="formValidate.descInfo || '无'"></span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <div v-if="isAtud" class="from-foot-btn btn-shadow">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" class="demo-ruleForm">
          <el-form-item label="审核状态" prop="platformEditStatus">
            <el-radio-group v-model="ruleForm.platformEditStatus">
              <el-radio :label="4">通过</el-radio>
              <el-radio :label="3">拒绝</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="ruleForm.platformEditStatus === 3" label="原因" prop="platformStatusReason">
            <el-input v-model="ruleForm.platformStatusReason" type="textarea" placeholder="请输入原因" />
          </el-form-item>
          <el-form-item>
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="onSubmit('ruleForm')">{{
              loadingBtn ? '提交中 ...' : '确 定'
            }}</el-button>
          </el-form-item>
        </el-form>
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
import { draftInfoApi, draftProductReviewApi } from '@/api/videoChannel';
import { Debounce } from '@/utils/validate';
import { mapGetters } from 'vuex';
const defaultObj = {
  image: '',
  sliderImages: [],
  videoLink: '',
  sliderImage: '',
  storeName: '',
  storeInfo: '',
  keyword: '',
  cateIds: [], // 商品分类id
  couponList: [],
  cateId: null, // 商品分类id传值
  unitName: '',
  sort: 0,
  giveIntegral: 0,
  ficti: 0,
  isShow: false,
  attrValue: [
    {
      image: '',
      price: 0,
      cost: 0,
      otPrice: 0,
      stock: 0,
      weight: 0,
      volume: 0,
    },
  ],
  attr: [],
  selectRule: '',
  isSub: false,
  content: '',
  specType: false,
  id: undefined,
  couponIds: [],
  coupons: [],
  postage: '1',
  categoryId: '',
  guaranteeIds: '',
  guaranteeIdsList: [],
  brandId: '',
};
const objTitle = {
  price: {
    title: '售价',
  },
  cost: {
    title: '成本价',
  },
  otPrice: {
    title: '划线价',
  },
  stock: {
    title: '库存',
  },
  weight: {
    title: '重量（KG）',
  },
  volume: {
    title: '体积(m³)',
  },
};
export default {
  name: 'ProductProductAdd',
  props: {
    isAtud: {
      type: Boolean,
      default: false,
    },
    productId: {
      type: [Number, String],
      default: () => null,
    },
  },
  components: { Tinymce },
  data() {
    return {
      rules: {
        platformEditStatus: [{ required: true, message: '请选择审核状态', trigger: 'change' }],
        platformStatusReason: [{ required: true, message: '请填写拒绝原因', trigger: 'blur' }],
      },
      isAppend: true,
      proId: 0,
      ruleForm: {
        platformStatusReason: '',
        platformEditStatus: 4,
        draftProductId: '',
      },
      direction: 'rtl',
      dialogVisible: false,
      isDisabled: true,
      props2: {
        children: 'childList',
        label: 'name',
        value: 'id',
        multiple: true,
        emitPath: false,
      },
      props1: {
        children: 'childList',
        label: 'name',
        value: 'id',
        multiple: false,
        emitPath: false,
      },
      checkboxGroup: [],
      recommend: [
        { name: '可能喜欢', value: 'isGood', type: '5' },
        { name: '热卖商品', value: 'isHot', type: '2' },
        { name: '主打商品', value: 'isBest', type: '1' },
      ],
      tabs: [],
      fullscreenLoading: false,
      props: { multiple: true },
      active: 0,
      OneattrValue: [Object.assign({}, defaultObj.attrValue[0])], // 单规格
      ManyAttrValue: [Object.assign({}, defaultObj.attrValue[0])], // 多规格
      ruleList: [],
      merCateList: [], // 商户分类筛选
      shippingList: [], // 运费模板
      formThead: Object.assign({}, objTitle),
      formValidate: Object.assign({}, defaultObj),
      formDynamics: {
        ruleName: '',
        ruleValue: [],
      },
      tempData: {
        page: 1,
        limit: 9999,
      },
      manyTabTit: {},
      manyTabDate: {},
      grid2: {
        xl: 12,
        lg: 12,
        md: 12,
        sm: 24,
        xs: 24,
      },
      // 规格数据
      formDynamic: {
        attrsName: '',
        attrsVal: '',
      },
      isBtn: false,
      manyFormValidate: [],
      currentTab: 0,
      isChoice: '',
      grid: {
        xl: 8,
        lg: 8,
        md: 12,
        sm: 24,
        xs: 24,
      },
      attrInfo: {},
      tableFrom: {
        page: 1,
        limit: 9999,
        keywords: '',
      },
      tempRoute: {},
      keyNum: 0,
      isAttr: false,
      showAll: false,
      videoLink: '',
      search: {
        limit: 10,
        page: 1,
        cid: '',
        brandName: '',
      },
      totalPage: 0,
      total: 0,
      loading: false,
      loadingBtn: false,
      propsCatId: {
        emitPath: true,
      },
      productQualificationType: 0, //商品资质类型，0不需要，1必填，2选填
      productQualification: '', // 资质说明
    };
  },
  computed: {
    ...mapGetters(['merPlatProductClassify', 'productBrand']),

    attrValue() {
      const obj = Object.assign({}, defaultObj.attrValue[0]);
      delete obj.image;
      return obj;
    },
    oneFormBatch() {
      const obj = [Object.assign({}, defaultObj.attrValue[0])];
      return obj;
    },
  },
  watch: {
    'formValidate.attr': {
      handler: function (val) {
        if (this.formValidate.specType && this.isAttr) this.watCh(val); //重要！！！
      },
      immediate: false,
      deep: true,
    },
  },
  created() {
    this.tempRoute = Object.assign({}, this.$route);
    if (this.$route.params.id && this.formValidate.specType) {
      this.$watch('formValidate.attr', this.watCh);
    }
    if (!localStorage.getItem('merPlatProductClassify')) this.$store.dispatch('product/getAdminProductClassify');
  },
  mounted() {
    if (this.dialogVisible) {
      this.setTagsViewTitle();
      this.ruleForm.platformStatusReason = '';
      this.ruleForm.platformEditStatus = 4;
    }
  },
  methods: {
    close() {
      this.dialogVisible = false;
      this.ruleForm.platformStatusReason = '';
      this.ruleForm.platformEditStatus = 4;
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loadingBtn = true;
          this.ruleForm.draftProductId = this.productId;
          draftProductReviewApi(this.ruleForm)
            .then((res) => {
              this.$message.success('操作成功');
              this.dialogVisible = false;
              this.currentTab = '0';
              this.ruleForm.platformStatusReason = '';
              this.ruleForm.platformEditStatus = 4;
              this.$emit('subSuccess');
              this.loadingBtn = false;
            })
            .catch((res) => {
              this.loadingBtn = false;
            });
        } else {
          return false;
        }
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
    watCh(val) {
      const tmp = {};
      const tmpTab = {};
      this.formValidate.attr.forEach((o, i) => {
        // tmp['value' + i] = { title: o.attrName }
        // tmpTab['value' + i] = ''
        tmp[o.attrName] = { title: o.attrName };
        tmpTab[o.attrName] = '';
      });
      this.ManyAttrValue = this.attrFormat(val);
      this.ManyAttrValue.forEach((val, index) => {
        const key = Object.values(val.attrValue).sort().join('/');
        if (this.attrInfo[key]) this.ManyAttrValue[index] = this.attrInfo[key];
      });
      this.attrInfo = [];
      this.ManyAttrValue.forEach((val) => {
        this.attrInfo[Object.values(val.attrValue).sort().join('/')] = val;
      });
      this.manyTabTit = tmp;
      this.manyTabDate = tmpTab;
      this.formThead = Object.assign({}, this.formThead, tmp);
    },
    attrFormat(arr) {
      let data = [];
      const res = [];
      return format(arr);
      function format(arr) {
        if (arr.length > 1) {
          arr.forEach((v, i) => {
            if (i === 0) data = arr[i]['attrValue'];
            const tmp = [];
            if (!data) return;
            data.forEach(function (vv) {
              arr[i + 1] &&
                arr[i + 1]['attrValue'] &&
                arr[i + 1]['attrValue'].forEach((g) => {
                  const rep2 = (i !== 0 ? '' : arr[i]['attrName'] + '_') + vv + '$&' + arr[i + 1]['attrName'] + '_' + g;
                  tmp.push(rep2);
                  if (i === arr.length - 2) {
                    const rep4 = {
                      image: '',
                      price: 0,
                      cost: 0,
                      otPrice: 0,
                      stock: 0,
                      weight: 0,
                      volume: 0,
                    };
                    rep2.split('$&').forEach((h, k) => {
                      const rep3 = h.split('_');
                      if (!rep4['attrValue']) rep4['attrValue'] = {};
                      rep4['attrValue'][rep3[0]] = rep3.length > 1 ? rep3[1] : '';
                    });
                    for (let attrValueKey in rep4.attrValue) {
                      rep4[attrValueKey] = rep4.attrValue[attrValueKey];
                    }
                    res.push(rep4);
                  }
                });
            });
            data = tmp.length ? tmp : [];
          });
        } else {
          const dataArr = [];
          arr.forEach((v, k) => {
            v['attrValue'].forEach((vv, kk) => {
              dataArr[kk] = v['attrName'] + '_' + vv;
              res[kk] = {
                image: '',
                price: 0,
                cost: 0,
                otPrice: 0,
                stock: 0,
                weight: 0,
                volume: 0,
                attrValue: { [v['attrName']]: vv },
              };
              // Object.values(res[kk].attrValue).forEach((v, i) => {
              //   res[kk]['value' + i] = v
              // })
              for (let attrValueKey in res[kk].attrValue) {
                res[kk][attrValueKey] = res[kk].attrValue[attrValueKey];
              }
            });
          });
          data.push(dataArr.join('$&'));
        }
        return res;
      }
    },
    // 详情
    getInfo(id) {
      this.loading = true;
      draftInfoApi(id)
        .then(async (res) => {
          // this.isAttr = true;
          let info = res;
          this.formValidate = {
            images: JSON.parse(info.headImg),
            title: info.title,
            unitName: info.unitName,
            tempId: info.tempId,
            attr: JSON.parse(info.attr),
            descInfo: info.descInfo,
            specType: info.specType,
            primaryProductId: info.primaryProductId,
            giveIntegral: info.giveIntegral,
            ficti: info.ficti,
            thirdCatIdList: [info.catInfo.firstCatName, info.catInfo.secondCatName, info.catInfo.thirdCatName],
            thirdCatId: info.thirdCatId,
            brandId: info.brandId,
            qualificationPicsList: JSON.parse(info.qualificationPics) || [],
            id: info.id,
          };
          this.ManyAttrValue = JSON.parse(info.attrValue);
          this.$nextTick(() => {
            this.ManyAttrValue.forEach((item, index) => {
              item.attrValue = JSON.parse(item.attrValue);
              for (let attrValueKey in item.attrValue) {
                item[attrValueKey] = item.attrValue[attrValueKey];
              }
              if (item.id) {
                this.$set(item, 'price', item.price);
                this.$set(item, 'quota', item.quota);
              }
            });
          });
          this.loading = false;
        })
        .catch((res) => {
          this.loading = false;
        });
    },
    // 表单验证
    validate(prop, status, error) {
      if (status === false) {
        this.$message.warning(error);
      }
    },
  },
};
</script>
<style scoped lang="scss">
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
  ::v-deep.el-drawer__header {
    margin-bottom: 0;
    font-size: 20px;
  }
  ::v-deep .el-input.is-disabled .el-input__inner {
    background: none;
    cursor: none;
    color: #606266;
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
  ::v-deep .el-form-item {
    margin-bottom: 4px;
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
  ::v-deepel-form-item__content {
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
  ::v-deepel-form-item__content {
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
  ::v-deepel-form-item__label {
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
