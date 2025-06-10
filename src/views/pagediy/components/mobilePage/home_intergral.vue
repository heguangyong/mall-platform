<!-- 积分 -->
<template>
  <div class="groupBox" v-if="configObj" :style="boxPadding">
    <div class="group" :style="boxStyle">
      <div class="group-top acea-row row-middle row-between" :style="selectBgImg == 0 ? bgImgStyle : ''">
        <div class="group-top-left acea-row">
          <img v-if="selectStyle == 0" :src="logoUrl" alt="" class="headerLogo" />
          <div v-else class="titleFont" :style="headerTitleConfig">{{ titleConfig }}</div>
        </div>
        <div class="group-top-right" :style="headerBtnColor">
          更多
          <span class="iconfont icon-xuanze" :style="headerBtnColor"></span>
        </div>
      </div>
      <!-- 样式二 -->
      <div class="group-bottom two acea-row row-between grid-list" v-if="listStyle == 0" :style="boxBgStyle">
        <div v-for="(item, index) in 2" :key="index">
          <div class="group-bottom-left">
            <div class="img acea-row row-center row-middle big-img" :style="contentStyle">
              <img src="@/assets/imgs/shan.png" alt="" class="shan" />
            </div>
          </div>
          <div class="two-item">
            <div class="title acea-row">
              <span class="line1" v-if="typeShow.includes(0)" :style="nameColor"
                >THE ROW 休闲针织衫女2024春秋深藏青条纹毛衣女羊绒真丝套头上衣 THE ROW
                休闲针织衫女2024春秋深藏青条纹毛衣女羊绒真丝套头上衣
              </span>
            </div>
            <div class="two-item-bottom acea-row row-between">
              <div class="price">
                <div
                  class="pinkNum semiBold acea-row row-middle f-s-16"
                  v-if="typeShow.includes(2)"
                  :style="priceColor"
                >
                  <img class="priceNum-img" src="@/assets/imgs/intergral-icon.png" alt="" />
                  <span>688800</span><span class="txtColor">+</span><span>67000</span><span class="txtColor">元</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 样式三 -->
      <div class="group-bottom three acea-row grid-three" v-if="listStyle == 1" :style="boxBgStyle">
        <div v-for="(item, index) in 3" :key="index" class="three-box">
          <div class="group-bottom-left">
            <div class="img acea-row row-center row-middle three-img" :style="contentStyle">
              <img src="@/assets/imgs/shan.png" alt="" class="shan" />
            </div>
          </div>
          <div class="two-item">
            <div class="two-item-bottom">
              <div class="price">
                <div
                  class="pinkNum semiBold acea-row row-middle f-s-14"
                  v-if="typeShow.includes(2)"
                  :style="priceColor"
                >
                  <img class="priceNum-img" src="@/assets/imgs/intergral-icon.png" alt="" />
                  <span>688800</span><span class="txtColor">+</span><span>670</span><span class="txtColor">元</span>
                </div>
              </div>
            </div>
            <div class="title acea-row">
              <span class="line1" v-if="typeShow.includes(0)" :style="nameColor"
                >THE ROW 休闲针织衫女2024春秋深藏青条纹毛衣女羊绒真丝套头上衣 THE ROW
                休闲针织衫女2024春秋深藏青条纹毛衣女羊绒真丝套头上衣
              </span>
            </div>
          </div>
        </div>
      </div>
      <!-- 样式四 -->
      <div class="group-bottom four acea-row" v-if="listStyle == 2" :style="boxBgStyle">
        <div v-for="(item, index) in 3" :key="index" class="four-item">
          <div class="group-bottom-left">
            <div class="img acea-row row-center row-middle four-img" :style="contentStyle">
              <img src="@/assets/imgs/shan.png" alt="" class="shan" />
            </div>
          </div>
          <div class="two-item">
            <div class="two-item-bottom">
              <div class="price">
                <div
                  class="pinkNum semiBold acea-row row-middle f-s-14"
                  v-if="typeShow.includes(2)"
                  :style="priceColor"
                >
                  <img class="priceNum-img" src="@/assets/imgs/intergral-icon.png" alt="" />
                  <span>688800</span><span class="txtColor">+</span><span>6700</span><span class="txtColor">元</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
  name: 'home_intergral',
  cname: '积分商城',
  icon: 't-icon-zujian-jifenshangcheng',
  configName: 'c_home_intergral',
  type: 1, // 0 基础组件 1 营销组件 2工具组件
  defaultName: 'intergral', // 外面匹配名称
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
    //容器样式
    //最外层盒子的样式
    boxStyle() {
      return [
        { 'border-radius': this.configObj.bgStyle.val ? this.configObj.bgStyle.val + 'px' : '0' },
        { margin: 0 + ' ' + this.configObj.lrConfig.val + 'px' + ' ' + 0 },
        {
          background: `linear-gradient(to right,${this.configObj.bgColor.color[0].item}, ${this.configObj.bgColor.color[1].item})`,
        },
      ];
    },
    //边距
    boxPadding() {
      return [
        {
          padding: this.configObj.upConfig.val + 'px' + ' ' + '0px' + ' ' + this.configObj.downConfig.val + 'px',
        },
        { margin: this.configObj.mbConfig.val + 'px' + ' ' + 0 + ' ' + 0 },
      ];
    },
    //背景颜色
    boxBgStyle() {
      return [
        {
          background: `linear-gradient(to right,${this.configObj.contentBgColor.color[0].item}, ${this.configObj.contentBgColor.color[1].item})`,
        },
        {
          gap: `${this.configObj.contentConfig.val}px`,
        },
      ];
    },
    //头部按钮颜色
    headerBtnColor() {
      return {
        color: this.configObj.headerBtnColor.color[0].item,
      };
    },
    //商品名称颜色
    nameColor() {
      return {
        color: this.configObj.nameColor.color[0].item,
      };
    },
    //拼团价格颜色
    priceColor() {
      return {
        color: this.themeStyle ? this.configObj.priceColor.color[0].item : this.themeColor,
      };
    },
    //图片圆角
    contentStyle() {
      return {
        'border-radius': this.configObj.contentStyle.val ? this.configObj.contentStyle.val + 'px' : '0',
      };
    },
    //样式一内容边距
    contentConfig() {
      return {
        'margin-top': this.configObj.contentConfig.val + 'px',
      };
    },
    //背景图片
    bgImgStyle() {
      return {
        'background-image': `url(${this.bgImgUrl})`,
      };
    },
    //标题文字格式
    headerTitleConfig() {
      return [
        {
          'font-weight': this.headerTitleStyle == 0 ? 600 : '',
        },
        {
          'font-style': this.headerTitleStyle == 2 ? 'italic' : 'normal',
        },
        {
          color: this.configObj.headerTitleColor.color[0].item,
        },
      ];
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
    selectStyle(nVal, oVal) {
      if (nVal == 0) {
        this.configObj.logoConfig.isShow = 1;
        this.configObj.titleConfig.isShow = 0;
        this.configObj.headerTitleStyle.isShow = 0;
        this.configObj.headerTitleColor.isShow = 0;
      } else {
        this.configObj.logoConfig.isShow = 0;
        this.configObj.titleConfig.isShow = 1;
        this.configObj.headerTitleStyle.isShow = 1;
        this.configObj.headerTitleColor.isShow = 1;
      }
    },
    selectBgImg(nVal, oVal) {
      if (nVal == 0) {
        this.configObj.bgImg.isShow = 1;
        this.configObj.bgColor.isShow = 0;
        this.configObj.bgColor.color = [
          {
            item: '#FFFFFF',
          },
          {
            item: '#FFFFFF',
          },
        ];
      } else {
        this.configObj.bgImg.isShow = 0;
        this.configObj.bgColor.isShow = 1;
      }
    },
    listStyle(nVal) {
      if (nVal == 2) {
        this.configObj.nameColor.isShow = 0;
      } else {
        this.configObj.nameColor.isShow = 1;
      }
    },
    themeStyle: {
      handler(nVal, oVal) {
        this.configObj.priceColor.isShow = this.configObj.themeStyleConfig.tabVal;
      },
      deep: true,
    },
  },
  data() {
    return {
      defaultConfig: {
        name: 'intergral',
        timestamp: this.num,
        setUp: {
          tabVal: 0,
          cname: '积分商城',
        },
        itemStyle: {
          title: '展示样式',
          tabTitle: '布局设置',
          tabVal: 0,
          isShow: 1,
          list: [
            {
              val: '样式1',
              icon: 'icon-yangshisan',
            },
            {
              val: '样式2',
              icon: 'icon-dianpujie-yangshiyi',
            },
            {
              val: '样式3',
              icon: 'icon-ic_layout4',
            },
          ],
        },
        selectStyle: {
          cname: 'selectStyle',
          title: '标题类型',
          tabVal: 0,
          isShow: 1,
          list: [
            {
              val: '图片',
            },
            {
              val: '文字',
            },
          ],
        },
        logoConfig: {
          isShow: 1,
          tabTitle: '头部设置',
          title: '标题图片',
          tips: '建议：154px*32px',
          url: localStorage.getItem('mediaDomain') + '/crmebimage/presets/intergralTitle.png',
        },
        selectBgImg: {
          cname: 'selectBgImg',
          title: '选择风格',
          tabVal: 0,
          isShow: 1,
          list: [
            {
              val: '背景图片',
            },
            {
              val: '背景色',
            },
          ],
        },
        bgImg: {
          isShow: 1,
          title: '背景图片',
          tips: '建议：710px*96px',
          url: localStorage.getItem('mediaDomain') + '/crmebimage/presets/intergralBg.png',
        },
        titleConfig: {
          title: '标题文字',
          val: '积分兑好礼',
          place: '请输入标题',
          isShow: 1,
          max: 6,
        },
        // 背景颜色
        bgColor: {
          tabTitle: '颜色设置',
          title: '背景颜色',
          isShow: 1,
          color: [
            {
              item: '#FFFFFF',
            },
            {
              item: '#FFFFFF',
            },
          ],
          default: [
            {
              item: '#FFFFFF',
            },
            {
              item: '#FFFFFF',
            },
          ],
        },
        // 内容背景颜色
        contentBgColor: {
          tabTitle: '颜色设置',
          title: '内容背景',
          isShow: 1,
          color: [
            {
              item: '#FFFFFF',
            },
            {
              item: '#FFFFFF',
            },
          ],
          default: [
            {
              item: '#FFFFFF',
            },
            {
              item: '#FFFFFF',
            },
          ],
        },
        headerTitleStyle: {
          cname: 'headerTitleStyle',
          title: '标题文字',
          tabVal: 0,
          isShow: 1,
          list: [
            {
              val: '加粗',
            },
            {
              val: '正常',
            },
            {
              val: '倾斜',
            },
          ],
        },
        headerTitleColor: {
          title: '标题颜色',
          isShow: 1,
          color: [
            {
              item: '#FFFFFF',
            },
          ],
          default: [
            {
              item: '#FFFFFF',
            },
          ],
        },
        headerBtnColor: {
          title: '按钮颜色',
          color: [
            {
              item: '#FFFFFF',
            },
          ],
          default: [
            {
              item: '#FFFFFF',
            },
          ],
        },
        nameColor: {
          isShow: 1,
          title: '商品名称颜色',
          color: [
            {
              item: '#000000',
            },
          ],
          default: [
            {
              item: '#000000',
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
              item: '#E93323',
            },
          ],
          default: [
            {
              item: '#E93323',
            },
          ],
        },
        bgStyle: {
          tabTitle: '圆角设置',
          title: '背景圆角',
          name: 'bgStyle',
          val: 7,
          min: 0,
          max: 30,
        },
        contentStyle: {
          title: '图片圆角',
          name: 'contentStyle',
          val: 5,
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
          val: 12,
          min: 0,
          max: 15,
        },
        mbConfig: {
          title: '页面间距',
          val: 0,
          min: 0,
        },
        contentConfig: {
          title: '内容间距',
          val: 12,
          min: 0,
          max: 20,
        },
      },
      listStyle: 0,
      configObj: null,
      logoUrl: null,
      typeShow: [0, 1, 2, 3],
      selectStyle: '',
      titleConfig: '',
      selectBgImg: '',
      bgImgUrl: '',
      headerTitleStyle: 0,
      themeStyle: 0,
      themeColor: '',
    };
  },
  mounted() {
    this.$nextTick(() => {
      if (this.num) {
        let pageData = this.$store.state.mobildConfig.defaultArray[this.num];
        this.setConfig(pageData);
      }
    });
  },
  methods: {
    setConfig(data) {
      if (!data) return;
      if (data) {
        this.configObj = data;
        this.listStyle = this.configObj.itemStyle.tabVal;
        this.logoUrl = this.configObj.logoConfig.url;
        this.selectStyle = this.configObj.selectStyle.tabVal;
        this.titleConfig = this.configObj.titleConfig.val;
        this.selectBgImg = this.configObj.selectBgImg.tabVal;
        this.bgImgUrl = this.configObj.bgImg.url;
        this.headerTitleStyle = this.configObj.headerTitleStyle.tabVal;
        this.themeStyle = data.themeStyleConfig.tabVal;
        this.themeColor = this.$options.filters.filterTheme(this.mobileTheme - 1);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.groupBox {
  overflow: hidden;

  .group {
    overflow: hidden;

    .group-top {
      width: 100%;
      height: 50px;
      background-repeat: no-repeat;
      background-size: cover;
      padding: 0 12px;

      .group-top-left {
        .headerLogo {
          width: 70px;
          height: 16px;
        }

        .interval {
          width: 0px;
          height: 16px;
          border: 1px solid rgba(255, 255, 255, 0.6);
          margin-left: 5px;
        }

        .pinkHead {
          width: 54px;
          height: 18px;
        }

        .num {
          height: 16px;
          line-height: 16px;
          font-size: 13px;
          color: #ffffff;
        }
      }

      .group-top-right {
        height: 16px;
        line-height: 16px;
        font-size: 12px;

        .icon-xuanze {
          font-size: 12px;
        }
      }
    }

    .group-bottom {
      width: 100%;
      padding: 10px;

      .img {
        width: 120px;
        height: 120px;
        background: #f3f9ff;

        .shan {
          width: 65px;
          height: 50px;
        }
      }

      .big-img.img {
        width: 100%;
        height: 161px;
      }

      .three-img.img {
        width: 100%;
        height: 100px;
      }

      .four-img {
        width: 120px;
        height: 120px;
      }

      .group-bottom-right {
        width: 200px;

        .right-top {
          .title {
            font-size: 14px;
            color: #333333;
          }

          .pink {
            margin-top: 8px;
            font-size: 11px;

            .people {
              color: #fff;
              padding: 2px 6px;
              border-radius: 4px 0 0 4px;
            }

            .groupNum {
              color: #e93323;
              background: rgba(211, 56, 42, 0.1);
              padding: 2px 6px;
              border-radius: 0 4px 4px 0;
            }
          }
        }

        .right-bottom {
          .price {
            .pinkNum {
              img {
                vertical-align: middle;
              }

              .pinkNum-num {
                font-weight: 600;
                font-size: 18px;
              }
            }

            .num {
              color: #999999;
            }
          }

          .btnBox {
            margin-top: 8px;
            font-size: 11px;

            .btn {
              padding: 6px 10px;
              border-radius: 25px 25px 25px 25px;
            }
          }
        }
      }
    }

    .group-bottom.two {
      .two-item {
        width: 100%;

        .title {
          margin-top: 10px;

          .numPink {
            color: #ffffff;
            padding: 2px 6px;
            border-radius: 0 4px 4px 0;
            font-size: 11px;
            width: 41px;
          }

          .line1 {
            width: 150px;
            margin-left: 5px;
          }
        }

        .two-item-bottom {
          margin-top: 5px;

          .pinkNum {
            .num {
              font-weight: 600;
              font-size: 18px;
            }
          }

          .otNum {
            font-size: 13px;
            color: #999999;
            text-decoration-line: line-through;
          }

          .btnBox {
            margin-top: 8px;
            font-size: 11px;

            .btn {
              padding: 6px 12px;
              border-radius: 25px 25px 25px 25px;
            }
          }
        }
      }
    }

    .group-bottom.three {
      .numPink {
        position: absolute;
        color: #ffffff;
        padding: 2px 6px;
        border-radius: 0 4px 4px 0;
        font-size: 11px;
      }

      .two-item {
        width: 100%;

        .title {
          margin-top: 9px;
          width: 100%;

          .numPink {
            color: #ffffff;
            padding: 2px 6px;
            border-radius: 0 4px 4px 0;
            font-size: 11px;
            width: 41px;
          }

          .line1 {
            width: 100px;
            margin-left: 5px;
          }
        }

        .two-item-bottom {
          margin-top: 5px;
          // width: 100%;

          .pinkNum {
            .num {
              font-weight: 600;
              font-size: 18px;
            }
          }

          .otNum {
            font-size: 13px;
            color: #999999;
            text-decoration-line: line-through;
          }

          .btnBox {
            margin-top: 8px;
            font-size: 11px;

            .btn {
              padding: 6px 12px;
              border-radius: 25px 25px 25px 25px;
            }
          }
        }
      }
    }

    .group-bottom.four {
      overflow: hidden;
      flex-wrap: nowrap;
      position: relative;

      .numPink {
        position: absolute;
        color: #ffffff;
        padding: 2px 6px;
        border-radius: 0 4px 4px 0;
        font-size: 11px;
      }

      .two-item {
        width: 112px;

        .title {
          margin-top: 9px;

          .numPink {
            color: #ffffff;
            padding: 2px 6px;
            border-radius: 0 4px 4px 0;
            font-size: 11px;
            width: 41px;
          }

          .line1 {
            width: 105px;
            margin-left: 5px;
          }
        }

        .two-item-bottom {
          margin-top: 5px;

          .pinkNum {
            .num {
              font-weight: 600;
              font-size: 18px;
            }
          }

          .otNum {
            font-size: 13px;
            text-decoration-line: line-through;
          }

          .btnBox {
            margin-top: 8px;
            font-size: 11px;

            .btn {
              padding: 6px 12px;
              border-radius: 25px 25px 25px 25px;
            }
          }
        }
      }
    }
  }

  .price {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .grid-list {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto;
    width: 100%;
  }

  .grid-three {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto;
    width: 100%;
    justify-content: space-between;

    .three-box {
      width: 100%;
    }
  }
}

.f-s-20 {
  font-size: 20px;
}

.f-s-14 {
  font-size: 14px;
}

.titleFont {
  font-size: 16px;
}

.priceNum-img {
  width: 14px;
  height: 14px;
  margin-right: 4px;
}

.semiBold {
  font-weight: 600;
}
.txtColor {
  color: #666;
  font-weight: 500;
}
</style>
