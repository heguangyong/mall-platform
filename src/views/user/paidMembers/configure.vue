<template>
  <div class="divBox">
    <el-card :bordered="false" shadow="never" class="ivu-mt" :body-style="{ padding: '0 20px' }">
      <el-tabs v-model="activeName" class="list-tabs mb5">
        <el-tab-pane label="基础设置" name="first"></el-tab-pane>
        <el-tab-pane label="会员权益" name="second"></el-tab-pane>
        <el-tab-pane label="会员卡" name="three"></el-tab-pane>
      </el-tabs>
      <div v-if="activeName === 'first'">
        <el-form
          v-hasPermi="['platform:paid:member:base:config:get', 'platform:paid:member:base:config:edit']"
          :model="pram"
          ref="signForm"
          label-width="90px"
          class="demo-ruleForm"
        >
          <el-form-item label="购买入口：" required>
            <el-switch
              v-model="pram.paidMemberPaidEntrance"
              active-text="开启"
              inactive-text="关闭"
              active-value="1"
              inactive-value="0"
            />
            <div class="from-tips">
              购买入口关闭之后，已经购买付费会员的且未到期用户仍可继续使用，未购买付费会员的用户，不支持购买。
            </div>
          </el-form-item>
          <el-form-item label="会员价格：" required>
            <el-radio-group v-model="pram.paidMemberPriceDisplay">
              <el-radio label="all">全部用户可见</el-radio>
              <el-radio label="paid">仅付费会员可见</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="会员专享：" required>
            <el-switch
              v-model="pram.paidMemberProductSwitch"
              active-text="开启"
              inactive-text="关闭"
              active-value="1"
              inactive-value="0"
            />
            <div class="from-tips">开启/关闭用户端-付费会员开通页面 会员专享商品列表 模块。</div>
          </el-form-item>
          <el-form-item>
            <el-button
              v-if="checkPermi(['platform:paid:member:base:config:edit'])"
              type="primary"
              v-debounceClick="memberConfigSubmitForm"
              >提交</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <div v-if="activeName === 'second'">
        <el-table
          :key="activeName"
          ref="table"
          v-loading="listLoading"
          :data="tableData"
          highlight-current-row
          size="small"
          class="mb50"
        >
          <el-table-column prop="id" label="ID" :show-overflow-tooltip="true" width="60"></el-table-column>
          <el-table-column prop="name" label="权益名称" :show-overflow-tooltip="true" min-width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.name | filterMemberBenefits }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="value"
            label="展示名称"
            :show-overflow-tooltip="true"
            min-width="160"
          ></el-table-column>
          <el-table-column prop="imageUrl" label="权益图标" min-width="160">
            <template slot-scope="scope">
              <div class="demo-image__preview line-heightOne">
                <el-image :src="scope.row.imageUrl" :preview-src-list="[scope.row.imageUrl]" />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="message"
            label="权益简介"
            :show-overflow-tooltip="true"
            min-width="160"
          ></el-table-column>
          <el-table-column label="状态" min-width="160">
            <template slot-scope="scope">
              <el-switch
                v-if="checkPermi(['platform:paid:member:benefits:switch'])"
                v-model="scope.row.status"
                :active-value="true"
                :inactive-value="false"
                active-text="显示"
                inactive-text="隐藏"
                @change="handleStatusChange(scope.row, 'benefits')"
              >
              </el-switch>
              <div v-else>{{ scope.row.status ? '显示' : '隐藏' }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160" fixed="right">
            <template slot-scope="scope">
              <a @click="handleCreatBenefits(scope.row)" v-hasPermi="['platform:paid:member:benefits:edit']"
                >权益设置</a
              >
              <el-divider direction="vertical"></el-divider>
              <a @click="handleCreatExplain(scope.row)" v-hasPermi="['platform:paid:member:benefits:statement:edit']"
                >权益说明</a
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="activeName === 'three'">
        <el-button size="small" type="primary" @click="handlerCreat()">新增</el-button>
        <el-table
          ref="table"
          v-loading="listLoading"
          :data="tableDataMember"
          highlight-current-row
          size="small"
          class="mb50 mt20"
          :key="activeName"
        >
          <el-table-column prop="id" label="ID" :show-overflow-tooltip="true" width="60"></el-table-column>
          <el-table-column
            prop="name"
            label="会员卡名称"
            :show-overflow-tooltip="true"
            min-width="160"
          ></el-table-column>
          <el-table-column prop="value" label="会员卡类型" :show-overflow-tooltip="true" min-width="160">
            <template slot-scope="scope">{{ scope.row.type | filterMemberType }}</template>
          </el-table-column>
          <el-table-column prop="deadlineDay" label="会员卡期限" :show-overflow-tooltip="true" min-width="160">
            <template slot-scope="scope">{{ scope.row.type === 2 ? '永久' : scope.row.deadlineDay + '天' }}</template>
          </el-table-column>
          <el-table-column
            prop="price"
            label="会员卡售价（元）"
            :show-overflow-tooltip="true"
            min-width="160"
          ></el-table-column>
          <el-table-column
            prop="giftBalance"
            label="赠送余额（元）"
            :show-overflow-tooltip="true"
            min-width="160"
          ></el-table-column>
          <el-table-column
            prop="label"
            label="标签文字"
            :show-overflow-tooltip="true"
            min-width="160"
          ></el-table-column>
          <el-table-column label="状态" min-width="160">
            <template slot-scope="scope">
              <el-switch
                v-if="checkPermi(['platform:paid:member:card:switch'])"
                v-model="scope.row.status"
                :active-value="true"
                :inactive-value="false"
                active-text="开启"
                inactive-text="关闭"
                @change="handleStatusChange(scope.row, 'card')"
              >
              </el-switch>
              <div v-else>{{ scope.row.status ? '开启' : '关闭' }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160" fixed="right">
            <template slot-scope="scope">
              <a @click="handlerCreat(scope.row)" v-hasPermi="['platform:paid:member:card:edit']">编辑</a>
              <el-divider direction="vertical"></el-divider>
              <a @click="handleDelete(scope.$index, scope.row)" v-hasPermi="['platform:paid:member:card:delete']"
                >删除</a
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <!--权益设置-->
    <benefits-edit
      ref="benefitsEditRef"
      :drawerVisible="drawerVisible"
      v-if="drawerVisible"
      :pramInfo="pramInfo"
      @onClosedrawerVisible="onClosedrawerVisible"
      @subSuccess="subSuccessBenefits"
    ></benefits-edit>
    <!--权益说明-->
    <explain-creat
      ref="explainCreatRef"
      v-if="drawerVisibleExplain"
      :drawerVisible="drawerVisibleExplain"
      :pramInfo="pramInfo"
      @subSuccess="subSuccessExplain"
      @onClosedrawerVisible="onClosedrawerVisibleExplain"
    ></explain-creat>
    <!--会员卡-->
    <card-creat
      ref="cardCreatRef"
      v-if="drawerVisibleCard"
      :pramInfo="pramInfo"
      :drawerVisible="drawerVisibleCard"
      @onClosedrawerVisible="onClosedrawerVisibleCard"
      @subSuccess="subSuccessCard"
    ></card-creat>
  </div>
</template>
<script>
import {
  memberBenefitsListApi,
  memberBenefitsStatementSwitchApi,
  memberCardDeleteApi,
  memberCardListApi,
  memberCardSwitchApi,
  memberConfigEditApi,
  memberConfigGetApi,
} from '@/api/user';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
import Debounce from '@/libs/debounce';
import BenefitsEdit from '../components/benefitsCreat..vue';
import ExplainCreat from '../components/explainCreat.vue';
import CardCreat from '../components/cardCreat.vue';
const cardInfo = {
  deadlineDay: 0,
  giftBalance: 0,
  id: 0,
  isFirstChargeGive: false,
  label: '',
  name: '',
  originalPrice: 0,
  price: 0,
  sort: 0,
  status: true,
  type: 0,
};
export default {
  name: 'Configure',
  components: { CardCreat, ExplainCreat, BenefitsEdit },
  data() {
    return {
      activeName: 'first',
      pram: {
        paidMemberPaidEntrance: 1,
        paidMemberPriceDisplay: 'all',
        paidMemberProductSwitch: 1,
      },
      listLoading: false,
      tableData: [], //会员权益列表
      drawerVisible: false, //权益
      pramInfo: null,
      drawerVisibleExplain: false, //权益说明
      tableDataMember: [], //会员卡列表
      drawerVisibleCard: false, //会员卡
    };
  },
  watch: {
    activeName: {
      handler(val) {
        if (val === 'second') this.getList();
        if (val === 'three') this.getMemberList();
      },
      deep: true,
      immediate: false,
    },
  },
  mounted() {
    if (checkPermi(['platform:paid:member:base:config:get'])) this.getMemberConfig();
  },
  methods: {
    checkPermi,
    //基础设置
    memberConfigSubmitForm(formName) {
      memberConfigEditApi(this.pram).then(async (res) => {
        this.$message.success('提交成功');
        this.getMemberConfig();
      });
    },
    async getMemberConfig() {
      try {
        this.pram = await memberConfigGetApi();
      } catch (e) {}
    },
    //会员卡列表
    async getMemberList() {
      this.listLoading = true;
      try {
        this.tableDataMember = await memberCardListApi();
        this.listLoading = false;
      } catch (e) {
        this.listLoading = false;
      }
    },
    //行删除
    handleDelete(index, row) {
      this.$modalSure('要删除此会员卡吗？').then(async () => {
        try {
          await memberCardDeleteApi(row.id);
          this.$message.success('删除成功');
          this.tableDataMember.splice(index, 1);
        } catch (e) {}
      });
    },
    //会员卡关闭
    onClosedrawerVisibleCard() {
      this.drawerVisibleCard = false;
    },
    //会员卡创建
    handlerCreat(row) {
      this.pramInfo = row ? row : Object.assign({}, cardInfo);
      this.drawerVisibleCard = true;
    },
    //会员卡创建成功
    subSuccessCard() {
      this.getMemberList();
      this.onClosedrawerVisibleCard();
    },
    //会员权益列表
    async getList() {
      this.listLoading = true;
      try {
        this.tableData = await memberBenefitsListApi();
        this.listLoading = false;
      } catch (e) {
        this.listLoading = false;
      }
    },
    //会员权益修改状态
    handleStatusChange: Debounce(async function (row, name) {
      try {
        if (name === 'benefits') {
          await memberBenefitsStatementSwitchApi(row.id);
          this.getList();
        } else {
          await memberCardSwitchApi(row.id);
          this.getMemberList();
        }
        this.$message.success('更新状态成功');
      } catch (e) {
        row.status = !row.status;
      }
    }),
    //会员权益设置
    handleCreatBenefits(row) {
      this.pramInfo = row;
      this.drawerVisible = true;
    },
    //会员权益关闭弹窗
    onClosedrawerVisible() {
      this.drawerVisible = false;
    },
    subSuccessBenefits() {
      this.getList();
      this.onClosedrawerVisible();
    },
    //权益说明
    handleCreatExplain(row) {
      this.pramInfo = row;
      this.drawerVisibleExplain = true;
    },
    //权益说明关闭
    onClosedrawerVisibleExplain() {
      this.drawerVisibleExplain = false;
    },
    subSuccessExplain() {
      this.getList();
      this.onClosedrawerVisibleExplain();
    },
  },
};
</script>
<style scoped lang="scss"></style>
