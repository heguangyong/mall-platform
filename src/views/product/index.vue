<template>
  <div class="divBox relative">
    <el-card
      :bordered="false"
      shadow="never"
      class="ivu-mt"
      :body-style="{ padding: 0 }"
      v-hasPermi="['platform:product:page:list']"
    >
      <div class="padding-add">
        <el-form inline label-position="right" @submit.native.prevent>
          <el-form-item label="商品搜索：">
            <el-input
              v-model="keywords"
              placeholder="请输入商品名称，关键字"
              class="selWidth"
              size="small"
              clearable
              @keyup.enter.native="handleSeachList"
            ></el-input>
          </el-form-item>
          <el-form-item label="商品分类：">
            <el-cascader
              ref="cascader"
              v-model="tableFrom.categoryId"
              @change="handleSeachList"
              clearable
              :options="merPlatProductClassify"
              :props="categoryProps"
              size="small"
              class="selWidth"
            />
          </el-form-item>
          <el-form-item label="商户类别：">
            <el-select
              v-model="tableFrom.isSelf"
              clearable
              size="small"
              placeholder="请选择"
              class="selWidth"
              @change="handleSeachList"
            >
              <el-option label="自营" :value="1" />
              <el-option label="非自营" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="商户名称：">
            <merchant-name @getMerId="getMerId" :merIdChecked="tableFrom.merId"></merchant-name>
          </el-form-item>
          <el-form-item label="会员商品：">
            <el-select
              v-model="tableFrom.isPaidMember"
              clearable
              size="small"
              placeholder="请选择"
              class="selWidth"
              @change="handleSeachList"
            >
              <el-option label="是" value="true" />
              <el-option label="否" value="false" />
            </el-select>
          </el-form-item>
          <el-form-item label="商品类型：">
            <el-select
              v-model="tableFrom.productType"
              clearable
              size="small"
              placeholder="请选择"
              class="selWidth"
              @change="handleSeachList"
            >
              <el-option v-for="item in productTypeList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="handleSeachList" v-hasPermi="['platform:product:page:list']"
              >查询</el-button
            >
            <el-button size="small" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card mt14" :body-style="{ padding: '0 20px 20px' }" shadow="never" :bordered="false">
      <div class="clearfix" ref="headerBox">
        <el-tabs class="list-tabs mb5" v-model="tableFrom.type" @tab-click="handleSeachList">
          <el-tab-pane
            :label="item.name + '(' + item.count + ')'"
            :name="item.type.toString()"
            v-for="(item, index) in headeNum"
            :key="index"
          />
        </el-tabs>
      </div>
      <div class="acea-row mt5">
        <el-button
          size="small"
          :disabled="!multipleSelection.length"
          @click.native="handlebatchOff()"
          v-if="tableFrom.type === ProductTypeEnum.OnSale && checkPermi(['platform:product:force:down'])"
          >强制下架</el-button
        >
        <el-button
          size="small"
          :disabled="!multipleSelection.length"
          @click.native="handlebatchAudit"
          v-if="tableFrom.type === ProductTypeEnum.Audit && checkPermi(['platform:product:batch:audit'])"
          >批量审核</el-button
        >
        <el-button
          size="small"
          :disabled="!multipleSelection.length"
          @click.native="handleBatchSales()"
          v-if="
            (Number(tableFrom.type) < 4 || Number(tableFrom.type) === 6) &&
            checkPermi(['platform:product:batch:set:virtual:sales'])
          "
          >增加初始销量</el-button
        >
      </div>
      <el-table
        v-loading="listLoading"
        :data="tableData.data"
        style="width: 100%"
        class="mt20 tableSelection"
        size="small"
        :highlight-current-row="true"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          v-if="Number(tableFrom.type) < 3 || tableFrom.type === ProductTypeEnum.Audit"
          key="2"
          type="selection"
          width="55"
        />
        <el-table-column type="expand" width="40">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="商户类别：">
                <span>{{ props.row.isSelf | selfTypeFilter }}</span>
              </el-form-item>
              <el-form-item label="初始销量：">
                <span>{{ props.row.ficti }}</span>
              </el-form-item>

              <el-form-item label="拒绝原因：" v-if="tableFrom.type == 7">
                <span>{{ props.row.reason }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="ID" width="50" v-if="checkedCities.includes('ID')" />
        <el-table-column label="商品图" width="80" v-if="checkedCities.includes('商品图')">
          <template slot-scope="scope">
            <div class="demo-image__preview line-heightOne">
              <el-image :src="scope.row.image" :preview-src-list="[scope.row.image]" />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="商品名称"
          min-width="200"
          v-if="checkedCities.includes('商品名称')"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <div>
              <span class="tags_name" :class="'name' + scope.row.specType">{{
                scope.row.specType ? '[多规格]' : '[单规格]'
              }}</span
              >{{ scope.row.name || '-' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="商品售价" prop="price" min-width="100" v-if="checkedCities.includes('商品售价')">
        </el-table-column>
        <el-table-column
          prop="merchantName"
          label="商户名称"
          v-if="checkedCities.includes('商户名称')"
          min-width="180"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="商户类别" min-width="100" v-if="checkedCities.includes('商户类别')">
          <template slot-scope="scope">
            <span>{{ scope.row.isSelf | selfTypeFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sales" label="销量" v-if="checkedCities.includes('销量')" min-width="100" />
        <el-table-column prop="stock" label="库存" min-width="70" v-if="checkedCities.includes('库存')" />
        <el-table-column label="审核状态" min-width="80" fixed="right" v-if="checkedCities.includes('审核状态')">
          <template slot-scope="scope">
            <span>{{ scope.row.auditStatus | auditStatusFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="190px" fixed="right" :scoped-slot="renderHeader">
          <template slot-scope="scope">
            <a @click="handleAudit(scope.row.id, false)" v-hasPermi="['platform:product:info']">详情</a>
            <template v-if="tableFrom.type === '1'">
              <el-divider direction="vertical"></el-divider>
              <a @click="handlePreview(scope.row.id)">预览</a>
            </template>
            <template v-if="tableFrom.type === '6' && checkPermi(['platform:product:audit'])">
              <el-divider direction="vertical"></el-divider>
              <a @click="handleAudit(scope.row.id, true)">审核</a>
            </template>
            <template v-if="Number(tableFrom.type) < 7 && checkPermi(['platform:product:update'])">
              <el-divider direction="vertical"></el-divider>
              <a @click="handleEdit(scope.row)">编辑</a>
            </template>
            <template v-if="Number(tableFrom.type) < 2 && checkPermi(['platform:product:force:down'])">
              <el-divider direction="vertical"></el-divider>
              <a @click="handleOff(scope.row.id)">下架</a>
            </template>
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
    <div class="card_abs" v-show="card_select_show">
      <template>
        <div class="cell_ht">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"
            >全选</el-checkbox
          >
          <el-button type="text" @click="checkSave()">保存</el-button>
        </div>
        <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="item in columnData" :label="item" :key="item" class="check_cell">{{ item }}</el-checkbox>
        </el-checkbox-group>
      </template>
    </div>
    <!-- 商品详情 -->
    <info-from
      ref="infoFrom"
      :componentKey="componentKey"
      :is-atud="isAtud"
      :is-show="isShow"
      :productId="productId"
      @subSuccess="subSuccess"
      @onCloseInfo="onCloseInfo"
      fromType="product"
      :dialogVisibleInfoData="dialogVisibleInfo"
    />

    <!--预览商品-->
    <div v-if="previewVisible">
      <div class="bg" @click.stop="previewVisible = false" />
      <preview-box v-if="previewVisible" ref="previewBox" :frontDomainUrl="frontDomainUrl" />
    </div>

    <!-- 批量增加销量-->
    <el-dialog title="增加初始销量" :visible.sync="dialogVisible" width="540px" :before-close="handleClose">
      <el-form :model="formData" ref="formData" label-width="100px" class="demo-ruleForm">
        <el-form-item label="增加初始销量：" required>
          <el-input-number v-model.trim="formData.ficti" :min="0" :max="99999"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm('formData')" v-hasPermi="['platform:express:update']"
          >确定</el-button
        >
      </span>
    </el-dialog>

    <batch-audit :idList="checkedIds" ref="refBatchAudit" @subBatchAuditSuccess="subBatchAuditSuccess"></batch-audit>
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
import {
  productLstApi,
  productDeleteApi,
  offShellApi,
  productHeadersApi,
  productExcelApi,
  updateProductApi,
  productBatchVirtualSalesApi,
} from '@/api/product';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
import merchantName from '@/components/merchantName';
import infoFrom from '@/components/productInfo';
import previewBox from './previewBox';
import { mapGetters } from 'vuex';
import Debounce from '@/libs/debounce';
import { ProductTypeEnum } from '@/enums/productEnums';
import BatchAudit from '@/views/product/batchAudit.vue';
import { handleDeleteTable } from '@/libs/public';
import { useProduct } from '@/hooks/use-product';
import product from '@/mixins/product';
const headerName = [
  {
    name: '出售中商品',
    type: 1,
  },
  {
    name: '仓库中商品',
    type: 2,
  },
  {
    name: '待审核商品',
    type: 6,
  },
  {
    name: '审核未通过商品',
    type: 7,
  },
];
const { productTypeList } = useProduct();
export default {
  name: 'ProductList',
  components: { BatchAudit, infoFrom, merchantName, previewBox },
  mixins: [product],
  data() {
    return {
      productTypeList: productTypeList, //商品类型
      componentKey: 0,
      isAtud: false,
      isShow: false,
      productId: 0,
      categoryProps: {
        value: 'id',
        label: 'name',
        children: 'childList',
        expandTrigger: 'hover',
        checkStrictly: false,
        emitPath: false,
        multiple: false,
      },
      props: {
        children: 'child',
        label: 'name',
        value: 'id',
        emitPath: false,
      },
      isShowSeach: true,
      categoryIdData: [],
      headeNum: [],
      listLoading: false,
      tableData: {
        data: [],
        total: 0,
      },
      tableFrom: {
        page: 1,
        limit: 20,
        categoryId: null,
        keywords: '',
        type: '1',
        isSelf: null,
        merId: null,
        isPaidMember: null,
        productType: null,
      },
      keywords: '',
      categoryList: [],
      merCateList: [],
      objectUrl: process.env.VUE_APP_BASE_API,
      dialogVisible: false,
      card_select_show: false,
      checkAll: false,
      checkedCities: ['ID', '商品图', '商品名称', '商品售价', '商户名称', '商户类别', '销量', '库存', '审核状态'],
      columnData: ['ID', '商品图', '商品名称', '商品售价', '商户名称', '商户类别', '销量', '库存', '审核状态'],
      isIndeterminate: true,
      merchantList: [],
      search: {
        limit: 10,
        page: 1,
        keywords: '',
      },
      loading: false,
      totalPage: 0,
      total: 0,
      keyNum: 0,
      multipleSelection: [],
      checkedIds: [],
      previewVisible: false,
      frontDomainUrl: '', // iframe地址
      formData: { ficti: 0, idList: [] },
      //dialogVisibleInfo: false //详情
    };
  },
  mounted() {
    if (checkPermi(['platform:product:tabs:headers'])) this.goodHeade();
    if (!localStorage.getItem('merPlatProductClassify')) this.$store.dispatch('product/getAdminProductClassify');
    if (checkPermi(['platform:product:page:list'])) this.getList(1);
    this.checkedCities = this.$cache.local.has('goods_stroge')
      ? this.$cache.local.getJSON('goods_stroge')
      : this.checkedCities;
  },
  computed: {
    ProductTypeEnum() {
      return ProductTypeEnum;
    },
    ...mapGetters(['merPlatProductClassify', 'frontDomain']),
    heightBoxs: function () {
      this.$nextTick(() => {
        // 页面渲染完成后的回调
        return Number(this.$refs.headerBox.offsetHeight) - Number(document.documentElement.clientHeight);
      });
    },
  },
  methods: {
    checkPermi,
    //搜索
    handleSeachList() {
      this.getList(1);
      this.goodHeade();
    },
    //批量审核
    handlebatchAudit() {
      if (this.multipleSelection.length === 0) return this.$message.warning('请先选择商品');
      this.$refs.refBatchAudit.dialogVisible = true;
    },
    //批量审核提交成功回调
    subBatchAuditSuccess() {
      this.subSuccess();
    },
    //详情关闭
    onCloseInfo() {
      this.dialogVisibleInfo = false;
    },
    //批量增加初始销量
    handleBatchSales() {
      if (this.multipleSelection.length === 0) return this.$message.warning('请先选择商品');
      this.dialogVisible = true;
    },
    /** 提交按钮 */
    submitForm: Debounce(function (formData) {
      this.$refs[formData].validate((valid) => {
        if (valid) {
          this.formData.idList = this.checkedIds;
          productBatchVirtualSalesApi(this.formData).then((response) => {
            this.$modal.msgSuccess('操作成功');
            this.getList(1);
            this.handleClose();
          });
        }
      });
    }),
    handleClose() {
      this.dialogVisible = false;
      this.formData.ficti = 0;
    },
    ishttp(url) {
      return url.indexOf('http://') !== -1 || url.indexOf('https://') !== -1;
    },
    // 预览
    handlePreview(id) {
      this.previewVisible = true;
      this.frontDomainUrl = `${this.$selfUtil.getFrontDomainUrl()}/pages/goods/goods_details/index?id=${id}&mt=0`;
    },
    getMerId(id) {
      this.tableFrom.merId = id;
      this.subSuccess();
    },
    // 批量下架
    handlebatchOff() {
      if (this.multipleSelection.length === 0) return this.$message.warning('请先选择商品');
      this.handleOff(this.checkedIds);
    },
    // 下架
    handleOff(id) {
      this.$modalSure('强制下架吗').then(() => {
        offShellApi({
          ids: id.toString(),
        }).then((res) => {
          this.$message({
            type: 'success',
            message: '提交成功',
          });
          this.subSuccess();
        });
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      const data = [];
      this.multipleSelection.map((item) => {
        data.push(item.id);
      });
      this.checkedIds = data;
    },
    handleEdit(row) {
      if (!row && this.checkedIds.length === 0) return this.$message.warning('请至少选择一个商品');
      const _this = this;
      this.$modalParserFrom(
        '编辑商品',
        '平台商品编辑',
        1,
        { ficti: row.ficti || '0', id: row.id, rank: row.rank },
        function (formValue) {
          _this.submit(formValue, row.id);
        },
        (this.keyNum += 5),
      );
    },
    submit(formValue, id) {
      const data = {
        id: id,
        ficti: formValue.ficti,
        rank: formValue.rank,
      };
      updateProductApi(data)
        .then((res) => {
          this.$message.success('操作成功');
          this.$msgbox.close();
          this.getList(1);
        })
        .catch(() => {
          this.loading = false;
        });
    },
    subSuccess() {
      this.getList(1);
      this.goodHeade();
      this.dialogVisibleInfo = false;
    },
    handleAudit(id, c) {
      //this.getProductInfo(id)
      this.productId = id;
      this.isShow = true;
      this.isAtud = c;
      this.componentKey += 1;
      this.dialogVisibleInfo = true;
      // this.$refs.infoFrom.dialogVisible = true;

      // this.$refs.infoFrom.getProductInfo(id);
    },
    // 导出
    exports() {
      productExcelApi({
        cateId: this.tableFrom.cateId,
        keywords: this.tableFrom.keywords,
        type: this.tableFrom.type,
      }).then((res) => {
        window.location.href = res.fileName;
      });
    },
    // 获取商品表单头数量
    goodHeade() {
      let data = Object.assign({}, this.tableFrom);
      delete data.page;
      delete data.limit;
      delete data.type;
      productHeadersApi(data)
        .then((res) => {
          res.map((item, index) => {
            if (item.type === headerName[index].type) item.name = headerName[index].name;
          });
          this.headeNum = res;
        })
        .catch((res) => {
          this.$message.error(res.message);
        });
    },
    // 列表
    getList(num) {
      this.tableFrom.page = num ? num : this.tableFrom.page;
      this.tableFrom.keywords = encodeURIComponent(this.keywords);
      this.listLoading = true;
      productLstApi(this.tableFrom)
        .then((res) => {
          this.tableData.data = res.list;
          this.tableData.total = res.total;
          this.listLoading = false;
        })
        .catch((res) => {
          this.listLoading = false;
          this.$message.error(res.message);
        });
    },
    reset() {
      this.keywords = '';
      this.tableFrom.categoryId = null;
      this.tableFrom.keywords = null;
      this.tableFrom.isSelf = null;
      this.tableFrom.merId = null;
      this.tableFrom.isPaidMember = null;
      this.tableFrom.productType = null;
      this.getList(1);
      this.goodHeade();
    },
    pageChange(page) {
      this.tableFrom.page = page;
      this.getList();
    },
    handleSizeChange(val) {
      this.tableFrom.limit = val;
      this.getList();
    },
    // 删除
    handleDelete(id, type) {
      this.$modalSure(`删除 id 为 ${id} 的商品`).then(() => {
        const deleteFlag = type == 5 ? 'delete' : 'recycle';
        productDeleteApi(id, deleteFlag).then(() => {
          this.$message.success('删除成功');
          handleDeleteTable(this.tableData.data.length, this.tableFrom);
          this.getList();
          this.goodHeade();
        });
      });
    },
    renderHeader(h) {
      return (
        <p>
          <span style="padding-right:5px;">操作</span>
          <i class="el-icon-setting" onClick={() => this.handleAddItem()}></i>
        </p>
      );
    },
    handleAddItem() {
      if (this.card_select_show) {
        this.$set(this, 'card_select_show', false);
      } else if (!this.card_select_show) {
        this.$set(this, 'card_select_show', true);
      }
    },
    handleCheckAllChange(val) {
      this.checkedCities = val ? this.columnData : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.columnData.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.columnData.length;
    },
    checkSave() {
      this.$set(this, 'card_select_show', false);
      this.$modal.loading('正在保存到本地，请稍候...');
      this.$cache.local.setJSON('goods_stroge', this.checkedCities);
      setTimeout(this.$modal.closeLoading(), 1000);
    },
  },
};
</script>

<style scoped lang="scss">
.tags_name {
  font-size: 12px;
  height: 16px;
  line-height: 16px;
  padding: 0 2px;
  margin-right: 2px;
  &.nametrue {
    color: var(--prev-color-primary);
  }
  &.namefalse {
    color: #ff8a4d;
  }
}
.bg {
  z-index: 100;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.el-table__body {
  width: 100%;
  table-layout: fixed !important;
}

.demo-table-expand {
  ::v-deep label {
    width: 82px;
  }
}

.demo-table-expand {
  ::v-deep .el-form-item__content {
    width: 70%;
  }
}

.seachTiele {
  line-height: 30px;
}

.relative {
  position: relative;
}

.card_abs {
  position: absolute;
  padding-bottom: 15px;
  top: 260px;
  right: 40px;
  width: 200px;
  background: #fff;
  z-index: 99999;
  box-shadow: 0px 0px 14px 0px rgba(0, 0, 0, 0.1);
}

.cell_ht {
  height: 50px;
  padding: 15px 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #eeeeee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.check_cell {
  width: 100%;
  padding: 15px 20px 0;
}

.mt-1 {
  margin-top: 6px;
}

::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #606266;
}
</style>
