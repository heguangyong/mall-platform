<template>
  <div class="divBox">
    <el-card
      :bordered="false"
      shadow="never"
      class="ivu-mt"
      :body-style="{ padding: 0 }"
      v-hasPermi="['platform:finance:merchant:closing:page:list']"
    >
      <div class="padding-add">
        <el-form size="small" inline @submit.native.prevent>
          <el-form-item label="时间选择：">
            <el-date-picker
              v-model="timeVal"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              size="small"
              type="daterange"
              placement="bottom-end"
              placeholder="自定义时间"
              style="width: 260px"
              @change="onchangeTime"
            />
          </el-form-item>
          <el-form-item label="商户名称：" v-hasPermi="['platform:merchant:page:list']">
            <merchant-name @getMerId="getMerId" :mer-id-checked="tableFrom.merId"></merchant-name>
          </el-form-item>
          <el-form-item label="审核状态：">
            <el-select
              v-model="tableFrom.auditStatus"
              placeholder="请选择"
              class="selWidth"
              clearable
              @change="getList(1)"
            >
              <el-option label="全部" value="" />
              <el-option label="待审核" value="0" />
              <el-option label="审核通过" value="1" />
              <el-option label="审核失败" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="到账状态：">
            <el-select
              v-model="tableFrom.accountStatus"
              placeholder="请选择"
              class="selWidth"
              clearable
              @change="getList(1)"
            >
              <el-option v-for="item in arrivalStatusList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="结算类型：">
            <el-select
              v-model="tableFrom.closingType"
              placeholder="请选择"
              class="selWidth"
              clearable
              @change="getList(1)"
            >
              <el-option v-for="item in closingTypeList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="结算单号：">
            <el-input
              v-model.trim="tableFrom.closingNo"
              @keyup.enter.native="getList(1)"
              placeholder="请输入结算单号"
              class="selWidth"
              size="small"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="getList(1)">查询</el-button>
            <el-button size="small" @click="reset()">重置</el-button>
          </el-form-item>
          <br />
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card mt14" :body-style="{ padding: '20px' }" shadow="never" :bordered="false">
      <el-table
        v-loading="listLoading"
        size="small"
        tooltip-effect="dark"
        :data="tableData.data"
        style="width: 100%"
        class="table"
      >
        <el-table-column prop="id" label="ID" min-width="60" />
        <el-table-column prop="closingNo" label="结算单号" min-width="180" />
        <el-table-column prop="merName" label="商户名称" min-width="160" :show-overflow-tooltip="true" />
        <el-table-column prop="amount" label="金额" min-width="120" />
        <el-table-column label="审核员姓名" min-width="120" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.auditName | filterEmpty }}</span>
          </template>
        </el-table-column>
        <el-table-column label="结算类型" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.closingType | closingTypeFilter }}</span>
          </template>
        </el-table-column>

        <el-table-column label="审核状态" min-width="120">
          <template slot-scope="scope">
            <span>{{
              scope.row.auditStatus == 0 ? '待审核' : scope.row.auditStatus == 1 ? '审核通过' : '审核失败'
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="到账状态" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.accountStatus == 1 ? '已转账' : '未转账' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="平台备注" min-width="150" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.platformMark | filterEmpty }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="申请时间" min-width="150" :show-overflow-tooltip="true" />
        <el-table-column label="操作" width="170" fixed="right">
          <template slot-scope="scope">
            <a @click="closingDetail(scope.row.closingNo, 1)" v-hasPermi="['platform:finance:merchant:closing:detail']"
              >转账详情</a
            >
            <el-divider direction="vertical"></el-divider>
            <template v-if="scope.row.auditStatus === 0 && checkPermi(['platform:finance:merchant:closing:audit'])">
              <a @click="closingDetail(scope.row.closingNo, 2)">审核</a>
              <el-divider direction="vertical"></el-divider>
            </template>
            <template
              v-if="
                scope.row.auditStatus === 1 &&
                scope.row.accountStatus === 0 &&
                checkPermi(['platform:finance:merchant:closing:proof'])
              "
            >
              <a @click="closingDetail(scope.row.closingNo, 3)">转账</a>
              <el-divider direction="vertical"></el-divider>
            </template>
            <a v-hasPermi="['platform:finance:merchant:closing:remark']" @click="onRemark(scope.row)">备注</a>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          background
          :page-sizes="[20, 40, 60, 80]"
          :page-size="tableFrom.limit"
          :current-page="tableFrom.page"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.total"
          @size-change="handleSizeChange"
          @current-change="pageChange"
        />
      </div>
    </el-card>
    <!--转账凭证 审核 详情-->
    <el-drawer direction="rtl" :visible.sync="dialogVisible" size="700px" @close="close('ruleForm')" title="结算详情">
      <div class="detailHead">
        <div class="acea-row row-between headerBox">
          <div class="full">
            <div class="order_icon"><span class="iconfont icon-caiwuchazhang"></span></div>
            <div class="text">
              <div class="title">结算详情</div>
            </div>
          </div>
          <div v-if="isShow === 2 && closingData.auditStatus == 0" class="acea-row justify-content">
            <el-button
              size="small"
              v-debounceClick="
                () => {
                  onSubmit('fail');
                }
              "
              style="margin-left: 0"
              >{{ loadingBtn ? '提交中 ...' : '审核拒绝' }}</el-button
            >
            <el-button
              size="small"
              type="primary"
              v-debounceClick="
                () => {
                  onSubmit('success');
                }
              "
              >{{ loadingBtn ? '提交中 ...' : '审核通过' }}</el-button
            >
          </div>
        </div>
      </div>
      <div class="box-container detailSection" v-loading="loading">
        <div class="acea-row">
          <div class="list sp100"><label class="name">商户名称：</label>{{ closingData.merName }}</div>
          <div class="list sp100"><label class="name">商户流水金额：</label>{{ closingData.amount }}</div>
          <div class="list sp100"><label class="name">商户余额：</label>{{ closingData.balance }}</div>
          <div class="list sp100">
            <label class="name">商户收款方式：</label>{{ closingData.closingType | closingTypeFilter }}
          </div>
          <template v-if="closingData.closingType === 'bank'">
            <div class="list sp100"><label class="name">开户银行：</label>{{ closingData.closingBank }}</div>
            <div class="list sp100"><label class="name">银行账号：</label>{{ closingData.closingBankCard }}</div>
            <div class="list sp100"><label class="name">开户户名：</label>{{ closingData.closingName }}</div>
          </template>
          <div v-if="closingData.closingType === 'wechat'" class="list sp100">
            <label class="name">微信号：</label>{{ closingData.wechatNo }}
          </div>
          <div v-if="closingData.closingType === 'alipay'" class="list sp100">
            <label class="name">支付宝账号：</label>{{ closingData.alipayAccount }}
          </div>
          <div v-if="closingData.closingType === 'wechat' || closingData.closingType === 'alipay'" class="list sp100">
            <label class="name">真实姓名：</label>{{ closingData.realName }}
          </div>
          <div v-if="closingData.closingType !== 'bank'" class="list sp100 acea-row">
            <label class="name">收款二维码：</label>
            <div class="demo-image__preview">
              <el-image :src="closingData.paymentCode" :preview-src-list="[closingData.paymentCode]" />
            </div>
          </div>

          <div class="list sp100">
            <label class="name">审核状态：</label
            >{{ closingData.auditStatus == 0 ? '待审核' : closingData.auditStatus == 1 ? '已审核' : '审核失败' }}
          </div>
          <div v-if="closingData.auditStatus == 1" class="list sp100">
            <label class="name">审核时间：</label>{{ closingData.auditTime | filterEmpty }}
          </div>
          <div v-if="closingData.closingProof" class="list sp100">
            <label class="name">结算凭证：</label>
            <div class="acea-row">
              <div v-for="(item, index) in JSON.parse(closingData.closingProof)" :key="index" class="pictrue">
                <img @click="getPicture(item)" :src="item" />
              </div>
            </div>
          </div>
          <div v-if="closingData.auditStatus == 1 && closingData.closingTime" class="list sp100">
            <label class="name">结算时间：</label>{{ closingData.closingTime }}
          </div>
          <div v-if="closingData.auditStatus == 2 && closingData.refusalReason" class="list sp100">
            <label class="name">审核未通过原因：</label>{{ closingData.refusalReason }}
          </div>
          <div class="list sp100">
            <label class="name">平台备注：</label>{{ closingData.platformMark | filterEmpty }}
          </div>
          <div class="list sp100"><label class="name">商户备注：</label>{{ closingData.mark | filterEmpty }}</div>
        </div>
        <div v-if="isShow !== 1">
          <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
            <template v-if="isShow === 3 && closingData.auditStatus === 1 && closingData.accountStatus === 0">
              <el-form-item label="转账凭证：" prop="closingProof">
                <div class="acea-row">
                  <div class="acea-row" v-if="ruleForm.closingProof.length > 0">
                    <div v-for="(item, index) in ruleForm.closingProof" :key="index" class="pictrue">
                      <img :src="item" @click="getPicture(item)" />
                      <i class="el-icon-error btndel" @click="handleRemove(index)" />
                    </div>
                  </div>
                  <el-upload
                    v-show="ruleForm.closingProof.length < 6"
                    class="upload-demo"
                    action
                    :http-request="handleUploadForm"
                    :headers="myHeaders"
                    :show-file-list="false"
                    multiple
                  >
                    <div class="upLoadPicBox">
                      <div class="upLoad">
                        <i class="el-icon-upload2" />
                      </div>
                    </div>
                  </el-upload>
                </div>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submit">{{ loadingBtn ? '提交中 ...' : '确 定' }}</el-button>
              </el-form-item>
            </template>
          </el-form>
        </div>
      </div>
    </el-drawer>
    <!--查看图片-->
    <el-dialog v-if="pictureVisible" :visible.sync="pictureVisible" width="700px">
      <img :src="pictureUrl" class="pictures" />
    </el-dialog>
    <!--导出订单列表-->
    <!--<file-list ref="exportList" />-->
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
import {
  merchantClosingListApi,
  transferProofApi,
  closingAuditApi,
  merClosingDetailApi,
  transferRecordsExportApi,
  merClosingRemarkApi,
} from '@/api/finance';
import merchantName from '@/components/merchantName';
import { getToken } from '@/utils/auth';
import { fileImageApi } from '@/api/systemSetting';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
export default {
  name: 'transferAccount',
  data() {
    return {
      myHeaders: { 'X-Token': getToken() },
      isShow: 0,
      loadingBtn: false,
      rules: {
        auditStatus: [{ required: true, message: '请选择审核状态', trigger: 'change' }],
        refusalReason: [{ required: true, message: '请填写拒绝原因', trigger: 'blur' }],
        closingProof: [{ required: true, message: '请上传结算凭证', type: 'array', trigger: 'change' }],
      },
      tableData: {
        data: [],
        total: 0,
      },
      arrivalStatusList: [
        { label: '已到账', value: 1 },
        { label: '未到账', value: 0 },
      ],
      closingTypeList: [
        { label: '银行卡', value: 'bank' },
        { label: '微信', value: 'wechat' },
        { label: '支付宝', value: 'alipay' },
      ],
      listLoading: true,
      tableFrom: {
        dateLimit: '',
        page: 1,
        limit: 20,
        closingNo: '',
        auditStatus: '',
        accountStatus: '',
        merId: null,
        closingType: '',
      },
      timeVal: [],
      fromList: this.$constants.fromList,
      loading: false,
      dialogVisible: false,
      pictureVisible: false,
      closingData: {},
      baseInfoform: {
        amount: 0,
        mark: '',
        transferType: '',
      },
      merchantList: [],
      search: {
        limit: 10,
        page: 1,
        keywords: '',
      },
      ruleForm: {
        refusalReason: '',
        auditStatus: 1,
        id: '',
        closingProof: [],
      },
      localImg: '',
      closingNo: '',
    };
  },
  components: { merchantName },
  mounted() {
    if (checkPermi(['platform:finance:merchant:closing:page:list'])) this.getList(1);
  },
  methods: {
    checkPermi,
    getMerId(id) {
      this.tableFrom.merId = id;
      this.getList(1);
    },
    onRemark(row) {
      this.$modalPrompt('textarea', '备注', row.platformMark).then((V) => {
        merClosingRemarkApi({
          closingNo: row.closingNo,
          remark: V,
        }).then((res) => {
          this.$message({
            type: 'success',
            message: '提交成功',
          });
          this.getList('');
        });
      });
    },
    // 审核提交
    onSubmit(type) {
      if (type === 'success') {
        this.$modalSure('审核通过该结算吗？').then(() => {
          this.ruleForm.auditStatus = 1;
          this.submit();
        });
      } else {
        this.ruleForm.auditStatus = 2;
        this.cancelForm();
      }
    },
    //审核拒绝
    cancelForm() {
      this.$modalPrompt('textarea', '拒绝原因').then((V) => {
        this.ruleForm.refusalReason = V;
        this.submit();
      });
    },
    submit() {
      if (this.isShow === 2) {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.loadingBtn = true;
            const data = {
              closingNo: this.closingNo,
              refusalReason: this.ruleForm.refusalReason,
              auditStatus: this.ruleForm.auditStatus,
            };
            // return;
            closingAuditApi(data)
              .then((res) => {
                this.$message.success('操作成功');
                this.dialogVisible = false;
                this.getList(1);
                this.close('ruleForm');
                this.loadingBtn = false;
              })
              .catch((res) => {
                this.loadingBtn = false;
              });
          } else {
            return false;
          }
        });
      } else {
        this.loadingBtn = true;
        const data = {
          closingNo: this.closingNo,
          closingProof: JSON.stringify(this.ruleForm.closingProof),
        };
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            transferProofApi(data)
              .then((res) => {
                this.$message.success('操作成功');
                this.dialogVisible = false;
                this.getList(1);
                this.close('ruleForm');
                this.loadingBtn = false;
              })
              .catch((res) => {
                this.loadingBtn = false;
              });
          }
        });
      }
    },
    handleUploadForm(param) {
      const formData = new FormData();
      const data = {
        model: 'finance',
        pid: 0,
      };
      formData.append('multipart', param.file);
      let loading = this.$loading({
        lock: true,
        text: '上传中，请稍候...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      fileImageApi(formData, data)
        .then((res) => {
          loading.close();
          this.$message.success('上传成功');
          this.ruleForm.closingProof.push(res.url);
        })
        .catch((res) => {
          loading.close();
        });
    },
    handleRemove(i) {
      this.ruleForm.closingProof.splice(i, 1);
    },
    close(refName) {
      if (this.$refs[refName]) {
        this.$refs[refName].resetFields();
      }
      this.dialogVisible = false;
      this.ruleForm.closingProof = [];
    },
    // 商户结算记录详情
    closingDetail(id, num) {
      this.closingNo = id;
      this.isShow = num;
      this.dialogVisible = true;
      this.loading = true;
      merClosingDetailApi(id)
        .then((res) => {
          this.closingData = res;
          this.loading = false;
        })
        .catch((res) => {
          this.loading = false;
        });
    },
    // 查看图片
    getPicture(url) {
      this.pictureVisible = true;
      this.pictureUrl = url;
    },
    // 选择时间
    selectChange(tab) {
      this.tableFrom.dateLimit = tab;
      this.timeVal = [];
      this.getList(1);
    },
    // 具体日期
    onchangeTime(e) {
      this.timeVal = e;
      this.tableFrom.dateLimit = e ? this.timeVal.join(',') : '';
      this.getList(1);
    },
    // 导出
    exportRecord() {
      transferRecordsExportApi(this.tableFrom)
        .then((res) => {
          const h = this.$createElement;
          this.$msgbox({
            title: '提示',
            message: h('p', null, [
              h('span', null, '文件正在生成中，请稍后点击"'),
              h('span', { style: 'color: teal' }, '导出记录'),
              h('span', null, '"查看~ '),
            ]),
            confirmButtonText: '我知道了',
          }).then((action) => {});
        })
        .catch((res) => {
          this.$message.error(res.message);
        });
    },
    // 导出列表
    getExportFileList() {
      this.$refs.exportList.exportFileList();
    },
    // 列表
    getList(num) {
      this.listLoading = true;
      this.tableFrom.page = num ? num : this.tableFrom.page;
      merchantClosingListApi(this.tableFrom)
        .then((res) => {
          this.tableData.data = res.list;
          this.tableData.total = res.total;
          this.listLoading = false;
        })
        .catch((res) => {
          this.listLoading = false;
        });
    },
    reset() {
      this.tableFrom.dateLimit = '';
      this.tableFrom.closingNo = '';
      this.tableFrom.auditStatus = '';
      this.tableFrom.accountStatus = '';
      this.tableFrom.merId = null;
      this.tableFrom.closingType = '';
      this.timeVal = [];
      this.getList(1);
    },
    pageChange(page) {
      this.tableFrom.page = page;
      this.getList('');
    },
    handleSizeChange(val) {
      this.tableFrom.limit = val;
      this.getList('');
    },

    handleClose() {
      this.dialogLogistics = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.detailHead .full{
  .text{
    width: auto !important;
  }
}
.demo-image__preview {
  width: 60px;
  height: 60px;

  .el-image {
    width: 100%;
    height: 100%;
  }
}

.title {
  font-size: 20px;
}

.wid100 {
  width: 100px;
}

.ml100 {
  margin-left: 100px;
}

.transferMinAmount {
  ::v-deep.el-form-item__content {
    line-height: normal;
  }
}

::v-deep .el-dialog__title {
  font-weight: bold;
}

.el-icon-arrow-down {
  font-size: 12px;
}

.font-red {
  color: #ff4949;
}

.tabBox_tit {
  width: 60%;
  font-size: 12px !important;
  margin: 0 2px 0 10px;
  letter-spacing: 1px;
  padding: 5px 0;
  box-sizing: border-box;
}

.box-container {
  overflow: hidden;
  padding: 25px 35px;
}

.box-container .list.image {
  margin: 20px 0;
  position: relative;
}

.box-container .list.image img {
  position: absolute;
  top: -20px;
}

.box-container .list {
  float: left;
  font-size: 13px;
  color: #303133;
  margin-bottom: 16px;

  .name {
    color: #606266;
    width: 110px;
    display: inline-block;
    text-align: right;
  }
}

.box-container .sp100 {
  width: 100%;
}

.pictures {
  width: 100%;
  height: 100%;
}
</style>
