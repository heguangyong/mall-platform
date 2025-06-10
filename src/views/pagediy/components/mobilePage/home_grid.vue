<template>

  <div class="mobile-page" :style="boxStyle" v-if="configObj">
    <div class="menu-grid">
      <div v-for="(item, index) in menuItems" :key="index" class="menu-item" @click="handleClick(item)">
        <img :src="item.icon" class="icon" alt="icon" />
        <p>{{ item.title }}</p>
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
  import {
    mapState,
    mapGetters
  } from 'vuex';
  export default {
    name: 'home_grid', // 组件名称
    cname: '推荐位', // 标题名称
    icon: 't-icon-zujian-lunbotu',
    defaultName: 'gridTj', // 外面匹配名称
    configName: 'c_home_grid', // 右侧配置名称
    type: -1, // 自定义
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
        return [{
            'border-radius': this.configObj.bgStyle.val ? this.configObj.bgStyle.val + 'px' : '0'
          },
          {
            background: `linear-gradient(${this.configObj.bgColor.color[0].item}, ${this.configObj.bgColor.color[1].item})`,
          },
          {
            margin: this.configObj.mbConfig.val + 'px' + ' ' + this.configObj.lrConfig.val + 'px' + ' ' + 0
          },
          {
            padding: this.configObj.upConfig.val + 'px' + ' ' + 0 + ' ' + this.configObj.downConfig.val + 'px'
          },
        ];
      },
      //内容圆角
      contentStyleLeft() {
        return [{
          'border-radius': 0 + 'px ' + this.configObj.contentStyle.val + 'px ' + this.configObj.contentStyle.val +
            'px ' + 0 + 'px',
        }, ];
      },
      contentStyleMiddle() {
        return [{
          'border-radius': this.configObj.contentStyle.val + 'px ',
        }, ];
      },
      contentStyleRight() {
        return [{
          'border-radius': this.configObj.contentStyle.val + 'px ' + 0 + 'px ' + 0 + 'px ' + this.configObj
            .contentStyle.val + 'px',
        }, ];
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
      themeStyle: {
        handler(nVal, oVal) {
          this.configObj.docColor.isShow = this.configObj.themeStyleConfig.tabVal;
        },
        deep: true,
      },
    },
    data() {
      return {
        // 默认初始化数据禁止修改
        defaultConfig: {
          name: 'home_grid',
          isShow: true,
          timestamp: this.num,
          setUp: {
            tabVal: 3,
            cname: '推荐位',
          },
          menuItems: [{
              title: '景区介绍',
              icon: require('@/assets/imgs/fukuan.png')
            },
            {
              title: '景区门票',
              icon: require('@/assets/imgs/fukuan.png')
            },
            {
              title: '餐饮美食',
              icon: require('@/assets/imgs/fukuan.png')
            },
            {
              title: '周边活动',
              icon: require('@/assets/imgs/fukuan.png')
            },
            {
              title: '周边停车',
              icon: require('@/assets/imgs/fukuan.png')
            },
            {
              title: '人文江都',
              icon: require('@/assets/imgs/fukuan.png')
            },
            {
              title: '秒杀活动',
              icon: require('@/assets/imgs/fukuan.png')
            },
            {
              title: '领券中心',
              icon: require('@/assets/imgs/fukuan.png')
            },
          ],
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
            ],
          },
          //色调
          themeStyleConfig: {
            title: '色调',
            tabVal: 0,
            isShow: 1,
            list: [{
                val: '跟随主题风格',
              },
              {
                val: '自定义',
              },
            ],
          },


        },
        configObj: null,
        pageData: {},

      };
    },
    mounted() {
      this.$nextTick(() => {
        console.log(this.num)
        if (this.num) {

          this.pageData = this.$store.state.mobildConfig.defaultArray[this.num];

          this.setConfig(this.pageData);
        }
      });
    },
    methods: {
      onChange() {},
      setConfig(data) {
        if (!data) return;
        if (data) {

          this.configObj = data;
          this.menuItems = data.menuItems;

        }
      },

    },
  };
</script>
<style scoped lang="scss">
  .mobile-page {
    position: relative;
    width: auto;

    .menu-grid {
      // height:100px;
      background: #ff0000;
      // display:flex;
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 10px;
      padding: 10px;
      text-align: center;
      box-sizing: border-box;
    }

    .menu-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      // width: 60px;
      // height: 60px;
    }

    .icon {
      width: 40px;
      height: 40px;
      margin-bottom: 8px;
    }

  }
</style>
