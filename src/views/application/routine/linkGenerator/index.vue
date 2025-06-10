<template>
  <div class="divBox">
    <el-card
      class="box-card"
      shadow="never"
      :bordered="false"
      :body-style="{ padding: 0 }"
      v-hasPermi="['platform:wechat:mini:url:link:page:list']"
    >
      <div class="padding-add">
        <el-form ref="form" inline :model="tableFrom" @submit.native.prevent>
          <el-form-item label="链接名称：">
            <el-input
              v-model.trim="keywords"
              placeholder="请输入链接名称"
              class="selWidth"
              size="small"
              clearable
              @keyup.enter.native="getList(1)"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="getList(1)">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card mt14" :body-style="{ padding: '20px' }" shadow="never" :bordered="false">
      <el-button
        type="primary"
        class="mb20"
        size="small"
        @click="handlerAdd"
        v-hasPermi="['platform:wechat:mini:generate:url:link']"
        >新增链接</el-button
      >
      <el-alert
        class="mb20"
        title="突破低复购率的瓶颈，用户可通过点击短信、邮件、微信外网页等短链接直接跳转进入商城，并最终在商城实现私域用户沉淀和转化。"
        type="warning"
        :closable="false"
        effect="light"
      ></el-alert>
      <el-table v-loading="loading" :data="tableData.data" size="small">
        <el-table-column prop="id" label="ID" min-width="90" />
        <el-table-column label="链接名称" min-width="150" prop="name" :show-overflow-tooltip="true" />
        <el-table-column min-width="250" label="跳转页面" prop="originalPath" />
        <el-table-column min-width="200" label="生成链接" prop="urlLink" />
        <el-table-column min-width="100" label="有效期(天)" prop="expireInterval" />
        <el-table-column label="生成时间" min-width="150" prop="createTime" />
        <el-table-column prop="address" fixed="right" width="190" label="操作">
          <template slot-scope="scope">
            <a class="copy copy-data" :data-clipboard-text="scope.row.urlLink" @click="handleCopy">复制链接</a>
            <el-divider direction="vertical"></el-divider>
            <a @click="handleRegenerate(scope.row)" v-hasPermi="['platform:wechat:mini:generate:url:link']">再次生成</a>
            <el-divider direction="vertical"></el-divider>
            <a @click="handleDelete(scope.row.id)" v-hasPermi="['platform:wechat:mini:delete:url:link']">删除</a>
          </template>
        </el-table-column> </el-table
      >`
      <div class="block-pagination">
        <el-pagination
          background
          :page-sizes="[20, 40, 60, 80]"
          :page-size="tableFrom.limit"
          :current-page="tableFrom.page"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.total"
          @current-change="pageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>
    <!--添加表单-->
    <el-dialog title="新增链接" :visible.sync="dialogVisible" width="700px" :before-close="handleClose">
      <el-form :model="formData" :rules="rules" ref="formData" label-width="90px" class="demo-ruleForm">
        <el-form-item label="链接名称：" prop="name">
          <el-input v-model.trim="formData.name" maxlength="50" placeholder="请输入链接名称（最多50字）"></el-input>
        </el-form-item>
        <el-form-item label="跳转页面：" prop="originalPath">
          <el-input
            @click="handleGetLink"
            size="small"
            icon="ios-arrow-forward"
            v-model="formData.originalPath"
            readonly
            placeholder="请选择链接"
          >
            <el-button @click="handleGetLink" slot="append" icon="el-icon-arrow-right"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="有效期(天)：" prop="expireInterval">
          <el-input-number
            v-model.trim="formData.expireInterval"
            :min="1"
            :step="1"
            step-strictly
            :max="30"
            placeholder="范围在1~30，默认30"
          ></el-input-number>
          <div class="from-tips">根据微信接口要求，链接有效期最长为30天</div>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="submitForm('formData')" v-hasPermi="['platform:express:update']"
          >生成链接</el-button
        >
      </div>
    </el-dialog>
    <linkaddress ref="linkaddres" @linkUrl="getLinkUrl" fromType="linkGenerator"></linkaddress>
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
import { checkPermi } from '@/utils/permission'; // 权限判断函数
import linkaddress from '@/components/linkaddress/index.vue';
import { wechatUrlLinkDeleteApi, wechatUrlLinkGenerateApi, wechatUrlLinkListApi } from '@/api/wxApi';
import ClipboardJS from 'clipboard';
import { Debounce } from '@/utils/validate';
import { handleDeleteTable } from '@/libs/public';
export default {
  name: 'linkGenerator',
  components: { linkaddress },
  data() {
    return {
      constants: this.$constants,
      tableFrom: {
        page: 1,
        limit: 20,
        keywords: '',
      },
      keywords: '',
      loading: false,
      dialogVisible: false,
      tableData: {
        data: [],
        total: 0,
      },
      formData: {
        expireInterval: 30,
        originalPath: '',
        name: '',
      },
      rules: {
        name: [{ required: true, message: '请填写链接名称', trigger: 'blur' }],

        originalPath: [{ required: true, message: '请选择跳转页面', trigger: 'change' }],
        expireInterval: [{ required: true, message: '请填写失效间隔天数', trigger: ['blur', 'change'] }],
      },
    };
  },
  mounted() {
    if (checkPermi(['platform:wechat:mini:url:link:page:list'])) this.getList(1);
  },
  methods: {
    checkPermi,
    handleCopy() {
      this.$nextTick(function () {
        const clipboard = new ClipboardJS('.copy-data');
        clipboard.on('success', () => {
          this.$message.success('复制成功');
          clipboard.destroy();
        });
      });
    },
    //再次生成
    handleRegenerate(row) {
      this.formData = {
        expireInterval: row.expireInterval,
        originalPath: row.originalPath,
        name: row.name,
      };
      this.handlerAdd();
    },
    //新增
    handlerAdd() {
      this.dialogVisible = true;
    },
    //关闭弹窗
    handleClose() {
      this.dialogVisible = false;
      this.$refs.formData.resetFields();
    },
    //获取链接地址
    getLinkUrl(e) {
      this.formData.originalPath = e;
    },
    handleGetLink() {
      this.$refs.linkaddres.dialogVisible = true;
    },
    // 删除
    handleDelete(id) {
      this.$modalSure('删除该链接吗？').then(() => {
        wechatUrlLinkDeleteApi(id).then(() => {
          this.$message.success('删除成功');
          handleDeleteTable(this.tableData.data.length, this.tableFrom);
          this.getList();
        });
      });
    },
    // 列表
    getList(num) {
      this.loading = true;
      this.tableFrom.page = num ? num : this.tableFrom.page;
      this.tableFrom.keywords = encodeURIComponent(this.keywords);
      wechatUrlLinkListApi(this.tableFrom)
        .then((res) => {
          this.tableData.data = res.list;
          this.tableData.total = res.total;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    pageChange(page) {
      this.tableFrom.page = page;
      this.getList();
    },
    handleSizeChange(val) {
      this.tableFrom.limit = val;
      this.getList();
    },
    //表单提交
    submitForm: Debounce(function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          wechatUrlLinkGenerateApi(this.formData).then((res) => {
            this.$message.success('新增成功');
            this.getList(1);
            this.handleClose();
          });
        } else {
          return false;
        }
      });
    }),
  },
};
</script>
<style scoped lang="scss"></style>
