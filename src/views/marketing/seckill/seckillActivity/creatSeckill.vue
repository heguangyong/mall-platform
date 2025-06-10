<template>
  <div class="divBox">
    <div class="container_box">
      <pages-header
        ref="pageHeader"
        :title="pageType ? '添加商品' : `${title}秒杀活动`"
        backUrl="/marketing/seckill/seckillActivity"
      ></pages-header>
      <el-card class="box-card box-body mt14" :bordered="false" shadow="never">
        <el-tabs v-model="activeName" class="mb25 list-tabs">
          <el-tab-pane v-if="!pageType" label="基础设置" name="first"></el-tab-pane>
          <el-tab-pane :label="!isEdit || pageType ? '添加商品' : '商品列表'" name="second"></el-tab-pane>
        </el-tabs>
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="75px" size="small" class="demo-ruleForm">
          <div v-loading="loading">
            <template v-if="activeName == 'first' && !pageType">
              <el-form-item label="活动名称：" prop="name">
                <el-input
                  :disabled="pageType"
                  v-model="ruleForm.name"
                  placeholder="请输入活动名称"
                  class="from-ipt-width"
                ></el-input>
              </el-form-item>
              <el-form-item label="活动日期：" prop="timeVal">
                <el-date-picker
                  :disabled="pageType"
                  v-model="ruleForm.timeVal"
                  value-format="yyyy-MM-dd"
                  align="right"
                  unlink-panels
                  format="yyyy-MM-dd"
                  size="small"
                  type="daterange"
                  placement="bottom-end"
                  placeholder="自定义时间"
                  class="from-ipt-width"
                  @change="onchangeTime"
                  :picker-options="pickerOptions"
                />
                <p class="desc mt10">设置活动开始日期与结束日期，用户可以在有效时间内参与秒杀</p>
              </el-form-item>
              <el-form-item label="秒杀场次:" prop="timeVal2">
                <el-select
                  :disabled="pageType"
                  v-model="ruleForm.timeVal2"
                  placeholder="请选择秒杀场次"
                  multiple
                  cearable
                  class="from-ipt-width"
                  @change="onchangeTime2"
                >
                  <el-option
                    v-for="item in spikeTimeList"
                    :key="item.id + 'onl'"
                    :label="item.name + ' | ' + item.startTime + '-' + item.endTime"
                    :value="item.id"
                    :disabled="item.status === 0"
                  />
                </el-select>
                <p class="desc mt10">
                  选择商品开始时间段，该时间段内用户可参与购买；其它时间段会显示活动未开始或已结束，可多选
                </p>
              </el-form-item>
              <el-form-item label="活动限购:">
                <el-input-number
                  :disabled="pageType"
                  v-model="ruleForm.allQuota"
                  controls-position="right"
                  :min="0"
                  :max="99999"
                  class="from-ipt-width"
                ></el-input-number>
                <p class="desc mt10">
                  活动有效期内每个用户可购买该商品总数限制。例如设置为4，表示本次活动有效期内，每个用户最多可购买总数4个，0为不限购
                </p>
              </el-form-item>
              <el-form-item label="单次限购:">
                <el-input-number
                  :disabled="pageType"
                  v-model="ruleForm.oneQuota"
                  controls-position="right"
                  :min="0"
                  :max="99999"
                  class="from-ipt-width"
                ></el-input-number>
                <p class="desc mt10">
                  用户参与秒杀时，一次购买最大数量限制。例如设置为2，表示参与秒杀时，用户一次购买数量最大可选择2个，0为不限购
                </p>
              </el-form-item>
              <el-form-item label="商品范围:">
                <el-select
                  :disabled="pageType"
                  v-model="ruleForm.proCategorylist"
                  placeholder="请选择商品分类"
                  multiple
                  class="from-ipt-width"
                >
                  <el-option
                    v-for="item in merPlatProductClassify"
                    :key="item.id + 'onl'"
                    :label="item.name"
                    :value="item.id"
                    :disabled="!item.isShow"
                  />
                </el-select>
                <p class="desc mt10">设置秒杀活动可以参与的商品分类，可多选，不选为全品类商品。</p>
              </el-form-item>
              <el-form-item label="参与门槛:" prop="merStars">
                <el-rate :disabled="pageType" v-model="ruleForm.merStars" style="margin-top: 6px"></el-rate>
                <p class="desc mt10">设置秒杀活动可以参与的商户星级。</p>
              </el-form-item>
            </template>
            <template v-if="activeName == 'second'">
              <div v-if="!isEdit || pageType" class="acea-row row-between-wrapper">
                <div class="acea-row mb20">
                  <el-button size="small" type="primary" @click="addGoods()">添加商品</el-button>
                  <el-dropdown size="small" class="ml10 mr10">
                    <el-button :disabled="isShowCheck">
                      批量设置<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item :disabled="isShowCheck" @click.native="setPrice(2)">限量</el-dropdown-item>
                      <el-dropdown-item :disabled="isShowCheck" @click.native="setPrice(1)">活动价</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <el-button size="small" @click="batchDel" :disabled="isShowCheck">批量删除</el-button>
                </div>
              </div>
              <el-table
                ref="tableList"
                row-key="id"
                :data="proData"
                v-loading="listLoading"
                size="small"
                default-expand-all
                :tree-props="{ children: 'children' }"
                style="width: 100%"
              >
                <el-table-column width="30"></el-table-column>
                <el-table-column width="50">
                  <template slot="header" slot-scope="scope">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" />
                  </template>
                  <template slot-scope="scope" v-if="!scope.row.sku">
                    <el-checkbox :value="scope.row.checked" @change="(v) => handleCheckOneChange(v, scope.row)" />
                  </template>
                </el-table-column>
                <el-table-column width="240" label="商品信息">
                  <template slot-scope="scope">
                    <div class="acea-row">
                      <div class="demo-image__preview mr10 line-heightOne">
                        <el-image :src="scope.row.image" :preview-src-list="[scope.row.image]" />
                      </div>
                      <div class="row_title line2">{{ scope.row.name }}</div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="categoryName" label="商品分类" min-width="80" />
                <el-table-column prop="price" label="售价" width="120" />
                <el-table-column :label="isEdit && !pageType ? '限量剩余' : '库存'" min-width="80">
                  <template slot-scope="scope">
                    {{ isEdit && !pageType ? scope.row.quota : scope.row.stock }}
                  </template>
                </el-table-column>
                <el-table-column label="限量" width="120">
                  <template slot-scope="scope" v-if="scope.row.sku || ($route.params.id!=0 && !pageType)">
                    <span v-if="isEdit && !pageType">{{ scope.row.quotaShow }}</span>
                    <el-input-number
                      v-else
                      :disabled="isEdit && !pageType"
                      v-model="scope.row.quota"
                      :precision="0"
                      :min="0"
                      :max="scope.row.stock"
                      :controls="false"
                      class="input_width"
                    >
                    </el-input-number>
                  </template>
                </el-table-column>
                <el-table-column prop="activityPrice" label="活动价格" width="120">
                  <template slot-scope="scope" v-if="scope.row.sku || ($route.params.id!=0 && !pageType)">
                    <span v-if="isEdit && !pageType">{{ scope.row.seckillPrice }}</span>
                    <el-input-number
                      v-else
                      :disabled="isEdit && !pageType"
                      v-model="scope.row.activityPrice"
                      type="number"
                      :precision="2"
                      :min="0.01"
                      :max="99999"
                      :controls="false"
                      class="input_width"
                    >
                    </el-input-number>
                  </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序" width="120">
                  <template slot-scope="scope" v-if="!scope.row.sku">
                    <el-input-number
                      :disabled="isEdit && !pageType"
                      v-model="scope.row.sort"
                      type="number"
                      :precision="0"
                      :min="0"
                      :max="99999"
                      :controls="false"
                      class="input_width"
                    >
                    </el-input-number>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="60" fixed="right">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      size="small"
                      :disabled="isEdit && !pageType"
                      v-if="!scope.row.sku"
                      @click="handleDelete(scope.$index, scope.row)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </div>
        </el-form>
      </el-card>
      <el-card dis-hover class="fixed-card box-card" :bordered="false" shadow="never">
        <div class="acea-row row-center-wrapper">
          <el-button v-show="activeName == 'first'" size="small" type="primary" @click="activeName = 'second'"
            >下一步</el-button
          >
          <el-button
            v-show="activeName == 'second' && !pageType"
            size="small"
            class="priamry_border"
            @click="activeName = 'first'"
            >上一步</el-button
          >

          <el-button
            :disabled="ruleForm.status == 2"
            v-show="
              (activeName == 'second' || (activeName == 'first' && isEdit && !pageType)) &&
              checkPermi(['platform:seckill:activity:add', 'platform:seckill:activity:update'])
            "
            type="primary"
            v-debounceClick="
              () => {
                submitForm('ruleForm');
              }
            "
            size="small"
            >保存</el-button
          >
        </div>
      </el-card>
    </div>
    <activity ref="activityModal" key="keyNum" @onChange="setActivity" />
  </div>
