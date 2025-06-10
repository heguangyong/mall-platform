<template>
  <div class="divBox">
    <el-card
      :bordered="false"
      shadow="never"
      class="ivu-mt"
      :body-style="{ padding: 0 }"
      v-hasPermi="['platform:merchant:page:list']"
    >
      <div class="padding-add">
        <el-form size="small" label-position="right" inline @submit.native.prevent>
          <el-form-item label="选择时间：">
            <el-date-picker
              v-model="timeVal"
              size="small"
              type="daterange"
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
          <el-form-item label="商户名称：">
            <el-input
              v-model.trim="keywords"
              @keyup.enter.native="getList(1)"
              size="small"
              placeholder="请输入商户名称"
              class="selWidth"
            />
          </el-form-item>
          <el-form-item label="商户类别：">
            <el-select v-model.trim="tableFrom.isSelf" clearable size="small" placeholder="请选择" class="selWidth">
              <el-option label="自营" value="1" />
              <el-option label="非自营" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="商户分类：">
            <el-select v-model="tableFrom.categoryId" clearable size="small" placeholder="请选择" class="selWidth">
              <el-option v-for="item in merchantClassify" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="店铺类型：">
            <el-select v-model="tableFrom.typeId" clearable placeholder="请选择" size="small" class="selWidth">
              <el-option v-for="item in merchantType" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="getList(1), getHeadNum()">查询</el-button>
            <el-button size="small" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card mt14" :body-style="{ padding: '0 20px 20px' }" shadow="never" :bordered="false">
      <el-tabs
        class="list-tabs"
        v-if="headeNum.length > 0"
        v-model="tableFrom.isSwitch"
        @tab-click="getList(1), getHeadNum()"
      >
        <el-tab-pane
          v-for="(item, index) in headeNum"
          :key="index"
          :name="item.type.toString()"
          :label="item.title + '(' + item.count + ')'"
        />
      </el-tabs>
      <el-button size="small" type="primary" v-hasPermi="['platform:merchant:add']" class="mt5" @click="onAdd"
        >添加商户
      </el-button>
      <el-table
        v-loading="listLoading"
        :data="tableData.data"
        style="width: 100%"
        size="small"
        highlight-current-row
        class="mt20"
      >
        <el-table-column prop="id" label="ID" min-width="60" />
        <el-table-column prop="name" label="商户名称" min-width="180" :show-overflow-tooltip="true" />
        <el-table-column prop="realName" label="商户姓名" min-width="150" />
        <el-table-column label="创建类型" min-width="120">
          <template slot-scope="scope">
            <span class="spBlock">{{ scope.row.createType | merCreateTypeFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="商户手机号" min-width="150" />
        <el-table-column prop="copyProductNum" label="第三方复制次数" min-width="110" />
        <el-table-column prop="createTime" label="创建时间" min-width="150" />
        <el-table-column prop="status" label="开启/关闭" min-width="90" fixed="right">
          <template slot-scope="scope">
            <el-switch
              v-if="checkPermi(['platform:merchant:open', 'platform:merchant:close'])"
              v-model="scope.row.isSwitch"
              active-text="开启"
              inactive-text="关闭"
              @click.native="onchangeIsClose(scope.row)"
            />
            <div v-else>{{ scope.row.isSwitch ? '开启' : '关闭' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="推荐" min-width="90" fixed="right">
          <template slot-scope="scope">
            <el-switch
              v-if="checkPermi(['platform:merchant:recommend:switch'])"
              v-model="scope.row.isRecommend"
              :active-value="true"
              :inactive-value="false"
              active-text="是"
              inactive-text="否"
              @click.native="onchangeIsShow(scope.row)"
            />
            <div v-else>{{ scope.row.isRecommend ? '是' : '否' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template slot-scope="scope">
            <a @click="handleLoginMer(scope.row.id)" v-hasPermi="['platform:merchant:detail']">登录 </a>
            <el-divider direction="vertical"></el-divider>
            <a @click="handleEdit(scope.row.id, 1, 'info')" v-hasPermi="['platform:merchant:detail']">详情 </a>
            <el-divider direction="vertical"></el-divider>
            <el-dropdown
              trigger="click"
              v-if="
                checkPermi([
                  'platform:merchant:update:phone',
                  'platform:merchant:update:phone',
                  'platform:merchant:reset:password',
                  'platform:merchant:copy:prodcut:num',
                ])
              "
            >
              <span class="el-dropdown-link"> 更多<i class="el-icon-arrow-down el-icon--right" /> </span>
              <el-dropdown-menu slot="dropdown" class="icon-arrow-down">
                <el-dropdown-item
                  @click.native="handleEdit(scope.row.id, '', 'edit')"
                  v-if="checkPermi(['platform:merchant:update'])"
                  >编辑
                </el-dropdown-item>
                <el-dropdown-item
                  @click.native="handleUpdatePhone(scope.row, 1)"
                  v-if="checkPermi(['platform:merchant:update:phone'])"
                  >修改手机号
                </el-dropdown-item>
                <el-dropdown-item
                  @click.native="onPassword(scope.row.id)"
                  v-if="checkPermi(['platform:merchant:reset:password'])"
                  >重置商户密码
                </el-dropdown-item>
                <el-dropdown-item
                  @click.native="handleTimes(scope.row, 2)"
                  v-if="checkPermi(['platform:merchant:copy:prodcut:num'])"
                  >设置第三方平台商品复制次数
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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

    <el-drawer
      title="商户"
      size="1000px"
      :visible.sync="dialogVisible"
      :before-close="closeModel"
      :closeOnClickModal="false"
    >
      <creat-merchant
        ref="creatMerchants"
        :merId="merId"
        :key="indexKey"
        :is-disabled="isDisabled"
        :handleType="handleType"
        @getList="getChange"
        @closeModel="closeModel"
        @onChangeEdit="onChangeEdit"
      ></creat-merchant>
    </el-drawer>
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
import * as merchant from '@/api/merchant';
import creatMerchant from './creatMerchant';
import { mapGetters } from 'vuex';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
import { merchantLogin } from '@/api/user';

export default {
  name: 'MerchantList',
  components: { creatMerchant },
  data() {
    return {
      dialogVisible: false,
      fromList: this.$constants.fromList,
      isChecked: false,
      listLoading: false,
      headeNum: [
        {
          count: '',
          type: '1',
          title: '正常开启的商户',
        },
        {
          count: '',
          type: '0',
          title: '已关闭商户',
        },
      ],
      tableData: {
        data: [],
        total: 0,
      },
      tableFrom: {
        page: 1,
        limit: 20,
        dateLimit: '',
        isSwitch: '1',
        keywords: '',
        isSelf: '',
        categoryId: '',
        typeId: '',
      },
      keywords: '',
      autoUpdate: true,
      timeVal: [],
      merId: 0,
      keyNum: 0,
      isDisabled: false,
      indexKey: 0,
      handleType: '', //操作类型，编辑、详情
    };
  },
  computed: {
    ...mapGetters(['merchantClassify', 'merchantType']),
  },
  mounted() {
    if (!this.merchantClassify.length) this.$store.dispatch('merchant/getMerchantClassify');
    if (!this.merchantType.length) this.$store.dispatch('merchant/getMerchantType');
    if (checkPermi(['platform:merchant:list:header:num'])) this.getHeadNum();
    if (checkPermi(['platform:merchant:page:list'])) this.getList('');
  },
  methods: {
    checkPermi,
    //详情中点击编辑按钮
    onChangeEdit() {
      this.isDisabled = !this.isDisabled;
    },
    /**
     *  选择时间
     */
    selectChange(tab) {
      this.tableFrom.dateLimit = tab;
      this.timeVal = [];
      this.tableData.data = [];
      this.getList(1);
      this.getHeadNum();
    },
    /**
     *  具体日期
     */
    onchangeTime(e) {
      this.timeVal = e;
      this.tableFrom.dateLimit = this.timeVal ? this.timeVal.join(',') : '';
      this.getList(1);
      this.getHeadNum();
    },
    /**
     *  获取开启商户数
     */
    getHeadNum() {
      const data = { ...this.tableFrom };
      delete data.page;
      delete data.limit;
      delete data.isSwitch;
      merchant
        .merHeaderNumApi(data)
        .then((res) => {
          this.headeNum[0]['count'] = res.openNum;
          this.headeNum[1]['count'] = res.closeNum;
        })
        .catch((res) => {});
    },
    /**
     *  列表
     */
    getList(num) {
      this.listLoading = true;
      this.tableFrom.keywords = encodeURIComponent(this.keywords);
      this.tableFrom.page = num ? num : this.tableFrom.page;
      merchant
        .merchantListApi({
          page: this.tableFrom.page,
          limit: this.tableFrom.limit,
          dateLimit: this.tableFrom.dateLimit,
          isSwitch: this.tableFrom.isSwitch,
          keywords: this.tableFrom.keywords,
          isSelf: this.tableFrom.isSelf,
          categoryId: this.tableFrom.categoryId,
          typeId: this.tableFrom.typeId,
        })
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
      this.timeVal = [];
      this.tableFrom.dateLimit = '';
      this.tableFrom.isSelf = '';
      this.tableFrom.categoryId = '';
      this.tableFrom.typeId = '';
      this.tableFrom.keywords = '';
      this.keywords = '';
      this.getHeadNum();
      this.getList(1);
    },
    pageChange(page) {
      this.tableFrom.page = page;
      this.getList('');
      this.getHeadNum();
    },
    handleSizeChange(val) {
      this.tableFrom.limit = val;
      this.getList(1);
      this.getHeadNum();
    },
    /**
     *  修改状态
     */
    onchangeIsShow(row) {
      if (this.tableFrom.isSwitch === '0') return;
      row.isRecommend = !row.isRecommend;
      const title = !row.isRecommend ? '是否开启推荐商户' : '是否关闭推荐商户';
      this.$modalSure(title).then(() => {
        merchant.merchantSwitchApi(row.id).then((res) => {
          row.isRecommend = !row.isRecommend;
          this.$message.success('切换商户推荐开关成功');
        });
      });
    },
    /**
     *  开启关闭
     */
    onchangeIsClose(row) {
      !row.isSwitch
        ? merchant.merchantCloseApi(row.id).then(() => {
            this.$message.success('关闭成功');
            this.tableFrom.isSwitch = '1';
            this.getHeadNum();
            this.getList('');
          })
        : merchant.merchantOpenApi(row.id).then(() => {
            this.$message.success('开启成功');
            this.tableFrom.isSwitch = '0';
            this.getHeadNum();
            this.getList('');
          });
    },
    getChange() {
      this.getHeadNum();
      this.getList(1);
      this.closeModel();
    },
    closeModel() {
      this.dialogVisible = false;
    },
    /**
     *  添加
     */
    onAdd() {
      this.dialogVisible = true;
      this.isDisabled = false;
      this.indexKey = Math.random();
      this.merId = 0;
    },
    /**
     * 登录商户
     * @param id 商户id
     */
    handleLoginMer(id) {
      merchantLogin(id).then((res) => {
        window.open(
          `https://${res.merSiteUrl}/dashboard?token=${res.token}&account=${res.account}&isSms=${res.isSms}&leftSquareLogo=${res.leftSquareLogo}&leftTopLogo=${res.leftTopLogo}&realName=${res.realName}`,
        );
      });
    },
    /**
     *  编辑
     */
    handleEdit(id, n, type) {
      this.dialogVisible = true;
      this.merId = id;
      this.indexKey = Math.random();
      this.handleType = type;
      n ? (this.isDisabled = true) : (this.isDisabled = false);
    },
    /**
     *  修改手机号
     */
    handleUpdatePhone(row, num) {
      this.merId = row.id;
      const _this = this;
      this.$modalParserFrom(
        '修改商户手机号',
        '修改商户手机号',
        1,
        { phone: row.phone },
        function (formValue) {
          _this.submit(formValue, num);
        },
        (this.keyNum += 2),
      );
    },
    /**
     *  设置复制次数
     */
    handleTimes(row, num) {
      this.merId = row.id;
      let nums = row.copyProductNum;
      const _this = this;
      this.$modalParserFrom(
        '修改复制商品数量',
        '修改复制商品数量',
        1,
        { copyProductNum: nums || 0 },
        function (formValue) {
          _this.submit(formValue, num);
        },
        (this.keyNum += 1),
      );
    },
    // 修改密码表单
    onPassword(id) {
      this.merId = id;
      this.$modalSure('重置商户密码为000000吗？').then(() => {
        merchant.merRsetPasswordApi(id).then((res) => {
          this.$message.success('重置密码成功');
        });
      });
    },
    submit(formValue, num) {
      if (num === 1) {
        const data = {
          id: this.merId,
          phone: formValue.phone,
        };
        merchant
          .merchantupdatePhoneApi(data)
          .then((res) => {
            this.$message.success('操作成功');
            this.$msgbox.close();
            this.getList(1);
          })
          .catch(() => {
            this.loading = false;
          });
      } else {
        const data = {
          id: this.merId,
          type: formValue.type,
          num: formValue.num,
        };
        merchant
          .merchantCopyNumApi(data)
          .then((res) => {
            this.$message.success('操作成功');
            this.$msgbox.close();
            this.getList(1);
          })
          .catch(() => {
            this.loading = false;
          });
      }
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .el-range-editor.is-active:hover {
  border-color: #409eff !important;
}

.demo-table-expand label {
  width: 90px;
}

.el-icon-arrow-down {
  font-size: 12px;
}

.icon-arrow-down {
  ::v-deep .el-dropdown-menu__item {
    font-size: 12px;
  }
}

::v-deep .el-col-12 {
  width: 100% !important;
}
</style>
