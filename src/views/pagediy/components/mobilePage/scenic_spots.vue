<template>
  <div v-if="configObj">
    <div :style="boxStyle" class="mobile-page paddingBox">
      <div class="home_product">
        <yangzhou-title
          :titleTxt="titleTxt"
          :titleTxt2="titleTxt2"
          :titleFuTxt="titleFuTxt"
          :titleRightTxt="titleRightTxt"
          :selectShow="selectShow === 0 ? false : true"
          :titleStyle="titleStyle"
          :titleStyle2="titleStyle2"
          :titleFuStyle="titleFuStyle"
          :titleRightStyle="titleRightStyle"
          :titleRightArrowStyle="titleRightArrowStyle"
        />
        <!-- 三列 -->
        <template>
          <div class="list-wrapper itemB" :style="{ gridGap: contentConfig + 'px' }" v-if="list.length > 0">
            <div class="item auto" v-for="(item, index) in list" :key="index">
              <div class="img-box">
                <img v-if="item.scenicSpot.image" :style="contentStyle" :src="item.scenicSpot.image" alt="" />
                <div v-else class="empty-box" :style="contentStyle"><span class="iconfont icon-tu"></span></div>
              </div>
              <div class="info">
                <div class="hd">
                  <span class="title-inside" v-if="titleShow" :style="{ ...titleColor, ...contentStyleBottom }">
                    <span>{{ item.scenicSpot.scenicName }}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="list-wrapper itemB" :style="{ gridGap: contentConfig + 'px' }" v-else>
            <div class="item auto" v-for="_ in 3">
              <div class="img-box">
                <div class="empty-box" :style="contentStyle"><span class="iconfont icon-tu"></span></div>
              </div>
              <div class="info">
                <div class="hd acea-row">
                  <span class="title-inside" v-if="titleShow" :style="{ ...titleColor, ...contentStyleBottom }">
                    <span>商品名称</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import yangzhouTitle from '@/views/pagediy/components/yangzhouTitle.vue';
