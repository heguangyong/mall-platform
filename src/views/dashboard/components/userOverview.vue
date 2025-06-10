<template>
  <div class="divBox" style="padding-top: 0">
    <el-row :gutter="14">
      <el-col :xs="24" :sm="24" :md="24" :lg="12" v-if="checkPermi(['platform:statistics:home:operating:data'])">
        <el-card class="box-card" shadow="never" :bordered="false">
          <div class="header_title">经营数据</div>
          <div class="nav_grid m-t-20">
            <div
              class="nav_grid_item"
              v-for="(item, index) in businessList"
              :key="index"
              @click="navigatorTo(item.path)"
            >
              <div class="pic_badge" :style="{ background: item.bgColor }">
                <span class="iconfont" :class="item.icon" :style="{ color: item.color }"></span>
              </div>
              <div>
                <p class="label">{{ item.title || 0 }}</p>
                <p class="num_data">{{ item.num || 0 }}</p>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="12" v-if="checkPermi(['platform:statistics:home:user:channel'])">
        <el-card class="box-card" shadow="never" :bordered="false">
          <div class="header_title">用户渠道比例</div>
          <echarts-new
            :option-data="optionData"
            :styles="style"
            height="100%"
            width="100%"
            v-if="optionData"
          ></echarts-new>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import echartsNew from '@/components/echartsNew/index';
