<template>
  <div v-if="configObj">
    <div class="indexList tui-skeleton" :style="boxStyle">
      <div class="title acea-row row-between-wrapper">
        <div class="text line1 tui-skeleton-rect acea-row">
          <el-image :src="src" class="image"></el-image>
          <span class="label" :style="titleColor">{{ configObj.titleConfig.val }}</span>
        </div>
        <div class="more tui-skeleton-rect f-s-12" :style="moreColor">
          更多
          <span class="iconfont icon-xuanze f-s-12"></span>
        </div>
      </div>
      <div class="tips mb10">Good brand store</div>
      <div v-if="listStyle === 0" class="merList" :style="gridGap">
        <div class="item" v-for="(item, index) in merList" :key="index">
          <div>
            <div class="pic tui-skeleton-rect" :style="contentStyle">
              <el-image :src="item.coverImage" class="picImg"></el-image>
            </div>
            <el-image class="lines left" :src="mediaDomain + '/crmebimage/presets/lianjie.png'"></el-image>
            <div v-show="logoShow" class="merlogo tui-skeleton-rect">
              <el-image :src="item.rectangleLogo" class="image"></el-image>
            </div>
            <el-image class="lines right" :src="mediaDomain + '/crmebimage/presets/lianjie.png'"></el-image>
            <div class="merName tui-skeleton-rect">
              <div v-show="nameShow" class="neme" :style="nameColor">{{ item.name }}</div>
              <div v-show="typeShow" class="label" :style="labelColor">旗舰店</div>
            </div>
          </div>
        </div>
      </div>
      <template v-if="listStyle === 1">
        <div class="store-wrapper">
          <template v-for="(item, index) in merList">
            <div
              :key="index"
              class="store-item street-noPad"
              :style="[{ 'background-image': 'url(' + item.streetBackImage + ')' }, contentStyle]"
            >
              <div class="head street-backImage">
                <div class="left-wrapper-merchant">
                  <div
                    class="merlogo street-merlogo"
                    :style="{ 'background-image': `url(${mediaDomain}/crmebimage/presets/shang.png)` }"
                  >
                    <el-image v-show="logoShow" :src="item.rectangleLogo" mode="" class="image"></el-image>
                  </div>
                  <div class="con-box">
                    <div class="name line1 acea-row row-middle street-name">
                      <span v-show="nameShow" class="mer_name line1" :style="nameColor">{{ item.name }}</span>
                      <div v-show="typeShow" class="merType mr10 label" :style="labelColor">自营</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pic-wrapper street-wrapper">
                <div v-for="(goods, indexn) in item.proList" :key="indexn" class="proList">
                  <div class="pic-item">
                    <el-image :src="goods.image" mode="aspectFill"></el-image>
                  </div>
                  <div class="pic-name line2 street-pic">{{ goods.name }}</div>
                  <div class="street-price" :style="priceColor">￥{{ goods.price }}</div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </template>
    </div>
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
import { mapState, mapGetters } from 'vuex';
export default {
  name: 'home_merchant',
  cname: '店铺街',
  icon: 't-icon-zujian-dianpujie',
  configName: 'c_home_merchant',
  type: 0, // 0 基础组件 1 营销组件 2工具组件
  defaultName: 'homeMerchant', // 外面匹配名称
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
    ...mapGetters(['mediaDomain', 'mobileTheme']),
    //最外层盒子的样式
    boxStyle() {
      return [
        { 'border-radius': this.configObj.bgStyle.val ? this.configObj.bgStyle.val + 'px' : '0' },
        {
          background: `linear-gradient(${this.configObj.bgColor.color[0].item}, ${this.configObj.bgColor.color[1].item})`,
        },
        { margin: this.configObj.mbConfig.val + 'px' + ' ' + this.configObj.lrConfig.val + 'px' + ' ' + 0 },
        { padding: this.configObj.upConfig.val + 'px' + ' ' + '10px' + ' ' + this.configObj.downConfig.val + 'px' },
      ];
    },
    //图片样式
    contentStyle() {
      return {
        'border-radius': this.configObj.contentStyle.val + 'px',
      };
    },
    //内容间距
    gridGap() {
      return { 'grid-gap': this.configObj.contentConfig.val + 'px' };
    },
    //内容边距
    contentConfig() {
      return [{ 'margin-right': this.configObj.contentConfig.val ? this.configObj.contentConfig.val + 'px' : '0' }];
    },
    //标题颜色
    titleColor() {
      return { color: this.configObj.titleColor.color[0].item };
    },
    //名称颜色
    nameColor() {
      return { color: this.configObj.nameColor.color[0].item };
    },
    //更多颜色
    moreColor() {
      return { color: this.configObj.moreColor.color[0].item };
    },
    //价格颜色
    priceColor() {
      return { color: this.themeStyle ? this.configObj.priceColor.color[0].item : this.themeColor };
    },
    //标签
    labelColor() {
      return [
        { backgroundColor: this.themeStyle ? this.configObj.labelColor.color[0].item : this.themeColor },
        { color: this.configObj.labelFontColor.color[0].item },
      ];
    },
    //店铺名称
    nameShow() {
      if (this.configObj.typeConfig.activeValue.indexOf(0) !== -1) {
        return true;
      } else {
        return false;
      }
    },
    //店铺logo
    logoShow() {
      if (this.configObj.typeConfig.activeValue.indexOf(1) !== -1) {
        return true;
      } else {
        return false;
      }
    },
    //店铺类型
    typeShow() {
      if (this.configObj.typeConfig.activeValue.indexOf(2) !== -1) {
        return true;
      } else {
        return false;
      }
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
    listStyle: {
      handler(nVal, oVal) {
        if (this.themeStyle == 1) {
          this.configObj.priceColor.isShow = nVal;
        }
      },
      deep: true,
    },
    themeStyle: {
      handler(nVal, oVal) {
        if (this.listStyle == 1) {
          this.configObj.priceColor.isShow = this.configObj.themeStyleConfig.tabVal;
          this.configObj.labelColor.isShow = this.configObj.themeStyleConfig.tabVal;
        } else {
          this.configObj.labelColor.isShow = this.configObj.themeStyleConfig.tabVal;
        }
      },
      deep: true,
    },
  },
  data() {
    return {
      defaultConfig: {
        name: 'homeMerchant',
        timestamp: this.num,
        setUp: {
          tabVal: 0,
          cname: '店铺街',
        },
        logoConfig: {
          tabTitle: '图标设置',
          title: '上传图标',
          tips: '建议：124px*32px',
          isShow: 1,
          url: localStorage.getItem('mediaDomain') + '/crmebimage/presets/haodian.png',
        },
        titleConfig: {
          tabTitle: '标题设置',
          title: '标题内容',
          val: '正品大牌低价购',
          place: '请输入标题',
          isShow: 1,
          max: 10,
        },
        linkConfig: {
          title: '更多链接',
          val: '/pages/merchant/merchant_street/index',
          place: '请选择链接',
          isShow: 1,
          max: 100,
        },
        //数量
        numConfig: {
          tabTitle: '内容数量',
          title: '展示数量',
          val: 3,
          isShow: 1,
          max: 9,
        },
        //显示内容
        typeConfig: {
          title: '展示信息',
          tabTitle: '显示内容',
          name: 'rowsNum',
          activeValue: [0, 1, 2],
          list: [
            {
              val: '店铺名称',
              icon: 'icon2hang',
            },
            {
              val: '店铺logo',
              icon: 'icon3hang',
            },
            {
              val: '店铺类型',
              icon: 'icon4hang',
            },
          ],
        },
        tabConfig: {
          title: '展示样式',
          tabTitle: '布局设置',
          name: 'listStyle',
          tabVal: 0,
          isShow: 1,
          list: [
            {
              val: '样式一',
              icon: 'icon-dianpujie-yangshiyi',
            },
            {
              val: '样式二',
              icon: 'icon-yangshisan',
            },
          ],
        },
        listConfig: {
          tabTitle: '店铺数据',
          title: '店铺数据',
          tabVal: 0,
          isShow: 1,
          list: [
            {
              name: '默认规则',
            },
            {
              name: '自定义',
            },
          ],
        },
        activeValueMer: {
          title: '选择店铺',
          activeValue: [],
          list: [],
          isShow: 0,
          isMultiple: true,
          goodsList: [],
        }, //商户
        // 背景颜色
        bgColor: {
          tabTitle: '颜色设置',
          title: '背景颜色',
          color: [
            {
              item: 'rgba(255,255,255,0)',
            },
            {
              item: 'rgba(255,255,255,0)',
            },
          ],
          default: [
            {
              item: 'rgba(255,255,255,0)',
            },
            {
              item: 'rgba(255,255,255,0)',
            },
          ],
        },
        labelColor: {
          isShow: 0,
          title: '标签背景颜色',
          name: 'labelColor',
          color: [
            {
              item: '#e93323',
            },
          ],
          default: [
            {
              item: '#e93323',
            },
          ],
        },
        labelFontColor: {
          title: '标签文字颜色',
          name: 'labelColor',
          color: [
            {
              item: '#fff',
            },
          ],
          default: [
            {
              item: '#fff',
            },
          ],
        },
        titleColor: {
          title: '标题颜色',
          color: [
            {
              item: '#999999',
            },
          ],
          default: [
            {
              item: '#999999',
            },
          ],
        },
        moreColor: {
          title: '更多按钮颜色',
          color: [
            {
              item: '#282828',
            },
          ],
          default: [
            {
              item: '#282828',
            },
          ],
        },
        nameColor: {
          title: '店铺名称颜色',
          color: [
            {
              item: '#282828',
            },
          ],
          default: [
            {
              item: '#282828',
            },
          ],
        },
        //色调
        themeStyleConfig: {
          title: '色调',
          tabVal: 0,
          isShow: 1,
          list: [
            {
              val: '跟随主题风格',
            },
            {
              val: '自定义',
            },
          ],
        },
        priceColor: {
          isShow: 0,
          title: '价格颜色',
          color: [
            {
              item: '#e93323',
            },
          ],
          default: [
            {
              item: '#e93323',
            },
          ],
        },
        bgStyle: {
          tabTitle: '圆角设置',
          title: '背景圆角',
          name: 'bgStyle',
          val: 0,
          min: 0,
          max: 30,
        },
        contentStyle: {
          title: '内容圆角',
          name: 'bgStyle',
          val: 7,
          min: 0,
          max: 30,
        },
        // 上间距
        upConfig: {
          tabTitle: '边距设置',
          title: '上边距',
          val: 10,
          min: 0,
          max: 100,
        },
        // 下间距
        downConfig: {
          title: '下边距',
          val: 10,
          min: 0,
        },
        // 左右间距
        lrConfig: {
          title: '左右边距',
          val: 0,
          min: 0,
          max: 25,
        },
        contentConfig: {
          title: '内容间距',
          val: 10,
          min: 0,
          max: 30,
        },
        mbConfig: {
          title: '页面间距',
          val: 10,
          min: 0,
        },
      },
      configObj: null,
      listStyle: 0,
      merList: [
        {
          name: '大王商城',
          streetBackImage: require('../../images/dianbj.png'),
          rectangleLogo: require('../../images/dafu.png'),
          coverImage: require('../../images/shangpin1.png'),
          proList: [
            {
              image: require('../../images/shangpin1.png'),
              name: '无线蓝牙耳机',
              price: '1299.00',
            },
            {
              image: require('../../images/shangpin2.png'),
              name: '苹果新款平板',
              price: '1299.00',
            },
            {
              image: require('../../images/shangpin3.png'),
              name: '蒸汽手持熨斗',
              price: '1299.00',
            },
          ],
        },
        {
          name: '大王商城',
          streetBackImage: require('../../images/dianbj.png'),
          rectangleLogo: require('../../images/dafu.png'),
          coverImage: require('../../images/shangpin2.png'),
          proList: [
            {
              image: require('../../images/shangpin1.png'),
              name: '无线蓝牙耳机',
              price: '1299.00',
            },
            {
              image: require('../../images/shangpin2.png'),
              name: '苹果新款平板',
              price: '1299.00',
            },
            {
              image: require('../../images/shangpin3.png'),
              name: '蒸汽手持熨斗',
              price: '1299.00',
            },
          ],
        },
        {
          name: '大王商城',
          streetBackImage: require('../../images/dianbj.png'),
          rectangleLogo: require('../../images/dafu.png'),
          coverImage: require('../../images/shangpin3.png'),
          proList: [
            {
              image: require('../../images/shangpin1.png'),
              name: '无线蓝牙耳机',
              price: '1299.00',
            },
            {
              image: require('../../images/shangpin2.png'),
              name: '苹果新款平板',
              price: '1299.00',
            },
            {
              image: require('../../images/shangpin3.png'),
              name: '蒸汽手持熨斗',
              price: '1299.00',
            },
          ],
        },
      ],
      src: '',
      themeStyle: 0,
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
        this.listStyle = this.configObj.tabConfig.tabVal;
        this.src = this.configObj.logoConfig.url
          ? this.configObj.logoConfig.url
          : localStorage.getItem('mediaDomain') + '/crmebimage/presets/haodian.png';
        this.themeStyle = data.themeStyleConfig.tabVal;
        this.themeColor = this.$options.filters.filterTheme(this.mobileTheme - 1);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.merList {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  width: 100%;
  grid-gap: 10px;
  .item {
    position: relative;
    .lines {
      width: 4px;
      height: 17px;
      position: absolute;
      z-index: 1;
    }
    .left {
      left: 7px;
      top: 102px;
    }
    .right {
      right: 7px;
      top: 102px;
    }
    .pic {
      width: 100%;
      height: 110px;
      overflow: hidden;
      el-image {
        width: 100% !important;
        height: 100% !important;
      }
    }

    .merlogo {
      width: 75px;
      height: 22px;
      background: #ffffff;
      box-shadow: 0 2px 3px 1px rgba(0, 0, 0, 0.1);
      border-radius: 11px;
      opacity: 1;
      margin: auto;
      z-index: 1;
      left: 16%;
      top: 59%;
      position: absolute;
      .image,
      el-image {
        margin: auto;
        width: 65px;
        height: 22px;
        display: block;
      }
    }
    .merName {
      width: 100%;
      height: 55px;
      background: #ffffff;
      border-radius: 7px;
      opacity: 1;
      padding: 15px 0 7px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      .neme {
        font-weight: bold;
        color: #333333;
        font-size: 11px;
        text-align: center;
        margin-bottom: 2px;
      }
      .label {
        height: 14px;
        line-height: 14px;
        border-radius: 7px;
        opacity: 1;
        text-align: center;
        font-size: 9px;
        color: #fff;
        padding: 0 6px;
      }
    }
  }
}
.mb8 {
  margin-bottom: 4px;
}
.noCheck {
  color: #ddd;
}
.score {
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 12px;
  line-height: 1;
  height: 9px;

  .iconfont {
    font-size: 10px;
  }
}

.star-box {
  display: flex;
  align-items: center;

  .lines {
    width: 1px;
    height: 7px;
    background: #bfbfbf;
    border-radius: 0px 0px 0px 0px;
    opacity: 1;
    margin-left: 5px;
    margin-right: 5px;
  }

  .fans {
    font-size: 12px;
  }

  .num {
    font-size: 12px;
    margin-left: 5px;
  }
}

.street {
  &-merlogo {
    width: 84px !important;
    height: 40px !important;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    border-radius: 0 !important;
    margin-right: 0 !important;

    .image {
      width: 66px !important;
      height: 22px !important;
      margin-top: 9px;
      margin-left: 3px;
    }
  }

  &-name {
    color: #fff !important;
  }

  &-pad20 {
    padding: 0 10px;
  }

  &-noPad {
    width: 100%;
    height: 177px;
    padding: 12px !important;
    background-size: 100% 100%;
    margin-bottom: 49px !important;
  }

  &-pic {
    border-radius: 4px !important;
    overflow: hidden;
    margin-right: 6px !important;
  }

  &-price {
    font-size: 14px;
    color: #fd502f;
    margin-top: 3px;

    font-weight: 800;
  }

  &-wrapper {
    padding: 10px !important;
    margin-top: -1px;
  }

  &-active {
    background-size: 56px 10px;
  }
}

.backImage {
  padding: 12px 0 12px 10px;
  border-radius: 16px 16px 0px 0px;
}

.store-item {
  background-color: #fff;
  padding: 11px;
  background-size: 100% 100%;
  margin-bottom: 48px;
  .head {
    display: flex;
    justify-content: space-between;

    .left-wrapper-merchant {
      display: flex;
      align-items: center;

      .merlogo {
        width: 40px;
        height: 40px;
        border-radius: 3px;
        overflow: hidden;
        margin-right: 5px;

        el-image {
          width: 60px;
          height: 60px;
          border-radius: 3px;
          overflow: hidden;
        }
      }

      .con-box {
        .bt-color {
          width: max-content;
          white-space: nowrap;
          font-size: 8px;
          padding: 1px 5px;
          background-color: #fff;
          border-radius: 7px;
        }

        .name {
          font-size: 15px;
          color: #333;
          font-weight: bold;
          margin-top: -7rpx;

          .mer_name {
            max-width: 200px;
            margin-right: 5px;
            font-size: 14px;
          }
          .merType {
            height: 14px;
            line-height: 14px;
            border-radius: 7px;
            opacity: 1;
            text-align: center;
            font-size: 9px;
            color: #fff;
            padding: 0 6px;
          }
        }
      }
    }

    .link {
      width: 57px;
      height: 25px;
      line-height: 25px;
      border-radius: 13px;
      text-align: center;
      color: #fff;
      font-size: 12px;
    }
  }

  .pic-wrapper {
    width: 100%;
    display: grid;
    grid-template-rows: auto;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 10px;
    background-color: #ffffff;
    border-radius: 0px 8px 8px 8px;
    padding-top: 10px;

    .pic-name {
      margin-top: 5px;
      font-size: 12px;
      color: #333333;
    }

    .pic-item {
      position: relative;
      width: 100%;
      height: 98px;
      overflow: hidden;
      border-radius: 7px;

      .easy-loadimage,
      image,
      uni-image {
        overflow: hidden;
        border-radius: 8px;
        width: 100%;
        height: 100%;
      }

      .price {
        position: absolute;
        right: 0;
        bottom: 0;
        height: 18px;
        padding: 0 5px;
        line-height: 18px;
        text-align: center;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 8px 1px 8px 1px;
        color: #fff;
        font-size: 12px;

        text {
          font-size: 9px;
        }
      }

      &:nth-child(3n) {
        margin-right: 0;
      }
    }
  }
}
.f-s-12 {
  font-size: 12px !important;
}
</style>
