<template>
  <div class="divBox">
    <el-card :bordered="false" shadow="never" class="ivu-mt" :body-style="{ padding: 0 }">
      <div class="padding-add">
        <el-form size="small" label-position="right" inline @submit.native.prevent>
          <el-form-item label="商户分类：" prop="categoryId">
            <el-select v-model="tableForm.merchant_type" placeholder="请选择商户分类" clearable class="selWidth">
              <el-option
                v-for="item in merchantClassify"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品搜索：">
            <el-input
              v-model="keywords"
              @keyup.enter.native="getList(1)"
              placeholder="请输入直播商品名称/ID,商户名称,微信直播间id,微信审核单id"
              class="selWidth"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="getList(1)">查询</el-button>
            <el-button size="small" @click="reset()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card mt14" :body-style="{ padding: '0 20px 20px' }" shadow="never" :bordered="false">
      <el-tabs class="list-tabs" v-model="tableForm.reviewStatus" @tab-click="getList(1)">
        <el-tab-pane label="商户创建" name="0" />
        <el-tab-pane label="平台待审核" name="1" />
        <el-tab-pane label="平台审核通过" name="2"></el-tab-pane>
        <el-tab-pane label="平台审核失败" name="3"></el-tab-pane>
        <el-tab-pane label="微信审核失败" name="4" />
        <el-tab-pane label="微信审核成功" name="5" />
      </el-tabs>
      <el-table v-loading="listLoading" :data="tableData.data" size="small" highlight-current-row class="mt5">
        <el-table-column label="ID" width="50" prop="id" />
        <el-table-column label="直播商品ID" min-width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.goodsId | filterEmpty }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" min-width="120" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.name + '/' + scope.row.productId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品图" min-width="60">
          <template slot-scope="scope">
            <div class="demo-image__preview line-heightOne">
              <el-image :src="scope.row.coverImgUrlLocal" :preview-src-list="[scope.row.coverImgUrlLocal]" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="价格类型" min-width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.priceType | priceTypeFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="价格" min-width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.priceType === 1">{{ scope.row.price }}</span>
            <span v-else-if="scope.row.priceType === 1">{{ scope.row.price + '~' + scope.row.price2 }}</span>
            <span v-else>(原){{ scope.row.price }}，(折扣){{ scope.row.price2 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商户名称" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.merName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商户分类" min-width="80">
          <template slot-scope="scope">
            <span class="widths">{{ scope.row.merType | merCategoryFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sort" min-width="60" label="排序" />
        <el-table-column label="审核状态" min-width="110">
          <template slot-scope="scope">
            <el-tooltip
              v-if="scope.row.reviewStatus === 3 || scope.row.reviewStatus === 5"
              class="item"
              effect="dark"
              :content="scope.row.reviewReason"
              placement="top"
            >
              <el-tag class="notStartTag tag-background" v-if="scope.row.reviewStatus === 3">平台审核失败</el-tag>
              <el-tag class="notStartTag tag-background" v-if="scope.row.reviewStatus === 5">微信审核失败</el-tag>
            </el-tooltip>
            <div v-else>
              <el-tag class="doingTag tag-background" v-if="scope.row.reviewStatus === 1">平台待审核</el-tag>
              <el-tag class="endTag tag-background" v-if="scope.row.reviewStatus === 2">平台审核通过</el-tag>
              <el-tag class="endTag tag-background" v-if="scope.row.reviewStatus === 4">微信审核成功</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <template
              v-if="
                scope.row.reviewStatus === 1 &&
                checkPermi(['platform:mp:live:goods:review', 'platform:mp:live:goods:info'])
              "
            >
              <a @click="toExamine(scope.row)">审核 </a>
              <el-divider direction="vertical"></el-divider>
            </template>
            <a v-hasPermi="['platform:mp:live:goods:sort']" @click="handleSort(scope.row.id)">排序 </a>
            <el-divider direction="vertical"></el-divider>
            <a v-hasPermi="['platform:mp:live:goods:delete']" @click="handleDelete(scope.row.id)">删除 </a>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          background
          :page-sizes="[20, 40, 60, 80]"
          :page-size="tableForm.limit"
          :current-page="tableForm.page"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.total"
          @size-change="handleSizeChange"
          @current-change="pageChange"
        />
      </div>
    </el-card>
    <!--审核-->
    <el-drawer
      custom-class="demo-drawer"
      direction="rtl"
      :visible.sync="dialogVisible"
      size="1000px"
      @close="close('ruleForm')"
    >
      <div v-loading="loading">
        <div class="detailHead">
          <div class="acea-row row-between headerBox">
            <div class="full">
              <img class="order_icon" :src="proInfo.coverImgUrlLocal" alt="" />
              <div class="text">
                <div class="title">{{ proInfo.name }}</div>
                <div>
                  <span class="mr20">商品ID：{{ proInfo.productId }}</span>
                </div>
              </div>
            </div>
            <div class="acea-row justify-content">
              <el-button
                v-hasPermi="['platform:mp:live:goods:review']"
                v-debounceClick="
                  () => {
                    onSubmit(3);
                  }
                "
                style="margin-left: 0"
                >{{ loadingBtn ? '提交中 ...' : '审核拒绝' }}
              </el-button>
              <el-button
                type="primary"
                v-hasPermi="['platform:mp:live:goods:review']"
                v-debounceClick="
                  () => {
                    onSubmit(2);
                  }
                "
                >{{ loadingBtn ? '提交中 ...' : '审核通过' }}
              </el-button>
            </div>
          </div>
        </div>
        <div class="detailSection divBox padBox">
          <ul class="list mt-16">
            <li class="item">
              <div class="tips">商户名称：</div>
              <div class="value">{{ proInfo.merName }}</div>
            </li>
            <li class="item">
              <div class="tips">商户分类：</div>
              <div class="value">{{ proInfo.merType | merCategoryFilter }}</div>
            </li>
            <li v-if="proInfo.priceType === 1" class="item">
              <div class="tips">一口价：</div>
              <div class="value">{{ proInfo.price }}</div>
            </li>
            <li v-else class="item">
              <div class="tips">价格区间：</div>
              <div class="value">{{ proInfo.price + '~' + proInfo.price2 }}</div>
            </li>
            <li class="item">
              <div class="tips">审核结果：</div>
              <div class="value">{{ proInfo.reviewStatus | liveReviewStatusFilter }}</div>
            </li>
            <li v-show="proInfo.reviewStatus === 3 || proInfo.reviewStatus === 5" class="item">
              <div class="tips">审核失败原因：</div>
              <div class="value">{{ proInfo.reviewReason }}</div>
            </li>
          </ul>
        </div>
      </div>
    </el-drawer>
    <!--排序-->
    <details-from ref="ProDetail" @getList="getList" />
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
import { liveGoodsListApi, liveGoodsReviewApi, liveGoodsDelApi } from '@/api/marketing';
import detailsFrom from './proDetail';
import { mapGetters } from 'vuex';
import { checkPermi } from '@/utils/permission';
import { handleDeleteTable } from '@/libs/public'; // 权限判断函数
export default {
  name: 'BroadcastProList',
  computed: {
    ...mapGetters(['merchantClassify', 'merchantType']),
  },
  components: { detailsFrom },
  data() {
    return {
      loading: false,
      listLoading: true,
      id: '',
      dialogVisible: false,
      tableData: {
        data: [],
        total: 0,
      },
      keywords: '',
      tableForm: {
        page: 1,
        limit: 20,
        reviewStatus: '',
        keywords: '',
        merchant_type: '',
      },
      liveRoomStatus: '',
      ruleForm: {
        reviewReason: '',
        reviewStatus: 2,
        id: '',
      },
      proInfo: '', //直播商品详情
      loadingBtn: false, //审核按钮
    };
  },
  mounted() {
    if (!this.merchantClassify.length) this.$store.dispatch('merchant/getMerchantClassify');
    if (checkPermi(['platform:mp:live:goods:list'])) this.getList();
  },
  methods: {
    checkPermi,
    close() {
      this.dialogVisible = false;
    },
    //审核拒绝
    cancelForm() {
      this.$modalPrompt('textarea', '拒绝原因').then((V) => {
        this.ruleForm.reviewReason = V;
        this.submit();
      });
    },
    // 审核提交
    onSubmit(type) {
      this.ruleForm.reviewStatus = type;
      if (type === 2) {
        this.$modalSure('审核通过该直播商品吗？').then(() => {
          this.submit();
        });
      } else {
        this.cancelForm();
      }
    },
    submit() {
      this.loadingBtn = true;
      this.ruleForm.id = this.id;
      liveGoodsReviewApi(this.ruleForm)
        .then((res) => {
          this.$message.success('操作成功');
          this.dialogVisible = false;
          this.loadingBtn = false;
          this.getList();
        })
        .catch((res) => {
          this.loadingBtn = false;
        });
    },
    // 排序
    handleSort(id) {
      this.id = id;
      this.$refs.ProDetail.dialogVisible = true;
      this.$refs.ProDetail.isEdit = true;
      this.$refs.ProDetail.getData(id);
    },
    // 删除
    handleDelete(id, idx) {
      this.$modalSure('删除该商品吗？').then(() => {
        liveGoodsDelApi(id).then(() => {
          this.$message.success('删除成功');
          handleDeleteTable(this.tableData.data.length, this.tableForm);
          this.getList('');
        });
      });
    },
    // 列表
    getList(num) {
      this.listLoading = true;
      this.tableForm.page = num ? num : this.tableForm.page;
      this.tableForm.keywords = encodeURIComponent(this.keywords);
      liveGoodsListApi(this.tableForm)
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
      this.tableForm = {
        page: 1,
        limit: 20,
        reviewStatus: '',
        keywords: '',
        merchant_type: '',
      };
      this.getList();
    },
    pageChange(page) {
      this.tableForm.page = page;
      this.getList();
    },
    handleSizeChange(val) {
      this.tableForm.limit = val;
      this.getList();
    },
    // 审核
    toExamine(row) {
      this.loading = true;
      this.proInfo = row;
      this.id = row.id;
      this.dialogVisible = true;
      this.loading = false;
    },
  },
};
</script>

<style scoped lang="scss">
.lang {
  width: 100% !important;
}

.demo-drawer__content {
  padding: 0 30px;
  padding-bottom: 86px;
}

.title {
  margin-bottom: 14px;
  color: #303133;
  font-weight: 500;
  font-size: 14px;
}

.description {
  &-term {
    display: table-cell;
    padding-bottom: 5px;
    line-height: 30px;
    width: 50%;
    font-size: 14px;
    color: #606266;
  }

  ::v-deep .el-divider--horizontal {
    margin: 12px 0 !important;
  }
}

.seachTiele {
  line-height: 35px;
}

.fa {
  color: #0a6aa1;
  display: block;
}

.sheng {
  color: #ff0000;
  display: block;
}
</style>