import { businessData, userChannelData } from '@/api/dashboard';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
export default {
  data() {
    return {
      optionData: {},
      style: { height: '320px' },
      timeVal: [],
      dateLimit: '',
      list: [],
      fromList: this.$constants.timeList,
      userView: {},
      pickerOptions: this.$timeOptions, //快捷时间选项
      statisticData: [
        {
          icon: 'icon-zaishoushangpin',
          title: '在售',
          num: 0,
          path: '/product/list',
          color: '#1890FF',
          bgColor: 'rgba(24, 144, 255, 0.08)',
        },
        {
          icon: 'icon-daishenheshangpin',
          title: '待审核',
          num: 0,
          path: '/product/list',
          color: '#A277FF',
          bgColor: 'rgba(162, 119, 255, 0.08)',
        },
        {
          icon: 'icon-daifahuo2',
          title: '待发货',
          num: 0,
          path: '/order/list',
          color: '#1890FF',
          bgColor: 'rgba(24, 144, 255, 0.08',
        },
        {
          icon: 'icon-daihexiao',
          title: '待核销',
          num: 0,
          path: '/order/list',
          color: '#1BBE6B',
          bgColor: 'rgba(27, 190, 107, 0.08)',
        },
        {
          icon: 'icon-daituikuan',
          title: '待退款',
          num: 0,
          path: '/order/refund',
          color: '#EF9C20',
          bgColor: 'rgba(239, 156, 32, 0.08)',
        },
      ],
    };
  },
  components: {
    echartsNew,
  },
  computed: {
    //鉴权处理
    permList: function () {
      let arr = [];
      this.nav_list.forEach((item) => {
        arr.push(item);
      });
      return arr;
    },
    businessList: function () {
      let arr = [];
      this.statisticData.forEach((item) => {
        arr.push(item);
      });
      return arr;
    },
  },
  created() {
    const end = new Date();
    const start = new Date();
    start.setTime(start.setTime(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 29)));
    this.timeVal = [start, end];
  },
  mounted() {
    this.dateLimit = 'lately7';
    this.dateLimitPram = 'lately7';
    if (checkPermi(['platform:statistics:home:user:channel'])) this.getChannel();
    if (checkPermi(['platform:statistics:home:operating:data'])) this.getbusinessData();
  },
  methods: {
    checkPermi,
    navigatorTo(path) {
      this.$router.push(path);
    },
    getbusinessData() {
      businessData().then((res) => {
        this.statisticData[0].num = res.onSaleProductNum; //在售商品数量
        this.statisticData[1].num = res.awaitAuditProductNum; //待审核商品数量
        this.statisticData[2].num = res.notShippingOrderNum; //待发货订单数量
        this.statisticData[3].num = res.awaitVerificationOrderNum; //待核销订单数量
        this.statisticData[4].num = res.refundingOrderNum; //待退款订单数量
      });
    },
    onchangeTime(e) {
      this.timeVal = e;
      this.dateLimit = e ? this.timeVal.join(',') : '';
      this.dateLimitPram = e ? this.timeVal.join(',') : '';
    },
    //用户渠道
    getChannel() {
      userChannelData().then((res) => {
        let channelData = res.data;
        channelData = [
          { name: 'H5', value: 0, channel: 'h5' },
          { name: '小程序', value: 0, channel: 'routine' },
          { name: '公众号', value: 0, channel: 'wechat' },
          { name: 'ios', value: 0, channel: 'ios' },
          { name: '微信ios', value: 0, channel: 'iosWx' },
          { name: '微信安卓', value: 0, channel: 'androidWx' },
        ];
        let channelArr = [];
        channelData.forEach((item) => {
          res.forEach((item1) => {
            //通过两层遍历返回api数据的长度，并且得到指定key的渠道name
            if (item.channel == item1.registerType) {
              channelArr.push({
                name: item.name,
                value: item1.num ? item1.num : 0,
              });
            }
          });
        });
        this.optionData = {
          grid: {
            left: '20%',
            right: '20%',
            top: '20%',
            bottom: '20%',
          },
          //环形图鼠标放上去显示
          tooltip: {
            trigger: 'item',
            enterable: true,
            formatter: (option) => {
              return `${option.seriesName} <br/> ${option.name}: ${option.value}人
            ${option.percent}%`;
            },
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            left: 'left',
            top: 'center',
            right: '10%', // 距离右侧位置
            itemGap: 18,
            itemHeight: 16, // 图标大小设置
            icon: 'circle',
            data: '',

            //y: 'center',
            pageIconSize: 14,
            textStyle: {
              fontSize: 14,
              color: '#333',
              lineHeight: 20, // 解决提示语字显示不全
              rich: {
                a: {
                  padding: [0, 10, 0, 10],
                  color: '#FF0000',
                },
                b: {
                  color: '#666',
                },
              },
            },
            formatter: (name) => {
              let num = 0; //人
              let percent = 0; //环比
              let total = 0; //总数量

              for (let i = 0; i < channelArr.length; i++) {
                total += channelArr[i].value;
                if (channelArr[i].name === name) {
                  num = channelArr[i].value; //人
                }
              }
              percent = this.$selfUtil.Division(num, total); //除法算出环比
              let arr = [
                name + '{a|' + num + '人' + '}' + '{b|' + percent ? (percent * 100).toFixed(2) : 0 + '%' + '}',
              ];
              return arr.join('\n');
            },
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: ['30%', '50%'],
              center: ['75%', '50%'], //饼图的位置,第一个参数：是指左右，第二个参数：是指上下位置；
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
                normal: {
                  color: function (params) {
                    //自定义颜色
                    var colorList = ['#1BBE6B', '#1890FF', '#EF9C20', '#F56C6C', '#A277FF'];
                    return colorList[params.dataIndex];
                  },
                },
              },
              labelLine: {
                show: true,
              },
              data: channelArr,
            },
          ],
        };
      });
    },
  },
};
</script>

<style scoped lang="scss">
.flex {
  display: flex;
}
.flex-wrap {
  flex-wrap: wrap;
}
.mb30 {
  margin-bottom: 30px;
}
.mr-20 {
  margin-right: 20px;
}
.justify-between {
  justify-content: space-between;
}
.up,
.el-icon-caret-top {
  color: #f5222d;
  font-size: 12px;
  opacity: 1 !important;
}

.down,
.el-icon-caret-bottom {
  color: #39c15b;
  font-size: 12px;
}
.curP {
  cursor: pointer;
}
.header {
  &-title {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.85);
  }
  &-time {
    font-size: 12px;
    color: #000000;
    opacity: 0.45;
  }
}

.iconfont {
  font-size: 16px;
  color: #fff;
}

