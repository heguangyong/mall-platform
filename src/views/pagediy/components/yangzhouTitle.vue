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

  props: {
    titleTxt: {
      type: String,
      default: '',
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
  },
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
  font-weight: bold;
  font-size: 12px;
  font-family: yixin;
}
.ml6 {
  margin: 1px 0;
  margin-left: 4px !important;
}
.right-arrow {
  height: 0;
  width: 0;
  border: 2.5px solid transparent;
  border-right: 0px;
  border-left: 4px solid #000;
}
</style>