export default {
  name: 'scenic_spots',
  cname: '周边景区',
  configName: 'c_scenic_spots',
  icon: 't-icon-zujian-shangpinliebiao',
  type: 4, // 0 基础组件 1 营销组件 2工具组件 3自定义组件
  defaultName: 'scenicSpots', // 外面匹配名称
  components: {
    'yangzhou-title': yangzhouTitle,
  },
  props: {
    index: {
      type: null,
    },
    num: {
      type: null,
    },
  },
  computed: {
    ...mapState('mobildConfig', ['defaultArray']),
    ...mapGetters(['mobileTheme']),
    //最外层盒子的样式
    boxStyle() {
      return [
        { 'border-radius': this.configObj.bgStyle.val ? this.configObj.bgStyle.val + 'px' : '0' },
        {
          background: `linear-gradient(${this.configObj.bgColor.color[0].item}, ${this.configObj.bgColor.color[1].item})`,
        },
        { margin: this.configObj.mbConfig.val + 'px' + ' ' + this.configObj.lrConfig.val + 'px' + ' ' + 0 },
        { padding: this.configObj.upConfig.val + 'px' + ' ' + '12px' + ' ' + this.configObj.downConfig.val + 'px' },
      ];
    },
    //已售数量
    soldColor() {
      return { color: this.configObj.soldColor.color[0].item };
    },
    //商品标题颜色
    titleColor() {
      return { color: this.configObj.titleColor.color[0].item };
    },
    //内容圆角
    contentStyle() {
      return { 'border-radius': this.configObj.contentStyle.val ? this.configObj.contentStyle.val + 'px' : '0' };
    },
    // 内容标题的下圆角
    contentStyleBottom() {
      return { 'border-bottom-left-radius': this.configObj.contentStyle.val ? this.configObj.contentStyle.val + 'px' : '0',
        'border-bottom-right-radius': this.configObj.contentStyle.val ? this.configObj.contentStyle.val + 'px' : '0',
      };
    },
    //商品名称
    titleShow() {
      if (this.configObj.typeConfig.activeValue.indexOf(0) !== -1) {
        return true;
      } else {
        return false;
      }
    },
    titleStyle() {
      return [
        {
          'font-weight':
            this.configObj.textStyle.tabVal == 2
              ? this.configObj.textStyle.list[this.configObj.textStyle.tabVal].style
              : '',
        },
        {
          'font-style':
            this.configObj.textStyle.tabVal != 2
              ? this.configObj.textStyle.list[this.configObj.textStyle.tabVal].style
              : '',
        },
        {
          fontSize: this.configObj.fontSize.val + 'px',
        },
        { color: this.configObj.fontColor.color[0].item },
      ];
    },
    titleStyle2() {
      return [
        {
          'font-weight':
            this.configObj.textStyle.tabVal == 2
              ? this.configObj.textStyle.list[this.configObj.textStyle.tabVal].style
              : '',
        },
        {
          'font-style':
            this.configObj.textStyle.tabVal != 2
              ? this.configObj.textStyle.list[this.configObj.textStyle.tabVal].style
              : '',
        },
        {
          fontSize: this.configObj.fontSize.val + 'px',
        },
        { color: this.configObj.fontColor2.color[0].item },
      ];
    },
    titleFuStyle() {
      return [
        {
          fontSize: this.configObj.fontFuSize.val + 'px',
        },
        { color: this.configObj.fontFuColor.color[0].item },
      ];
    },
    titleRightStyle() {
      return [
        {
          fontSize: this.configObj.fontRightSize.val + 'px',
        },
        { color: this.configObj.fontRightColor.color[0].item },
        {
          backgroundColor:
            this.configObj.fontRightColor.color[0].item[0] === '#' // 判断是否是#开头，否则是rgba
              ? this.configObj.fontRightColor.color[0].item + '26'
              : this.configObj.fontRightColor.color[0].item.replace(
                  /rgba\((\d+,\s*\d+,\s*\d+,\s*)[\d\.]+\)/,
                  'rgba($10.15)',
                ),
        },
      ];
    },
    titleRightArrowStyle() {
      return {
        borderLeft: '4px solid ' + this.configObj.fontRightColor.color[0].item,
      };
    },
  },
  watch: {
    pageData: {
      handler(nVal, oVal) {
        this.setConfig(nVal);
      },
      deep: true,
    },
    num: {
      handler(nVal, oVal) {
        let data = this.$store.state.mobildConfig.defaultArray[nVal];
        this.setConfig(data);
      },
      deep: true,
    },
    defaultArray: {
      handler(nVal, oVal) {
        let data = this.$store.state.mobildConfig.defaultArray[this.num];
        this.setConfig(data);
      },
      deep: true,
    },
    configObj: {
      handler(nVal, oVal) {
        if (nVal) {
          this.contentConfig = nVal.contentConfig.val || 0;
        }
      },
      deep: true,
    },
    selectShow: {
      handler(nVal, oVal) {
        if (nVal == 0) {
          this.configObj.titleRightConfig.isShow = 1;
        } else {
          this.configObj.titleRightConfig.isShow = 0;
        }
      },
      deep: true,
    },
    selectStyle: {
      handler(nVal, oVal) {
        if (nVal == 0) {
          this.configObj.bgImg.isShow = 1;
          this.configObj.bgColor.isShow = 0;
        } else {
          this.configObj.bgImg.isShow = 0;
          this.configObj.bgColor.isShow = 1;
        }
      },
      deep: true,
    },
  },
  data() {
    return {
      // 默认初始化数据禁止修改
      defaultConfig: {
        name: 'scenicSpots',
        timestamp: this.num,
        setUp: {
          tabVal: 0,
          cname: '周边景区',
        },
        titleConfig: {
          tabTitle: '文本标题',
          title: '标题名称（左）',
          val: '周边',
          place: '请输入标题，限制4个字以内',
          max: 4,
          isShow: 1,
        },
        titleConfig2: {
          title: '标题名称（右）',
          val: '景区',
          place: '请输入标题，限制4个字以内',
          max: 4,
          isShow: 1,
        },
        titleFuConfig: {
          tabTitle: '文本标题',
          title: '副标题',
          val: '周边美景，等你来探秘！',
          place: '请输入副标题，限制16个字以内',
          max: 16,
          isShow: 1,
        },
        titleRightConfig: {
          tabTitle: '右侧文字',
          title: '右侧文字',
          val: '更多',
          place: '请输入右侧文字，限制2个字以内',
          max: 2,
          isShow: 1,
        },
        selectShow: {
          cname: 'selectShow',
          title: '右侧按钮',
          tabVal: 0,
          isShow: 1,
          list: [
            {
              val: '显示',
            },
            {
              val: '隐藏',
            },
          ],
        },
        linkConfig: {
          title: '链接',
          val: '',
          place: '请输入链接地址',
          max: 100,
          isShow: 1,
        },
        fontColor: {
          title: '标题颜色（左）',
          tabTitle: '标题设置',
          name: 'fontColor',
          default: [
            {
              item: '#000000',
            },
          ],
          color: [
            {
              item: '#000000',
            },
          ],
        },
        fontColor2: {
          title: '标题颜色（右）',
          name: 'fontColor',
          default: [
            {
              item: '#2CCA83',
            },
          ],
          color: [
            {
              item: '#2CCA83',
            },
          ],
        },
        textStyle: {
          title: '文本样式',
          isShow: 1,
          tabVal: 0,
          list: [
            {
              val: '正常',
              style: 'normal',
              icon: 'icon-zhengchang',
            },
            {
              val: '斜体',
              style: 'italic',
              icon: 'icon-qingxie',
            },
            {
              val: '加粗',
              style: 'bold',
              icon: 'icon-jiacu',
            },
          ],
        },
        fontSize: {
          title: '标题文字',
          val: 15,
          min: 10,
          max: 30,
        },
        fontFuColor: {
          title: '副标题颜色',
          tabTitle: '文字设置',
          name: 'fontFuColor',
          default: [
            {
              item: '#909090',
            },
          ],
          color: [
            {
              item: '#909090',
            },
          ],
        },
        fontFuSize: {
          title: '副标题文字',
          val: 9,
          min: 5,
          max: 20,
        },
        fontRightColor: {
          title: '按钮颜色',
          tabTitle: '文字设置',
          name: 'fontFuColor',
          default: [
            {
              item: '#2CCA83',
            },
          ],
          color: [
            {
              item: '#2CCA83',
            },
          ],
        },
        fontRightSize: {
          title: '按钮文字',
          val: 9,
          min: 5,
          max: 20,
        },
        tabConfig: {
          tabTitle: '商品设置',
          title: '选择方式',
          tabVal: 0,
          list: [
            {
              name: '指定好礼',
            },
            {
              name: '指定分类',
            },
            {
              name: '指定品牌',
            },
            {
              name: '指定商户',
            },
          ],
        },
        //显示内容
        typeConfig: {
          title: '展示信息',
          tabTitle: '显示内容',
          name: 'rowsNum',
          activeValue: [0,1],
          list: [
            {
              val: '商品名称',
            },
            {
              val: '价格',
            },
          ],
        },
        selectConfig: {
          title: '商品分类',
          activeValue: [],
          list: [],
          isMultiple: true,
          goodsList: [],
          isShow: 0,
        }, //分类
        activeValueMer: {
          title: '商户名称',
          activeValue: [],
          list: [],
          isMultiple: true,
          goodsList: [],
          isShow: 0,
        }, //商户
        activeValueBrand: {
          title: '商品品牌',
          activeValue: [],
          list: [],
          isMultiple: true,
          goodsList: [],
          isShow: 0,
        }, //品牌
        goodsSort: {
          title: '商品排序',
          name: 'goodsSort',
          tabVal: 0,
          list: [
            {
              val: '综合',
              icon: 'icon-zonghe',
            },
            {
              val: '销量',
              icon: 'icon-xiaoliang',
            },
            {
              val: '价格',
              icon: 'icon-jiage',
            },
          ],
          isShow: 0,
        },
        numConfig: {
          val: 3,
          isShowNum: false,
          max: 50,
        },
        // 背景颜色
        bgColor: {
          tabTitle: '颜色设置',
          title: '背景颜色',
          color: [
            {
              item: '#FFF',
            },
            {
              item: '#FFF',
            },
          ],
          default: [
            {
              item: '#FFF',
            },
            {
              item: '#FFF',
            },
          ],
        },
        titleColor: {
          title: '标题颜色',
          name: 'titleColor',
          color: [
            {
              item: '#ffffff',
            },
          ],
          default: [
            {
              item: '#ffffff',
            },
          ],
        },
        bgStyle: {
          tabTitle: '圆角设置',
          title: '背景圆角',
          name: 'bgStyle',
          val: 5,
          min: 0,
          max: 30,
        },
        contentStyle: {
          title: '内容圆角',
          name: 'contentStyle',
          val: 4,
          min: 0,
          max: 30,
        },
        // 上间距
        upConfig: {
          title: '上边距',
          tabTitle: '边距设置',
          val: 3,
          min: 0,
          max: 100,
        },
        // 下间距
        downConfig: {
          tabTitle: '边距设置',
          title: '下边距',
          val: 3,
          min: 0,
        },
        // 左右间距
        lrConfig: {
          title: '左右边距',
          val: 12,
          min: 0,
          max: 15,
        },
        mbConfig: {
          title: '页面间距',
          val: 12,
          min: 0,
        },
        contentConfig: {
          title: '内容间距',
          val: 7,
          min: 0,
          max: 20,
        },
        productList: {
          title: '商品列表',
          list: [],
        },
        goodsList: {
          max: 20,
          list: [],
          isShow: 1,
        },
      },
      configObj: null,
      titleTxt: '',
      titleTxt2: '',
      titleFuTxt: '',
      titleRightTxt: '',
      link: '',
      txtPosition: '',
      txtStyle: '',
      fontSize: 0,
      mTOP: 0,
      themeColor: '',
      prConfig: 0,
      bgStyle: 0,
      pageData: {},
      selectShow: '',
      selectStyle: '',
      contentConfig: '', //内容间距
      navlist: [],
      imgStyle: '',
      txtColor: '',
      slider: '',
      tabCur: 0,
      list: [],
      itemStyle: 0,
      themeColor: '',
    };
  },
  mounted() {
    this.$nextTick(() => {
      if (this.num) {
        this.pageData = this.$store.state.mobildConfig.defaultArray[this.num];
        this.setConfig(this.pageData);
      }
    });
  },
  methods: {
    setConfig(data) {
      if (!data) return;
      if (data) {
        this.configObj = data;
        // 先设置关键样式属性
        this.contentConfig = data.contentConfig.val || 0;
        this.themeColor = this.$options.filters.filterTheme(this.mobileTheme - 1);

        // 然后设置其他属性
        this.titleTxt = data.titleConfig.val;
        this.titleTxt2 = data.titleConfig2.val;
        this.titleFuTxt = data.titleFuConfig.val;
        this.titleRightTxt = data.titleRightConfig.val;
        this.link = data.linkConfig.val;
        this.selectShow = this.configObj.selectShow.tabVal;
        this.selectStyle = this.configObj.selectStyle ? this.configObj.selectStyle.tabVal : null;
        this.itemStyle = data.itemStyle ? data.itemStyle.tabVal || 0 : 0;
        this.slider = data.mbConfig.val;

        // 最后处理列表数据
        switch (data.tabConfig.tabVal) {
          case 0:
            this.list = this.configObj.goodsList.list || [];
            break;
          case 1:
            this.list = this.configObj.selectConfig.goodsList || [];
            break;
          case 2:
            this.list = this.configObj.activeValueBrand.goodsList || [];
            break;
          case 3:
            this.list = this.configObj.activeValueMer.goodsList || [];
            break;
        }
      }
    },
    arrayChunk(arr) {
      this.leftList = [];
      this.rightList = [];
      for (let i = 0; i < arr.length; i++) {
        if (i % 2 == 0) {
          this.leftList.push(arr[i]);
        } else {
          this.rightList.push(arr[i]);
        }
      }
    },
  },
};
</script>
<style scoped lang="scss">