.iconCrl {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  text-align: center;
  line-height: 32px;
  opacity: 0.7;
}

.lan {
  background: var(--prev-color-primary);
}

.iconshangpinliulanliang {
  color: #fff;
}

.infoBox {
  width: 20%;
  height: 87px;
  @media screen and (max-width: 1300px) {
    width: 25%;
  }
  @media screen and (max-width: 1200px) {
    width: 33%;
  }
  @media screen and (max-width: 900px) {
    width: 50%;
  }
}
.data_num {
  height: 100px;
}
.info {
  .sp1 {
    color: #666;
    font-size: 14px;
    display: block;
  }
  .sp2 {
    font-weight: 400;
    font-size: 30px;
    color: rgba(0, 0, 0, 0.85);
    display: block;
    padding: 10px 0 10px;
  }
  .sp3 {
    font-size: 12px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.45);
    display: block;
  }
}
.user_chart {
  min-width: 900px;
}
.user-visitUser {
  width: 75%;
  height: 100px;
  background: #f2f6ff;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  @media screen and (max-width: 1200px) {
    width: 55%;
  }
  @media screen and (max-width: 900px) {
    width: 35%;
  }
}
.user-visitUser-ti {
  width: 310px;
  height: 100px;
  background: var(--prev-color-primary);
  transform: perspective(5em) rotateX(-11deg);
  margin-left: -104px;
  margin-top: 8px;
  text-align: center;
  color: #fff;
  font-size: 14px;
}
.column_center {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 17px;
}
.orderUser {
  position: relative;
  top: -6px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  white-space: normal;
}
.payOrderUser {
  position: relative;
  top: -16px;
}
.user-orderUser {
  width: 75%;
  height: 98px;
  background: #f1fffa;
  box-sizing: border-box;
  @media screen and (max-width: 1200px) {
    width: 55%;
  }
  @media screen and (max-width: 900px) {
    width: 35%;
  }
}
.user-orderUser-ti {
  width: 226px;
  height: 98px;
  background: #4bcad5;
  transform: perspective(7em) rotateX(-20deg);
  margin-left: -62px;
  margin-top: 7px;
  text-align: center;
  color: #fff;
  font-size: 14px;
}
.user-orderUser-change,
.user-orderUser-changeduan {
  height: 100px;
  border-bottom: 1px solid #d8d8d8;
  border-top: 1px solid #d8d8d8;
  margin-left: -19px;
}
.user-orderUser-change {
  width: 128px;
}
.user-payOrderUser {
  width: 75%;
  height: 95px;
  background: #f3f4f8;
  box-sizing: border-box;
  margin-top: 3px;
  @media screen and (max-width: 1200px) {
    width: 55%;
  }
  @media screen and (max-width: 900px) {
    width: 35%;
  }
}
.user-payOrderUser-ti {
  width: 145px;
  height: 92px;
  background: #5e7092;
  transform: perspective(3em) rotateX(-13deg);
  margin-left: -22px;
  margin-top: 15px;
  text-align: center;
  color: #fff;
  font-size: 14px;
}
.num_data {
  font-size: 24px;
  color: #fff;
  font-weight: 600;
  line-height: 33px;
}
.sp1 {
  margin-left: 10px;
  overflow: auto;
}
.sp2 {
  margin-top: 77px;
  margin-left: 10px;
  overflow: auto;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.inone {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 61px;
}
.m20 {
  margin: 20px;
}
.user_reg_tit {
  font-size: 16px;
  color: #333;
  font-weight: bold;
}
.reg_time {
  font-size: 14px;
  padding: 10px 0 10px;
  color: #333;
}

.mb30 {
  margin-bottom: 30px;
}
.card_show {
  @media screen and (max-width: 700px) {
    display: none;
  }
}
.nav_grid {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 10px;
}
.nav_grid_item {
  width: 33.33%;
  margin-top: 30px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  padding-left: 50px;
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
    margin-right: 16px;
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
    color: #606266;
    text-align: center;
  }
}
.m-t-20 {
  margin-top: 20px;
}
.box-card {
  height: 320px;
}
</style>
