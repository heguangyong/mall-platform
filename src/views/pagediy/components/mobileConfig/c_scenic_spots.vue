<template>
  <div class="mobile-config pro">
    <div v-for="(item, key) in rCom" :key="key">
      <component
        :is="item.components.name"
        :configObj="configObj"
        ref="childData"
        :configNme="item.configNme"
        :key="key"
        @getConfig="getConfig"
        :index="activeIndex"
        :number="num"
        :num="item.num"
      ></component>
    </div>
    <rightBtn :activeIndex="activeIndex" :configObj="configObj"></rightBtn>
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
import { productActivityListApi } from '@/api/product';
import { mapGetters } from 'vuex';
import toolCom from '../mobileConfigRight/index.js';
import rightBtn from '../rightBtn/index.vue';
export default {
  name: 'c_scenic_spots',
  componentsName: 'scenic_spots',
  cname: '周边景区',
  props: {
    activeIndex: {
      type: null,
    },
    num: {
      type: null,
    },
    index: {
      type: null,
    },
  },
  components: {
    ...toolCom,
    rightBtn,
  },
  computed: {
    ...mapGetters(['merPlatProductClassify', 'productBrand']),
    //商品排序
    goodsSort() {
      return this.configObj.goodsSort.tabVal;
    },
    //选择方式
    tabConfig() {
      return this.configObj.tabConfig.tabVal;
    },
  },
  data() {
    return {
      configObj: {},
      rCom: [
        {
          components: toolCom.c_checked_tab,
          configNme: 'setUp',
        },
      ],
      rComContent: [
        {
          components: toolCom.c_title,
          configNme: 'titleConfig',
        },
        {
          components: toolCom.c_input_item,
          configNme: 'titleConfig',
        },
        {
          components: toolCom.c_input_item,
          configNme: 'titleConfig2',
        },
        {
          components: toolCom.c_input_item,
          configNme: 'titleFuConfig',
        },
        {
          components: toolCom.c_radio,
          configNme: 'selectShow',
        },
        {
          components: toolCom.c_input_item,
          configNme: 'titleRightConfig',
        },
        {
          components: toolCom.c_input_item,
          configNme: 'linkConfig',
        },
        {
          components: toolCom.c_title,
          configNme: 'typeConfig',
        },
        {
          components: toolCom.c_checkbox_group,
          configNme: 'typeConfig',
        },
        {
          components: toolCom.c_title,
          configNme: 'tabConfig',
        },
        {
          components: toolCom.c_tab_radio,
          configNme: 'tabConfig',
        },
        {
          components: toolCom.c_goods,
          configNme: 'goodsList',
        },
        {
          components: toolCom.c_select,
          configNme: 'activeValueBrand',
        },
        {
          components: toolCom.c_cascader,
          configNme: 'selectConfig',
        },
        {
          components: toolCom.c_merchantName,
          configNme: 'activeValueMer',
        },
        {
          components: toolCom.c_input_number,
          configNme: 'numConfig',
        },
        {
          components: toolCom.c_txt_tab,
          configNme: 'goodsSort',
        },
      ],
      rComStyle: [
        {
          components: toolCom.c_title,
          configNme: 'fontColor',
        },
        {
          components: toolCom.c_bg_color,
          configNme: 'fontColor',
        },
        {
          components: toolCom.c_bg_color,
          configNme: 'fontColor2',
        },
        {
          components: toolCom.c_slider,
          configNme: 'fontSize',
        },
        {
          components: toolCom.c_txt_tab,
          configNme: 'textStyle',
        },
        {
          components: toolCom.c_bg_color,
          configNme: 'fontFuColor',
        },
        {
          components: toolCom.c_slider,
          configNme: 'fontFuSize',
        },
        {
          components: toolCom.c_bg_color,
          configNme: 'fontRightColor',
        },
        {
          components: toolCom.c_slider,
          configNme: 'fontRightSize',
        },
        {
          components: toolCom.c_title,
          configNme: 'bgColor',
        },
        {
          components: toolCom.c_bg_color,
          configNme: 'bgColor',
        },
        {
          components: toolCom.c_bg_color,
          configNme: 'titleColor',
        },
        {
          components: toolCom.c_title,
          configNme: 'upConfig',
        },
        {
          components: toolCom.c_slider,
          configNme: 'upConfig',
        },
        {
          components: toolCom.c_slider,
          configNme: 'downConfig',
        },
        {
          components: toolCom.c_slider,
          configNme: 'lrConfig',
        },
        {
          components: toolCom.c_slider,
          configNme: 'contentConfig',
        },
        {
          components: toolCom.c_slider,
          configNme: 'mbConfig',
        },
        {
          components: toolCom.c_title,
          configNme: 'bgStyle',
        },
        {
          components: toolCom.c_slider,
          configNme: 'bgStyle',
        },
        {
          components: toolCom.c_slider,
          configNme: 'contentStyle',
        },
      ],
      setUp: 0,
      type: 0,
      lockStatus: false,
    };
  },
  watch: {
    num(nVal) {
      let value = JSON.parse(JSON.stringify(this.$store.state.mobildConfig.defaultArray[nVal]));
      this.configObj = value;
    },
    configObj: {
      handler(nVal, oVal) {
        this.$store.commit('mobildConfig/UPDATEARR', { num: this.num, val: nVal });
      },
      deep: true,
    },
    'configObj.setUp.tabVal': {
      handler(nVal, oVal) {
        this.setUp = nVal;
        var arr = [this.rCom[0]];
        if (nVal == 0) {
          this.rCom = arr.concat(this.rComContent);
        } else {
          this.rCom = arr.concat(this.rComStyle);
        }
      },
      deep: true,
    },
    //选择方式选择，0指定商品，1指定分类，2指定品牌，3指定商户
    'configObj.tabConfig.tabVal': {
      handler(nVal, oVal) {
        this.type = nVal;
        switch (this.type) {
          case 0:
            this.$set(this.configObj.selectConfig, 'list', this.merPlatProductClassify);
            this.$set(this.configObj.numConfig, 'isShow', 0); //是否显示inputnumber框
            this.$set(this.configObj.goodsList, 'isShow', 1); //选择商品
            this.$set(this.configObj.activeValueBrand, 'isShow', 0); //选择品牌
            this.$set(this.configObj.selectConfig, 'isShow', 0); //选择分类
            this.$set(this.configObj.activeValueMer, 'isShow', 0); //选择商户
            this.$set(this.configObj.goodsSort, 'isShow', 0); //商品排序
            break;
          case 1:
            this.$set(this.configObj.selectConfig, 'list', this.merPlatProductClassify);
            this.$set(this.configObj.numConfig, 'isShow', 1);
            this.$set(this.configObj.goodsList, 'isShow', 0); //选择商品
            this.$set(this.configObj.activeValueBrand, 'isShow', 0); //选择品牌
            this.$set(this.configObj.selectConfig, 'isShow', 1); //选择分类
            this.$set(this.configObj.activeValueMer, 'isShow', 0); //选择商户
            this.$set(this.configObj.goodsSort, 'isShow', 1); //商品排序
            break;
          case 2:
            this.$set(this.configObj.activeValueBrand, 'list', this.productBrand);
            this.$set(this.configObj.numConfig, 'isShow', 1);
            this.$set(this.configObj.goodsList, 'isShow', 0); //选择商品
            this.$set(this.configObj.activeValueBrand, 'isShow', 1); //选择品牌
            this.$set(this.configObj.selectConfig, 'isShow', 0); //选择分类
            this.$set(this.configObj.activeValueMer, 'isShow', 0); //选择商户
            this.$set(this.configObj.goodsSort, 'isShow', 1); //商品排序
            break;
          case 3:
            this.$set(this.configObj.numConfig, 'isShow', 1);
            this.$set(this.configObj.goodsList, 'isShow', 0); //选择商品
            this.$set(this.configObj.activeValueBrand, 'isShow', 0); //选择品牌
            this.$set(this.configObj.selectConfig, 'isShow', 0); //选择分类
            this.$set(this.configObj.activeValueMer, 'isShow', 1); //选择商户
            this.$set(this.configObj.goodsSort, 'isShow', 1); //商品排序
            break;
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      let value = JSON.parse(JSON.stringify(this.$store.state.mobildConfig.defaultArray[this.num]));
      this.configObj = value;
      if (!localStorage.getItem('merPlatProductClassify')) this.$store.dispatch('product/getAdminProductClassify');
      if (!localStorage.getItem('productBrand')) this.$store.dispatch('product/getMerProductBrand');
      this.$nextTick(() => {
        this.$set(this.configObj.selectConfig, 'list', this.merPlatProductClassify);
      });
    });
  },
  methods: {
    getConfig(data) {
      //选择tab获取商品列表.0指定商品
      if (data.name && data.name === 'goods') this.configObj.goodsList.list = data.values;
      //选择tab获取商品列表,1指定品牌，2指定分类，3指定商户
      this.getProList(data);
    },
    //选择tab获取商品列表
    getProList(data) {
      if (
        data.name &&
        (data.name === 'merchantName' ||
          data.name === 'select' ||
          data.name === 'cascader' ||
          data.name === 'radio' ||
          data.name === 'number')
      ) {
        let activeValue = '';
        let priceOrder = '';
        let salesOrder = '';
        switch (this.tabConfig) {
          case 0:
            break;
          case 1:
            activeValue = this.configObj.selectConfig.activeValue.join(',');
            break;
          case 2:
            activeValue = this.configObj.activeValueBrand.activeValue.join(',');
            break;
          case 3:
            activeValue = this.configObj.activeValueMer.activeValue.join(',');
            break;
        }
        if (this.goodsSort === 0) {
          priceOrder = '';
          salesOrder = '';
        } else if (this.goodsSort === 1) {
          priceOrder = '';
          salesOrder = 'desc';
        } else {
          priceOrder = 'desc';
          salesOrder = '';
        }
        productActivityListApi({
          categoryId: this.tabConfig === 1 ? activeValue : null,
          page: 1,
          limit: this.configObj.numConfig.val,
          type: '1',
          brandId: this.tabConfig === 2 ? activeValue : null,
          merIds: this.tabConfig === 3 ? activeValue : null,
          priceOrder: priceOrder,
          salesOrder: salesOrder,
        }).then((res) => {
          //选择tab获取商品列表,1指定分类，2指定品牌，3指定商户
          switch (this.configObj.tabConfig.tabVal) {
            case 1:
              this.configObj.selectConfig.goodsList = res.list;
              break;
            case 2:
              this.configObj.activeValueBrand.goodsList = res.list;
              break;
            case 3:
              this.configObj.activeValueMer.goodsList = res.list;
              break;
          }
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.pro {
  //padding: 15px 15px 0;
  .tips {
    height: 50px;
    line-height: 50px;
    color: #999;
    font-size: 12px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }

  .btn-box {
    padding-bottom: 20px;
  }
}
</style>
