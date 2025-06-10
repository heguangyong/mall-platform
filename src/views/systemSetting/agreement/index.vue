<template>
  <div class="divBox">
    <el-card class="box-card" :bordered="false" shadow="never">
      <div v-loading="loading">
        <el-tabs
          tab-position="left"
          v-model="agreementValue"
          @tab-click="tabStatus"
          v-hasPermi="[
            'platform:system:agreement:user:info',
            'platform:system:agreement:merincomming:info',
            'platform:system:agreement:userprivacy:info',
            'platform:system:agreement:useraccountcancel:info',
            'platform:system:agreement:useraccountcancelnotice:info',
            'platform:system:agreement:aboutus:info',
            'platform:system:agreement:intelligent:info',
            'platform:system:agreement:platfromrule:info',
            'platform:system:agreement:coupon:agreement:info',
          ]"
        >
          <el-tab-pane :label="item.title" v-for="(item, index) in tabList" :key="index" :name="item.info">
            <div class="content">
              <div class="phoneBox">
                <div class="fontBox" v-html="formValidate.agreement"></div>
              </div>
              <div class="ueditor">
                <div class="font"><span class="verticalLine"></span> {{ item.title }}</div>
                <Tinymce v-model="formValidate.agreement" :key="keyIndex"></Tinymce>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div class="btn">
          <el-button
            class="button"
            type="primary"
            @click="submenus"
            v-hasPermi="[
              'platform:system:agreement:user:save',
              'platform:system:agreement:merincomming:save',
              'platform:system:agreement:userprivacy:save',
              'platform:system:agreement:useraccountcancel:save',
              'platform:system:agreement:useraccountcancelnotice:save',
              'platform:system:agreement:aboutus:save',
              'platform:system:agreement:intelligent:save',
              'platform:system:agreement:platfromrule:save',
              'platform:system:agreement:coupon:agreement:save',
              'platform:system:agreement:paid:member:save',
            ]"
            >提交</el-button
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
import Tinymce from '@/components/Tinymce/index';
import { agreementInfoApi, agreementSaveApi } from '@/api/system';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
export default {
  name: 'agreements',
  components: { Tinymce },
  data() {
    return {
      loading: false,
      tabList: [
        { title: '用户协议', id: 1, info: 'userinfo', save: 'usersave' },
        { title: '隐私协议', id: 2, info: 'userprivacyinfo', save: 'userprivacysave' },
        { title: '入驻协议', id: 3, info: 'merincomminginfo', save: 'merincommingsave' },
        { title: '关于我们', id: 4, info: 'aboutusinfo', save: 'aboutussave' },
        { title: '资质证照', id: 5, info: 'intelligentinfo', save: 'intelligentsave' },
        { title: '平台规则', id: 6, info: 'platfromruleinfo', save: 'platfromrulesave' },
        { title: '注销协议', id: 7, info: 'useraccountcancelinfo', save: 'useraccountcancelsave' },
        { title: '注销声明', id: 8, info: 'useraccountcancelnoticeinfo', save: 'useraccountcancelnoticesave' },
        { title: '优惠券协议', id: 8, info: 'coupon/agreement/info', save: 'coupon/agreement/save' },
        { title: '付费会员协议', id: 8, info: 'paid/member/info', save: 'paid/member/save' },
      ],
      formValidate: {
        agreement: '',
      },
      agreementValue: 'userinfo',
      agreementSave: 'usersave',
      keyIndex: 0,
    };
  },
  created() {
    if (
      checkPermi([
        'platform:system:agreement:user:info',
        'platform:system:agreement:merincomming:info',
        'platform:system:agreement:userprivacy:info',
        'platform:system:agreement:useraccountcancel:info',
        'platform:system:agreement:useraccountcancelnotice:info',
        'platform:system:agreement:aboutus:info',
        'platform:system:agreement:intelligent:info',
        'platform:system:agreement:platfromrule:info',
        'platform:system:agreement:coupon:agreement:info',
        'platform:system:agreement:paid:member:info',
      ])
    )
      this.getInfo(this.agreementValue);
  },
  methods: {
    checkPermi,
    getInfo(data) {
      this.loading = true;
      this.formValidate.agreement = '';
      agreementInfoApi(data)
        .then((res) => {
          this.formValidate.agreement = res ? JSON.parse(res).agreement : '';
          this.keyIndex += 1;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    submenus() {
      if (this.formValidate.agreement === '' || !this.formValidate.agreement) {
        return this.$message.warning('请输入协议信息！');
      } else {
        agreementSaveApi(this.agreementSave, this.formValidate).then(async (res) => {
          this.$message.success('保存成功');
        });
      }
    },
    tabStatus(e) {
      this.getInfo(e.name);
      this.agreementSave = this.tabList[e.index].save;
    },
  },
};
</script>
<style scoped lang="scss">
.box-card :v-deep.el-card__body {
  padding-left: 0px;
}
:v-deep.el-tabs__item.is-active {
  color: var(--prev-color-primary);
  background-color: #ccc;
  background: #437efd1e;
  // opacity: 0.1;
}
:v-deep.el-tabs--left .el-tabs__header.is-left {
  float: left;
  margin-bottom: 0;
  margin-right: 20px;
  height: 700px;
}
.verticalLine {
  border: 2px solid var(--prev-color-primary);
  margin-right: 10px;
}
.btn {
  border-top: 1px solid #ccc;
  margin-top: 20px;
  .button {
    display: block;
    margin: 17px auto 0px;
  }
}
.content {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  img {
    max-width: 100%;
  }
  .phoneBox {
    width: 302px;
    height: 543px;
    background-image: url('../../../assets/imgs/phoneBox.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    overflow: hidden;
    margin-right: 30px;
    .fontBox {
      margin: 0 auto;
      margin-top: 45px;
      width: 255px;
      height: 450px;
      background: #ffffff;
      border: 1px solid #e2e2e2;
      padding: 10px;
      overflow: hidden;
      overflow-y: auto;
      ::v-deep img {
        width: 100% !important;
      }
    }
  }
  .ueditor {
    flex: 1;
    .font {
      font-size: 20px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 30px;
    }
  }
}
</style>
