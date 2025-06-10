<template>
  <div class="divBox">
    <el-row :gutter="14">
      <el-col v-for="(item, index) in permList" :key="index" class="ivu-mb pointer">
        <div>
          <el-card :bordered="false" dis-hover :padding="12" shadow="never">
            <div class="nav_item" @click="navigatorTo(item.url)">
              <div class="pic_badge">
                <span class="iconfont" :class="item.icon" :style="{ color: item.bgColor }"></span>
              </div>
              <p class="text-14">{{ item.title }}</p>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
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
import echartsNew from '@/components/echartsNew/index';
import { businessData } from '@/api/dashboard';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
export default {
  components: {
    echartsNew,
  },
  data() {
    return {
      grid: { xl: 4, lg: 8, md: 12, sm: 6, xs: 24 },
      nav_list: [
        {
          bgColor: '#EF9C20',
          icon: 'icon-yonghuguanli',
          title: '用户管理',
          url: '/user/index',
        },
        {
          bgColor: '#1890FF',
          icon: 'icon-shangpinguanli',
          title: '商品管理',
          url: '/product/list',
        },
        {
          bgColor: '#4BCAD5',
          icon: 'icon-shanghuguanli',
          title: '商户管理',
          url: '/merchant/list',
        },
        {
          bgColor: '#A277FF',
          icon: 'icon-a-dingdanguanli1',
          title: '订单管理',
          url: '/order/list',
        },
        {
          bgColor: '#1BBE6B',
          icon: 'icon-xitongshezhi',
          title: '系统设置',
          url: '/operation/setting',
        },
        {
          bgColor: '#1890FF',
          icon: 'icon-fenxiaoshezhi',
          title: '分销设置',
          url: '/distribution/distributionconfig',
        },
        {
          bgColor: '#A277FF',
          icon: 'icon-caiwuguanli',
          title: '财务管理',
          url: '/finance/statement',
        },

        {
          bgColor: '#EF9C20',
          icon: 'icon-yihaotong',
          title: '一号通',
          url: '/operation/onePass/home',
        },
        {
          bgColor: '#4BCAD5',
          icon: 'icon-qiandaopeizhi',
          title: '签到配置',
          url: '/marketing/sign/config',
        },
      ],
      statisticData: [
        { title: '待审核商品数量', num: 0, path: '/product/list' },
        { title: '待核销订单数量', num: 0, path: '/order/list' },
        { title: '待发货订单数量', num: 0, path: '/order/list' },
        { title: '在售商品数量', num: 0, path: '/product/list' },
        { title: '待退款订单数量', num: 0, path: '/order/refund' },
      ],
      optionData: {},
      applyNum: 0,
      style: { height: '250px' },
    };
  },
  computed: {
    //鉴权处理
    permList: function () {
      let arr = [];
      this.nav_list.forEach((item) => {
        //if (this.checkPermi(item.perms)) {
        arr.push(item);
        //}
      });
      return arr;
    },
  },
  mounted() {
    // this.getbusinessData();
  },
  methods: {
    checkPermi,
    navigatorTo(path) {
      this.$router.push(path);
    },
  },
};
</script>
<style lang="scss" scoped>
.ivu-mb {
  @media screen and (min-width: 1400px) {
    width: 11.11%;
  }

  @media screen and (max-width: 1400px) {
    width: 33.3333333%;
    margin-bottom: 14px;
  }

  @media screen and (max-width: 750px) {
    width: 100%;
    margin-bottom: 14px;
  }
}

.dashboard-console-grid {
  text-align: center;

  .ivu-card-body {
    padding: 0;
  }

  i {
    font-size: 32px;
  }

  a {
    display: block;
    color: inherit;
  }

  p {
    margin-top: 8px;
  }
}

.nav_grid {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 10px;
}

.nav_grid_item {
  width: 11.11%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  img {
    width: 58px;
    height: 58px;
  }

  .pic_badge {
    width: 58px;
    height: 58px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    border-radius: 4px;

    // margin-bottom: 10px;
    .iconfont {
      font-size: 30px;
    }
  }

  p {
    height: 17px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #000000;
    line-height: 17px;
    margin-top: 12px;
  }

  .num_data {
    font-size: 28px;
    font-weight: 600;
    color: #333;
    text-align: center;
    margin-bottom: 18px;
  }

  .label {
    font-size: 14px;
    color: #666666;
    text-align: center;
  }
}

.el-ccard {
  width: 100% !important;
}

::v-deep .el-row {
  padding: 0 !important;
}

.pic_badge {
  // width: 58px;
  // height: 58px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  border-radius: 4px;
  margin-bottom: 13px;

  .iconfont {
    font-size: 30px;
  }
}

.nav_item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.text-14 {
  font-size: 14px;
  color: #333;
}
</style>
