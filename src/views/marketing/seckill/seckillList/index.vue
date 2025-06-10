<template>
  <div class="divBox relative">
    <el-card
      :bordered="false"
      shadow="never"
      class="ivu-mt"
      :body-style="{ padding: 0 }"
      v-hasPermi="['platform:seckill:product:list']"
    >
      <div class="padding-add">
        <el-form size="small" label-position="right" inline @submit.native.prevent>
          <el-form-item label="商品名称：">
            <el-input v-model="proName" placeholder="请输入商品名称" class="selWidth" clearable></el-input>
          </el-form-item>
          <el-form-item label="活动名称：">
            <el-input v-model="activityName" placeholder="请输入活动名称" class="selWidth" clearable></el-input>
          </el-form-item>
          <el-form-item label="商品状态：" class="inline">
            <el-select v-model="tableFrom.proStatus" clearable placeholder="请选择" class="selWidth">
              <el-option label="上架" :value="1" />
              <el-option label="下架" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="活动状态：" class="inline">
            <el-select v-model="tableFrom.activityStatus" clearable placeholder="请选择" class="selWidth">
              <el-option label="进行中" :value="1" />
              <el-option label="已结束" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="商户名称：">
            <merchant-name @getMerId="getMerId" :merIdChecked="merIds"></merchant-name>
          </el-form-item>
          <el-form-item label="商户星级：" class="inline">
            <el-select v-model="tableFrom.merStars" clearable placeholder="请选择" class="selWidth">
              <el-option label="一星以上" :value="1" />
              <el-option label="二星以上" :value="2" />
              <el-option label="三星以上" :value="3" />
              <el-option label="四星以上" :value="4" />
              <el-option label="五星以上" :value="5" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="getList(1)">查询</el-button>
            <el-button size="small" @click="reset('tableFrom')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card mt14" :body-style="{ padding: '0 20px 20px' }" shadow="never" :bordered="false">
      <el-tabs class="list-tabs" v-model="tableFrom.auditStatus" @tab-click="getList(1)">
        <el-tab-pane :label="item.name" :name="item.type" v-for="(item, index) in headeNum" :key="index" />
      </el-tabs>
      <div class="acea-row mt5">
        <el-button
          v-hasPermi="['platform:seckill:product:delete']"
          size="small"
          @click="batchDel"
          :disabled="!multipleSelection.length"
          >批量删除</el-button
        >
        <el-button
          v-if="tableFrom.auditStatus === '2' && checkPermi(['platform:seckill:product:down'])"
          size="small"
          @click="batchDown"
          :disabled="!multipleSelection.length"
          >批量下架</el-button
        >
      </div>
      <el-table
        v-loading="listLoading"
        :data="tableData.data"
        size="small"
        ref="multipleTable"
        row-key="id"
        @selection-change="handleSelectionChange"
        class="mt20 tableSelection"
      >
        <el-table-column type="selection" :reserve-selection="true" width="45"></el-table-column>
        <el-table-column prop="id" label="ID" min-width="45" />
        <el-table-column label="商品图" min-width="80">
          <template slot-scope="scope">
            <div class="demo-image__preview line-heightOne">
              <el-image :src="scope.row.image" :preview-src-list="[scope.row.image]" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" prop="name" min-width="180" :show-overflow-tooltip="true"> </el-table-column>
        <el-table-column prop="categoryName" label="商品分类" min-width="100" />
        <el-table-column prop="merName" :show-overflow-tooltip="true" label="商户名称" min-width="130" />
        <el-table-column prop="activityName" label="活动名称" min-width="150" :show-overflow-tooltip="true" />
        <el-table-column prop="price" label="商品售价" min-width="90" />
        <el-table-column prop="seckillPrice" label="活动价" min-width="90" />
        <el-table-column label="商户星级" min-width="140">
          <template slot-scope="scope">
            <el-rate disabled v-model="scope.row.merStarLevel"></el-rate>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" min-width="60" />
        <el-table-column label="商品状态" fixed="right" min-width="70">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isShow">上架</el-tag>
            <el-tag v-else>下架</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="活动状态" fixed="right" min-width="90">
          <template slot-scope="scope">
            <el-tag class="notStartTag tag-background" v-if="scope.row.activityStatus === 0">未开始</el-tag>
            <el-tag class="doingTag tag-background" v-if="scope.row.activityStatus === 1">进行中</el-tag>
            <el-tag class="endTag tag-background" v-if="scope.row.activityStatus === 2">已结束</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" fixed="right" min-width="90">
          <template slot-scope="scope">
            <el-tag class="doingTag tag-background" v-if="scope.row.auditStatus === 1">待审核</el-tag>
            <el-tag class="endTag tag-background" v-if="scope.row.auditStatus === 2">审核成功</el-tag>
            <el-tag class="notStartTag tag-background" v-if="scope.row.auditStatus === 3">审核失败</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          v-if="tableFrom.auditStatus === '3'"
          prop="reason"
          label="失败原因"
          fixed="right"
          min-width="120"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="操作" width="190" fixed="right">
          <template slot-scope="scope">
            <a v-if="checkPermi(['platform:seckill:product:list'])" @click="handleAudit(scope.row, 2)">详情</a>
            <el-divider direction="vertical"></el-divider>
            <template v-if="tableFrom.auditStatus === '2' && checkPermi(['platform:seckill:product:list'])">
              <a @click="handleAudit(scope.row, 3)">编辑</a>
              <el-divider direction="vertical"></el-divider>
            </template>
            <template v-if="tableFrom.auditStatus === '1' && checkPermi(['platform:seckill:time:interval:delete'])">
              <a @click="handleAudit(scope.row, 1)">审核</a>
              <el-divider direction="vertical"></el-divider>
            </template>
            <template
              v-if="tableFrom.auditStatus === '2' && scope.row.isShow && checkPermi(['platform:seckill:product:down'])"
            >
              <a @click="handleDown(scope.row)">下架</a>
              <el-divider direction="vertical"></el-divider>
            </template>
            <template v-if="checkPermi(['platform:seckill:product:delete'])">
              <a @click="handleDelete(scope.row)">删除</a>
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

    <!--秒杀商品 审核 详情-->
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
              <img class="order_icon" :src="seckillInfo.image" alt="" />
              <div class="text">
                <div class="title">{{ seckillInfo.name }}</div>
                <div>
                  <span class="mr20">商品ID：{{ seckillInfo.id }}</span>
                </div>
              </div>
            </div>
            <div v-if="isShow === 1" class="acea-row justify-content">
              <el-button
                v-hasPermi="['platform:seckill:product:audit']"
                v-debounceClick="
                  () => {
                    onSubmit('fail');
                  }
                "
                style="margin-left: 0"
                >{{ loadingBtn ? '提交中 ...' : '审核拒绝' }}</el-button
              >
              <el-button
                type="primary"
                v-hasPermi="['platform:seckill:product:audit']"
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
        <div class="detailSection padBox">
          <div class="title">活动信息</div>
          <ul class="list">
            <li class="item">
              <div class="tips">活动名称：</div>
              <div class="value">{{ seckillInfo.activityName }}</div>
            </li>
            <li class="item">
              <div class="tips">活动状态：</div>
              <div class="value color-warning">{{ seckillInfo.activityStatus | activityStatusFilter }}</div>
            </li>
            <li class="item">
              <div class="tips">审核状态：</div>
              <div class="value color-warning">
                {{ seckillInfo.auditStatus == 1 ? '待审核' : seckillInfo.auditStatus == 2 ? '审核通过' : '审核失败' }}
              </div>
            </li>
            <li class="item">
              <div class="tips">商品分类：</div>
              <div class="value">{{ seckillInfo.categoryName }}</div>
            </li>
          </ul>
        </div>
        <div class="detailSection padBox">
          <div class="title">商户信息</div>
          <ul class="list">
            <li class="item">
              <div class="tips">商户名称：</div>
              <div class="value">{{ seckillInfo.merName }}</div>
            </li>
            <li class="item">
              <div class="tips">商户星级：</div>
              <div class="value">
                <el-rate disabled v-model="seckillInfo.merStarLevel" style="margin-top: -3px"></el-rate>
              </div>
            </li>
          </ul>
        </div>
        <div class="detailSection padBox">
          <div class="title">商品信息</div>
          <div class="value w100">
            <el-table
              ref="tableList"
              row-key="id"
              :data="seckillInfo.attrValue"
              v-loading="listLoading"
              size="mini"
              border
              default-expand-all
              :tree-props="{ children: 'children' }"
              style="width: 100%"
            >
              <el-table-column min-width="140" label="商品信息">
                <template slot-scope="scope">
                  <div class="acea-row">
                    <div class="demo-image__preview mr10 line-heightOne">
                      <el-image :src="scope.row.image" :preview-src-list="[scope.row.image]" />
                    </div>
                    <div class="row_title line2">{{ scope.row.sku }}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="otPrice" label="售价" width="120" />
              <el-table-column prop="quotaShow" label="限量" width="80" />
              <el-table-column prop="quota" label="限量剩余" width="120" />
              <el-table-column prop="price" label="活动价格" min-width="120">
                <template slot-scope="scope">
                  <el-input-number
                    :disabled="isShow < 3"
                    v-model="scope.row.price"
                    type="number"
                    :precision="2"
                    :min="0"
                    :max="99999"
                    :controls="false"
                    class="input_width"
                  >
                  </el-input-number>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-show="isShow === 3" class="mt20 acea-row justify-content">
            <el-button
              size="small"
              type="primary"
              @click="setPrice(seckillInfo.id, seckillInfo.attrValue)"
              v-hasPermi="['platform:seckill:product:price']"
              >保存活动价</el-button
            >
          </div>
        </div>
      </div>
      <!--      <div slot="title">-->
      <!--        {{ isShow === 1 ? '审核秒杀商品' : isShow === 3 ? '秒杀商品编辑' : '秒杀商品详情' }}-->
      <!--      </div>-->
    </el-drawer>
  </div>
