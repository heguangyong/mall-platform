<template>
  <div class="divBox">
    <pages-header
      ref="pageHeader"
      :title="$route.params.id ? '编辑文章' : '添加文章'"
      backUrl="/marketing/content/articleManager"
    ></pages-header>
    <el-card class="box-card mt14" shadow="never" :bordered="false" :body-style="{ padding: '40px 50px' }">
      <div class="components-container">
        <el-form ref="pram" label-width="81px" :model="pram" size="small">
          <el-form-item
            label="标题："
            prop="title"
            :rules="[{ required: true, message: '请填写标题', trigger: ['blur', 'change'] }]"
          >
            <el-input v-model.trim="pram.title" class="from-ipt-width" placeholder="标题" maxlength="100" />
          </el-form-item>
          <el-form-item
            label="作者："
            prop="author"
            :rules="[{ required: true, message: '请填作者', trigger: ['blur', 'change'] }]"
          >
            <el-input v-model.trim="pram.author" class="from-ipt-width" placeholder="作者" maxlength="20" />
          </el-form-item>
          <el-form-item
            label="文章分类："
            :rules="[{ required: true, message: '请选择分类', trigger: ['blur', 'change'] }]"
          >
            <el-select v-model.trim="pram.cid" placeholder="请选择" class="from-ipt-width">
              <el-option v-for="item in categoryTreeData" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="图文封面："
            prop="cover"
            :rules="[{ required: true, message: '请上传图文封面', trigger: 'change' }]"
          >
            <div class="upLoadPicBox" @click="modalPicTap(false)">
              <div v-if="pram.cover" class="pictrue"><img :src="pram.cover" /></div>
              <div v-else class="upLoad">
                <i class="el-icon-camera cameraIconfont" />
              </div>
            </div>
          </el-form-item>
          <el-form-item
            label="文章简介："
            prop="synopsis"
            :rules="[{ required: true, message: '请填写文章简介', trigger: ['blur', 'change'] }]"
          >
            <el-input
              v-model.trim="pram.synopsis"
              maxlength="100"
              type="textarea"
              :rows="2"
              resize="none"
              class="from-ipt-width"
              placeholder="文章简介"
            />
          </el-form-item>
          <el-form-item
            label="文章内容："
            prop="content"
            :rules="[{ required: true, message: '请填写文章内容', trigger: ['blur', 'change'] }]"
          >
            <Tinymce v-model.trim="pram.content"></Tinymce>
          </el-form-item>
          <el-form-item label="排序：">
            <el-input-number v-model.trim="pram.sort" :min="0" :max="10" label="排序"></el-input-number>
          </el-form-item>
          <el-form-item label="是否Banner：">
            <el-switch v-model.trim="pram.isBanner" active-text="是" inactive-text="否" />
          </el-form-item>
          <el-form-item label="是否热门：">
            <el-switch v-model.trim="pram.isHot" active-text="是" inactive-text="否" />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              :loading="loading"
              @click="handerSubmit('pram')"
              v-hasPermi="['platform:article:update', 'platform:article:save']"
              >保存</el-button
            >
          </el-form-item>
        </el-form>
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
import * as articleApi from '@/api/article.js';
import { getToken } from '@/utils/auth';
import { Debounce } from '@/utils/validate';
export default {
  components: { Tinymce },
  data() {
    return {
      loading: false,
      constants: this.$constants,
      categoryTreeData: [],
      categoryProps: {
        value: 'id',
        label: 'name',
        children: 'child',
        expandTrigger: 'hover',
        checkStrictly: true,
        emitPath: false,
      },
      pram: {
        author: null,
        cid: null,
        content: '', //<span>My Document\'s Title</span>
        cover: '',
        isBanner: false,
        isHot: null,
        shareSynopsis: null,
        shareTitle: null,
        sort: 0,
        synopsis: null,
        title: null,
        id: null,
        // mediaId: null
      },
      editData: {},
      myHeaders: { 'X-Token': getToken() },
      editorContentLaebl: '',
    };
  },
  created() {
    this.tempRoute = Object.assign({}, this.$route);
  },
  mounted() {
    if (localStorage.getItem('articleClass')) {
      this.categoryTreeData = JSON.parse(localStorage.getItem('articleClass'));
    } else {
      this.handlerGetCategoryTreeData();
    }
    if (this.$route.params.id) {
      this.getInfo();
      this.setTagsViewTitle();
    }
  },
  methods: {
    getInfo() {
      articleApi.InfoArticle(this.$route.params.id).then((data) => {
        this.editData = data;
        this.hadlerInitEditData();
      });
    },
    modalPicTap(multiple) {
      const _this = this;
      this.$modalUpload(
        function (img) {
          if (!img) return;
          _this.pram.cover = img[0].sattDir;
        },
        multiple,
        'content',
      );
    },
    hadlerInitEditData() {
      if (!this.$route.params.id) return;
      const { author, cid, content, cover, isBanner, isHot, shareSynopsis, shareTitle, sort, synopsis, title, id } =
        this.editData;
      this.pram.author = author;
      this.pram.cid = Number.parseInt(cid);
      this.pram.content = content;
      this.pram.cover = cover;
      this.pram.isBanner = isBanner;
      this.pram.isHot = isHot;
      this.pram.shareSynopsis = shareSynopsis;
      this.pram.shareTitle = shareTitle;
      this.pram.sort = sort;
      this.pram.synopsis = synopsis;
      this.pram.title = title;
      this.pram.id = id;
    },
    handlerGetCategoryTreeData() {
      articleApi.articleCategoryListApi().then((data) => {
        this.categoryTreeData = data;
        let list = data.filter((item) => {
          return item.status;
        });
        localStorage.setItem('articleClass', JSON.stringify(list));
      });
    },
    handerSubmit: Debounce(function (form) {
      this.$refs[form].validate((valid) => {
        if (!valid) return;
        if (!this.$route.params.id) {
          this.handlerSave();
        } else {
          this.handlerUpdate();
        }
      });
    }),
    handlerUpdate() {
      this.loading = true;
      this.pram.shareTitle = this.pram.title;
      this.pram.shareSynopsis = this.pram.synopsis;
      articleApi
        .UpdateArticle(this.pram)
        .then((data) => {
          this.$message.success('编辑文章成功');
          this.loading = false;
          this.$router.push({ path: '/marketing/content/articleManager' });
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handlerSave() {
      this.loading = true;
      //this.pram.cid = Array.isArray(this.pram.cid) ? this.pram.cid[0] : this.pram.cid
      this.pram.shareTitle = this.pram.title;
      this.pram.shareSynopsis = this.pram.synopsis;
      articleApi
        .AddArticle(this.pram)
        .then((data) => {
          this.$message.success('新增文章成功');
          this.loading = false;
          this.$router.push({ path: '/marketing/content/articleManager' });
        })
        .catch(() => {
          this.loading = false;
        });
    },
    setTagsViewTitle() {
      const title = '编辑文章';
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.$route.params.id}` });
      this.$store.dispatch('tagsView/updateVisitedView', route);
    },
  },
};
</script>

<style scoped></style>
