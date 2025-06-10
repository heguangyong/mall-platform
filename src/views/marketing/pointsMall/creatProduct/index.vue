<template>
  <div class="divBox">
    <pages-header
      ref="pageHeader"
      :title="isChoose || isCopy || isDisabled || $route.params.id == 0 ? '添加商品' : '编辑商品'"
      backUrl="/marketing/pointsMall/productManage"
    ></pages-header>
    <el-card class="box-card mt14" :body-style="{ padding: '0 20px 20px' }" shadow="never" :bordered="false">
      <el-tabs class="list-tabs" v-model="currentTab">
        <el-tab-pane v-for="(item, index) in headTab" :key="index" :label="item.tit" :name="item.name"></el-tab-pane>
      </el-tabs>
      <el-form
        ref="formValidate"
        v-loading="fullscreenLoading"
        class="formValidate form-boder-padding"
        :rules="ruleValidate"
        :model="formValidate"
        label-width="108px"
        @submit.native.prevent
      >
        <el-row v-show="currentTab === '1'" :gutter="24">
          <!-- 商品信息-->
          <el-col v-bind="grid2">
            <el-form-item label="商品名称：" prop="name">
              <el-input
                class="from-ipt-width"
                v-model.trim="formValidate.name"
                maxlength="50"
                show-word-limit
                placeholder="请输入商品名称"
                :disabled="isDisabled"
              />
            </el-form-item>
          </el-col>
          <el-col v-bind="grid2">
            <el-form-item label="单位：" prop="unitName">
              <el-input
                v-model.trim="formValidate.unitName"
                placeholder="请输入单位"
                class="from-ipt-width"
                :disabled="isDisabled"
                maxlength="16"
              />
            </el-form-item>
          </el-col>
          <el-col v-bind="grid2">
            <el-form-item label="商品封面图：" prop="image">
              <div class="upLoadPicBox acea-row" @click="modalPicTap(false)" :disabled="isDisabled">
                <div v-if="formValidate.image" class="pictrue"><img :src="formValidate.image" /></div>
                <div v-else class="upLoad">
                  <i class="el-icon-camera cameraIconfont" />
                </div>
              </div>
              <div class="from-tips" v-show="!isDisabled">建议尺寸：800*800px，上传小于500kb的图片</div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="商品轮播图：" prop="sliderImages">
              <div class="acea-row">
                <div
                  v-for="(item, index) in formValidate.sliderImages"
                  :key="index"
                  class="pictrue"
                  draggable="true"
                  @dragstart="handleDragStart($event, item)"
                  @dragover.prevent="handleDragOver($event, item)"
                  @dragenter="handleDragEnter($event, item)"
                  @dragend="handleDragEnd($event, item)"
                >
                  <img :src="item" />
                  <i v-show="!isDisabled" class="el-icon-error btndel" @click="handleRemove(index)" />
                </div>
                <div
                  v-if="formValidate.sliderImages.length < 10 && !isDisabled"
                  class="upLoadPicBox"
                  @click="modalPicTap(true)"
                >
                  <div class="upLoad">
                    <i class="el-icon-camera cameraIconfont" />
                  </div>
                </div>
              </div>
              <div class="from-tips">建议尺寸：800*800px，上传小于500kb的图片；最多可上传10张图片，拖动可调整顺序</div>
            </el-form-item>
          </el-col>
          <el-col v-bind="grid2">
            <el-form-item label="商品关键字：">
              <keyword
                @getLabelarr="getLabelarr"
                :labelarr="labelarr"
                class="from-ipt-width"
                :isDisabled="isDisabled"
              ></keyword>
              <div class="from-tips">用户可以根据关键字进行商品搜索</div>
            </el-form-item>
          </el-col>
          <el-col v-bind="grid2">
            <el-form-item label="主图视频：" prop="video_link">
              <div class="acea-row">
                <el-input
                  v-model="videoLink"
                  :disabled="isDisabled"
                  size="small"
                  class="from-ipt-width"
                  placeholder="请输入MP4格式的视频链接"
                >
                  <input ref="refid" type="file" style="display: none" />
                  <el-upload
                    class="upload-demo"
                    action
                    slot="append"
                    :http-request="handleUploadForm"
                    :before-upload="beforeAvatarUpload"
                    :headers="myHeaders"
                    :show-file-list="false"
                    :disabled="isDisabled"
                    multiple
                  >
                    <el-button :disabled="isDisabled" size="small">
                      {{ videoLink ? '确认添加' : '上传视频' }}</el-button
                    >
                  </el-upload>
                </el-input>
              </div>
              <div class="from-tips">请上传小于20M的视频</div>
              <div v-if="videoLink" class="iview-video-style">
                <video
                  class="from-ipt-width"
                  style="height: 100% !important; border-radius: 10px"
                  :src="videoLink"
                  controls="controls"
                >
                  您的浏览器不支持 video 标签。
                </video>
                <div class="mark" />
                <i class="el-icon-delete iconv" @click="delVideo" />
              </div>
            </el-form-item>
          </el-col>
          <el-col v-bind="grid2">
            <el-form-item label="商品简介：" prop="intro">
              <el-input
                class="from-ipt-width"
                v-model.trim="formValidate.intro"
                type="textarea"
                maxlength="100"
                :rows="3"
                placeholder="请输入商品简介，最多可输入250字（商品简介用于通过公众号分享商品详情，会展示此简介信息）"
                :disabled="isDisabled"
                show-word-limit
              />
              <div class="from-tips">通过公众号分享商品详情，会展示此简介信息</div>
            </el-form-item>
          </el-col>
          <el-col v-bind="grid2">
            <el-form-item label="兑换数量限制：" prop="exchangeNum">
              <el-input-number
                v-model.trim="formValidate.exchangeNum"
                :min="0"
                :max="9999"
                :step="1"
                step-strictly
                placeholder="请输入"
              ></el-input-number>
              <div class="from-tips">用户可以兑换总数量限制，支持输入0～9999整数，填0代表不限制</div>
            </el-form-item>
            <el-form-item label="上架状态：" required>
              <el-switch
                v-model.trim="formValidate.isShow"
                :active-value="true"
                :inactive-value="false"
                active-text="上架"
                inactive-text="下架"
                :disabled="isDisabled"
              />
            </el-form-item>
            <el-form-item label="热门推荐：" required>
              <el-switch
                v-model.trim="formValidate.isHot"
                :active-value="1"
                :inactive-value="0"
                active-text="是"
                inactive-text="否"
                :disabled="isDisabled"
              />
            </el-form-item>
            <el-form-item label="排序：">
              <el-input-number
                v-model.trim="formValidate.sort"
                :min="1"
                :max="999999"
                placeholder="请输入排序"
                @keyup.native="proving1"
                :disabled="isDisabled"
                :step="1"
                step-strictly
              />
              <div class="from-tips">请输入0～999999的数字，数字越大越靠前</div>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 商品规格-->
        <creatAttr
          v-if="isShowAttr"
          v-show="currentTab === '2'"
          v-model="formValidate"
          :oneFormBatch="oneFormBatch"
          :isDisabled="isDisabled"
          :formThead="formThead"
          :manyTabDate="manyTabDate"
          :ManyAttrValue="ManyAttrValue"
          :OneattrValue="OneattrValue"
          :manyTabTit="manyTabTit"
          @handleBatchDel="handleBatchDel"
          @changeIsEditVal="changeIsEditVal"
          @changeManyAttrValue="changeManyAttrValue"
        ></creatAttr>
        <!-- 商品详情-->
        <el-row v-show="currentTab === '3' && !isDisabled">
          <el-col :span="24">
            <el-form-item label="商品详情：">
              <Tinymce v-model.trim="formValidate.content" :key="htmlKey"></Tinymce>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-show="currentTab === '3' && isDisabled">
          <el-col :span="24">
            <el-form-item label="商品详情：">
              <span v-html="formValidate.content || '无'"></span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button v-if="Number(currentTab) > 1" class="submission priamry_border" @click="handleSubmitUp"
            >上一步</el-button
          >
          <el-button v-show="Number(currentTab) < 3" class="priamry_border" @click="handleSubmitNest('formValidate')"
            >下一步</el-button
          >
          <el-button
            v-show="(currentTab === '3' || $route.params.id) && !isDisabled"
            type="primary"
            class="submission"
            @click="handleSubmit('formValidate')"
            :loading="loadingBtn"
            v-if="checkPermi(['platform:integral:product:save', 'platform:integral:product:update'])"
            >保存</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

