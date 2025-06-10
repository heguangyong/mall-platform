<template>
  <div>
    <el-card class="box-card" :bordered="false" shadow="never">
      <div>
        <el-form inline>
          <el-form-item label="类目名称:">
            <el-input v-model.trim="tableFrom.catName" placeholder="类目名称" size="small" class="selWidth" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="search()">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        v-loading="listLoading"
        :data="tableData.data"
        style="width: 100%"
        size="small"
        row-key="value"
        ref="multipleTable"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="" label="类目" min-width="200">
          <template slot-scope="scope">
            <el-popover
              v-if="scope.row.productQualificationType > 0 || scope.row.qualificationType > 0"
              placement="top-start"
              :title="scope.row.thirdCatName"
              width="200"
              trigger="hover"
              :content="scope.row.qualification | filterEmpty"
            >
              <el-link type="info" :underline="false" slot="reference">{{ scope.row.thirdCatName }}</el-link>
            </el-popover>
            <el-link
              v-if="scope.row.productQualificationType === 0 && scope.row.qualificationType === 0"
              type="info"
              :underline="false"
              slot="reference"
              >{{ scope.row.thirdCatName }}</el-link
            >
            <span> < {{ scope.row.secondCatName }} < {{ scope.row.firstCatName }} </span>
          </template>
        </el-table-column>
        <el-table-column label="类目资质" prop="">
          <template slot-scope="scope">
            <el-link type="success" :underline="false" v-if="scope.row.qualificationType === 0">不需要</el-link>
            <el-link type="warning" :underline="false" v-if="scope.row.qualificationType === 1">选填</el-link>
            <el-link type="danger" :underline="false" v-if="scope.row.qualificationType === 2">必须</el-link>
          </template>
        </el-table-column>
        <el-table-column label="商品资质" prop="">
          <template slot-scope="scope">
            <el-link type="success" :underline="false" v-if="scope.row.productQualificationType === 0">不需要</el-link>
            <el-link type="warning" :underline="false" v-if="scope.row.productQualificationType === 1">选填</el-link>
            <el-link type="danger" :underline="false" v-if="scope.row.productQualificationType === 2">必须</el-link>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.productQualificationType === 0 && scope.row.qualificationType === 0">-</span>
            <span v-else-if="scope.row.status === 0"> 待提审 </span>
            <span v-else-if="scope.row.status === 1"> 微信审核中 </span>
            <span v-else-if="scope.row.status === 2"> 微信审核失败 </span>
            <span v-else-if="scope.row.status === 3"> 微信审核成功 </span>
          </template>
        </el-table-column>
        <el-table-column label="审核时间" prop="auditTime">
          <template slot-scope="scope">
            {{ scope.row.auditTime | filterEmpty }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-if="
                (scope.row.productQualificationType > 0 || scope.row.qualificationType > 0) &&
                scope.row.status < 1 &&
                checkPermi(['platform:pay:component:shop:category:audit'])
              "
              size="small"
              type="text"
              @click="handleAudit(scope.row, true)"
              >上传资质</el-button
            >
            <el-button
              v-else-if="
                scope.row.status === 3 &&
                (scope.row.productQualificationType > 0 || scope.row.qualificationType > 0) &&
                checkPermi(['platform:pay:component:certificate'])
              "
              size="small"
              type="text"
              @click="handleAudit(scope.row.id, false)"
              >查看资质</el-button
            >
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="block mb20">
        <el-pagination
          background
          :page-sizes="[20, 40, 60, 80]"
          :page-size="tableData.data.limit"
          :current-page="tableFrom.page"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.total"
          @size-change="handleSizeChange"
          @current-change="pageChange"
        />
      </div>
      <!--      上传类目审核资质-->
      <el-dialog
        :title="forSubmitAuditCat.dialog.title"
        :visible="forSubmitAuditCat.dialog.visible"
        @close="forSubmitAuditCat.dialog.visible = false"
        destroy-on-close
        :close-on-click-modal="false"
      >
        <submit-cat-audit
          :catTitle="forSubmitAuditCat.catTitle"
          :params="forSubmitAuditCat.params"
          @closeDia="forSubmitAuditCat.dialog.visible = false"
          @auditSuccess="forSubmitAuditCatSuccess()"
        ></submit-cat-audit>
      </el-dialog>
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
import { catListApi, videoDelApi, videoUpApi, videoDownApi } from '@/api/videoChannel';
import SubmitCatAudit from '@/views/videoChannel/weChatcategoryAndBrand/submitCatAudit';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
export default {
  name: 'categoryList',
  components: { SubmitCatAudit },
  data() {
    return {
      listLoading: false,
      tableData: {
        // 列表数据对象
        data: [],
        total: 0,
      },
      tableFrom: {
        // 列表参数
        page: 1,
        limit: 20,
        catName: null, // 类目名称
      },
      forSubmitAuditCat: {
        dialog: {
          title: '上传微信类目资质',
          visible: false,
        },
        catTitle: null, // 当前选择的三级目录
        params: {
          audit_req: {
            category_info: {
              certificate: [], //证件素材地址
              level1: null,
              level2: null,
              level3: null,
            },
            license: '',
            scene_group_list: [1], // 类目使用场景,1:视频号 ，3:订单中心（非视频号订单中心，未明确开通此场景的商家请勿传值）。 组件开通流程中以及未接入场景时，请保持为空"scene_group_list":[]
          },
        },
      },
    };
  },
  mounted() {
    if (checkPermi(['platform:pay:component:cat:list'])) this.search();
  },
  methods: {
    checkPermi,
    search() {
      this.tableFrom.page = 1;
      this.tableFrom.limit = 20;
      this.getList(this.tableFrom);
    },
    // 列表
    getList(tablefrom) {
      this.listLoading = true;
      catListApi(tablefrom)
        .then((res) => {
          this.tableData.data = res.list;
          this.tableData.total = res.total;
          this.listLoading = false;
        })
        .catch((res) => {
          this.listLoading = false;
        });
    },
    pageChange(page) {
      this.tableFrom.page = page;
      this.getList(this.tableFrom);
    },
    handleSizeChange(val) {
      this.tableFrom.limit = val;
      this.getList(this.tableFrom);
    },
    handleAudit(row) {
      this.forSubmitAuditCat.catTitle = row.firstCatName + ' > ' + row.secondCatName + ' > ' + row.thirdCatName;
      this.forSubmitAuditCat.params.audit_req.category_info.level1 = row.firstCatId;
      this.forSubmitAuditCat.params.audit_req.category_info.level2 = row.secondCatId;
      this.forSubmitAuditCat.params.audit_req.category_info.level3 = row.thirdCatId;
      this.forSubmitAuditCat.dialog.title = '上传类目资质';
      this.forSubmitAuditCat.dialog.visible = true;
    },
    forSubmitAuditCatSuccess() {
      this.forSubmitAuditCat.dialog.visible = false;
      this.getList(this.tableFrom);
    },
  },
};
</script>

<style scoped></style>