.title-inside {
  width: 100%;
  height: 21px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 10px;
  margin-top: -29px; // todo
  z-index: 255000;
  text-align: center;
  background: linear-gradient( 180deg, rgba(0,0,0,0) 0%, #000000 100%);

}

.titleOn {
  border-radius: 10px !important;
}

.auto {
  width: auto !important;
}

.sold {
  font-size: 10px;
  margin-top: 3px;
}

.pageOn {
  border-radius: 8px !important;
}

.line2 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  line-clamp: 2;
}

.listBig {
  width: 100%;

  .itemBig {
    width: 100%;

    &:last-child {
      margin-bottom: 0 !important;
    }

    .img-box {
      width: 100%;
      height: 355px;
      position: relative;

      img {
        width: 100%;
        height: 355px;
      }

      .label {
        position: absolute;
        top: 0;
        left: 0;
        width: 59px;
        height: 25px;
        line-height: 25px;
        text-align: center;
        color: #fff;
        font-size: 12px;
        border-radius: 8px 0 8px 0;
      }
    }

    .name {
      font-size: 15px;
      font-weight: bold;
      margin-top: 8px;
      padding: 0 10px;
    }

    .coupon {
      width: 16px;
      height: 18px;
      line-height: 18px;
      text-align: center;
      font-size: 12px;
      margin-right: 5px;
      display: inline-block;
    }

    .price {
      font-weight: bold;
      font-size: 10px;
      margin-top: 10px;
      width: 100%;
      justify-content: space-between;
      align-items: baseline;

      .num {
        font-size: 22px;
        margin-right: 5px;
      }

      .old-price {
        margin-left: auto;
        color: #aaa !important;
        font-weight: normal;
        text-decoration: line-through;
      }
    }
  }
}

