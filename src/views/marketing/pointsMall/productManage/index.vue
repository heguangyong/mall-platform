<template>
  <div class="divBox relative">
    <el-card
      v-if="checkPermi(['platform:integral:product:page'])"
      :bordered="false"
      shadow="never"
      class="ivu-mt"
      :body-style="{ padding: 0 }"
    >
      <div class="padding-add">
        <el-form inline size="small" label-position="right" @submit.native.prevent>
          <el-form-item label="商品搜索：">
            <el-input
              v-model.trim="keywords"
              placeholder="请输入商品名称关键字"
              class="form_content_width"
              size="small"
              @keyup.enter.native="handleSeachList"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="创建日期：">
            <el-date-picker
              v-model="timeVal"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              size="small"
              type="daterange"
              placement="bottom-end"
              placeholder="自定义时间"
              class="selWidth"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="onchangeTime"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="handleSeachList">查询</el-button>
            <el-button size="small" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card mt14" :body-style="{ padding: '0 20px 20px' }" shadow="never" :bordered="false">
      <div class="clearfix" ref="headerBox" v-if="checkPermi(['platform:integral:product:page'])">
        <el-tabs class="list-tabs mb5" v-model="tableFrom.isShow" @tab-click="handleSeachList">
          <el-tab-pane
            :label="item.name + '(' + item.count + ')'"
            :name="item.type"
            v-for="(item, index) in headeNum"
            :key="index"
          />
        </el-tabs>
      </div>
      <el-button size="small" type="primary" v-hasPermi="['platform:integral:product:save']" @click="handleAdd('isAdd')"
        >添加商品</el-button
      >
      <el-button
        size="small"
        v-hasPermi="['platform:integral:product:save', 'platform:product:marketing:search:page']"
        @click="handleQuickAdd('isAdd')"
        >快速添加</el-button
      >
      <el-table
        v-loading="listLoading"
        :data="tableData.data"
        style="width: 100%"
        size="small"
        class="mt20"
        :highlight-current-row="true"
        highlight-current-row
      >
        <el-table-column prop="id" label="ID" min-width="50" />
        <el-table-column label="商品图" min-width="80">
          <template slot-scope="scope">
            <div class="demo-image__preview line-heightOne">
              <el-image :src="scope.row.image" :preview-src-list="[scope.row.image]" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" min-width="200" :show-overflow-tooltip="true"> </el-table-column>
        <el-table-column prop="redeemIntegral" label="兑换积分" min-width="90" />
        <el-table-column prop="price" label="兑换金额（元）" min-width="130" />
        <el-table-column prop="sales" label="已兑换数" min-width="90" />
        <el-table-column prop="stock" label="剩余库存" min-width="90" />
        <el-table-column prop="sort" label="排序" min-width="90" />
        <el-table-column prop="createTime" label="创建时间" min-width="130" />
        <el-table-column label="状态" min-width="80" fixed="right">
          <template slot-scope="scope">
            <el-switch
              v-if="checkPermi(['platform:integral:product:update:show'])"
              v-model="scope.row.isShow"
              :active-value="true"
              :inactive-value="false"
              active-text="上架"
              inactive-text="下架"
              @change="onchangeIsShow(scope.row)"
            />
            <div v-else>{{ scope.row.isShow ? '上架' : '下架' }}</div>
          </template>
        </el-table-column>
        <el-table-column width="190" fixed="right" label="操作">
          <template slot-scope="scope">
            <!--id:商品id，isDisabled：是否能编辑(noEdit不能，edit能)，isChoose：是否是选择商品(choose是，noChoose不是)-->
            <template v-if="checkPermi(['platform:integral:product:detail'])">
              <a @click="handleView(scope.row.id)">详情</a>
            </template>
            <template v-if="checkPermi(['platform:integral:product:update'])">
              <el-divider direction="vertical"></el-divider>
              <a @click="onEdit(scope.row,'edit')">编辑</a>
            </template>
            <template v-if="checkPermi(['platform:integral:product:save'])">
              <el-divider direction="vertical"></el-divider>
              <a @click="onEdit(scope.row, 'copy')">复制</a>
            </template>
            <template v-if="checkPermi(['platform:integral:product:delete'])">
              <el-divider direction="vertical"></el-divider>
              <a @click="handleDelete(scope.row.id, tableFrom.type)">删除</a>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          background
          :page-sizes="$constants.page.limit"
          :page-size="tableFrom.limit"
          :current-page="tableFrom.page"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.total"
          @size-change="handleSizeChange"
          @current-change="pageChange"
        />
      </div>
    </el-card>

    <!-- 商品详情 -->
    <info-from
      ref="infoFrom"
      :componentKey="componentKey"
      :is-atud="false"
      :is-show="isShow"
      :productId="productId"
      @onCloseInfo="onCloseInfo"
      fromType="pointsMall"
      :dialogVisibleInfoData="dialogVisibleInfo"
    />
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