import Tinymce from '@/components/Tinymce/index';
import { productUpdateApi, productCreateApi, pointsProductDetailApi } from '@/api/pointsMall';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
import { uploadImage } from '@/utils/ZBKJIutil';
import { getToken } from '@/utils/auth';
import product from '@/mixins/product';
import { objTitlePoints, defaultObj, objTitle } from '@/views/marketing/pointsMall/default';
import creatAttr from '../components/creatAttr';
import { productDetailApi } from '@/api/product';

export default {
  name: 'ProductProductAdd',
  directives: {
    // 计算是否滚动到最下面
    selectLoadMore: {
      bind(el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap');
        SELECTWRAP_DOM.addEventListener('scroll', function () {
          const condition = this.scrollHeight - this.scrollTop <= this.clientHeight;
          if (condition) {
            binding.value();
          }
        });
      },
    },
  },
  components: { Tinymce, creatAttr },
  mixins: [product],
  data() {
    return {
      formThead: Object.assign({}, objTitlePoints),
      manyTabTit: {},
      manyTabDate: {}, // 生成规格表格中的头部标题
      htmlKey: 0,
      headTab: [
        { tit: '商品信息', name: '1' },
        { tit: '规格库存', name: '2' },
        { tit: '商品详情', name: '3' },
      ],
      form: 2,
      labelarr: [],
      isDisabled: this.$route.params.isDisabled === 'noEdit' ? true : false,
      isChoose: this.$route.params.isChoose === 'choose' ? true : false, //是否是选择商品
      isCopy: this.$route.params.isCopy === 'copy' ? true : false, //是否是复制商品
      tabs: [],
      props: { multiple: true },
      active: 0,
      OneattrValue: [Object.assign({}, defaultObj.attrValueList[0])], // 单规格
      ManyAttrValue: [Object.assign({}, defaultObj.attrValueList[0])], // 多规格
      formValidate: Object.assign({}, defaultObj),
      // tableAttrValue: {}, //商品规格
      grid2: {
        xl: 24,
        lg: 24,
        md: 24,
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
      currentTab: '1',
      isChoice: '',
      grid: {
        xl: 24,
        lg: 24,
        md: 24,
        sm: 24,
        xs: 24,
      },
      ruleValidate: {
        name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        unitName: [{ required: true, message: '请输入单位', trigger: 'blur' }],
        intro: [{ required: true, message: '请输入商品简介', trigger: 'blur' }],
        tempId: [{ required: true, message: '请选择运费模板', trigger: 'change' }],
        image: [{ required: true, message: '请上传商品图', trigger: 'change' }],
        sliderImages: [{ required: true, message: '请上传商品轮播图', type: 'array', trigger: 'change' }],
        specType: [{ required: true, message: '请选择商品规格', trigger: 'change' }],
        exchangeNum: [{ required: true, message: '请输入兑换数量限制', trigger: 'blur' }],
      },
      attrInfo: {},
      tableFrom: {
        page: 1,
        limit: 9999,
        keywords: '',
      },
      tempRoute: {},
      keyNum: 0,
      isShowAttr: false,
      showAll: false,
      search: {
        limit: this.$constants.page.limit[0],
        page: 1,
        cid: '',
        brandName: '',
      },
      totalPage: 0,
      total: 0,
      loading: false,
      loadingBtn: false,
      isShowGroup: false,
      multiples: true,
      productType: [
        { tit: '普通商品', id: 0, tit2: '实体货物' },
        { tit: '云盘商品', id: 5, tit2: '同一链接发货' },
        { tit: '卡密商品', id: 6, tit2: '不同充值码发货' },
      ],
      upload: {
        videoIng: false, // 是否显示进度条；
      },
      videoLink: '', //视频地址
      progress: 10, // 进度条默认0
      myHeaders: { 'X-Token': getToken() },
      oneFormBatch: [
        {
          image: '',
          price: void 0,
          redeemIntegral: void 1,
          cost: void 0,
          stock: void 0,
          barCode: '',
          weight: void 0,
          volume: void 0,
        },
      ],
    };
  },
  beforeRouteUpdate(to, from, next) {
    this.bus.$emit('onTagsViewRefreshRouterView', this.$route.path);
    next();
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews;
    },
  },
  created() {
    this.tempRoute = Object.assign({}, this.$route);
    if (parseFloat(this.$route.params.id) > 0 && this.formValidate.specType) {
    }
  },
  async mounted() {
    this.setTagsViewTitle();
    this.formValidate.sliderImages = [];
    this.formValidate.attrs = [];
    if (this.$route.params.id && this.$route.params.id != 0) {
      if (!this.isChoose) {
        // 积分商品详情
        if (checkPermi(['platform:integral:product:detail'])) await this.getPointsProductInfo(this.$route.params.id, 'points');
      } else {
        //普通商品详情
        await this.getProductInfo(this.$route.params.id, 'normal');
        this.formThead = Object.assign({}, objTitlePoints);
        this.getPointsProductAttrValue(); //获取积分商品规格数据
      }
    } else {
      this.isShowAttr = true;
    }
  },
  methods: {
    checkPermi,
    // 回调规格生成表格数据
    changeManyAttrValue(e) {
      // rows数组第一项 新增默认数据 oneFormBatch
      this.ManyAttrValue = e;
    },
    changeIsEditVal() {
      this.isEditAttrVal = false;
    },
    //批量清空规格中的批量数据
    handleBatchDel() {
      this.oneFormBatch = [
        {
          image: '',
          price: void 0,
          redeemIntegral: void 1,
          cost: void 0,
          stock: void 0,
          barCode: '',
          weight: void 0,
          volume: void 0,
        },
      ];
    },
    //视频上传前
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'video/mp4';
      const isLt2M = file.size / 10240 / 10240 < 2;

      if (!isJPG) {
        this.$message.error('上传视频只能是 mp4 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传视频不能超过 20MB!');
      }
      return isJPG && isLt2M;
    },
    // 上传
    async handleUploadForm(param) {
      const formData = new FormData();
      const data = {
        model: 'product',
        pid: 0,
      };
      let loading = this.$loading({
        lock: true,
        text: '上传中，请稍候...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      formData.append('multipart', param.file);
      try {
        let res = await uploadImage(formData, data);
        this.upload.videoIng = true;
        this.videoLink = res.url;
        this.progress = 100;
        loading.close();
      } catch (e) {
        loading.close();
      }
    },
    // 删除视频；
    delVideo() {
      this.$set(this, 'videoLink', '');
    },
    getLabelarr(attr) {
      this.labelarr = attr;
    },
    proving1(e) {
      this.formValidate.sort = e.target.value.replace(/[^\.\d]/g, '');
      this.formValidate.sort = e.target.value.replace('.', '');
    },
    setTagsViewTitle() {
      if (this.$route.params.id && this.$route.params.id != 0) {
        const title = this.isDisabled ? '商品详情' : '编辑商品';
        const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.$route.params.id}` });
        this.$store.dispatch('tagsView/updateVisitedView', route);
      } else {
        const title = '采集商品';
        const route = Object.assign({}, this.tempRoute, { title: `${title}` });
        this.$store.dispatch('tagsView/updateVisitedView', route);
      }
    },
    showInput(item) {
      this.$set(item, 'inputVisible', true);
    },
    handleRemove(i) {
      this.formValidate.sliderImages.splice(i, 1);
    },
    // 上一步
    handleSubmitUp() {
      this.currentTab = (Number(this.currentTab) - 1).toString();
    },
    // 下一步
    handleSubmitNest(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.currentTab = (Number(this.currentTab) + 1).toString();
        } else {
          if (
            !this.formValidate.name ||
            !this.formValidate.unitName ||
            !this.formValidate.intro ||
            !this.formValidate.image ||
            !this.formValidate.sliderImages
          ) {
            this.$message.warning('请填写完整商品信息！');
          }
        }
      });
    },
    //保存接口数据更新
    getFromData() {
      if (this.formValidate.specType && this.formValidate.attrs.length < 1)
        return this.$message.warning('请填写多规格属性！');
      this.formValidate.keyword = this.labelarr.join(',');
      if (this.videoLink) {
        //如果有视频主图，将视频链接插入到轮播图第一的位置
        this.formValidate.sliderImages.unshift(this.videoLink);
      }
      this.formValidate.sliderImage = JSON.stringify(this.formValidate.sliderImages);
      let attrValueListData = [];
      if (this.formValidate.specType) {
        //规格值
        this.formValidate.attrList = this.formValidate.attrs.map((item, index) => {
          return {
            attributeName: item.value,
            isShowImage: item.add_pic == 1 ? true : false,
            id: 0,
            sort: index + 1,
            optionList: item.detail.map((arr, idx) => {
              return {
                image: arr.image,
                optionName: arr.value,
                sort: idx + 1,
              };
            }),
          };
        });
        //表格数据
        let ManyAttrValues = [...this.ManyAttrValue];
        attrValueListData = ManyAttrValues;
        attrValueListData.shift();
        for (var i = 0; i < attrValueListData.length; i++) {
          let attrValues = { ...attrValueListData[i].attrValueShow };
          this.$set(attrValueListData[i], 'attrValue', JSON.stringify(attrValues)); //
        }
      } else {
        this.formValidate.attrList = [
          {
            attributeName: '规格',
            attrValues: '默认',
            isShowImage: false,
            optionList: [
              {
                optionName: '默认',
                id: 0,
                image: '',
                sort: 1,
              },
            ],
          },
        ];
        this.OneattrValue.map((item) => {
          this.$set(item, 'attrValue', JSON.stringify({ 规格: '默认' }));
        });
      }
      let data = {
        ...this.formValidate,
        keyword: this.labelarr.join(','),
        sliderImage: JSON.stringify(this.formValidate.sliderImages),
        deliveryMethod: 1,
        systemFormId: this.formValidate.systemFormId ? this.formValidate.systemFormId : 0,
        attrValueList: this.formValidate.specType ? attrValueListData : this.OneattrValue,
        tempId: this.formValidate.type != 0 ? 0 : this.formValidate.tempId,
      };
      return data;
    },
    // 保存
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          //this.getFromData();
          this.postData();
        } else {
          if (
            !this.formValidate.name ||
            !this.formValidate.cateId ||
            !this.formValidate.keyword ||
            !this.formValidate.unitName ||
            !this.formValidate.intro ||
            !this.formValidate.image ||
            !this.formValidate.sliderImages
          ) {
            this.$message.warning('请填写完整商品信息！');
          }
        }
      });
    },
    // 新增保存数据
    postData() {
      this.loadingBtn = true;
      let data = this.getFromData();
      parseFloat(this.$route.params.id) > 0 && !this.isChoose && !this.isCopy
        ? productUpdateApi(data)
            .then(async (res) => {
              this.$message.success('编辑成功');
              setTimeout(() => {
                this.$router.push({ path: '/marketing/pointsMall/productManage' });
              }, 500);
              this.closeSelectedTag();
              this.loadingBtn = false;
            })
            .catch((res) => {
              this.loadingBtn = false;
            })
        : productCreateApi(data)
            .then(async (res) => {
              this.$message.success('新增成功');
              setTimeout(() => {
                this.$router.push({ path: '/marketing/pointsMall/productManage' });
              }, 500);
              this.closeSelectedTag();
              this.loadingBtn = false;
            })
            .catch((res) => {
              this.loadingBtn = false;
            });
    },
    isActive(route) {
      return route.path === this.$route.path;
    },
    closeSelectedTag() {
      let that = this;
      that.$store.dispatch('tagsView/delView', that.$route).then(({ visitedViews }) => {
        if (that.isActive(that.$route)) {
          that.toLastView(visitedViews, that.$route);
        }
      });
    },
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0];
      if (latestView) {
        this.$router.push(latestView.fullPath);
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
          // to reload home page
          this.$router.replace({ path: '/redirect' + view.fullPath });
        } else {
          this.$router.push('/');
        }
      }
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
.tabPic {
  width: 100% !important;
  height: 100% !important;
}
.perW50 {
  width: 80%;
}
.line-ht {
  line-height: 28px;
}
.el-icon-warning {
  position: relative;
  top: 9px;
  left: 17px;
}
.disLabel {
  ::v-deepel-form-item__label {
    margin-left: 36px !important;
  }
}
.disLabelmoren {
  ::v-deepel-form-item__label {
    margin-left: 120px !important;
  }
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

.noLeft {
  ::v-deepel-form-item__content {
    margin-left: 0 !important;
  }
}
.tabNumWidth {
  ::v-deep .el-input-number--medium {
    width: 121px !important;
  }
  ::v-deep .el-input-number__increase {
    width: 20px !important;
    font-size: 12px !important;
  }
  ::v-deep .el-input-number__decrease {
    width: 20px !important;
    font-size: 12px !important;
  }
  ::v-deep .el-input-number--medium .el-input__inner {
    padding-left: 25px !important;
    padding-right: 25px !important;
  }
  ::v-deep thead {
    line-height: normal !important;
  }
  ::v-deep .el-table .cell {
    line-height: normal !important;
  }
}
.selWidth100 {
  width: 100%;
}
.selWidthd {
  width: 300px;
}
.input-new-tag {
  width: 150px;
  margin-left: 10px;
  vertical-align: bottom;
}

.btndel {
  position: absolute;
  z-index: 1;
  width: 20px !important;
  height: 20px !important;
  left: 46px;
  top: -4px;
}
.labeltop {
  ::v-deepel-form-item__label {
    float: none !important;
    display: inline-block !important;
    width: auto !important;
  }
}
.iview-video-style {
  width: 460px;
  height: 180px;
  border-radius: 10px;
  background-color: #707070;
  margin-top: 10px;
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