</template>

<script>
import {
  seckillProListApi,
  seckillProSetPriceApi,
  seckillProDelApi,
  seckillProDownApi,
  seckillProAuditApi,
} from '@/api/marketing';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
import merchantName from '@/components/merUseCategory';
import { handleDeleteTable } from '@/libs/public';
export default {
  name: 'SeckillList',
  components: {
    merchantName,
  },
  data() {
    return {
      orderImg: require('@/assets/imgs/order_icon.png'),
      isShow: 0, //1审核，2查看，3编辑
      loading: false,
      listLoading: false,
      tableData: {
        data: [],
        total: 0,
      },
      proName: '',
      activityName: '',
      tableFrom: {
        page: 1,
        limit: 20,
        proName: '',
        activityName: '',
        merStars: null,
        auditStatus: '2',
        merIds: '',
        activityStatus: '',
        proStatus: '',
      },
      headeNum: [
        {
          name: '审核成功',
          type: '2',
        },
        {
          name: '待审核',
          type: '1',
        },
        {
          name: '审核失败',
          type: '3',
        },
      ],
      multipleSelection: [],
      ruleForm: {
        reason: '',
        auditStatus: 'success',
        id: '',
      },
      rules: {
        auditStatus: [{ required: true, message: '请选择审核状态', trigger: 'change' }],
        reason: [{ required: true, message: '请填写拒绝原因', trigger: 'blur' }],
      },
      dialogVisible: false,
      loadingBtn: false,
      id: '', //秒杀商品id
      merIds: [], //商户id
      seckillInfo: {},
    };
  },
  mounted() {
    if (checkPermi(['platform:user:tag:list'])) this.getList(1);
    if (!localStorage.getItem('merPlatProductClassify')) this.$store.dispatch('product/getAdminProductClassify');
  },
  methods: {
    checkPermi,
    handleAudit(row, n) {
      this.id = row.id;
      this.isShow = n;
      this.dialogVisible = true;
      this.seckillInfo = row;
    },
    close(refName) {
      this.dialogVisible = false;
      if (this.$refs[refName]) {
        this.$refs[refName].resetFields();
      }
    },
    reset(formName) {
      this.proName = '';
      this.activityName = '';
      this.merIds = [];
      this.tableFrom.proName = '';
      this.tableFrom.activityName = '';
      this.tableFrom.merStars = null;
      this.tableFrom.merIds = null;
      this.tableFrom.proName = '';
      this.tableFrom.activityStatus = '';
      this.tableFrom.proStatus = '';
      this.getList(1);
    },
    //审核拒绝
    cancelForm() {
      this.$modalPrompt('textarea', '拒绝原因').then((V) => {
        this.ruleForm.reason = V;
        this.submit();
      });
    },
    // 审核提交
    onSubmit(type) {
      this.ruleForm.auditStatus = type;
      if (type === 'success') {
        this.$modalSure('审核通过该秒杀商品吗？').then(() => {
          this.submit();
        });
      } else {
        this.cancelForm();
      }
    },
    submit() {
      this.loadingBtn = true;
      this.ruleForm.id = this.id;
      seckillProAuditApi(this.ruleForm)
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
    //表格选中
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getMerId(id) {
      this.merIds = id;
      this.tableFrom.merIds = id.toString();
      this.getList();
    },
    // 列表
    getList(num) {
      this.tableFrom.page = num ? num : this.tableFrom.page;
      this.tableFrom.activityName = encodeURIComponent(this.activityName);
      this.tableFrom.proName = encodeURIComponent(this.proName);
      this.listLoading = true;
      seckillProListApi(this.tableFrom)
        .then((res) => {
          this.tableData.data = res.list;
          this.tableData.total = res.total;
          this.listLoading = false;
        })
        .catch((res) => {
          this.listLoading = false;
        });
    },
    //批量删除
    batchDel() {
      let ids = this.multipleSelection.map((item) => item.id).toString();
      this.$modalSure('批量删除秒杀商品吗？').then(() => {
        seckillProDelApi({ ids: ids }).then(() => {
          this.$message.success('删除成功');
          this.getList();
        });
      });
    },
    // 删除
    handleDelete(row) {
      this.$modalSure('删除该秒杀商品吗？').then(() => {
        seckillProDelApi({ ids: row.id }).then(() => {
          this.$message.success('删除成功');
          handleDeleteTable(this.tableData.data.length, this.tableFrom);
          this.getList();
        });
      });
    },
    //批量下架
    batchDown() {
      let ids = this.multipleSelection.map((item) => item.id).toString();
      this.$modalSure('批量下架秒杀商品吗？').then(() => {
        seckillProDownApi({ ids: ids }).then(() => {
          this.$message.success('下架成功');
          this.getList();
        });
      });
    },
    //下架
    handleDown(row) {
      this.$modalSure('下架该秒杀商品吗？').then(() => {
        seckillProDownApi({ ids: row.id }).then(() => {
          this.$message.success('下架成功');
          this.getList();
        });
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
    //编辑价格
    setPrice(id, row) {
      let productList = {
        productList: [
          {
            attrValue: row.map((item) => {
              return {
                activityPrice: item.price,
                id: item.id,
              };
            }),
            id: id,
          },
        ],
      };
      seckillProSetPriceApi(productList)
        .then((res) => {
          this.$message.success('保存成功');
          this.getList();
          this.dialogVisible = false;
        })
        .catch((res) => {});
    },
  },
};
</script>

<style lang="scss" scoped>
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
    line-height: 20px;
    width: 50%;
    font-size: 14px;
    color: #606266;
  }
  ::v-deep .el-divider--horizontal {
    margin: 12px 0 !important;
  }
}
</style>
