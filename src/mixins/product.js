import { brandListApi, productDetailApi } from '@/api/product';
import { mapGetters } from 'vuex';
import { pointsProductDetailApi } from '@/api/pointsMall';
import { objTitlePoints, defaultObj, defaultObjAttrValue, objTitle } from '@/views/marketing/pointsMall/default';

export default {
  data() {
    return {
      // manyTabTit: {},
      // manyTabDate: {},
      formValidate: Object.assign({}, defaultObj),
      labelarr: [],
      ruleList: [],
      merCateList: [], // 商户分类筛选
      shippingList: [], // 运费模板

      // OneattrValue: [Object.assign({}, defaultObj.attrValue[0])], // 单规格
      // ManyAttrValue: [Object.assign({}, defaultObj.attrValue[0])], // 多规格
      brandList: [],
      search: {
        limit: 9999,
        page: 1,
        cid: '',
        brandName: '',
      },
      loading: false,
      attrInfo: {},
      tempRoute: {},
      videoLink: '',
      fullscreenLoading: false, //积分商品
      dialogVisibleInfo: false, // 控制积分、商品详情抽屉展示
      AttrValueList: [], //详情中使用规格列表
      // componentKey: 0,
      // isShow: false, //控制商品详情展示
      // productId: 0, //商品id，普通、活动商品都是此id
    };
  },
  computed: {
    ...mapGetters(['merPlatProductClassify', 'productBrand']),
  },
  methods: {
    // 点击商品图
    modalPicTap(multiple, num, i, status) {
      const _this = this;
      if (_this.isDisabled) return;
      this.$modalUpload(
        function (img) {
          if (!img) return;
          if (!multiple && !num) {
            _this.formValidate.image = img[0].sattDir;
            _this.OneattrValue[0].image = img[0].sattDir;
          }
          if (multiple && !num) {
            if (img.length > 10) return this.$message.warning('最多选择10张图片！');
            if (img.length + _this.formValidate.sliderImages.length > 10)
              return this.$message.warning('最多选择10张图片！');
            img.map((item) => {
              _this.formValidate.sliderImages.push(item.sattDir);
            });
          }
          if (!multiple && num === 'dan') {
            _this.OneattrValue[0].image = img[0].sattDir;
          }
          if (!multiple && num === 'duo') {
            _this.ManyAttrValue[i].image = img[0].sattDir;
          }
          if (!multiple && num === 'pi') {
            _this.oneFormBatch[0].image = img[0].sattDir;
          }
        },
        multiple,
        'content',
      );
    },
    // 移动
    handleDragStart(e, item) {
      if (!this.isDisabled) this.dragging = item;
    },
    handleDragEnd(e, item) {
      if (!this.isDisabled) this.dragging = null;
    },
    handleDragOver(e) {
      if (!this.isDisabled) e.dataTransfer.dropEffect = 'move';
    },
    handleDragEnter(e, item, index) {
      if (!this.isDisabled) {
        e.dataTransfer.effectAllowed = 'move';
        if (item === this.dragging) {
          return;
        }
        const newItems =
          index || index === 0
            ? [...this.formValidate.attrList[index].optionList]
            : [...this.formValidate.sliderImages];
        const src = newItems.indexOf(this.dragging);
        const dst = newItems.indexOf(item);
        newItems.splice(dst, 0, ...newItems.splice(src, 1));
        if (index || index === 0) {
          this.formValidate.attrList[index].optionList = newItems;
        } else {
          this.formValidate.sliderImages = newItems;
        }
      }
    },
    // 解决cascader placeholder重影
    fixCascader() {
      const cascader = document.querySelectorAll('.el-cascader__search-input');

      for (let index = 0; index < cascader.length; index++) {
        cascader[index].setAttribute('placeholder', '');
      }
    },

    //普通商品详情
    getProductInfo(id, type) {
      this.formThead = Object.assign({}, objTitle);
      this.fullscreenLoading = true;
      productDetailApi(id)
        .then(async (res) => {
          this.isShowAttr = true
          this.getData(res, type);
          this.getbrandList();
          this.fullscreenLoading = false;
        })
        .catch((res) => {
          this.fullscreenLoading = false;
        });
    },
    // 积分商品详情
    getPointsProductInfo(id, type) {
      this.formThead = Object.assign({}, objTitlePoints);
      // this.getPointsProductAttrValue();
      this.fullscreenLoading = true;
      pointsProductDetailApi(id)
        .then(async (res) => {
          this.isShowAttr = true
          this.getData(res, type);
          this.fullscreenLoading = false;
        })
        .catch((res) => {
          this.fullscreenLoading = false;
        });
    },
    // 获取积分商品规格数据
    getPointsProductAttrValue() {
      let obj = Object.assign({}, defaultObjAttrValue);
      delete obj.image;
      this.tableAttrValue = obj;
    },
    // 商品详情数据
    getData(res, type) {
      this.AttrValueList = [];
      let info = res;
      this.formValidate = {
        ...info,
        image: this.$selfUtil.setDomain(info.image),
        sliderImages: JSON.parse(info.sliderImage),
        cateIds: info.cateId ? info.cateId.split(',').map(Number) : '', // 商品分类id
        couponList: info.couponList || [], //优惠券
        sort: info.sort ? info.sort : 0,
        attrList: info.attrList || [],
        attrValueList: info.attrValueList ? info.attrValueList : [],
        content: info.content ? this.$selfUtil.replaceImgSrcHttps(info.content) : '',
        id: info.id ? info.id : 0,
        exchangeNum: info.exchangeNum || 0,
        isHot: info.isHot,
      };

      //详情中使用，规格数据生成规格的格式
      this.AttrValueList = [...info.attrValueList];
      this.AttrValueList = this.AttrValueList.map((item) => {
        return {
          ...item,
          ...JSON.parse(item.attrValue),
        };
      });
      this.getTableHeader();
      /*******/

      this.labelarr = info.keyword ? info.keyword.split(',') : [];
      let imgs = JSON.parse(info.sliderImage);
      let imgss = [];
      Object.keys(imgs).map((i) => {
        imgss.push(this.$selfUtil.setDomain(imgs[i]));
      });
      this.formValidate.sliderImages = [...imgss];
      if (this.getFileType(this.formValidate.sliderImages[0]) == 'video') {
        //如果返回数据轮播图的第一张是视频，就将其赋值给videoLink做渲染，同时将其在轮播图中删除
        this.$set(this, 'videoLink', this.formValidate.sliderImages[0]);
        this.formValidate.sliderImages.splice(0, 1);
      }
      if (info.specType) {
        //this.productGetRule(); //加载商品规格选项
        if (info.attrValueList) {
          info.attrValueList.forEach((val) => {
            val.image = this.$selfUtil.setDomain(val.image);
            val.attrValueShow = JSON.parse(val.attrValue);
            val.attr_arr = val.sku.split(',');
            val.brokerage = val.brokerage || 0;
            val.brokerageTwo = val.brokerageTwo || 0;
            val.isShow = true;
            if(type === 'normal')val.cost = val.otPrice
          });
          this.ManyAttrValue = [...this.oneFormBatch, ...info.attrValueList];
          this.getTableHeader();
          this.formThead = Object.assign({}, this.formThead, tmp);
        } else {
          if (this.formValidate.attrList.length) {
            this.oneFormBatch[0].image = this.$selfUtil.setDomain(info.image);
          }
        }
      } else {
        this.OneattrValue = info.attrValueList;
      }
    },
    getTableHeader() {
      const tmp = {};
      const tmpTab = {};
      this.formValidate.attrList.forEach((o, i) => {
        tmp[o.attributeName] = { title: o.attributeName };
        tmpTab[o.attributeName] = '';
      });
      this.manyTabTit = tmp;
      this.manyTabDate = tmpTab;
    },
    getFileType(fileName) {
      // 后缀获取
      let suffix = '';
      // 获取类型结果
      let result = '';
      try {
        const flieArr = fileName.split('.');
        suffix = flieArr[flieArr.length - 1];
      } catch (err) {
        suffix = '';
      }
      // fileName无后缀返回 false
      if (!suffix) {
        return false;
      }
      suffix = suffix.toLocaleLowerCase();
      // 图片格式
      const imglist = ['png', 'jpg', 'jpeg', 'bmp', 'gif'];
      // 进行图片匹配
      result = imglist.find((item) => item === suffix);
      if (result) {
        return 'image';
      }
      // 匹配 视频
      const videolist = ['mp4', 'm2v', 'mkv', 'rmvb', 'wmv', 'avi', 'flv', 'mov', 'm4v'];
      result = videolist.find((item) => item === suffix);
      if (result) {
        return 'video';
      }
      // 其他 文件类型
      return 'other';
    },
    // 品牌列表
    getbrandList() {
      this.search.cid = this.formValidate.categoryId;
      brandListApi(this.search).then((res) => {
        this.brandList = res.list;
        this.brandList.unshift({
          id: 0,
          name: '其他',
          isShow: true,
        });
      });
    },
    //详情关闭
    onCloseInfo() {
      this.dialogVisibleInfo = false;
    },
  },
};
