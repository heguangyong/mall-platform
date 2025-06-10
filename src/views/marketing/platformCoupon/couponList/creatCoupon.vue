<template>
  <div class="divBox">
    <div class="container_box">
      <pages-header
        ref="pageHeader"
        :title="isEdit && !isCopy ? '编辑优惠券' : !isCopy ? '添加优惠券' : '复制优惠券'"
        backUrl="/marketing/PlatformCoupon/list"
      ></pages-header>
      <el-card class="mt14" :body-style="{ padding: '0 20px 20px' }" shadow="never" :bordered="false">
        <el-tabs v-if="tabList.length > 0" v-model="currentTab" class="list-tabs mb25">
          <el-tab-pane v-for="(item, index) in tabList" :key="index" :name="item.value" :label="item.title" />
        </el-tabs>
        <el-form
          ref="formValidate"
          v-loading="loading"
          class="formValidate"
          :rules="ruleValidate"
          :model="formValidate"
          label-width="150px"
          @submit.native.prevent
        >
          <div v-show="currentTab === '1'">
            <el-form-item label="优惠券名称：" prop="name">
              <el-input
                v-model="formValidate.name"
                size="small"
                class="from-ipt-width"
                placeholder="请输入优惠券名称"
                maxlength="20"
              />
            </el-form-item>
            <el-form-item label="优惠券面值(元)：" prop="money">
              <el-input-number
                type="number"
                v-model="formValidate.money"
                size="small"
                :disabled="isEdit && !isCopy"
                :max="9999"
                :min="1"
                :step="1"
                step-strictly
                placeholder="请输入优惠券面值"
                controls-position="right"
              >
                <span slot="suffix" class="suffix_text">元</span>
              </el-input-number>
            </el-form-item>
            <el-form-item label="使用门槛(元)：" prop="minPrice">
              <el-input-number
                v-model="formValidate.minPrice"
                size="small"
                :disabled="isEdit && !isCopy"
                :max="999999"
                :min="0"
                :step="1"
                step-strictly
                placeholder="请输入使用门槛"
                controls-position="right"
              >
                <span slot="suffix" class="suffix_text">元</span>
              </el-input-number>
              <p class="desc mt10">填写优惠券的最低消费金额，使用门槛为0时指无门槛</p>
            </el-form-item>
            <el-form-item label="领取方式：" prop="receiveType">
              <el-radio-group v-model="formValidate.receiveType" :disabled="isEdit && !isCopy">
                <el-radio :label="1">用户领取</el-radio>
                <el-radio :label="3">平台活动使用</el-radio>
              </el-radio-group>
              <p class="desc mt10">
                1. 用户手动领取指用户需要在移动端的领券中心领取优惠券；<br />
                2. 平台活动使用指其他营销活动可选择此类型优惠券，用户满足活动条件后直接提示发放 ；
              </p>
            </el-form-item>
            <el-form-item label="领取时间：" prop="isTimeReceive" v-if="formValidate.receiveType === 1">
              <el-radio-group v-model="formValidate.isTimeReceive" :disabled="isEdit && !isCopy">
                <el-radio :label="true">时间段</el-radio>
                <el-radio :label="false">不限时</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="formValidate.isTimeReceive && formValidate.receiveType === 1" prop="collectionTime">
              <el-date-picker
                v-model="formValidate.collectionTime"
                size="small"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptionsForEditCoupon"
                align="right"
                @change="onChangeCollectionTime"
              />
              <p class="desc mt10">优惠券可以在此时间范围之内领取</p>
            </el-form-item>
            <el-form-item label="使用有效期：" prop="isFixedTime">
              <el-radio-group v-model="formValidate.isFixedTime">
                <el-radio :label="false">天数</el-radio>
                <el-radio :label="true">时间段</el-radio>
              </el-radio-group>
              <p class="desc mt10">
                {{ !isEdit || isCopy ? '' : '优惠券编辑后，之前已经领取的优惠券使用有效期不会改变' }}
              </p>
            </el-form-item>
            <el-form-item v-if="!formValidate.isFixedTime" prop="day">
              <el-input-number
                size="small"
                placeholder="请输入天数"
                :max="999"
                :min="1"
                :step="1"
                step-strictly
                v-model="formValidate.day"
                controls-position="right"
              >
                <span slot="suffix" class="suffix_text">天</span>
              </el-input-number>
              <p class="desc mt10">领取之后多少天之后失效，失效的优惠券将不能使用</p>
            </el-form-item>
            <el-form-item v-if="formValidate.isFixedTime" prop="validityTime">
              <el-date-picker
                v-model="formValidate.validityTime"
                size="small"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
                @change="onChangeValidityTime"
                :picker-options="pickerOptionsForEditCoupon"
              />
            </el-form-item>
            <el-form-item :label="!isEdit || isCopy ? '发布数量(张)：' : '增加发布数量(张)：'" prop="isLimited">
              <el-radio-group v-model="formValidate.isLimited" :disabled="isEdit && !isCopy">
                <el-radio :label="true">限量</el-radio>
                <el-radio :label="false">不限量</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="formValidate.isLimited" prop="total">
              <el-input-number
                v-if="!isEdit || isCopy"
                size="small"
                placeholder="请输入优惠券数量"
                :max="999999"
                :step="1"
                :min="1"
                step-strictly
                v-model="formValidate.total"
                controls-position="right"
              >
                <span slot="suffix" class="suffix_text">张</span>
              </el-input-number>
              <el-input-number
                v-else
                size="small"
                placeholder="请输入优惠券数量"
                :max="999999"
                :step="1"
                :min="1"
                step-strictly
                v-model="formValidate.num"
                controls-position="right"
              >
                <span slot="suffix" class="suffix_text">张</span>
              </el-input-number>
              <p class="desc mt10">
                {{
                  !isEdit || isCopy
                    ? '填写优惠券的发放数量'
                    : '编辑时，填写优惠券增加的数量；例如：新增时填写2张优惠券，编辑时填写1，则编辑后总共发布3张优惠券'
                }}
              </p>
            </el-form-item>
            <el-form-item label="重复领取：" prop="isRepeated">
              <el-radio-group v-model="formValidate.isRepeated">
                <el-radio :label="false">不可重复</el-radio>
                <el-radio :label="true">可重复</el-radio>
              </el-radio-group>
              <p v-if="formValidate.receiveType === 1" class="desc mt10">
                可重复领取，若用户领取该优惠券且使用过后，可以再次领取；<br />
                不可重复领取，若用户领取该优惠券无论是否使用，都不可再次领取
              </p>
              <p v-else class="desc mt10">
                可重复领取，若多个营销活动赠送同一优惠券，一个用户可领取多张；<br />
                不可重复领取，若多个营销活动赠送同一优惠券，一个用户只能领取1张
              </p>
            </el-form-item>
            <el-form-item label="是否开启:">
              <el-switch
                :width="56"
                :disabled="isEdit && !isCopy"
                v-model="formValidate.status"
                active-text="开启"
                inactive-text="关闭"
              />
            </el-form-item>
          </div>
          <div v-show="currentTab === '2'">
            <el-form-item label-width="0">
              <el-radio-group v-model="formValidate.category" :disabled="isEdit && !isCopy">
                <el-radio :label="3">通用</el-radio>
                <el-radio :label="4">品类</el-radio>
                <el-radio :label="2">商品</el-radio>
                <el-radio :label="5">品牌</el-radio>
                <el-radio :label="6">跨店</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="formValidate.category == 4" label="选择分类:" :span="24" label-width="64px">
              <el-cascader
                class="from-ipt-width"
                ref="cascader"
                v-model="linkedData"
                clearable
                :options="merPlatProductClassify"
                :props="categoryProps"
              />
            </el-form-item>
            <el-form-item v-if="formValidate.category == 2" label-width="0">
              <el-button size="small" type="primary" @click="addGoods">添加商品</el-button>
              <el-button size="small" @click="batchDel" :disabled="!multipleSelection.length">批量删除</el-button>
            </el-form-item>
            <el-form-item v-if="formValidate.category == 2" label-width="0">
              <el-table
                ref="tableList"
                v-loading="listLoading"
                :data="tableData.data"
                style="width: 100%"
                size="small"
                @selection-change="handleSelectionChange"
                @select-all="selectAll"
                @select="selectOne"
                class="tableSelection"
              >
                <el-table-column type="selection" width="55"> </el-table-column>
                <el-table-column prop="id" label="ID" width="55"> </el-table-column>
                <el-table-column label="商品图" min-width="80">
                  <template slot-scope="scope">
                    <div class="demo-image__preview line-heightOne">
                      <el-image :src="scope.row.image" :preview-src-list="[scope.row.image]" />
                    </div>
                  </template>
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="name" label="商品名称" min-width="200" />
                <el-table-column prop="price" label="售价" min-width="90" />
                <el-table-column prop="stock" label="库存" min-width="70" />
                <el-table-column label="操作" width="140" fixed="right">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
            <el-form-item
              v-if="formValidate.category == 5"
              label="选择品牌:"
              :span="24"
              prop="proBrandList"
              label-width="64px"
            >
              <el-select
                class="from-ipt-width"
                clearable
                filterable
                v-model="proBrandList"
                :loading="loading"
                remote
                placeholder="请选择品牌"
              >
                <el-option v-for="(v, i) in productBrand" :key="i" :label="v.name" :value="v.id" :disabled="!v.isShow">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="选择商户:"
              v-if="formValidate.category == 6"
              :span="24"
              label-width="64px"
              prop="merIds"
            >
              <merchant-name
                @getMerId="getMerId"
                :multiple="true"
                :merIdChecked="merIds"
                style="width: 460px"
              ></merchant-name>
            </el-form-item>
          </div>
        </el-form>
      </el-card>
    </div>
    <el-card dis-hover class="fixed-card box-card" shadow="never" :bordered="false">
      <div class="acea-row row-center-wrapper">
        <el-button
          type="primary"
          v-show="currentTab === '1'"
          v-debounceClick="
            () => {
              submitForm('formValidate');
            }
          "
          size="small"
          >下一步</el-button
        >
        <el-button v-show="currentTab === '2'" @click="currentTab = '1'" size="small" class="priamry_border"
          >上一步</el-button
        >
        <el-button
          v-show="currentTab === '2' && checkPermi(['platform:coupon:add', 'platform:coupon:update'])"
          type="primary"
          v-debounceClick="
            () => {
              save('formValidate');
            }
          "
          size="small"
          >保存</el-button
        >
      </div>
    </el-card>
  </div>
