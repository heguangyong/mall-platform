<template>
  <div class="divBox">
    <pages-header
      v-if="$route.path.indexOf('keyword') !== -1"
      ref="pageHeader"
      :title="this.$route.params.id ? '关键字编辑' : '关键字添加'"
      backUrl="/operation/application/publicAccount/wxReply/keyword"
    ></pages-header>
    <el-card class="box-card mt14" :bordered="false" shadow="never" :body-style="{ padding: '40px 50px' }">
      <el-row :gutter="30" v-loading="loading">
        <el-col v-bind="grid" class="acea-row">
          <div class="left mb15 ml40">
            <img class="top" src="@/assets/imgs/mobilehead.png" />
            <img class="bottom" src="@/assets/imgs/mobilefoot.png" />
            <div class="centent">
              <div class="time-wrapper"><span class="time">9:36</span></div>
              <div v-if="formValidate.type !== 'news'" class="view-item text-box clearfix">
                <div class="avatar fl"><img src="@/assets/imgs/head.gif" /></div>
                <div class="box-content fl">
                  <span v-if="formValidate.type === 'text'" v-text="formValidate.contents.content" />
                  <div v-if="formValidate.contents.mediaId" class="box-content_pic">
                    <img v-if="formValidate.type === 'image'" :src="formValidate.contents.srcUrl" />
                    <i class="el-icon-service" v-else></i>
                  </div>
                </div>
              </div>
              <div v-if="formValidate.type === 'news'">
                <div class="newsBox">
                  <!--<div class="news_pic mb15" style="backgroundImage: url('@/assets/imgs/mobilefoot.png');backgroundSize:'100% 100%'}" />-->
                  <div
                    class="news_pic mb15"
                    :style="{
                      backgroundImage:
                        'url(' +
                        (formValidate.contents.articleData.imageInput
                          ? formValidate.contents.articleData.imageInput
                          : '') +
                        ')',
                      backgroundSize: '100% 100%',
                    }"
                  />
                  <span class="news_sp">{{ formValidate.contents.articleData.title }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :xl="11" :lg="12" :md="14" :sm="22" :xs="22">
          <div class="box-card ml50">
            <el-form
              ref="formValidate"
              :model="formValidate"
              :rules="ruleValidate"
              label-width="100px"
              class="mt20"
              @submit.native.prevent
            >
              <el-form-item v-if="$route.path.indexOf('keyword') !== -1" label="关键字：" prop="val">
                <keyword @getLabelarr="getLabelarr" :labelarr="labelarr" class="from-ipt-width"></keyword>
                <!--                <div class="arrbox">-->
                <!--                  <el-tag-->
                <!--                    v-for="(item, index) in labelarr"-->
                <!--                    :key="index"-->
                <!--                    type="success"-->
                <!--                    closable-->
                <!--                    class="mr5 from-ipt-width"-->
                <!--                    :disable-transitions="false"-->
                <!--                    @close="handleClose(item)"-->
                <!--                    >{{ item }}-->
                <!--                  </el-tag>-->
                <!--                  <el-input-->
                <!--                    v-model.trim="val"-->
                <!--                    size="mini"-->
                <!--                    class="arrbox_ip"-->
                <!--                    placeholder="输入后回车"-->
                <!--                    style="width: 90%"-->
                <!--                    @change="addlabel"-->
                <!--                  />-->
                <!--                </div>-->
              </el-form-item>
              <el-form-item label="规则状态：">
                <el-radio-group
                  v-model="formValidate.status"
                  v-hasPermi="['platform:wechat:public:keywords:reply:status']"
                >
                  <el-radio :label="true">启用</el-radio>
                  <el-radio :label="false">禁用</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="消息类型：" prop="type">
                <el-select
                  v-model="formValidate.type"
                  placeholder="请选择规则状态"
                  class="from-ipt-width"
                  @change="RuleFactor(formValidate.type)"
                >
                  <el-option label="文字消息" value="text">文字消息</el-option>
                  <el-option label="图片消息" value="image">图片消息</el-option>
                  <el-option label="图文消息" value="news">图文消息</el-option>
                  <el-option label="声音消息" value="voice">声音消息</el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="formValidate.type === 'text'" label="规则内容：" prop="content">
                <el-input
                  v-model.trim="formValidate.contents.content"
                  placeholder="请填写规则内容"
                  class="from-ipt-width"
                  @input="change($event)"
                />
              </el-form-item>
              <el-form-item
                v-if="formValidate.type === 'news' && checkPermi(['platform:wechat:public:keywords:reply:list'])"
                label="选取图文："
              >
                <el-button size="mini" type="primary" @click="changePic">选择图文消息</el-button>
              </el-form-item>
              <el-form-item
                v-if="formValidate.type === 'image' || formValidate.type === 'voice'"
                :label="formValidate.type === 'image' ? '图片地址：' : '语音地址：'"
                prop="mediaId"
              >
                <div class="acea-row row-middle">
                  <el-input
                    v-model.trim="formValidate.contents.mediaId"
                    readonly="readonly"
                    placeholder="default size"
                    style="width: 75%"
                    class="mr10"
                  />
                  <el-upload
                    v-hasPermi="['platform:wechat:open:media:upload']"
                    class="upload-demo mr10"
                    action
                    :http-request="handleUploadForm"
                    :headers="myHeaders"
                    :show-file-list="false"
                    multiple
                  >
                    <el-button size="mini" type="primary">点击上传</el-button>
                  </el-upload>
                </div>
                <span v-show="formValidate.type === 'image'">文件最大5Mb，支持bmp/png/jpeg/jpg/gif格式</span>
                <span v-show="formValidate.type === 'voice'"
                  >文件最大5Mb，支持mp3/wma/wav/amr格式,播放长度不超过60s</span
                >
              </el-form-item>
            </el-form>
          </div>
          <el-col :span="24">
            <div class="acea-row row-center">
              <el-button
                type="primary"
                class="ml50"
                @click="submenus('formValidate')"
                v-hasPermi="[
                  'platform:wechat:public:keywords:reply:save',
                  'platform:wechat:public:keywords:reply:update',
                ]"
                >保存并发布
              </el-button>
            </div>
          </el-col>
        </el-col>
      </el-row>
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
import { getToken } from '@/utils/auth';
import { wechatReplySaveApi, wechatReplyInfoApi, keywordsInfoApi, wechatReplyUpdateApi } from '@/api/wxApi';
import { wechatUploadApi } from '@/api/systemSetting';
import { Debounce } from '@/utils/validate';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
export default {
  name: 'Index',
  components: {},
  data() {
    const validateContent = (rule, value, callback) => {
      if (this.formValidate.type === 'text') {
        if (this.formValidate.contents.content === '') {
          callback(new Error('请填写规则内容'));
        } else {
          callback();
        }
      }
    };
    const validateSrc = (rule, value, callback) => {
      if (this.formValidate.type === 'image' && this.formValidate.contents.mediaId === '') {
        callback(new Error('请上传'));
      } else {
        callback();
      }
    };
    const validateVal = (rule, value, callback) => {
      if (this.labelarr.length === 0) {
        callback(new Error('请输入后回车'));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      visible: false,
      grid: {
        xl: 7,
        lg: 12,
        md: 10,
        sm: 24,
        xs: 24,
      },
      delfromData: {},
      isShow: false,
      maxCols: 3,
      scrollerHeight: '600',
      contentTop: '130',
      contentWidth: '98%',
      modals: false,
      val: '',
      formatImg: ['jpg', 'jpeg', 'png', 'bmp', 'gif'],
      formatVoice: ['mp3', 'wma', 'wav', 'amr'],
      header: {},
      formValidate: {
        status: true,
        type: '',
        keywords: '',
        contents: {
          content: '',
          articleData: {},
          mediaId: '',
          srcUrl: '',
          articleId: null,
        },
        id: null,
      },
      ruleValidate: {
        val: [{ required: true, validator: validateVal, trigger: 'blur' }],
        type: [{ required: true, message: '请选择消息类型', trigger: 'change' }],
        content: [{ required: true, validator: validateContent, trigger: 'blur' }],
        mediaId: [{ required: true, validator: validateSrc, trigger: 'change' }],
      },
      labelarr: [],
      myHeaders: { 'X-Token': getToken() },
    };
  },
  computed: {
    fileUrl() {
      return https + `/wechat/reply/upload/image`;
    },
    voiceUrl() {
      return https + `/wechat/reply/upload/voice`;
    },
    httpsURL() {
      return process.env.VUE_APP_BASE_API.replace('api/', '');
    },
  },
  watch: {
    $route(to, from) {
      if (this.$route.params.id) {
        // this.formValidate.keywords = this.$route.params.key
        if (checkPermi(['platform:wechat:public:keywords:reply:info'])) this.details();
      } else {
        // this.labelarr = []
        // this.$refs['formValidate'].resetFields()
      }
    },
  },
  mounted() {
    if (this.$route.params.id) {
      if (checkPermi(['platform:wechat:public:keywords:reply:info'])) this.details();
    }
    if (this.$route.path.indexOf('keyword') === -1) {
      if (checkPermi(['platform:wechat:public:keywords:reply:info:keywords'])) this.followDetails();
    }
  },
  methods: {
    checkPermi,
    getLabelarr(attr) {
      this.labelarr = attr;
    },
    change(e) {
      this.$forceUpdate();
    },
    // 上传
    handleUploadForm(param) {
      const formData = new FormData();
      formData.append('media', param.file);
      let loading = this.$loading({
        lock: true,
        text: '上传中，请稍候...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      wechatUploadApi(formData, { type: this.formValidate.type === 'image' ? 'image' : 'voice' })
        .then((res) => {
          loading.close();
          this.formValidate.contents.mediaId = res.mediaId;
          this.formValidate.contents.srcUrl = res.url;
          this.$message.success('上传成功');
        })
        .catch(() => {
          loading.close();
        });
    },
    changePic() {
      const _this = this;
      this.$modalArticle(function (row) {
        _this.formValidate.contents.articleData = {
          title: row.title,
          imageInput: row.imageInput,
        };
        _this.formValidate.contents.articleId = row.id;
      });
    },
    handleClosePic() {
      this.visible = false;
    },
    // 详情
    details() {
      this.loading = true;
      wechatReplyInfoApi(this.$route.params.id)
        .then(async (res) => {
          const info = res || null;
          this.formValidate = {
            status: info.status,
            type: info.type,
            keywords: info.keywords,
            id: info.id,
            contents: {
              content: JSON.parse(info.data).content,
              mediaId: JSON.parse(info.data).mediaId,
              srcUrl: JSON.parse(info.data).srcUrl,
              articleData: JSON.parse(info.data).articleData,
            },
          };
          this.labelarr = info.keywords.split(',') || [];
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 关注回复，无效关键词详情
    followDetails() {
      this.loading = true;
      keywordsInfoApi({ keywords: this.$route.path.indexOf('follow') !== -1 ? 'subscribe' : 'default' })
        .then(async (res) => {
          const info = res || null;
          this.formValidate = {
            status: info.status,
            type: info.type,
            keywords: info.keywords,
            data: '',
            id: info.id,
            contents: {
              content: JSON.parse(info.data).content || '',
              mediaId: JSON.parse(info.data).mediaId || '',
              srcUrl: JSON.parse(info.data).srcUrl || '',
              articleData: JSON.parse(info.data).articleData || {},
            },
          };
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
          // if (res.message === '数据不存在') return
          // this.$message.error(res.message)
        });
    },
    // 下拉选择
    RuleFactor(type) {
      switch (type) {
        case 'text':
          this.formValidate.contents.mediaId = '';
          this.formValidate.contents.srcUrl = '';
          this.formValidate.contents.articleData = {};
          break;
        case 'news':
          this.formValidate.contents.mediaId = '';
          this.formValidate.contents.content = '';
          this.formValidate.contents.srcUrl = '';
          this.formValidate.contents.articleData = {};
          break;
        default:
          this.formValidate.contents.content = '';
          this.formValidate.contents.mediaId = '';
          this.formValidate.contents.articleData = {};
      }
      // this.$refs['formValidate'].resetFields();
    },
    handleClose(tag) {
      const index = this.labelarr.indexOf(tag);
      this.labelarr.splice(index, 1);
    },
    addlabel() {
      const count = this.labelarr.indexOf(this.val);
      if (count === -1) {
        this.labelarr.push(this.val);
      }
      this.val = '';
    },
    // 保存
    submenus: Debounce(function (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.formValidate.keywords = this.labelarr.join(',');
          this.formValidate.data = JSON.stringify(this.formValidate.contents);
          if (this.$route.path.indexOf('keyword') !== -1) {
            this.formValidate.id = this.$route.params.id || '';
            this.$route.params.id
              ? wechatReplyUpdateApi(this.formValidate)
                  .then(async (res) => {
                    this.operation();
                  })
                  .catch((res) => {
                    this.$message.error(res.message);
                  })
              : wechatReplySaveApi(this.formValidate)
                  .then(async (res) => {
                    this.operation();
                  })
                  .catch((res) => {
                    this.$message.error(res.message);
                  });
          } else {
            this.$route.path.indexOf('follow') !== -1
              ? (this.formValidate.keywords = 'subscribe')
              : (this.formValidate.keywords = 'default');
            this.formValidate.id !== null
              ? wechatReplyUpdateApi(this.formValidate).then(async (res) => {
                  this.$message.success('操作成功');
                })
              : wechatReplySaveApi(this.formValidate)
                  .then(async (res) => {
                    this.operation();
                  })
                  .catch((res) => {
                    this.$message.error(res.message);
                  });
          }
        } else {
          return false;
        }
      });
    }),
    // 保存成功操作
    operation() {
      this.$modalSure('继续添加')
        .then(() => {
          setTimeout(() => {
            this.labelarr = [];
            this.val = '';
            this.$refs['formValidate'].resetFields();
            this.formValidate.contents.mediaId = '';
          }, 1000);
        })
        .catch(() => {
          setTimeout(() => {
            this.$router.push({ path: `/operation/application/publicAccount/wxReply/keyword` });
          }, 500);
        });
    },
  },
};
</script>

<style scoped lang="scss">
.newsBox {
  background: #fff;
}
.arrbox {
  background-color: white;
  font-size: 12px;
  border: 1px solid #dcdee2;
  border-radius: 6px;
  margin-bottom: 0px;
  padding: 0 5px;
  text-align: left;
  box-sizing: border-box;
  width: 90%;
}
.news_sp {
  font-size: 12px;
  color: #000000;
  background: #fff;
  width: 100%;
  height: 38px;
  line-height: 38px;
  padding: 0 12px;
  box-sizing: border-box;
  display: block;
}
.arrbox_ip {
  font-size: 12px;
  border: none;
  box-shadow: none;
  outline: none;
  background-color: transparent;
  padding: 0;
  margin: 0;
  width: auto !important;
  max-width: inherit;
  min-width: 80px;
  vertical-align: top;
  color: #34495e;
  margin: 2px;
}

.left {
  min-width: 390px;
  min-height: 550px;
  position: relative;
  padding-left: 40px;
}

.top {
  position: absolute;
  top: 0px;
}

.bottom {
  position: absolute;
  bottom: 0px;
}

.centent {
  background: #f4f5f9;
  min-height: 545px;
  width: 320px;
  padding: 15px;
  box-sizing: border-box;
}
.box-content {
  position: relative;
  max-width: 60%;
  min-height: 40px;
  margin-left: 15px;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  word-break: break-all;
  word-wrap: break-word;
  line-height: 1.5;
  border-radius: 5px;
}

.box-content_pic {
  width: 100%;
}

.box-content_pic img {
  width: 100%;
  height: auto;
}

.box-content:before {
  content: '';
  position: absolute;
  left: -13px;
  top: 11px;
  display: block;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 10px solid #ccc;
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
}

.box-content:after {
  content: '';
  content: '';
  position: absolute;
  left: -12px;
  top: 11px;
  display: block;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 10px solid #f5f5f5;
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
}

.time-wrapper {
  margin-bottom: 10px;
  text-align: center;
  margin-top: 62px;
}

.time {
  display: inline-block;
  color: #f5f5f5;
  background: rgba(0, 0, 0, 0.3);
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 12px;
}

.text-box {
  display: flex;
}

.avatar {
  width: 40px;
  height: 40px;
}

.avatar img {
  width: 100%;
  height: 100%;
}
.modelBox {
  .ivu-modal-body {
    padding: 0 16px 16px 16px !important;
  }
}
.news_pic {
  width: 100%;
  height: 150px;
  overflow: hidden;
  position: relative;
  background-size: 100%;
  background-position: center center;
  border-radius: 5px 5px 0 0;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.news_cent {
  width: 100%;
  height: auto;
  background: #fff;
  border-top: 1px dashed #eee;
  display: flex;
  padding: 10px;
  box-sizing: border-box;
  justify-content: space-between;
  .news_sp1 {
    font-size: 12px;
    color: #000000;
    width: 71%;
  }
  .news_cent_img {
    width: 81px;
    height: 46px;
    border-radius: 6px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
