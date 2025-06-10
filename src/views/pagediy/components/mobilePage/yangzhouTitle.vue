<template>
  <div class="title-box acea-row row-between row-middle">
    <!-- <div class="acea-row row-middle"> -->
    <div class="info-title" :style="titleStyle">{{ titleTxt }}</div>
    <div class="info-title" :style="titleStyle2">{{ titleTxt2 }}</div>
    <div class="ml6" :style="titleFuStyle">{{ titleFuTxt }}</div>
    <!-- </div> -->
    <div v-if="!selectShow" :style="titleRightStyle" class="titleRight">
      {{ titleRightTxt }}
      <!-- <i class="el-icon-arrow-right"></i> -->
      <div class="right-arrow" :style="titleRightArrowStyle"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'yangzhouTitle',
    cname: '公共标题', // 标题名称
    icon: 't-icon-zujian-lunbotu',
    defaultName: 'yzTitle', // 外面匹配名称
    configName: 'c_title', // 右侧配置名称
    type: -1, // 0 基础组件 1 营销组件 2工具组件 3自定义
    props: {
      titleTxt: {
        type: String,
        default: '12123',
      },
      titleTxt2: {
        type: String,
        default: '',
      },
      titleFuTxt: {
        type: String,
        default: '',
      },
      titleRightTxt: {
        type: String,
        default: '',
      },
      selectShow: {
        type: Boolean,
        default: false,
      },
      titleStyle: {
        type: Object,
        default: () => ({}),
      },
      titleStyle2: {
        type: Object,
        default: () => ({}),
      },
      titleFuStyle: {
        type: Object,
        default: () => ({}),
      },
      titleRightStyle: {
        type: Object,
        default: () => ({}),
      },
      titleRightArrowStyle: {
        type: Object,
        default: () => ({}),
      },
      num: {
        type: null,
      },
    },

    data() {
      return {
        // 默认初始化数据禁止修改
        defaultConfig: {
          name: 'yangzhouTitle',
          isShow: true,
          timestamp: this.num,
          setUp: {
            tabVal: 3,
            cname: '公共标题',
          },

          // 上间距
          upConfig: {
            title: '上边距',
            val: 10,
            min: 0,
            max: 100,
          },
          // 下间距
          downConfig: {
            tabTitle: '边距设置',
            title: '下边距',
            val: 10,
            min: 0,
          },
          bgStyle: {
            tabTitle: '圆角设置',
            title: '背景圆角',
            name: 'bgStyle',
            val: 0,
            min: 0,
            max: 30,
          },
          // 左右间距
          lrConfig: {
            title: '左右边距',
            val: 12,
            min: 0,
            max: 15,
          },
          // 页面间距
          mbConfig: {
            title: '页面间距',
            val: 0,
            min: 0,
          },
          // 背景颜色
          bgColor: {
            tabTitle: '颜色设置',
            title: '背景颜色',
            color: [{
                item: '#FFFFFF',
              },
              {
                item: '#FFFFFF',
              },
            ],
            default: [{
                item: '#FFFFFF',
              },
              {
                item: '#FFFFFF',
              },
            ]
          },
          //色调
          themeStyleConfig: {
            title: '色调',
            tabVal: 3,
            isShow: 1,
            list: [{
                val: '跟随主题风格',
              },
              {
                val: '自定义',
              },
            ],
          },


          configObj: null,
          pageData: {},
          imgSrcList: [],
          docType: 0,
          swiperType: 0,
          themeStyle: 0,
          themeColor: '',
        }
      }
}
  };
</script>

<style lang="scss" scoped>
  .title-box {
    // height: 20px;
    height: 40px;
    padding-top: 7px;
    padding-bottom: 12px;

    background-repeat: no-repeat;

    display: flex;
    align-items: end;
    justify-content: start;
  }

  .titleRight {
    margin-left: auto;
    margin-top: 1px;
    margin-bottom: -1px;
    padding: 3px 4px 3px 6px;
    border-radius: 10px;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
  }

  .info-title {
    font-size: 12px;
    font-family: yixin;
  }

  .ml6 {
    margin: 1px 0;
    margin-left: 2px !important;
  }

  .right-arrow {
    height: 0;
    width: 0;
    border: 2.5px solid transparent;
    border-right: 0px;
    border-left: 4px solid #000;
  }
</style>