</template>
<script>
import { couponInfoApi, platformCouponAddApi, platformCouponEditApi } from '@/api/marketing';
import { mapGetters } from 'vuex';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
import merchantName from '@/components/merUseCategory';
import { Debounce } from '@/utils/validate';
export default {
  name: 'createCoupon',
  data() {
    return {
      currentTab: '1',
      tabList: [
        { value: '1', title: '基础设置' },
        { value: '2', title: '使用范围' },
      ],
      loading: false,
      formValidate: {
        name: '', //优惠券名称
        category: 3, //适用范围
        money: 1, //面值
        minPrice: 0, //使用门槛
        receiveType: 1, //领取方式
        isTimeReceive: true, //领取时间类型
        receiveStartTime: '', //可领取开始时间
        receiveEndTime: '', //可领取结束时间
        isFixedTime: false,
        day: 1, //天数
        useStartTime: '', //可使用时间范围 开始时间
        useEndTime: '', //可使用时间范围 结束时间
        isLimited: true, //是否限量
        total: 1, //总数
        num: 1, //编辑优惠券发布数量
        isRepeated: false, //是否可重复领取
        linkedData: null, //关联数据
        status: false,
        validityTime: [], //使用有效期
        collectionTime: [], //领取时间
      },
      pickerOptionsForEditCoupon: {
        // 时间有效校验
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      ruleValidate: {
        name: [{ required: true, message: '请输入优惠券名称' }],
        money: [{ required: true, message: '请输入优惠券面值' }],
        minPrice: [{ required: true, message: '请输入优惠券使用门槛' }],
        receiveType: [{ required: true, message: '请选择领取方式' }],
        isTimeReceive: [{ required: true, message: '请选择领取时间类型' }],
        day: [{ required: true, message: '请输入天数' }],
        total: [{ required: true, message: '请输入发布数量' }],
        isLimited: [{ required: true, message: '请选择使用有效期' }],
        isRepeated: [{ required: true, message: '请选择是否可重复领取' }],
        isFixedTime: [{ required: true, message: '请选择使用有效期' }],
        validityTime: [
          {
            type: 'array',
            required: true,
            message: '请选择日期区间',
            fields: {
              0: {
                //type: 'tpye', //tpye类型试情况而定,所以如果返回的是date就改成date
                required: true,
                trigger: 'change',
                message: '请选择开始日期',
              },
              1: {
                //type: 'tpye',
                required: true,
                trigger: 'change',
                message: '请选择结束日期',
              },
            },
          },
        ],
        collectionTime: [
          {
            type: 'array',
            required: true,
            message: '请选择日期区间',
            fields: {
              0: {
                //type: 'tpye', //tpye类型试情况而定,所以如果返回的是date就改成date
                required: true,
                trigger: 'change',
                message: '请选择开始日期',
              },
              1: {
                //type: 'tpye',
                required: true,
                trigger: 'change',
                message: '请选择结束日期',
              },
            },
          },
        ],
      },
      categoryProps: {
        value: 'id',
        label: 'name',
        children: 'childList',
        expandTrigger: 'hover',
        checkStrictly: false,
        emitPath: false,
        multiple: false,
      },
      listLoading: false,
      selectGoods: false,
      multipleSelection: [],
      tableData: {
        data: [],
        total: 0,
      },
      proBrandList: '',
      merIds: [],
      ids: [],
      linkedData: null,
    };
  },
  components: { merchantName },
  computed: {
    ...mapGetters(['merPlatProductClassify', 'productBrand']),
    isEdit() {
      return this.$route.params.id ? true : false;
    },
    isCopy() {
      return this.$route.params.copy ? true : false;
    },
  },
  created() {
    this.tempRoute = Object.assign({}, this.$route);
  },
  mounted() {
    this.setTagsViewTitle();
    if (!localStorage.getItem('merPlatProductClassify')) this.$store.dispatch('product/getAdminProductClassify');
    if (!localStorage.getItem('productBrand')) this.$store.dispatch('product/getMerProductBrand');
    if (this.isEdit) {
      this.getInfo();
    }
  },
  methods: {
    checkPermi,
    //设置标题
    setTagsViewTitle() {
      if (this.$route.params.id && this.$route.params.id != 0) {
        const title = this.isEdit && !this.isCopy ? '编辑优惠券' : this.isCopy ? '复制优惠券' : '添加优惠券';
        const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.$route.params.id}` });
        this.$store.dispatch('tagsView/updateVisitedView', route);
      }
    },
    // 具体日期
    onChangeValidityTime(e) {
      this.formValidate.validityTime = e;
      this.formValidate.useStartTime = e ? e[0] : '';
      this.formValidate.useEndTime = e ? e[1] : '';
    },
    // 领取时间
    onChangeCollectionTime(e) {
      this.formValidate.collectionTime = e;
      this.formValidate.receiveStartTime = e ? e[0] : '';
      this.formValidate.receiveEndTime = e ? e[1] : '';
    },
    back() {
      this.$router.push({ path: '/marketing/PlatformCoupon/list' });
    },
    // 获取商户id
    getMerId(id) {
      this.merIds = id;
    },
    addGoods() {
      const _this = this;
      this.$modalGoodList(
        function (row) {
          _this.listLoading = false;
          _this.tableData.data = row;
        },
        'many',
        _this.tableData.data,
      );
    },
    //行删除
    handleDelete(index, row) {
      this.$modalSure('删除该商品吗？').then(() => {
        this.tableData.data.splice(index, 1);
      });
    },
    //批量删除
    batchDel() {
      this.$modalSure('批量删除该商品吗？').then(() => {
        let data = [];
        for (let item1 of this.tableData.data) {
          let _index = this.multipleSelection.findIndex((c) => c.id === item1.id);
          if (_index === -1) {
            data.push(item1);
          }
        }
        this.tableData.data = data;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    selectAll(data) {
      let id = data.map((i, index) => {
        return i.spu_id;
      });
      this.ids = Array.from(new Set([...this.ids, ...id]));
    },
    selectOne(data, row) {
      let id = data.map((i, index) => {
        return i.spu_id;
      });
      let index = this.ids.findIndex((e) => {
        return e == row.spu_id;
      });
      this.ids.splice(index, 1);
      this.ids = Array.from(new Set([...this.ids, ...id]));
    },
    handleCommand(command) {
      this.$message('click on item ' + command);
      this.selectAllPage = command === 'all';
      this.$nextTick(() => {
        this.$refs.tableList.toggleAllSelection();
      });
    },
    getInfo() {
      couponInfoApi(this.$route.params.id).then((res) => {
        this.formValidate = JSON.parse(JSON.stringify(res));
        if (this.formValidate.isTimeReceive) {
          this.$set(this.formValidate, 'collectionTime', [
            this.formValidate.receiveStartTime,
            this.formValidate.receiveEndTime,
          ]);
        }
        if (res.category == 6) {
          this.merIds = this.formValidate.linkedData.split(',');
        } else if (this.formValidate.category == 4) {
          this.linkedData = Number(this.formValidate.linkedData);
        } else if (this.formValidate.category == 2) {
          this.tableData.data = this.formValidate.productList;
        } else if (this.formValidate.category == 5) {
          this.proBrandList = Number(this.formValidate.linkedData);
        }
        if (this.formValidate.useStartTime && this.formValidate.useEndTime) {
          this.$set(this.formValidate, 'validityTime', [res.useStartTime, res.useEndTime]);
        }
        this.formValidate.num = 1;
      });
    },
    submitForm: Debounce(function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.currentTab = '2';
        } else {
          this.$message.warning('请完善基础设置信息');
        }
      });
    }),
    //保存
    save() {
      switch (this.formValidate.category) {
        case 6:
          this.formValidate.linkedData = this.merIds.toString();
          break;
        case 2:
          if (!this.tableData.data.length) return this.$message.error('请选择至少一个商品');
          let data = [];
          this.tableData.data.map((item) => data.push(item.id));
          this.formValidate.linkedData = data.toString();
          break;
        case 4:
          this.formValidate.linkedData = this.linkedData;
          break;
        case 5:
          this.formValidate.linkedData = this.proBrandList.toString();
          break;
        default:
          this.formValidate.linkedData = '';
          break;
      }
      if (this.formValidate.receiveType === 3) this.formValidate.isTimeReceive = false;
      if (!this.formValidate.isLimited) {
        this.formValidate.total = 1;
      }
      if (this.isEdit && !this.isCopy) {
        platformCouponEditApi(this.formValidate).then((res) => {
          this.$message.success('添加成功');
          this.back();
        });
      } else {
        platformCouponAddApi(this.formValidate).then((res) => {
          this.$message.success('添加成功');
          this.back();
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .selWidth {
  width: 460px !important;
}
.add_title {
  position: relative;
}
.box-body {
  ::v-deep.el-card__body {
    padding-top: 0px;
  }
}
.from-ipt-width {
  width: 460px;
}
.input_width {
  width: 100px;
}
.pictrue {
  width: 58px;
  height: 58px;
  margin-right: 10px;
  position: relative;
  img {
    width: 100%;
    height: 100%;
  }
  .del {
    position: absolute;
    top: 0;
    right: 0;
  }
}
.suffix_text {
  color: #333;
}
</style>