import { productLstApi, productDeleteApi, putOnShellApi, offShellApi, productHeadersApi } from '@/api/pointsMall';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
import * as $constants from '@/utils/constants';
import { handleDeleteTable } from '@/libs/public';
import infoFrom from '@/components/productInfo';
import BatchAudit from '@/views/product/batchAudit';
import merchantName from '@/components/merchantName';
import previewBox from '@/views/product/previewBox';
import product from '@/mixins/product';
const objTitle = ['已上架', '未上架'];
const tableFroms = {
  page: 1,
  limit: $constants.page.limit[0],
  keywords: '',
  dateLimit: '',
  isShow: '1',
};
export default {
  name: 'ProductList',
  components: { infoFrom },
  mixins: [product],
  data() {
    return {
      drawer: false,
      direction: 'rtl',
      headeNum: [],
      timeVal: [],
      listLoading: false,
      tableData: {
        data: [],
        total: 0,
      },
      tableFrom: Object.assign({}, tableFroms),
      keywords: '',
      checkAll: false,
      isIndeterminate: true,
      componentKey: 0,
      isShow: false,
      productId: 0,
      multipleSelectionAll: [],
      checkedIds: [], //选中的id
      loadingBtn: false,
      dialogVisible: false,
      keyNum: 0,
      couponIds: [], //优惠券集合
      productInfo: null, //商品详情
      productType: 0, //商品类型
      isSub: false, //佣金设置是否单独设置
      addType: 'isAdd',
    };
  },
  computed: {},
  activated() {
    this.handleSeachList();
  },
  mounted() {
    if (checkPermi(['platform:integral:product:tabs:headers'])) this.goodHeade();
    if (checkPermi(['platform:integral:product:page'])) this.getList();
  },
  methods: {
    checkPermi,
    // 查看详情
    handleView(id) {
      this.productId = id;
      this.isShow = true;
      this.componentKey += 1;
      this.dialogVisibleInfo = true;
    },
    // 具体日期
    onchangeTime(e) {
      this.timeVal = e;
      this.tableFrom.dateLimit = e ? this.timeVal.join(',') : '';
      this.tableFrom.page = 1;
      this.handleSeachList();
    },
    // 删除成功
    delSuccess() {
      handleDeleteTable(this.tableData.data.length, this.tableFrom);
      this.getList();
    },
    //快速添加
    handleQuickAdd() {
      const _this = this;
      this.$modalGoodList(function (row) {
        //id:商品id，isDisabled：是否能编辑(noEdit不能，edit能)，isChoose：是否是选择商品(choose是，noChoose不是)
        _this.$router.push({ path: `/marketing/pointsMall/productManage/creatProduct/${row.id}/edit/choose` });
      }, '');
    },
    //添加商品
    handleAdd() {
      //id:商品id，isDisabled：是否能编辑(noEdit不能，edit能)，isChoose：是否是选择商品(choose是，noChoose不是)
      this.$router.push({ path: `/marketing/pointsMall/productManage/creatProduct/0/edit/noChoose` });
    },
    //编辑商品
    onEdit(row, copy) {
      //id:商品id，isDisabled：是否能编辑(noEdit不能，edit能)，isChoose：是否是选择商品(choose是，noChoose不是)
      if (this.tableFrom.type === '1') {
        this.$modalSure('下架该商品吗？出售商品需下架之后可编辑。').then(() => {
          offShellApi(row.id).then(() => {
            this.$router.push({
              path: `/marketing/pointsMall/productManage/creatProduct/${row.id}/edit/noChoose/${copy}`,
            });
          });
        });
      } else {
        this.$router.push({ path: `/marketing/pointsMall/productManage/creatProduct/${row.id}/edit/noChoose/${copy}` });
      }
    },
    handleCloseEdit() {
      this.drawer = false;
    },
    handleSeachList() {
      this.getList(1);
      this.goodHeade();
    },
    //重置
    handleReset() {
      this.tableFrom.keywords = '';
      this.tableFrom.dateLimit = '';
      this.keywords = '';
      this.timeVal = [];
      this.handleSeachList();
    },
    // 获取商品表单头数量
    goodHeade() {
      let data = Object.assign({}, this.tableFrom);
      delete data.page;
      delete data.limit;
      productHeadersApi(data).then((res) => {
        this.headeNum = [
          {
            name: objTitle[0],
            type: '1',
            count: res.upNum,
          },
          {
            name: objTitle[1],
            type: '0',
            count: res.downNum,
          },
        ];
      });
    },
    // 列表
    getList(num) {
      this.listLoading = true;
      this.tableFrom.page = num ? num : this.tableFrom.page;
      this.tableFrom.keywords = encodeURIComponent(this.keywords);
      productLstApi(this.tableFrom)
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
      this.getList();
    },
    handleSizeChange(val) {
      this.tableFrom.limit = val;
      this.getList();
    },
    //详情
    handleInfo(id, type) {
      this.$router.push({ path: `/product/list/creatProduct/${id}/2/2/${type}` });
    },
    // 删除
    handleDelete(id, type) {
      this.$modalSure(`删除 id 为 ${id} 的积分商品`).then(() => {
        productDeleteApi(id).then(() => {
          this.$message.success('删除成功');
          this.delSuccess();
        });
      });
    },
    //上下架
    onchangeIsShow(row) {
      putOnShellApi(row.id)
        .then(() => {
          this.$message.success('操作成功');
          this.getList();
          this.goodHeade();
        })
        .catch(() => {
          row.isShow = !row.isShow;
        });
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
  &.namefalse {
    color: var(--prev-color-primary);
  }
  &.nametrue {
    color: #ff8a4d;
  }
}
::v-deep .el-table__cell:nth-child(2) .cell {
  padding-left: 14px;
  padding-right: 14px;
}
.infoItem {
  ::v-deep a {
    color: #606266 !important;
  }
}
.el-table__body {
  width: 100%;
  table-layout: fixed !important;
}
.taoBaoModal {
  //  z-index: 3333 !important;
}
.demo-table-expand {
  ::v-deep label {
    width: 82px;
  }
}
.demo-table-expand {
  ::v-deep .el-form-item__content {
    width: 77%;
  }
}
.seachTiele {
  line-height: 30px;
}
.relative {
  position: relative;
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
::v-deep .el-drawer__header {
  font-size: 20px;
}
::v-deep .el-drawer__close-btn {
  font-size: 20px;
}
::v-deep .el-dialog__footer {
  padding: 0 24px 20px !important;
}
</style>
