<template>
  <div class="divBox">
    <el-card class="box-card" :body-style="{ padding: '40px 50px' }" shadow="never" :bordered="false">
      <div class="flex">
        <div class="iframe" :bordered="false">
          <div class="nofonts" v-if="!splashFrom.adList.length">暂无照片，请添加~</div>
          <swiper :options="swiperOption" class="swiperimg on">
            <swiper-slide class="swiperimg on" v-for="(item, index) in splashFrom.adList" :key="index + 'a'">
              <img :src="item.imageUrl" mode="aspectFill" />
            </swiper-slide>
          </swiper>
        </div>
        <div class="content">
          <div class="ml20">
            <div class="right-box">
              <div class="title-bar-line">开屏广告设置</div>
              <div class="from-tips">建议尺寸：750 * 1334px，拖拽图片可调整图片顺序哦，最多添加五张</div>
              <div class="list-box mt20">
                <el-form :model="splashFrom">
                  <el-form-item label="开屏广告:">
                    <el-switch
                      v-model="splashFrom.splashAdSwitch"
                      :active-value="1"
                      :inactive-value="0"
                      :width="55"
                      active-text="开启"
                      inactive-text="关闭"
                    />
                  </el-form-item>
                  <el-form-item label="广告时间:">
                    <el-input-number
                      v-model.number="splashFrom.splashAdShowTime"
                      type="number"
                      size="small"
                      :min="1"
                      placeholder="请输入开屏广告时间"
                      style="width: 150px"
                    ></el-input-number
                    >（单位：秒）
                    <div class="from-tips">广告N秒之后进行自动关闭（按照广告时间进行倒计时展示）。</div>
                  </el-form-item>
                  <el-form-item label="展示间隔:">
                    <el-input-number
                      v-model.number="splashFrom.splashAdShowInterval"
                      type="number"
                      size="small"
                      :min="0"
                      placeholder="请输入广告间隔时间"
                      style="width: 150px"
                    ></el-input-number
                    >（单位：小时）
                    <div class="from-tips">
                      在设置的时间内，重复打开商城，只展示一次开屏广告。设置0代表每次进入商城均会出现开屏广告。
                    </div>
                  </el-form-item>
                </el-form>
                <FromList :configObj="advertisementConfig"></FromList>
              </div>
              <div class="save">
                <el-button
                  size="small"
                  type="primary"
                  v-hasPermi="['platform:page:layout:splash:ad:save']"
                  v-debounceClick="handleAdvertisementSave"
                  >{{ loadingBtn ? '提交中 ...' : '保存' }}</el-button
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
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
import FromList from '@/components/FromList';
import { splashGetApi, splashSaveApi } from '@/api/devise';
import { checkPermi } from '@/utils/permission';
import { advertisementDefault } from '@/views/pagediy/advertisement/default';
export default {
  name: 'index',
  components: { FromList },
  data() {
    return {
      swiperOption: {
        //显示分页
        pagination: {
          el: '.swiper-pagination',
        },
        //设置点击箭头
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        //自动轮播
        autoplay: {
          delay: 2000,
          //当用户滑动图片后继续自动轮播
          disableOnInteraction: false,
        },
        //开启循环模式
        loop: false,
      },
      advertisementConfig: Object.assign({}, advertisementDefault()), //选择链接数据
      activeIndex: 0,
      splashFrom: {
        adList: [],
        splashAdShowInterval: 0,
        splashAdShowTime: 0,
        splashAdSwitch: 0,
      },
      loadingBtn: false,
    };
  },
  mounted() {
    if (checkPermi(['platform:page:layout:splash:ad:get'])) this.getAdvertisement();
  },
  methods: {
    // 开屏广告新增
    handleAdvertisementSave() {
      this.advertisementConfig.list.map((item, index) => {
        item.sort = index + 1;
      });
      let data = {
        ...this.splashFrom,
        adList: this.advertisementConfig.list,
      };
      this.loadingBtn = true;
      splashSaveApi(data)
        .then((res) => {
          this.$message.success('保存成功');
          this.loadingBtn = false;
          this.getAdvertisement();
        })
        .catch(() => {
          this.loadingBtn = false;
        });
    },
    // 开屏广告数据
    getAdvertisement() {
      splashGetApi().then((res) => {
        this.splashFrom = res;
        this.advertisementConfig.list = res.adList;
      });
    },
  },
};
</script>

<style scoped lang="scss">
.iframe {
  margin-left: 20px;
  position: relative;
  width: 350px;
  height: 75vh;
  max-height: 650px;
  background: #ffffff;
  border: 1px solid #eeeeee;
  opacity: 1;
  border-radius: 10px;
}
.swiperimg {
  width: 335px;
  height: 145px;
  border-radius: 8px;

  &.on {
    height: 75vh;
    max-height: 650px;
    width: 350px;
    line-height: 145px;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.nofonts {
  text-align: center;
  line-height: 125px;
}
.content {
  max-height: calc(100vh - 200px);
  overflow-y: scroll;
  .right-box {
    margin-left: 40px;
  }
}
.content::-webkit-scrollbar {
  width: 0;
  height: 0;
  background-color: transparent;
}
</style>