.paddingBox {
  padding-bottom: 0;
}

.home_product {
  .hd_nav {
    display: flex;
    height: 65px;
    padding: 0 5px;

    .item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 25%;

      .title {
        font-size: 20px;
      }

      .label {
        width: 62px;
        height: 18px;
        line-height: 18px;
        text-align: center;
        background: transparent;
        border-radius: 8px;
        color: #999999;
        font-size: 12px;

        &.active {
          .title {
            color: #ff4444;
          }

          .label {
            color: #fff;
            background: linear-gradient(270deg, rgba(255, 84, 0, 1) 0%, rgba(255, 0, 0, 1) 100%);
          }
        }
      }
    }
  }

  .info {
    position: absolute;
    display: flex;
    align-items: flex-start;
    justify-content: center;

    padding: 8px 0;
    width:100%;

    .title {
      font-size: 15px;
      line-height: 22px;
      text-align: center;
    }

    .text {
      display: flex;
      align-items: center;
      margin-top: 10px;
    }

    .label {
      padding: 0 2px;
      border-radius: 2px;
      color: #fff;
      font-size: 9px;
      text-align: center;
      line-height: 16px;
      height: 15px;
      margin-right: 4px;
    }

    .coupon,
    .ship {
      padding: 0 5px;
      line-height: 13px;
      border-radius: 2px;
      font-size: 10px;
      margin-left: 3px;
    }

    .ship {
      color: #ff9000;
      border: 1px solid #ff9000;
    }

    .old-price {
      color: #aaa;
      font-size: 10px;
      text-decoration: line-through;
      margin-left: 3px;
    }

    .price {
      display: flex;
      align-items: center;
      margin-top: 5px;
      width: 100%;
      justify-content: space-between;
      align-items: baseline;

      .num {
        font-size: 10px;

        span {
          font-size: 20px;
        }
      }

      .label {
        width: 16px;
        height: 18px;
        margin-left: 5px;
        text-align: center;
        line-height: 18px;
        font-size: 11px;

        &.on {
          margin-left: 0;
        }
      }
    }
  }

  .listC {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto;
    width: 100%;
  }

  .list-wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .item {
      width: 48.5%;

      .img-box {
        position: relative;
        width: 100%;
        height: 173px;

        img,
        .box {
          width: 100%;
          height: 100%;
        }

        .empty-box {
          background: #e6e9ed;
        }

        .box {
          background: #d8d8d8;
        }
      }
    }

    &.itemA {
      .text {
        margin-top: 0 !important;
      }

      .item {
        display: flex;
        width: 100%;

        &:last-child {
          margin-bottom: 0 !important;
        }

        .img-box {
          position: relative;
          width: 110px;
          height: 110px;
        }

        .info {
          display: flex;
          justify-content: space-between;
          flex-direction: column;
          flex: 1;
          padding: 5px 10px;

          .num {
            font-weight: bold;
          }
        }
      }
    }

    &.itemB {
      display: grid !important;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: auto;
      width: 100%;
      justify-content: inherit;

      .item {
        width: 31.6%;
        overflow: hidden;
        position: relative;

        &:nth-child(3n) {
          margin-right: 0;
        }

        .img-box {
          position: relative;
          width: 100%;
          height: 110px;
        }

        .price {
          display: block;
        }
      }
    }
  }
}
</style>
