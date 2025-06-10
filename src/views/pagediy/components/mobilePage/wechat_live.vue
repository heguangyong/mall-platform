<template>
  <div v-if="configObj" class="mobile-page indexList" :style="boxStyle">
    <div class="title acea-row row-between-wrapper">
      <div class="text line1 tui-skeleton-rect acea-row">
        <el-image class="image" :src="src"></el-image>
        <span class="label" :style="titleColor">{{ configObj.titleConfig.val }}</span>
      </div>
      <div class="more tui-skeleton-rect" :style="moreColor">
        MORE
        <span class="iconfont icon-xuanze"></span>
      </div>
    </div>
    <div class="tips mb10">Exciting live streaming</div>
    <div v-if="listStyle === 0" class="live-wrapper-a live-wrapper-c">
      <div
        :style="[{ marginRight: contentConfig }, contentStyle]"
        class="live-item-a"
        v-for="(item, index) in live"
        :key="index"
      >
        <div class="img-box">
          <div class="empty-box">
            <span class="iconfont icon-tu"></span>
          </div>
          <div class="label bgblue" v-if="item.type == 1">
            <span class="txt"><span class="iconfont iconweikaishi" style="margin-right: 5px"></span>预告</span>
            <span class="msg">7/29 10:00</span>
          </div>
          <div class="label bggary" v-if="item.type == 0">
            <span class="iconfont iconyijieshu" style="margin-right: 5px"></span>回放
          </div>
          <div class="label bgred" v-if="item.type == 2">
            <span class="iconfont iconzhibozhong" style="margin-right: 5px"></span>直播中
          </div>
        </div>
      </div>
    </div>
    <div v-if="listStyle === 1" class="live-wrapper-a">
      <div
        :style="[{ marginBottom: contentConfig }, contentStyle]"
        class="live-item-a"
        v-for="(item, index) in live"
        :key="index"
      >
        <div class="img-box">
          <div class="empty-box">
            <span class="iconfont icon-tu"></span>
          </div>
          <div class="label bgblue" v-if="item.type == 1">
            <span class="txt"><span class="iconfont iconweikaishi" style="margin-right: 5px"></span>预告</span>
            <span class="msg">7/29 10:00</span>
          </div>
          <div class="label bggary" v-if="item.type == 0">
            <span class="iconfont-diy iconyijieshu" style="margin-right: 5px"></span>回放
          </div>
          <div class="label bgred" v-if="item.type == 2">
            <span class="iconfont-diy iconzhibozhong" style="margin-right: 5px"></span>直播中
          </div>
        </div>
        <div class="info">
          <div class="title">直播标题直播标题直播标 题直播标题</div>
          <div class="people">
            <span>樱桃小丸子</span>
          </div>
          <div class="goods-wrapper">
            <template v-if="item.goods.length > 0">
              <div class="goods-item" v-for="(goods, index) in item.goods" :key="index">
                <div class="empty-box">
                </div>
                <span>￥{{ goods.price }}</span>
              </div>
            </template>
            <template v-else>
              <div class="empty-goods">暂无商品</div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <!--双列-->
    <div v-if="listStyle === 2" class="live-wrapper-b listC" :style="{ gridGap: contentConfig }">
      <div class="live-item-b" :style="contentStyle" v-for="(item, index) in live" :key="index">
        <div class="img-box">
          <div class="empty-box">
            <span class="iconfont icon-tu"></span>
          </div>
          <div class="label bgblue" v-if="item.type == 1">
            <span class="txt"><span class="iconfont-diy iconweikaishi" style="margin-right: 5px"></span>预告</span>
            <span class="msg">7/29 10:00</span>
          </div>
          <div class="label bggary" v-if="item.type == 0">
            <span class="iconfont-diy iconyijieshu" style="margin-right: 5px"></span>回放
          </div>
          <div class="label bgred" v-if="item.type == 2">
            <span class="iconfont-diy iconzhibozhong" style="margin-right: 5px"></span>直播中
          </div>
        </div>
        <div class="info">
          <div class="title">直播标题直播标题直播标 题直播标题</div>
          <div class="people">
            <span>樱桃小丸子</span>
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
  name: 'wechat_live',
  cname: '小程序直播',
  configName: 'c_wechat_live',
  type: 1, // 0 基础组件 1 营销组件 2工具组件
  defaultName: 'liveBroadcast', // 外面匹配名称
  icon: 't-icon-zujian-xiaochengxuzhibo',
  props: {
    index: {
      type: null,
      default: -1,
    },
    num: {
      type: null,
    },
  },
  computed: {
    ...mapState('mobildConfig', ['defaultArray']),
    ...mapGetters(['mediaDomain']),
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
    //内容圆角
    contentStyle() {
      return { 'border-radius': this.configObj.contentStyle.val ? this.configObj.contentStyle.val + 'px' : '0' };
    },
    //更多颜色
    moreColor() {
      return { color: this.configObj.moreColor.color[0].item };
    },
    //标题颜色
    titleColor() {
      return { color: this.configObj.titleColor.color[0].item };
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
  },
  data() {
    return {
      // 默认初始化数据禁止修改
      defaultConfig: {
        name: 'liveBroadcast',
        timestamp: this.num,
        setUp: {
          tabVal: 0,
          cname: '小程序直播',
        },
        logoConfig: {
          isShow: 1,
          tabTitle: '图标设置',
          title: '上传图标',
          tips: '建议：124px*32px',
          url: localStorage.getItem('mediaDomain') + '/crmebimage/presets/zhibo.png',
        },
        titleConfig: {
          tabTitle: '标题设置',
          title: '标题内容',
          val: '精彩抢先看',
          place: '请输入标题',
          isShow: 1,
          max: 10,
        },
        linkConfig: {
          title: '更多链接',
          val: '/pages/activity/liveBroadcast/index',
          place: '请选择链接',
          isShow: 1,
          max: 100,
        },
        //数量
        // numConfig: {
        //   tabTitle: '显示内容',
        //   title: '展示数量',
        //   val: 3,
        //   isShow: 1,
        // },
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
        // 背景颜色
        bgColor: {
          tabTitle: '颜色设置',
          title: '背景颜色',
          color: [
            {
              item: 'rgba(255, 255, 255, 0)',
            },
            {
              item: 'rgba(255, 255, 255, 0)',
            },
          ],
          default: [
            {
              item: 'rgba(255, 255, 255, 0)',
            },
            {
              item: 'rgba(255, 255, 255, 0)',
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
              val: '单行',
              icon: 'icon-yangshiyi',
            },
            {
              val: '多行',
              icon: 'icon-yangshisan',
            },
            {
              val: '双排',
              icon: 'icon-yangshier',
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
          title: '图片圆角',
          name: 'contentStyle',
          val: 10,
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
        contentConfig: {
          title: '内容间距',
          val: 10,
          min: 0,
          max: 30,
        },
        // 左右间距
        lrConfig: {
          title: '左右边距',
          val: 12,
          min: 0,
          max: 25,
        },
        mbConfig: {
          title: '页面间距',
          val: 10,
          min: 0,
        },
      },
      live: [
        {
          title: '直播中',
          name: 'playBg',
          type: 2,
          color: '',
          icon: 'iconzhibozhong',
          goods: [],
        },
        {
          title: '回放',
          name: 'endBg',
          type: 0,
          color: '',
          icon: 'iconyijieshu',
          goods: [],
        },
        {
          title: '预告',
          name: 'notBg',
          type: 1,
          color: '',
          icon: 'iconweikaishi',
          goods: [],
        },
        {
          title: '直播中',
          name: 'playBg',
          type: 2,
          color: '',
          icon: 'iconzhibozhong',
          goods: [],
        },
      ],
      configObj: null,
      pageData: {},
      listStyle: 0,
      src: '',
      contentConfig: 0, //内容间距
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
        this.contentConfig = this.configObj.contentConfig.val ? this.configObj.contentConfig.val + 'px' : '0';
        this.listStyle = data.tabConfig.tabVal;
        this.src = this.configObj.logoConfig.url
          ? this.configObj.logoConfig.url
          : localStorage.getItem('mediaDomain') + '/crmebimage/presets/zhibo.png';
      }
    },
  },
};
</script>

<style scoped lang="scss">
.listC {
  display: grid !important;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto;
  width: 100%;
}
.auto {
  width: auto !important;
}
.mobile-page {
  background: #f5f5f5;
  font-size: 12px;
}
.img-box {
  .label {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 0;
    top: 0;
    width: 76px;
    height: 17px;
    line-height: 17px;
    color: #fff;
    font-size: 12px;
    &.bgblue {
      justify-content: inherit;
      width: 110px;
      background: rgba(0, 0, 0, 0.36);
      overflow: hidden;
      .txt {
        width: 48px;
        height: 100%;
        text-align: center;
        margin-right: 5px;
        background: linear-gradient(270deg, #2fa1f5 0%, #0076ff 100%);
      }
    }
    &.bggary {
      width: 54px;
    }
  }
}

.pageOn {
  border-radius: 8px !important;
}
.live-wrapper-a {
  .live-item-a {
    display: flex;
    position: relative;
    background: #fff;
    overflow: hidden;
    .img-box {
      position: relative;
      width: 170px;
      height: 136px;
      overflow: hidden;
    }

    .info {
      flex: 1;
      padding: 8px 5px;
      border-radius: 0px 8px 8px 0;
      overflow: hidden;
      .title {
        color: #333333;
        font-size: 14px;
      }

      .people {
        display: flex;
        align-items: center;
        font-size: 12px;
        margin-top: 15px;
        color: #666666;
        img {
          width: 32px;
          height: 32px;
          margin-right: 5px;
          border-radius: 50%;
        }
      }
      .goods-wrapper {
        margin-top: 10px;
        display: flex;
        .goods-item {
          position: relative;
          width: 48px;
          height: 48px;
          margin-right: 8px;
          &:nth-child(3n) {
            margin-right: 0;
          }

          img {
            width: 100%;
            height: 100%;
          }

          span {
            position: absolute;
            left: 0;
            bottom: 0;
            color: #fff;
            font-size: 12px;
          }
        }
      }
    }
  }
  &.live-wrapper-c {
    display: flex;
    overflow: hidden;
    .live-item-a {
      width: 140px;
      height: 112px;
      flex-shrink: 0;
      .img-box {
        width: 100%;
        height: 112px;
      }
      .info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .left {
          width: 60%;
        }
      }
    }
  }
}
.live-wrapper-b {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .live-item-b {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .img-box {
      position: relative;
      height: 137px;
    }

    .info {
      width: 100%;
      padding: 10px;
      background-color: #fff;
      .people {
        display: flex;
        align-items: center;
        margin-top: 8px;
        color: #666666;
        img {
          width: 32px;
          height: 32px;
          margin-right: 5px;
          border-radius: 50%;
        }
      }
    }
  }
}

.iconfont-diy {
  font-size: 12px;
}

.icon-tu {
  font-size: 24px;
}

.bggary {
  background: linear-gradient(270deg, #999999 0%, #666666 100%);
}

.bgred {
  background: linear-gradient(270deg, #f5742f 0%, #ff1717 100%);
}

.empty-goods {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 48px;
  color: #fff;
  background: #b2b2b2;
  font-size: 12px;
}

.title-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 10px 0;
  font-size: 16px;
  .icon {
    width: 66px;
    height: 16px;
  }
  span {
    font-size: 12px;
    .iconfont {
      font-size: 8px;
    }
  }
}
</style>