</template>

<script>
import {
  seckillIntervalListApi,
  seckillActivityAddApi,
  seckillActivityDetailApi,
  seckillAtivityUpdateApi,
  seckillProAdd,
} from '@/api/marketing';
import { mapGetters } from 'vuex';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
import activity from './activity.vue';
import { Debounce } from '@/utils/validate';
export default {
  name: 'creatSeckill',
  components: {
    activity,
  },
  data() {
    return {
      activeName: 'first',
      ruleForm: {
        allQuota: 0,
        endDate: '',
        merStars: 1,
        name: '',
        oneQuota: 0,
        proCategory: '',
        startDate: '',
        timeIntervals: '',
        id: '',
        productList: [],
        timeVal2: [],
        timeVal: [],
        proCategorylist: [],
      },
      rules: {
        name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        share: [{ required: true, message: '请选择优惠比例', trigger: 'change' }],
        timeVal: [{ required: true, message: '请选择活动日期' }],
        discount: [{ required: true, message: '请选择优惠方式' }],
        timeVal2: [{ type: 'array', required: true, message: '请选择秒杀场次', trigger: 'change' }],
        merStars: [{ required: true, message: '请选择商户星级', trigger: 'change' }],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      spikeTimeList: [],
      multipleSelection: [],
      activityType: null,
      proData: [],
      listLoading: false,
      checkAll: false,
      isIndeterminate: true,
      tempRoute: {},
      isShowCheck: false,
      keyNum: 0,
      loading: false,
    };
  },
  created() {
    this.tempRoute = Object.assign({}, this.$route);
  },
  mounted() {
    if (!this.merPlatProductClassify.length) this.$store.dispatch('product/getAdminProductClassify');
    if (this.pageType) this.activeName = 'second';
    this.setTagsViewTitle();
    this.getSeckillIntervalList();
    this.isCkecked();
    if (this.$route.params.id!=0 && !this.pageType) {
      this.getInfo();
    }
  },
  computed: {
    ...mapGetters(['merPlatProductClassify']),
    //是否是编辑
    isEdit() {
      return this.$route.params.id!=0 ? true : false;
    },
    title() {
      return this.$route.params.id!=0 ? '编辑' : '添加';
    },
    //页面是添加商品还是编辑页面，add添加商品，edit编辑
    pageType() {
      return this.$route.params.type === 'add' ? true : false;
    },
  },
  methods: {
    checkPermi,
    setTagsViewTitle() {
      if (this.$route.params.id!=0) {
        const title = this.pageType ? '添加商品' : this.$route.params.id!=0 ? '编辑秒杀活动' : '添加秒杀活动';
        const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.$route.params.id}` });
        this.$store.dispatch('tagsView/updateVisitedView', route);
      }
    },
    // 判断选中没有
    isCkecked() {
      let checked = this.proData.filter((item) => item.checked);
      if (checked.length) {
        this.isShowCheck = false;
      } else {
        this.isShowCheck = true;
      }
    },
    //全选
    handleCheckAllChange(val) {
      this.isIndeterminate = !this.isIndeterminate;
      this.proData.forEach((item) => {
        this.$set(item, 'checked', val);
      });
      this.isCkecked();
    },
    //单选
    handleCheckOneChange(val, row) {
      let totalCount = this.proData.length;
      let someStatusCount = 0;
      this.$set(row, 'checked', val);
      this.proData.forEach((item) => {
        if (item.checked === val) {
          someStatusCount++;
        }
      });
      this.checkAll = totalCount === someStatusCount ? val : !val;
      this.isIndeterminate = someStatusCount > 0 && someStatusCount < totalCount;
      this.isCkecked();
    },
    //详情
    getInfo() {
      this.loading = true;
      seckillActivityDetailApi(this.$route.params.id)
        .then((res) => {
          let info = res;
          this.ruleForm = {
            ...res,
            timeVal2: info.timeIntervals.split(',').map((item) => item * 1),
            timeVal: [info.startDate, info.endDate],
            proCategorylist: info.proCategory !== '0' ? info.proCategory.split(',').map((item) => item * 1) : [],
          };
          this.getAttrValue(info.productList);
          this.loading = false;
          //this.isIndeterminate = !this.isIndeterminate;
        })
        .catch((res) => {
          this.loading = false;
        });
    },
    back() {
      this.$router.push({ path: `/marketing/seckill/seckillActivity` });
    },
    //行删除
    handleDelete(index, row) {
      this.$modalSure('删除该秒杀商品吗？').then(() => {
        let i = this.proData.findIndex((item) => item == row);
        this.proData.splice(i, 1);
      });
    },
    setActivity(data, type) {
      if (type == 1) {
        if (data.type == 0) {
          this.proData.forEach((item) => {
            item.children.forEach((item1) => {
              if (item.checked) {
                this.$set(item1, 'activityPrice', data.price);
              }
            });
          });
        } else {
          this.proData.forEach((item) => {
            item.children.forEach((item1) => {
              if (item.checked) {
                this.$set(item1, 'activityPrice', (item1.price * data.discount) / 100);
              }
            });
          });
        }
      } else if (type == 2) {
        this.proData.forEach((item) => {
          item.children.forEach((item1) => {
            if (item.checked) {
              this.$set(item1, 'quota', data.activity_stock);
            }
          });
        });
      }
    },
    // 列表
    getSeckillIntervalList() {
      seckillIntervalListApi().then((res) => {
        this.spikeTimeList = res;
      });
    },
    addGoods() {
      const _this = this;
      this.$modalGoodList(
        function (row) {
          _this.listLoading = false;
          _this.getAttrValue(row);
        },
        'many',
        _this.proData,
      );
    },
    // 选中商品
    getAttrValue(row) {
      const _this = this;
      row.map((item) => {
        _this.$set(item, 'sort', item.sort ? item.sort : 0);
        _this.$set(item, 'id', item.id ? item.id : 0);
        _this.$set(item, 'checked', true);
        item.attrValue.map((i) => {
          _this.$set(i, 'name', i.sku);
          _this.$set(i, 'merName', item.merName);
          _this.$set(i, 'categoryName', item.categoryName);
          _this.$set(i, 'quota', i.quota ? i.quota : 0);
          _this.$set(i, 'quotaShow', i.quotaShow ? i.quotaShow : 0);
          _this.$set(i, 'activityPrice', this.$route.params.id!=0 && !this.pageType ? i.price : 0);
          _this.$set(i, 'price', this.$route.params.id!=0 && !this.pageType ? i.otPrice : i.price);
        });
        _this.$set(item, 'children', item.attrValue);
      });
      _this.proData = row;
      _this.isCkecked();
    },
    batchDel() {
      this.$modalSure(`批量删除商品吗？`).then(() => {
        this.proData = this.proData.filter((item) => !item.checked);
      });
    },
    //设置活动价
    setPrice(type) {
      this.keyNum = Math.random();
      this.$refs.activityModal.type = type;
      this.$refs.activityModal.showStatus = true;
    },
    // 具体日期
    onchangeTime2(e) {
      this.ruleForm.timeIntervals = e.toString();
    },
    // 具体日期
    onchangeTime(e) {
      this.ruleForm.timeVal = e;
      this.ruleForm.startDate = e ? e[0] : '';
      this.ruleForm.endDate = e ? e[1] : '';
    },
    submitForm: Debounce(function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.proData.length > 0) {
            let total = 0;
            let price = 0;
            // 编辑时候的校验
            if(this.$route.params.id!=0 && !this.pageType){
              this.proData.map((item) => {
                total += item.quota;
                price += item.seckillPrice;
              });
            }else{
              // 新增时候的校验，格式不一样
              this.proData.map((item) => {
                item.children.map((i) => {
                  total += i.quota;
                  price += i.activityPrice;
                });
              });
            }

            if (!total && total !== 0) return this.$message.warning('商品限量不能为空');
            if (!price) return this.$message.warning('商品秒杀价格不能为空');
            if (total < this.proData.length) return this.$message.warning('商品限量总和不能小于0');
          }
          this.ruleForm.productList = this.proData.map((item) => {
            return {
              id: item.id,
              sort: item.sort,
              attrValue: item.attrValue.map((item1) => {
                return {
                  activityPrice: item1.activityPrice,
                  attrValueId: item1.id,
                  quota: item1.quota,
                };
              }),
            };
          });
          this.ruleForm.proCategory = this.ruleForm.proCategorylist.length
            ? this.ruleForm.proCategorylist.toString()
            : '0';
          if (this.pageType) {
            seckillProAdd({
              id: this.$route.params.id,
              productList: this.ruleForm.productList,
            })
              .then((res) => {
                this.$message.success('添加成功');
                this.$router.push({ path: `/marketing/seckill/seckillActivity` });
              })
              .catch((res) => {});
          } else {
            this.$route.params.id!=0
              ? seckillAtivityUpdateApi(this.ruleForm)
                  .then((res) => {
                    this.$message.success('编辑成功');
                    this.$router.push({ path: `/marketing/seckill/seckillActivity` });
                  })
                  .catch((res) => {})
              : seckillActivityAddApi(this.ruleForm)
                  .then((res) => {
                    this.$message.success('添加成功');
                    this.$router.push({ path: `/marketing/seckill/seckillActivity` });
                  })
                  .catch((res) => {});
          }
        } else {
          return false;
        }
      });
    }),
  },
};
</script>

<style lang="scss" scoped>
.add_title {
  position: relative;
}
.box-body {
  ::v-deep.el-card__body {
    padding-top: 0px;
  }
}

.f-w-500 {
  font-weight: 500;
}
.f-s-18 {
  font-size: 18px;
}
.ml32 {
  margin-left: 32px;
}
.row_title {
  width: 170px !important;
}
.input_width {
  width: 100px;
}
.desc {
  color: #999;
  font-size: 12px;
  line-height: 16px;
  margin: 0;
}
.mt10 {
  margin-top: 10px;
}
.mr14 {
  margin-right: 14px;
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
</style>
