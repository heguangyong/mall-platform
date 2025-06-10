<template>
  <div class="divBox">
    <el-card class="box-card" :bordered="false" shadow="never">
      <div slot="header" style="font-size: 16px">
        <div class="page_title">小程序下载</div>
      </div>
      <div>
        <div class="flex">
          <div class="ml-100 flex-1">
            <div class="header_title">小程序设置</div>
            <div class="content-box">
              <div class="left">小程序名称：</div>
              <div class="right">一码秦川</div>
            </div>
            <div class="content-box" v-hasPermi="['platform:wechat:code:download']">
              <div class="left">小程序包：</div>
              <el-button type="primary" @click="downCode()">下载小程序</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
// +---------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +---------------------------------------------------------------------
// | Copyright (c) 2016~2024 https://www.crmeb.com All rights reserved.
// +---------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +---------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +---------------------------------------------------------------------
import { wechatCodeDownload } from '@/api/wxApi';
export default {
  data() {
    return {};
  },
  methods: {
    downCode() {
      wechatCodeDownload().then((res) => {
        window.open(res);
      });
    },
  },
};
</script>
<style lang="scss">
.flex {
  display: flex;
}
.ml-100 {
  margin-left: 100px;
}
.flex-1 {
  flex: 1;
}
.page_title {
  font-size: 18px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #000000;
  padding-left: 10px;
}
.iframe-box {
  width: 312px;
  height: 600px;
  border-radius: 5px;
}
.relative {
  position: relative;
}
.mask {
  position: absolute;
  left: 0;
  top: 0;
  width: 312px;
  height: 600px;
  background-color: rgba(0, 0, 0, 0);
}
.content {
  padding: 0 20px;
}

.content > .title {
  padding-bottom: 26px;
}

.content-box {
  display: flex;
  align-items: center;
  margin: 20px 20px 0 20px;
  color: #333;
}

.content-box.last {
  margin-top: 0;
  color: #999999;
}
.content-box .title {
  font-size: 16px;
  font-weight: bold;
}

.content-box > span {
  color: #f5222d;
  font-size: 20px;
}

.content-box .left {
  font-size: 14px;
  text-align: right;
  width: 100px;
}

.content-box .right {
  width: 400px;
}

.rad {
  margin-left: 20px;
}
</style>
