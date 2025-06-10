<template>
  <div class="divBox relative">
    <el-card
      :bordered="false"
      shadow="never"
      class="ivu-mt"
      :body-style="{ padding: 0 }"
      v-hasPermi="['platform:user:page:list']"
    >
      <div class="padding-add">
        <el-form
          ref="userFrom"
          :model="userFrom"
          label-width="66px"
          label-position="right"
          @submit.native.prevent
          inline
        >
          <div class="acea-row search-form" v-if="!collapse">
            <div class="search-form-box">
              <el-form-item label="用户搜索：" label-for="nickname">
                <UserSearchInput v-model="userFrom" />
              </el-form-item>
              <el-form-item label="用户标签：">
                <el-select
                  v-model.trim="labelData"
                  placeholder="请选择"
                  class="selWidth"
                  clearable
                  filterable
                  multiple
                  size="small"
                >
                  <el-option
                    :value="item.id"
                    v-for="(item, index) in labelLists"
                    :key="index"
                    :label="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <el-form-item class="search-form-sub">
              <el-button type="primary" size="small" @click="userSearchs">搜索</el-button>
              <el-button size="small" @click="reset" class="ResetSearch">重置</el-button>
              <a class="ivu-ml-8 font12 ml10" @click="collapse = !collapse">
                <template v-if="!collapse"> 展开 <i class="el-icon-arrow-down" /> </template>
                <template v-else> 收起 <i class="el-icon-arrow-up" /> </template>
              </a>
            </el-form-item>
          </div>
          <div v-if="collapse" class="acea-row search-form">
            <div class="search-form-box">
              <el-form-item label="用户搜索：" label-for="nickname">
                <UserSearchInput v-model="userFrom" />
              </el-form-item>
              <el-form-item label="用户标签：">
                <el-select
                  v-model.trim="labelData"
                  placeholder="请选择"
                  class="selWidth"
                  clearable
                  filterable
                  multiple
                  size="small"
                >
                  <el-option
                    :value="item.id"
                    v-for="(item, index) in labelLists"
                    :key="index"
                    :label="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="消费情况：">
                <el-select v-model="userFrom.payCount" placeholder="请选择" size="small" class="selWidth" clearable>
                  <el-option value="0" label="0"></el-option>
                  <el-option value="1" label="1+"></el-option>
                  <el-option value="2" label="2+"></el-option>
                  <el-option value="3" label="3+"></el-option>
                  <el-option value="4" label="4+"></el-option>
                  <el-option value="5" label="5+"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="用户性别：">
                <el-select v-model="userFrom.sex" placeholder="请选择" size="small" class="selWidth" clearable>
                  <el-option value="" label="全部"></el-option>
                  <el-option value="0" label="未知"></el-option>
                  <el-option value="1" label="男"></el-option>
                  <el-option value="2" label="女"></el-option>
                  <el-option value="3" label="保密"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="用户身份：">
                <el-select v-model="userFrom.identity" placeholder="请选择" size="small" class="selWidth" clearable>
                  <el-option value="" label="全部"></el-option>
                  <el-option value="1" label="推广员"></el-option>
                  <el-option value="3" label="付费会员"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="时间选择：">
                <el-date-picker
                  v-model="timeVal"
                  align="right"
                  unlink-panels
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  size="small"
                  type="daterange"
                  placement="bottom-end"
                  placeholder="自定义时间"
                  :picker-options="pickerOptions"
                  @change="onchangeTime"
                  class="selWidth"
                />
              </el-form-item>
              <el-form-item label="注册类型：">
                <el-select v-model="userFrom.registerType" placeholder="请选择" size="small" class="selWidth" clearable>
                  <el-option v-for="item in registerTypeList" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <el-form-item class="search-form-sub">
              <el-button type="primary" size="small" @click="userSearchs">搜索</el-button>
              <el-button class="ResetSearch" size="small" @click="reset">重置</el-button>
              <a class="ivu-ml-8 font12 ml10" @click="collapse = !collapse">
                <template v-if="!collapse"> 展开 <i class="el-icon-arrow-down" /> </template>
                <template v-else> 收起 <i class="el-icon-arrow-up" /> </template>
              </a>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card mt14" :body-style="{ padding: '20px' }" shadow="never" :bordered="false">
      <div class="acea-row row-middle">
        <el-dropdown size="small">
          <el-button :disabled="!multipleSelectionAll.length">
            批量设置<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <template v-if="multipleSelectionAll.length">
              <el-dropdown-item v-hasPermi="['platform:user:tag']" @click.native="setBatch('label', '', 1)"
                >批量添加标签</el-dropdown-item
              >
              <el-dropdown-item
                v-hasPermi="['platform:coupon:can:send:list', 'platform:coupon:batch:send']"
                @click.native="sendCoupon"
                >发送优惠券</el-dropdown-item
              >
              <el-dropdown-item v-hasPermi="['platform:user:gift:paid:member']" @click.native="handleGiftMembers('')"
                >赠送会员</el-dropdown-item
              >
            </template>
          </el-dropdown-menu>
        </el-dropdown>
        <div v-show="multipleSelectionAll.length" class="ml12 font12">
          已选 <span class="font-color font12"> {{ multipleSelectionAll.length }} </span>项
        </div>
      </div>
      <el-table
        ref="table"
        v-loading="listLoading"
        :data="tableData.data"
        size="small"
        @selection-change="handleSelectionChange"
        highlight-current-row
        class="mt20"
      >
        <el-table-column type="expand" width="40">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="首次访问：">
                <span>{{ props.row.createTime | filterEmpty }}</span>
              </el-form-item>
              <el-form-item label="近次访问：">
                <span>{{ props.row.lastLoginTime | filterEmpty }}</span>
              </el-form-item>
              <el-form-item label="标签：">
                <span>{{ props.row.tagId | tagFilter }}</span>
              </el-form-item>
              <el-form-item label="地址：">
                <span>{{ (props.row.province + props.row.city) | filterEmpty }}</span>
              </el-form-item>
              <el-form-item label="备注：" style="width: 100%; display: flex; margin-right: 10px">
                <span>{{ props.row.mark | filterEmpty }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="selection" width="45"></el-table-column>
        <el-table-column prop="id" label="ID" width="70" align="right" v-if="checkedCities.includes('ID')" />
        <el-table-column label="头像" width="50" v-if="checkedCities.includes('头像')">
          <template slot-scope="scope">
            <div class="demo-image__preview line-heightOne">
              <el-image :src="scope.row.avatar" :preview-src-list="[scope.row.avatar]" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="昵称" min-width="180" v-if="checkedCities.includes('姓名')">
          <template slot-scope="scope">
            <div class="acea-row row-middle">
              <span :class="scope.row.isLogoff ? 'red' : ''">{{ scope.row.nickname | filterEmpty }} | </span>
              <img :src="getSexImage(scope.row.sex)" :title="sexFilter(scope.row.sex)" />
              <span :class="scope.row.isLogoff ? 'red' : ''" v-if="scope.row.isLogoff == true" class="ml2">|</span>
              <span v-if="scope.row.isLogoff" class="red ml2">(已注销)</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="推荐人" min-width="130" v-if="checkedCities.includes('推荐人')">
          <template slot-scope="scope">
            <span>{{ scope.row.spreadName | filterEmpty }}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系电话" min-width="100" v-if="checkedCities.includes('联系电话')">
          <template slot-scope="scope">
            <span>{{ scope.row.phone | filterEmpty }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="nowMoney" label="余额" min-width="100" v-if="checkedCities.includes('余额')" />
        <el-table-column prop="integral" label="积分" min-width="100" v-if="checkedCities.includes('积分')" />
        <el-table-column prop="registerType" label="注册类型" min-width="100" v-if="checkedCities.includes('注册类型')">
          <template slot-scope="scope">
            <span>{{ scope.row.registerType | registerTypeFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <a @click="onDetails(scope.row.id)" v-if="checkPermi(['platform:user:detail'])">详情</a>
            <el-divider direction="vertical"></el-divider>
            <a @click="editUser(scope.row)" v-hasPermi="['platform:user:update', 'platform:user:detail']">编辑</a>
            <el-divider direction="vertical"></el-divider>
            <el-dropdown
              trigger="click"
              v-hasPermi="[
                'platform:user:operate:integer',
                'platform:user:operate:balance',
                'platform:user:tag',
                'platform:retail:store:update:user:spread',
                'platform:retail:store:clean:user:spread',
                'platform:user:gift:paid:member',
              ]"
            >
              <span class="el-dropdown-link"> 更多<i class="el-icon-arrow-down el-icon--right" /> </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  @click.native="editPoint(scope.row, 'integral')"
                  v-if="checkPermi(['platform:user:operate:integer'])"
                  >修改积分</el-dropdown-item
                >
                <el-dropdown-item
                  @click.native="editPoint(scope.row, 'balance')"
                  v-if="checkPermi(['platform:user:operate:balance'])"
                  >修改余额</el-dropdown-item
                >
                <el-dropdown-item
                  @click.native="setBatch('label', scope.row, 2)"
                  v-if="checkPermi(['platform:user:tag'])"
                  >设置标签</el-dropdown-item
                >
                <el-dropdown-item
                  @click.native="setExtension(scope.row)"
                  v-if="checkPermi(['platform:retail:store:update:user:spread'])"
                  >修改上级推广人</el-dropdown-item
                >
                <el-dropdown-item
                  @click.native="clearSpread(scope.row)"
                  v-if="
                    scope.row.spreadUid &&
                    scope.row.spreadUid > 0 &&
                    checkPermi(['platform:retail:store:clean:user:spread'])
                  "
                  >清除上级推广人</el-dropdown-item
                >
                <el-dropdown-item
                  @click.native="handleGiftMembers(scope.row)"
                  v-if="checkPermi(['platform:user:gift:paid:member'])"
                  >赠送会员</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          background
          :page-sizes="[20, 40, 60, 80]"
          :page-size="userFrom.limit"
          :current-page="userFrom.page"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.total"
          @size-change="handleSizeChange"
          @current-change="pageChange"
        />
      </div>
    </el-card>
    <div class="card_abs" v-show="card_select_show" :style="{ top: collapse ? 570 + 'px' : 270 + 'px' }">
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
    <!--修改推广人-->
    <el-dialog title="修改推广人" :visible.sync="extensionVisible" width="540px" :before-close="handleCloseExtension">
      <el-form
        class="formExtension mt20"
        ref="formExtension"
        :model="formExtension"
        :rules="ruleInline"
        label-width="70px"
        @submit.native.prevent
        v-loading="loading"
      >
        <el-form-item label="选择用户:" prop="image">
          <div class="upLoadPicBox" @click="modalPicTap">
            <div v-if="selectedUser.image" class="acea-row">
              <img class="pictrue" :src="selectedUser.image" />
              <span>{{ selectedUser.nickname }}</span>
            </div>
            <div v-else class="upLoad">
              <i class="el-icon-camera cameraIconfont" />
            </div>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="extensionVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubExtension('formExtension')">确定</el-button>
      </span>
    </el-dialog>
    <!--用户列表-->
    <el-dialog class="big-dialog" title="推广员列表" :visible.sync="userVisible" width="900px">
      <user-list v-if="userVisible" @getTemplateRow="getTemplateRow"></user-list>
      <!-- <span slot="footer">
        <el-button @click="userVisible = false">取 消</el-button>
        <el-button type="primary" @click="userVisible = false">确 定</el-button>
      </span> -->
    </el-dialog>
    <!--批量设置-->
    <el-dialog
      :title="isBatch ? '批量添加标签' : '设置标签'"
      :visible.sync="dialogVisible"
      width="540px"
      :before-close="handleClose"
    >
      <el-form
        :model="dynamicValidateForm"
        ref="dynamicValidateForm"
        label-width="75px"
        class="demo-dynamic"
        v-loading="loading"
      >
        <el-form-item
          prop="groupId"
          label="用户标签："
          :rules="[{ required: true, message: '请选择用户标签', trigger: 'change' }]"
        >
          <el-select v-model="dynamicValidateForm.groupId" placeholder="请选择标签" filterable multiple>
            <el-option :value="item.id" v-for="(item, index) in labelLists" :key="index" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button
          type="primary"
          v-debounceClick="
            () => {
              submitForm('dynamicValidateForm');
            }
          "
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!--编辑-->
    <el-dialog title="编辑" :visible.sync="visible" width="900px">
      <edit-from v-if="visible" :userInfo="userInfo" @resetForm="resetForm" class="dialog-bottom"></edit-from>
    </el-dialog>
    <!--积分余额-->
    <el-dialog
      :title="type === 'integral' ? '积分' : '余额'"
      :visible.sync="VisiblePoint"
      width="540px"
      :close-on-click-modal="false"
      :before-close="handlePointClose"
    >
      <el-form
        :model="PointValidateForm"
        ref="PointValidateForm"
        label-width="75px"
        class="demo-dynamic"
        v-loading="loadingPoint"
      >
        <el-form-item :label="type === 'integral' ? '积分：' : '余额：'" required>
          <span>{{ type === 'integral' ? userInfo.integral : userInfo.nowMoney }}</span>
        </el-form-item>
        <template v-if="type === 'integral'">
          <el-form-item label="修改积分：" required>
            <el-radio-group v-model="PointValidateForm.operateType">
              <el-radio label="add">增加</el-radio>
              <el-radio label="sub">减少</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="积分：" required>
            <el-input-number
              type="text"
              step-strictly
              v-model.trim="PointValidateForm.integral"
              :min="0"
              :max="999999"
            ></el-input-number>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="修改余额：" required>
            <el-radio-group v-model="PointValidateForm.operateType">
              <el-radio label="add">增加</el-radio>
              <el-radio label="sub">减少</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="余额：" required>
            <el-input-number
              type="text"
              v-model.trim="PointValidateForm.money"
              :precision="2"
              :step="0.1"
              :min="0"
              :max="999999"
            ></el-input-number>
          </el-form-item>
        </template>
      </el-form>
      <span slot="footer">
        <el-button @click="handlePointClose">取 消</el-button>
        <el-button type="primary" :loading="loadingBtn" @click="submitPointForm('PointValidateForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!--用户详情-->
    <detail-user ref="userDetailFrom"></detail-user>
    <!-- 选择优惠券 -->
    <el-dialog v-if="visibleCoupon" title="优惠券列表" :visible.sync="visibleCoupon" width="1000px">
      <coupon-List v-if="visibleCoupon" ref="couponList" :checkedIds="checkedIds" @sendSuccess="sendSuccess" />
    </el-dialog>
    <!-- 赠送会员卡 -->
    <gift-to-members
      v-if="dialogVisibleMember"
      :tableDataMember="tableDataMember"
      :dialogVisibleMember="dialogVisibleMember"
      ref="giftMembersRef"
      :checkedIds="checkeduIds.toString()"
      @handlerSuccessSubmit="handlerSuccessSubmit"
      @handlerSuccessClose="handlerSuccessSubmit"
    ></gift-to-members>
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
  userListApi,
  tagAllListApi,
  tagPiApi,
  foundsApi,
  updateSpreadApi,
  balanceApi,
  memberCardListApi,
} from '@/api/user';
import { spreadClearApi } from '@/api/distribution';
import detailUser from '@/components/detailUser';
import editFrom from './edit';
import levelEdit from './level';
import userList from '@/components/userList';
import couponList from '../components/couponList';
import giftToMembers from '../components/giftToMembers';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
import { Debounce } from '@/utils/validate';
import { handleDeleteTable } from '@/libs/public';
export default {
  name: 'UserIndex',
  components: { editFrom, userList, levelEdit, detailUser, couponList, giftToMembers },
  data() {
    return {
      registerTypeList: [
        {
          value: 'wechat',
          label: '公众号',
        },
        {
          value: 'routine',
          label: '小程序',
        },
        {
          value: 'h5',
          label: 'H5',
        },
        {
          value: 'iosWx',
          label: '微信ios',
        },
        {
          value: 'androidWx',
          label: '微信安卓',
        },
        {
          value: 'ios',
          label: 'ios',
        },
      ],
      formExtension: {
        spreadUid: '',
        userId: '',
      },
      selectedUser: {
        image: '',
        nickname: '',
      },
      ruleInline: {},
      extensionVisible: false,
      userVisible: false,
      levelInfo: '',
      pickerOptions: this.$timeOptions,
      loadingBtn: false,
      PointValidateForm: {
        integral: null,
        operateType: 'add',
        uid: '',
        money: null,
      },
      loadingPoint: false,
      VisiblePoint: false,
      visible: false,
      dialogVisible: false,
      levelVisible: false,
      labelData: [],
      selData: [],
      keywords: '',
      labelPosition: 'right',
      collapse: false,
      listLoading: true,
      tableData: {
        data: [],
        total: 0,
      },
      userFrom: {
        payCount: '',
        sex: '',
        identity: '',
        registerType: '',
        page: 1,
        limit: 20,
        searchType: 'all',
        content: '',
      },
      grid: {
        xl: 8,
        lg: 12,
        md: 12,
        sm: 24,
        xs: 24,
      },
      labelLists: [],
      selectedData: [],
      timeVal: [],
      dynamicValidateForm: {
        groupId: [],
      },
      loading: false,
      groupIdFrom: [],
      selectionList: [],
      batchName: '',
      uid: 0,
      Visible: false,
      keyNum: 0,
      multipleSelection: [],
      multipleSelectionAll: [],
      idKey: 'id',
      card_select_show: false,
      checkAll: false,
      checkedCities: ['ID', '头像', '姓名', '注册类型', '推荐人', '联系电话', '余额', '积分'],
      columnData: ['ID', '头像', '姓名', '注册类型', '推荐人', '联系电话', '余额', '积分'],
      isIndeterminate: true,
      type: 'integral',
      userInfo: {},
      checkedIds: [],
      selectAllPage: false,
      visibleCoupon: false, //发送优惠券显示
      isBatch: false, //是否是批量
      tableDataMember: [], //会员卡
      dialogVisibleMember: false,
      checkeduIds: '',
    };
  },
  activated() {
    this.getList(1);
  },
  mounted() {
    if (checkPermi(['platform:user:page:list'])) this.getList(1);
    if (checkPermi(['platform:user:tag:all:list'])) this.getTagList();
    if (checkPermi(['platform:paid:member:card:list'])) this.getMemberList();
  },
  methods: {
    checkPermi,
    sexFilter(status) {
      const statusMap = {
        0: '未知',
        1: '男',
        2: '女',
        3: '保密',
      };
      return statusMap[status];
    },
    //性别
    getSexImage(sex) {
      const iconMap = {
        0: 'unknown.png',
        1: 'man.png',
        2: 'woman.png',
        3: 'unknown.png',
      };
      const imageName = iconMap[sex] || 'unknown.png';
      return require(`@/assets/imgs/${imageName}`);
    },
    //赠送会员
    handleGiftMembers(row) {
      if (!this.multipleSelection.length && !row) return this.$message.warning('请选择用户');
      if (row) {
        this.checkeduIds = row.id;
      } else {
        this.getUserIds();
        this.checkeduIds = this.checkedIds.join(',');
      }
      this.dialogVisibleMember = true;
    },
    handlerSuccessSubmit() {
      this.handleClearCheckbox();
      this.dialogVisibleMember = false;
    },
    //会员卡列表
    async getMemberList() {
      try {
        this.tableDataMember = await memberCardListApi({ type: 1, status: 1 });
      } catch (e) {}
    },
    filterRegisterType(status) {
      const statusMap = {
        wechat: '#FD5ACC',
        routine: '#A277FF',
        h5: '#E8B600',
        iosWx: '#1BBE6B',
        androidWx: '#EF9C20',
        ios: '#1890FF',
      };
      return statusMap[status];
    },
    // 清除
    clearSpread(row) {
      this.$modalSure('解除【' + row.nickname + '】的上级推广人吗').then(() => {
        spreadClearApi(row.id).then((res) => {
          this.$message.success('清除成功');
          this.getList();
        });
      });
    },
    onSubExtension(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          updateSpreadApi(this.formExtension).then((res) => {
            this.$message.success('设置成功');
            this.extensionVisible = false;
            this.getList();
          });
        } else {
          return false;
        }
      });
    },
    getTemplateRow(row) {
      this.formExtension.spreadUid = row.id;
      this.selectedUser = {
        image: row.avatar,
        nickname: row.nickname,
      };
      this.userVisible = false;
    },
    setExtension(row) {
      this.formExtension = {
        spreadUid: '',
        userId: row.id,
      };
      this.selectedUser = {
        image: '',
        nickname: '',
      };
      this.extensionVisible = true;
    },
    handleCloseExtension() {
      this.extensionVisible = false;
      this.selectedUser = {
        image: '',
        nickname: '',
      };
    },
    modalPicTap() {
      this.userVisible = true;
    },
    resetForm() {
      this.visible = false;
    },
    reset(formName) {
      this.userFrom.payCount = '';
      this.userFrom.sex = '';
      this.userFrom.identity = '';
      this.userFrom.registerType = '';
      this.userFrom.page = 1;
      this.userFrom.searchType = 'all';
      this.userFrom.content = '';
      this.keywords = '';
      this.labelData = [];
      this.timeVal = [];
      this.getList(1);
    },
    Close() {
      this.Visible = false;
      this.levelVisible = false;
    },
    // 账户详情
    onDetails(id) {
      this.$refs.userDetailFrom.getUserDetail(id);
      this.$refs.userDetailFrom.dialogUserDetail = true;
    },
    // 积分余额
    editPoint(row, type) {
      this.uid = row.id;
      this.type = type;
      this.userInfo = row;
      this.VisiblePoint = true;
    },
    // 积分余额
    submitPointForm: Debounce(function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.PointValidateForm.uid = this.uid;
          this.loadingBtn = true;
          if (this.type === 'integral') {
            foundsApi(this.PointValidateForm)
              .then((res) => {
                this.$message.success('设置成功');
                this.loadingBtn = false;
                this.handlePointClose();
                this.getList();
              })
              .catch(() => {
                this.loadingBtn = false;
              });
          } else {
            balanceApi(this.PointValidateForm)
              .then((res) => {
                this.$message.success('设置成功');
                this.loadingBtn = false;
                this.handlePointClose();
                this.getList();
              })
              .catch(() => {
                this.loadingBtn = false;
              });
          }
        } else {
          return false;
        }
      });
    }),
    // 积分余额
    handlePointClose() {
      this.VisiblePoint = false;
      this.PointValidateForm = {
        integral: null,
        operateType: 'add',
        uid: '',
        money: null,
      };
    },
    editUser(row) {
      this.userInfo = row;
      this.visible = true;
    },
    submitForm: Debounce(function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.getUserIds();
          this.loading = true;
          tagPiApi({ tagIds: this.dynamicValidateForm.groupId.join(','), ids: this.checkedIds.join(',') })
            .then((res) => {
              this.$message.success('设置成功');
              this.loading = false;
              this.handleClose();
              this.getList();
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    }),
    setBatch(name, row, num) {
      num === 1 ? (this.isBatch = true) : (this.isBatch = false);
      this.batchName = name;
      if (row) {
        this.checkedIds = row.id;
        this.dynamicValidateForm.groupId = row.tagId ? row.tagId.split(',').map(Number) : [];
      } else {
        this.dynamicValidateForm.groupId = '';
      }
      if (this.multipleSelection.length === 0 && !row) return this.$message.warning('请选择要设置的用户');
      this.dialogVisible = true;
    },
    //清除选中
    handleClearCheckbox(){
      this.$refs.table.clearSelection();
      this.multipleSelectionAll = [];
    },
    handleClose() {
      this.handleClearCheckbox();
      this.dialogVisible = false;
      this.$refs['dynamicValidateForm'].resetFields();
    },
    // 搜索
    userSearchs() {
      this.userFrom.page = 1;
      this.getList();
    },
    // 具体日期
    onchangeTime(e) {
      this.timeVal = e;
      this.userFrom.dateLimit = e ? this.timeVal.join(',') : '';
    },
    //标签列表
    getTagList() {
      tagAllListApi().then((res) => {
        this.labelLists = res;
        localStorage.setItem('tagAllList', JSON.stringify(res));
      });
    },
    // 列表
    getList(num) {
      this.listLoading = true;
      this.userFrom.page = num ? num : this.userFrom.page;
      this.userFrom.tagIds = this.labelData.join(',');
      userListApi(this.userFrom)
        .then((res) => {
          this.tableData.data = res.list;
          this.tableData.total = res.total;
          this.$nextTick(function () {
            this.setSelectRow(); // 调用跨页选中方法
          });
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
      this.checkedCities = this.$cache.local.has('user_stroge')
        ? this.$cache.local.getJSON('user_stroge')
        : this.checkedCities;
      this.$set(this, 'card_select_show', false);
    },
    // 设置选中的方法
    setSelectRow() {
      if (!this.multipleSelectionAll || this.multipleSelectionAll.length <= 0) {
        return;
      }
      // 标识当前行的唯一键的名称
      const idKey = this.idKey;
      const selectAllIds = [];
      this.multipleSelectionAll.forEach((row) => {
        selectAllIds.push(row[idKey]);
      });
      this.$refs.table.clearSelection();
      for (var i = 0; i < this.tableData.data.length; i++) {
        if (selectAllIds.indexOf(this.tableData.data[i][idKey]) >= 0) {
          // 设置选中，记住table组件需要使用ref="table"
          this.$refs.table.toggleRowSelection(this.tableData.data[i], true);
        }
      }
    },
    // 设置选中的方法
    handleSelectionChange(val) {
      this.multipleSelection = val;
      setTimeout(() => {
        this.$selfUtil.changePageCoreRecordData(
          this.multipleSelectionAll,
          this.multipleSelection,
          this.tableData.data,
          (e) => {
            this.multipleSelectionAll = e;
          },
        );
      }, 50);
    },
    pageChange(page) {
      this.$selfUtil.changePageCoreRecordData(
        this.multipleSelectionAll,
        this.multipleSelection,
        this.tableData.data,
        (e) => {
          this.multipleSelectionAll = e;
        },
      );
      this.userFrom.page = page;
      this.getList();
    },
    handleSizeChange(val) {
      this.$selfUtil.changePageCoreRecordData(
        this.multipleSelectionAll,
        this.multipleSelection,
        this.tableData.data,
        (e) => {
          this.multipleSelectionAll = e;
        },
      );
      this.userFrom.limit = val;
      this.getList(1);
    },
    // 删除
    handleDelete(id, idx) {
      this.$modalSure().then(() => {
        productDeleteApi(id).then(() => {
          this.$message.success('删除成功');
          handleDeleteTable(this.tableData.data.length, this.userFrom);
          this.getList();
        });
      });
    },
    onchangeIsShow(row) {
      row.isShow
        ? putOnShellApi(row.id)
            .then(() => {
              this.$message.success('上架成功');
              this.getList();
            })
            .catch(() => {
              row.isShow = !row.isShow;
            })
        : offShellApi(row.id)
            .then(() => {
              this.$message.success('下架成功');
              this.getList();
            })
            .catch(() => {
              row.isShow = !row.isShow;
            });
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
      this.card_select_show = false;
      this.$modal.loading('正在保存到本地，请稍候...');
      this.$cache.local.setJSON('user_stroge', this.checkedCities);
      setTimeout(this.$modal.closeLoading(), 1000);
    },
    // 获取批量用户ids
    getUserIds() {
      const data = [];
      this.multipleSelectionAll.map((item) => {
        data.push(item.id);
      });
      this.checkedIds = data;
    },
    //发送优惠券
    sendCoupon() {
      if (this.multipleSelection.length > 0) {
        this.getUserIds();
        this.visibleCoupon = true;
      } else {
        this.$message.warning('请选择用户');
      }
    },
    sendSuccess() {
      this.handleClearCheckbox();
      this.visibleCoupon = false;
    },
  },
};
</script>

<style scoped lang="scss">
.sexImg,
img {
  width: 16px !important;
  height: 16px !important;
  margin-left: 2px;
}
::v-deep .el-table__cell:nth-child(2) .cell {
  padding-left: 14px;
  padding-right: 14px;
}

.red {
  color: #ed4014;
}

.el-icon-arrow-down {
  font-size: 12px;
}

.text-right {
  text-align: right;
}

.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 33.33%;
}

.seachTiele {
  line-height: 30px;
}

.container {
  min-width: 821px;

  ::v-deepel-form-item {
    width: 100%;
  }

  ::v-deepel-form-item__content {
    width: 72%;
  }
}

.ivu-ml-8 {
  color: var(--prev-color-primary);
}

.btn_bt {
  border-top: 1px dashed #ccc;
  padding-top: 20px;
}

.relative {
  position: relative;
}

.card_abs {
  position: absolute;
  padding-bottom: 15px;
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

::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #606266;
}

.userbtn {
  position: absolute;
  right: 0;
}

::v-deep.el-tag {
  color: #fff !important;
}

.search-form {
  display: flex;
  justify-content: space-between;

  .search-form-box {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
  }
}

.search-form-sub {
  display: flex;
}

::v-deep.el-select {
  width: 100%;
}

::v-deep .el-tag {
  border: none;
}

::v-deep .el-tag--small {
  line-height: 24px;
}

::v-deep .el-dialog__title {
  font-weight: 600 !important;
}

::v-deep .el-dialog__body {
  padding-top: 20px !important;
}
</style>
