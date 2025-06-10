<template>
  <div class="divBox">
    <el-card
      :bordered="false"
      shadow="never"
      class="ivu-mt"
      :body-style="{ padding: 0 }"
      v-hasPermi="['platform:merchant:apply:page:list']"
    >
      <div class="padding-add">
        <el-form size="small" label-position="right" inline @submit.native.prevent>
          <el-form-item label="选择时间：">
            <el-date-picker
              v-model="timeVal"
              type="daterange"
              size="small"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="onchangeTime"
              class="selWidth"
            />
          </el-form-item>
          <el-form-item label="审核状态：">
            <el-select v-model="tableFrom.auditStatus" clearable size="small" placeholder="请选择" class="selWidth">
              <el-option
                v-for="(itemn, indexn) in statusList.fromTxt"
                :key="indexn"
                :label="itemn.text"
                :value="itemn.val"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="商户分类：">
            <el-select v-model="tableFrom.categoryId" clearable size="small" placeholder="请选择" class="selWidth">
              <el-option v-for="item in merchantClassify" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="店铺类型：">
            <el-select v-model="tableFrom.typeId" clearable size="small" placeholder="请选择" class="selWidth">
              <el-option v-for="item in merchantType" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="商户搜索：">
            <el-input
              v-model.trim="keywords"
              size="small"
              placeholder="请输入商户名称/关键字"
              class="selWidth"
              @keyup.enter.native="getList(1)"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="getList(1)">查询</el-button>
            <el-button size="small" @click="reset()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card mt14" :body-style="{ padding: '0 20px 20px' }" shadow="never" :bordered="false">
      <el-table v-loading="listLoading" :data="tableData.data" size="small" highlight-current-row class="mt20">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="商户姓名：">
                <span>{{ props.row.realName }}</span>
              </el-form-item>
              <el-form-item label="商户类别：">
                <span>{{ props.row.isSelf ? '自营' : '非自营' }}</span>
              </el-form-item>
              <el-form-item label="备注：">
                <span>{{ props.row.remark }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="ID" min-width="60" />
        <el-table-column prop="name" label="商户名称" min-width="150" :show-overflow-tooltip="true" />
        <el-table-column prop="phone" label="联系方式" min-width="130" />
        <el-table-column prop="createTime" label="申请时间" min-width="150" />
        <el-table-column label="状态" min-width="150">
          <template slot-scope="scope">
            <el-tag class="endTag tag-background" v-if="scope.row.auditStatus == 2" type="success">已通过</el-tag>
            <el-tag class="doingTag tag-background" v-if="scope.row.auditStatus == 1" type="info">未处理</el-tag>
            <el-tag class="notStartTag tag-background" v-if="scope.row.auditStatus == 3" type="warning">已拒绝</el-tag>
            <div v-if="scope.row.auditStatus == 3" class="mt10">原因：{{ scope.row.denialReason }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <a
              v-if="scope.row.auditStatus == 1 && checkPermi(['platform:merchant:apply:audit'])"
              @click="onchangeIsShow(scope.row, 'isSHOW')"
              >审核</a
            >
            <el-divider
              v-if="scope.row.auditStatus == 1 && checkPermi(['platform:merchant:apply:audit'])"
              direction="vertical"
            ></el-divider>
            <a @click="onchangeIsShow(scope.row)">详情</a>
            <el-divider direction="vertical"></el-divider>
            <a @click="onEdit(scope.row)" v-hasPermi="['platform:merchant:apply:remark']">备注</a>
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
    <audit-from ref="auditFroms" :merData="merData" :isSHOW="isSHOW" @subSuccess="subSuccess"></audit-from>
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
import { merApplyListApi, merApplyRemarkApi } from '@/api/merchant';
import { mapGetters } from 'vuex';
import auditFrom from './audit';
import { checkPermi } from '@/utils/permission';
import { handleDeleteTable } from '@/libs/public'; // 权限判断函数
export default {
  name: 'MerchantApplication',
  components: { auditFrom },
  data() {
    return {
      props: {
        emitPath: false,
      },
      fromList: this.$constants.fromList,
      statusList: this.$constants.statusList, //筛选状态列表
      isChecked: false,
      listLoading: false,
      tableData: {
        data: [],
        total: 0,
      },
      tableFrom: {
        page: 1,
        limit: 20,
        dateLimit: '',
        auditStatus: '',
        keywords: '',
        categoryId: '',
        typeId: '',
      },
      keywords: '',
      mer_id: this.$route.query.id ? this.$route.query.id : '',
      autoUpdate: true,
      timeVal: [],
      merData: {},
      isSHOW: '',
    };
  },
  computed: {
    ...mapGetters(['merchantClassify', 'merchantType']),
  },
  watch: {
    mer_id(newName, oldName) {
      if (checkPermi(['platform:merchant:apply:page:list'])) this.getList('');
    },
  },
  mounted() {
    if (checkPermi(['platform:merchant:apply:page:list'])) this.getList('');
  },
  methods: {
    checkPermi,
    subSuccess() {
      this.getList('');
    },
    // 选择时间
    selectChange(tab) {
      this.tableFrom.dateLimit = tab;
      this.timeVal = [];
      this.tableFrom.page = 1;
      this.getList('');
    },
    statusChange(tab) {
      this.tableFrom.auditStatus = tab;
      this.tableFrom.page = 1;
      this.getList('');
    },
    // 具体日期
    onchangeTime(e) {
      this.timeVal = e;
      this.tableFrom.dateLimit = this.timeVal ? this.timeVal.join(',') : '';
      this.tableFrom.page = 1;
      this.getList('');
    },
    // 列表
    getList(num) {
      if (!this.merchantClassify.length) this.$store.dispatch('merchant/getMerchantClassify');
      if (!this.merchantType.length) this.$store.dispatch('merchant/getMerchantType');
      this.listLoading = true;
      this.tableFrom.keywords = encodeURIComponent(this.keywords);
      this.tableFrom.page = num ? num : this.tableFrom.page;
      merApplyListApi(this.tableFrom)
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
      this.tableFrom = {
        page: 1,
        limit: 20,
        dateLimit: '',
        auditStatus: '',
        keywords: '',
        categoryId: '',
        typeId: '',
      };
      this.timeVal = [];
      this.keywords = '';
      this.getList();
    },
    pageChange(page) {
      this.tableFrom.page = page;
      this.getList('');
    },
    handleSizeChange(val) {
      this.tableFrom.limit = val;
      this.getList(1);
    },
    // 审核
    onchangeIsShow(row, type) {
      this.merData = row;
      this.isSHOW = type;
      this.$refs.auditFroms.dialogVisible = true;
    },
    // 添加

    // 备注
    onEdit(row) {
      this.$modalPrompt('textarea', '备注', row.remark).then((V) => {
        merApplyRemarkApi({
          id: row.id,
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
    // 删除
    handleDelete(id) {
      this.$modalSure().then(() => {
        intentionDelte(id).then(({ message }) => {
          this.$message.success(message);
          handleDeleteTable(this.tableData.data.length, this.tableFrom);
          this.getList();
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
