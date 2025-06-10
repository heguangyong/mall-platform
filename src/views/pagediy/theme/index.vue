<template>
  <div class="divBox">
    <el-card class="box-card" shadow="never" :bordered="false">
      <div class="theme_box">
        <div class="theme_head">
          <div
            class="tab_color"
            v-for="(item, index) in tabList"
            :key="index"
            :class="active === index ? 'active' : ''"
            @click="selected(index)"
          >
            <div class="color_cont flex align-center">
              <div class="main_c mr-2" :class="item.class">
                <span class="iconfont iconios-checkmark-circle white" v-show="active == index"></span>
              </div>
              <div>{{ item.tit }}</div>
            </div>
          </div>
        </div>
        <div class="theme_content">
          <img :src="item" alt="" v-for="(item, index) in imgList" :key="index" />
        </div>
        <div class="save">
          <el-button type="primary" @click="saveTheme()" v-hasPermi="['platform:system:config:change:color:save']"
            >保存</el-button
          >
        </div>
      </div>
    </el-card>
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
import { getSystemColorApi, saveSystemColorApi } from '@/api/systemConfig';
import { Debounce } from '@/utils/validate';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
export default {
  data() {
    return {
      active: 0,
      tabList: [
        { tit: '热情红', class: 'bg1' },
        { tit: '家居橙', class: 'bg2' },
        { tit: '生鲜绿', class: 'bg3' },
        { tit: '海鲜蓝', class: 'bg4' },
        { tit: '女神粉', class: 'bg5' },
      ],
      themeData: [],
      imgList: [require('@/assets/theme/theme1.png')],
      theme1: [require('@/assets/theme/theme1.png')],
      theme2: [require('@/assets/theme/theme2.png')],
      theme3: [require('@/assets/theme/theme3.png')],
      theme4: [require('@/assets/theme/theme4.png')],
      theme5: [require('@/assets/theme/theme5.png')],
    };
  },
  mounted() {
    if (checkPermi(['platform:system:config:change:color:get'])) this.getSet();
  },
  methods: {
    checkPermi,
    selected(index) {
      this.active = index;
      if (index == 0) {
        this.$set(this, 'imgList', this.theme1);
      } else if (index == 1) {
        this.$set(this, 'imgList', this.theme2);
      } else if (index == 2) {
        this.$set(this, 'imgList', this.theme3);
      } else if (index == 3) {
        this.$set(this, 'imgList', this.theme4);
      } else if (index == 4) {
        this.$set(this, 'imgList', this.theme5);
      }
    },
    getSet() {
      getSystemColorApi().then((res) => {
        this.active = Number(res.value) - 1;
        if (res.value == 1) {
          this.$set(this, 'imgList', this.theme1);
        } else if (res.value == 2) {
          this.$set(this, 'imgList', this.theme2);
        } else if (res.value == 3) {
          this.$set(this, 'imgList', this.theme3);
        } else if (res.value == 4) {
          this.$set(this, 'imgList', this.theme4);
        } else if (res.value == 5) {
          this.$set(this, 'imgList', this.theme5);
        }
      });
    },
    saveTheme: Debounce(function () {
      saveSystemColorApi({ value: this.active + 1 }).then((res) => {
        this.$message.success('编辑成功');
        this.$store.commit('settings/SET_mobileThemeColor', this.active + 1);
      });
    }),
  },
};
</script>

<style scoped lang="scss">
.flex {
  display: flex;
}
.align-center {
  align-items: center;
}
.theme_head {
  width: 100%;
  display: flex;
  margin: 20px auto;
}
.tab_color {
  width: 114px;
  height: 45px;
  border: 1px solid #e5e5e5;
  margin-right: 20px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.color_cont {
  font-size: 14px;
}
.mr-2 {
  margin-right: 10px;
}
.color_bdg {
  display: block;
  width: 18px;
  height: 18px;
  border-top: 1px solid #fff;
  border-bottom: 1px solid #fff;
}
.theme_content {
  width: 100%;
  display: flex;
  margin-bottom: 40px;
  img {
    display: block;
    margin-right: 20px;
    width: 800px;
  }
}
.sm_bg {
  width: 60px;
}
.main_c {
  width: 25px;
  height: 25px;
  border-radius: 5px;
  text-align: center;
  line-height: 25px;
  font-size: 14px;
}
.active {
  border: 1px solid #1ca5e9;
}
.bg1 {
  background: #e93323;
}
.bg2 {
  background: #fe5c2d;
}
.bg3 {
  background: #42ca4d;
}
.bg4 {
  background: #1ca5e9;
}
.bg5 {
  background: #ff448f;
}
.white {
  color: #fff;
}
</style>
