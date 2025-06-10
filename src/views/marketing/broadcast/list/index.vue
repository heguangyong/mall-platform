<template>
  <div class="divBox">
    <el-card :bordered="false" shadow="never" class="ivu-mt" :body-style="{ padding: 0 }">
      <div class="padding-add">
        <el-form size="small" label-position="right" inline @submit.native.prevent>
          <el-form-item label="商户名称：">
            <merchant-name @getMerId="getMerId" :merIdChecked="merIds"></merchant-name>
          </el-form-item>
          <el-form-item label="商户分类：" class="inline">
            <el-select v-model="tableForm.merType" placeholder="请选择商户分类" size="small" clearable class="selWidth">
              <el-option
                v-for="item in merchantClassify"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="直播状态：">
            <el-select v-model="tableForm.liveStatus" placeholder="请选择" class="selWidth" clearable size="small">
              <el-option v-for="item in studioStatusList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="显示状态：">
            <el-select v-model="tableForm.storeShow" placeholder="请选择" class="selWidth" size="small" clearable>
              <el-option
                v-for="item in studioShowStatusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="推荐级别：">
            <el-select v-model="tableForm.star" placeholder="请选择" class="selWidth" size="small" clearable>
              <el-option
                v-for="item in recommendedLevelStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="直播搜索：" label-width="66px">
            <el-input
              v-model="keywords"
              size="small"
              placeholder="请输入直播间名称/ID/主播昵称/主播微信号/主播副号微信号"
              class="selWidth"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="samll" @click="getList(1)">查询</el-button>
            <el-button size="samll" @click="reset()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card mt14" :body-style="{ padding: '0 20px 20px' }" shadow="never" :bordered="false">
      <el-tabs class="list-tabs" v-model="reviewStatus" @tab-click="getList(1)">
        <el-tab-pane label="全部" name="''" />
        <el-tab-pane label="平台待审核" name="0" />
        <el-tab-pane label="平台审核失败" name="1" />
        <el-tab-pane label="微信审核失败" name="2" />
        <el-tab-pane label="微信审核成功" name="3" />
      </el-tabs>
      <el-table
        v-loading="listLoading"
        :data="tableData.data"
        style="width: 100%"
        size="small"
        highlight-current-row
        class="mt5"
      >
        <el-table-column prop="id" label="ID" width="40" />
        <el-table-column prop="roomName" label="直播间名称" min-width="120" />
        <el-table-column prop="anchorName" label="主播昵称" min-width="90" />
        <el-table-column prop="anchorWechat" label="主播微信号" min-width="100" />
        <el-table-column key="14" label="显示在商城" min-width="100">
          <template slot-scope="scope">
            <el-switch
              v-if="checkPermi(['platform:mp:live:room:showstore'])"
              v-model="scope.row.storeShow"
              :active-value="1"
              :inactive-value="0"
              active-text="显示"
              inactive-text="隐藏"
              @click.native="onchangeStoreShow(scope.row)"
            />
            <div v-else>{{ scope.row.storeShow === 1 ? '显示' : '隐藏' }}</div>
          </template>
        </el-table-column>
        <el-table-column key="15" label="官方收录" min-width="100">
          <template slot-scope="scope">
            <el-switch
              v-if="checkPermi(['platform:mp:live:room:isfeedspubic'])"
              :disabled="scope.row.reviewStatus === 3"
              v-model="scope.row.isFeedsPublic"
              :active-value="1"
              :inactive-value="0"
              active-text="开启"
              inactive-text="关闭"
              @click.native="onchangeIsFeeds(scope.row)"
            />
            <div v-else>{{ scope.row.isFeedsPublic === 1 ? '开启' : '关闭' }}</div>
          </template>
        </el-table-column>
        <el-table-column key="16" label="评论" min-width="100">
          <template slot-scope="scope">
            <el-switch
              v-if="checkPermi(['platform:mp:live:room:updatecomment'])"
              :disabled="scope.row.liveStatus == 101 && scope.row.reviewStatus === 3"
              v-model="scope.row.closeComment"
              :active-value="1"
              :inactive-value="0"
              active-text="开启"
              inactive-text="关闭"
              @click.native="onchangeIsCommen(scope.row)"
            />
            <div v-else>{{ scope.row.closeComment === 1 ? '开启' : '关闭' }}</div>
          </template>
        </el-table-column>
        <el-table-column key="18" label="回放" min-width="100">
          <template slot-scope="scope">
            <el-switch
              v-if="checkPermi(['platform:mp:live:room:updatereplay'])"
              :disabled="scope.row.liveStatus !== 101"
              v-model="scope.row.closeReplay"
              :active-value="1"
              :inactive-value="0"
              active-text="开启"
              inactive-text="关闭"
              @click.native="onchangeCloseReplay(scope.row)"
            />
            <div v-else>{{ scope.row.closeReplay === 1 ? '开启' : '关闭' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="直播状态" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.liveStatus | broadcastStatusFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" min-width="110">
          <template slot-scope="scope">
            <el-tooltip
              v-if="scope.row.reviewStatus === 1 || scope.row.reviewStatus === 2"
              class="item"
              effect="dark"
              :content="scope.row.reviewReason"
              placement="top"
            >
              <el-tag class="notStartTag tag-background" v-if="scope.row.reviewStatus === 1">平台审核失败</el-tag>
              <el-tag class="notStartTag tag-background" v-if="scope.row.reviewStatus === 2">微信审核失败</el-tag>
            </el-tooltip>
            <div v-else>
              <el-tag class="doingTag tag-background" v-if="scope.row.reviewStatus === 0">待审核</el-tag>
              <el-tag class="endTag tag-background" v-if="scope.row.reviewStatus === 3">微信审核成功</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="startTime" min-width="150" label="直播开始时间" />
        <el-table-column prop="endTime" min-width="150" label="直播计划结束时间" />
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <a v-hasPermi="['platform:mp:live:room:list']" @click="onStudioDetails(scope.row, false)">详情</a>
            <el-divider direction="vertical"></el-divider>
            <a
              v-if="scope.row.reviewStatus === 0 && checkPermi(['platform:mp:live:room:review'])"
              @click="onStudioDetails(scope.row, true)"
              >审核</a
            >
            <el-divider direction="vertical"></el-divider>
            <a v-hasPermi="['platform:mp:live:room:delete']" @click="handleDelete(scope.row, scope.$index)">删除</a>
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
    <!-- 审核 详情-->
    <el-drawer
      custom-class="demo-drawer"
      direction="rtl"
      :visible.sync="dialogVisible"
      size="1000px"
      @close="close('ruleForm')"
    >
      <div slot="title" class="demo-drawer_title">直播详情</div>
      <div class="demo-drawer__content" v-loading="loading">
        <div class="description">
          <div class="title">直播间信息</div>
          <div class="acea-row">
            <div class="description-term sp100">
              <label class="name">直播间状态：</label>{{ roomInfo.liveStatus | broadcastStatusFilter }}
            </div>
            <div class="description-term sp100"><label class="name">直播间名称：</label>{{ roomInfo.roomName }}</div>
            <div class="description-term sp100"><label class="name">直播间ID：</label>{{ roomInfo.id }}</div>
            <div class="description-term sp100"><label class="name">主播昵称：</label>{{ roomInfo.anchorName }}</div>
            <!--<div class="description-term sp100"><label class="name">主播手机号：</label>{{ roomInfo.anchorPhone }}</div>-->
            <div class="description-term sp100">
              <label class="name">主播微信号：</label>{{ roomInfo.anchorWechat }}
            </div>
            <div class="description-term sp100">
              <label class="name">主播副号微信号：</label>{{ roomInfo.subAnchorWechat }}
            </div>
            <div class="description-term sp100">
              <label class="name">创建者微信号：</label>{{ roomInfo.activityName }}
            </div>
            <div class="description-term sp100">
              <label class="name">审核结果：</label>{{ roomInfo.reviewStatus | roomReviewStatusFilter }}
            </div>
            <div v-show="roomInfo.reviewStatus === 1 || roomInfo.reviewStatus === 2" class="description-term sp100">
              <label class="name">审核失败原因：</label>{{ roomInfo.reviewReason }}
            </div>
            <div class="description-term sp100"><label class="name">直播开始时间：</label>{{ roomInfo.startTime }}</div>
            <div class="description-term sp100">
              <label class="name">直播预计结束时间：</label>{{ roomInfo.endTime }}
            </div>
            <div class="description-term sp100">
              <label class="name">直播间类型：</label>{{ roomInfo.type === 1 ? '推流' : '手机直播' }}
            </div>
            <div class="description-term sp100">
              <label class="name">直播间点赞：</label>{{ roomInfo.closeLike | roomShowFilter }}
            </div>
            <div class="description-term sp100">
              <label class="name">直播间评论：</label>{{ roomInfo.closeComment | roomShowFilter }}
            </div>
            <div class="description-term sp100">
              <label class="name">直播间货架：</label>{{ roomInfo.closeGoods | roomShowFilter }}
            </div>
            <div class="description-term sp100">
              <label class="name">直播间客服：</label>{{ roomInfo.closeKf | roomShowFilter }}
            </div>
            <div class="description-term sp100">
              <label class="name">直播间回放：</label>{{ roomInfo.closeReplay | roomShowFilter }}
            </div>
            <div class="description-term sp100">
              <label class="name">直播间分享：</label>{{ roomInfo.closeShare | roomShowFilter }}
            </div>
            <div class="description-term sp100">
              <label class="name">直播间官方收录：</label>{{ roomInfo.isFeedsPublic === 1 ? '开启' : '关闭' }}
            </div>
            <div class="description-term sp100">
              <label class="name">背景图：</label>
              <div class="demo-image__preview mr10">
                <el-image
                  style="width: 36px; height: 36px"
                  :src="roomInfo.coverImgLocal"
                  :preview-src-list="[roomInfo.coverImgLocal]"
                />
              </div>
            </div>
            <div class="description-term sp100">
              <label class="name">封面图：</label>
              <div class="demo-image__preview mr10">
                <el-image
                  style="width: 36px; height: 36px"
                  :src="roomInfo.feedsImgLocal"
                  :preview-src-list="[roomInfo.feedsImgLocal]"
                />
              </div>
            </div>
            <div class="description-term sp100">
              <label class="name">分享图：</label>
              <div class="demo-image__preview mr10">
                <el-image
                  style="width: 36px; height: 36px"
                  :src="roomInfo.shareImgLocal"
                  :preview-src-list="[roomInfo.shareImgLocal]"
                />
              </div>
            </div>
            <div v-if="roomInfo.reviewStatus === 3" class="description-term sp100">
              <label class="name">直播小程序码：</label>
              <div class="demo-image__preview mr10">
                <el-image
                  style="width: 36px; height: 36px"
                  :src="roomInfo.qrcodeUrl"
                  :preview-src-list="[roomInfo.qrcodeUrl]"
                />
              </div>
            </div>
          </div>
        </div>
        <el-divider v-if="goodsList.length > 0"></el-divider>
        <div v-if="goodsList.length > 0" class="description">
          <div class="title">商品信息</div>
          <div class="acea-row mb20">
            <div style="width: 100%">
              <el-table
                ref="tableList"
                row-key="id"
                :data="goodsList"
                v-loading="listLoading"
                size="mini"
                border
                default-expand-all
                :tree-props="{ children: 'children' }"
                style="width: 100%"
              >
                <el-table-column prop="id" label="ID" min-width="50" />
                <el-table-column label="商品图" min-width="100">
                  <template slot-scope="scope">
                    <div class="demo-image__preview line-heightOne">
                      <el-image :src="scope.row.coverImgUrlLocal" :preview-src-list="[scope.row.coverImgUrlLocal]" />
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="商品名称" min-width="120" />
                <el-table-column label="价格类型" min-width="80">
                  <template slot-scope="scope">
                    <span>{{ scope.row.priceType | priceTypeFilter }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="价格" min-width="100">
                  <template slot-scope="scope">
                    <span v-if="scope.row.priceType === 1">{{ scope.row.price }}</span>
                    <span v-else>{{ scope.row.price + '~' + scope.row.price2 }}</span>
                  </template>
                </el-table-column>
                <!--<el-table-column prop="goods.pay_num" label="销售数量" min-width="50" />-->
              </el-table>
            </div>
          </div>
        </div>
      </div>
      <div v-show="isReview" class="demo-drawer__footer">
        <div class="from-foot-btn drawer_fix">
          <div class="acea-row justify-content">
            <el-button
              v-hasPermi="['platform:mp:live:room:review']"
              v-debounceClick="
                () => {
                  onSubmit(1);
                }
              "
              style="margin-left: 0"
              >{{ loadingBtn ? '提交中 ...' : '审核拒绝' }}</el-button
            >
            <el-button
              type="primary"
              v-hasPermi="['platform:mp:live:room:review']"
              v-debounceClick="
                () => {
                  onSubmit(3);
                }
              "
              >{{ loadingBtnSuccess ? '提交中 ...' : '审核通过' }}</el-button
            >
          </div>
        </div>
      </div>
    </el-drawer>
    <!--导入直播商品-->
    <!--<import-goods ref="uploadGoods" />-->
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
  liveRoomGoodsListApi,
  liveRoomListApi,
  liveRoomDeleteApi,
  liveRoomIsFeedsPublicApi,
  liveRoomUpdatecommentApi,
  studioPushMessageApi,
  liveRoomUpdatefeedpublicApi,
  liveRoomReviewApi,
  liveRoomShowApi,
} from '@/api/marketing';
//import detailsFrom from './studioDetail';
// import importGoods from '@/components/importGoods/index'
import { mapGetters } from 'vuex';
import merchantName from '@/components/merUseCategory';
import { checkPermi } from '@/utils/permission';
import { handleDeleteTable } from '@/libs/public'; // 权限判断函数
export default {
  name: 'StudioList',
  computed: {
    ...mapGetters(['merchantClassify', 'merchantType']),
  },
  components: { merchantName },
  data() {
    return {
      recommendedLevelStatus: [
        { label: '全部', value: '' },
        { label: '5星', value: '5' },
        { label: '4星', value: '4' },
        { label: '3星', value: '3' },
        { label: '2星', value: '2' },
        { label: '1星', value: '1' },
      ],
      merIds: [], //商户id
      loadingBtn: false,
      loading: false,
      Loading: false,
      dialogVisible: false,
      importVisible: false,
      listLoading: true,
      studioShowStatusList: [
        { label: '显示', value: 1 },
        { label: '关闭', value: 0 },
      ],
      studioStatusList: [
        { label: '直播中', value: '101' },
        { label: '已结束', value: '103' },
        { label: '未开始', value: '102' },
        { label: '禁播', value: '104' },
        { label: '暂停', value: '105' },
        { label: '异常', value: '106' },
        { label: '已过期', value: '107' },
      ],
      tableData: { data: [], total: 0 },
      tableForm: {
        page: 1,
        limit: 20,
        reviewStatus: null,
        liveStatus: null,
        keywords: '',
        storeShow: '',
        merType: '',
        star: '',
        merName: '',
      },
      reviewStatus: '',
      keywords: '',
      roomId: '',
      liveRoomStatus: '',
      roomInfo: {},
      isReview: false, //是否是审核，true是
      goodsList: [], //商品列表
      ruleForm: {
        reviewReason: '',
        reviewStatus: 2,
        id: '',
      },
      loadingBtnSuccess: false, //审核成功通过
    };
  },
  mounted() {
    if (!this.merchantClassify.length) this.$store.dispatch('merchant/getMerchantClassify');
    if (checkPermi(['platform:mp:live:room:list'])) this.getList('');
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
      if (type === 3) {
        this.$modalSure('审核通过该直播间吗？').then(() => {
          this.submit();
        });
      } else {
        this.cancelForm();
      }
    },
    submit() {
      if (this.ruleForm.reviewStatus === 3) {
        this.loadingBtnSuccess = true;
      } else {
        this.loadingBtn = true;
      }
      this.ruleForm.id = this.roomId;
      liveRoomReviewApi(this.ruleForm)
        .then((res) => {
          this.$message.success('操作成功');
          this.dialogVisible = false;
          if (this.ruleForm.reviewStatus === 3) {
            this.loadingBtnSuccess = false;
          } else {
            this.loadingBtn = false;
          }
          this.getList();
        })
        .catch((res) => {
          if (this.ruleForm.reviewStatus === 3) {
            this.loadingBtnSuccess = false;
          } else {
            this.loadingBtn = false;
          }
        });
    },
    //直播间商品列表
    roomGoodslist() {
      liveRoomGoodsListApi(this.roomId).then((res) => {
        this.goodsList = res;
      });
    },
    getMerId(id) {
      this.merIds = id;
      this.tableForm.merName = id.toString();
      this.getList();
    },
    // 详情
    onStudioDetails(row, type) {
      this.isReview = type;
      this.roomInfo = row;
      this.roomId = row.id;
      this.dialogVisible = true;
      if (row.reviewStatus === 3 && checkPermi(['platform:mp:live:room:goodslist'])) this.roomGoodslist();
    },
    // 删除
    handleDelete(item, idx) {
      this.$modalSure('该直播间正在进行直播，删除后不可恢复，您确认删除吗？').then(() => {
        liveRoomDeleteApi(item.id).then(() => {
          this.$message.success('删除成功');
          handleDeleteTable(this.tableData.data.length, this.tableFrom);
          this.getList('');
        });
      });
    },
    // 推送消息
    onPushMessage(id) {
      this.$confirm('给长期订阅用户推送消息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          studioPushMessageApi(id)
            .then(({ message }) => {
              this.$message.success(message);
            })
            .catch(({ message }) => {
              this.$message.error(message);
            });
        })
        .catch((action) => {
          this.$message({
            type: 'info',
            message: '已取消',
          });
        });
    },
    // 列表
    getList(num) {
      this.listLoading = true;
      this.tableData.page = num ? num : this.tableData.page;
      this.tableForm.keywords = encodeURIComponent(this.keywords);
      this.tableForm.reviewStatus = this.reviewStatus ? Number(this.reviewStatus) : null;
      this.tableForm.liveStatus = this.tableForm.liveStatus ? this.tableForm.liveStatus : null;
      liveRoomListApi(this.tableForm)
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
      this.tableForm = {
        page: 1,
        limit: 20,
        reviewStatus: null,
        liveStatus: null,
        keywords: '',
        storeShow: '',
        merType: '',
        star: '',
      };
      this.merIds = [];
      this.keywords = '';
      this.getList();
    },
    pageChange(page) {
      this.tableForm.page = page;
      this.getList('');
    },
    handleSizeChange(val) {
      this.tableForm.limit = val;
      this.getList('');
    },
    //开启回放
    onchangeCloseReplay(row) {
      liveRoomUpdatereplayApi(row.id, row.closeReplay).then(() => {
        this.$message.success('操作成功');
        this.getList('');
      });
    },
    // 开启收录
    onchangeIsFeeds(row) {
      liveRoomIsFeedsPublicApi(row.id, row.isFeedsPublic).then(() => {
        this.$message.success('操作成功');
        this.getList('');
      });
    },
    //是否显示在商城
    onchangeStoreShow(row) {
      liveRoomShowApi(row.id, row.storeShow).then(() => {
        this.$message.success('操作成功');
        this.getList('');
      });
    },
    // 禁言
    onchangeIsCommen(row) {
      liveRoomUpdatecommentApi(row.id, row.closeComment).then(() => {
        this.$message.success('操作成功');
        this.getList('');
      });
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
