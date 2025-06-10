<template>
  <div class="divBox">
    <el-card class="box-card mb20" :body-style="{ padding: '0 20px 20px' }" shadow="never" :bordered="false">
      <el-tabs class="list-tabs" v-model="currentTab">
        <el-tab-pane v-for="(item, index) in tabList" :key="index" :name="item.value" :label="item.title" />
      </el-tabs>
      <!-- 首页广告-->
      <template v-if="currentTab === '0'">
        <FromList :configObj="advertisementlistConfig"></FromList>
        <el-button
          v-hasPermi="['platform:pc:shopping:home:advertisement:edit']"
          type="primary"
          @click="handleAdvertisementSave"
          >{{ loadingBtn ? '提交中 ...' : '保存' }}</el-button
        >
      </template>
      <!-- 首页banner-->
      <template v-if="currentTab === '1'">
        <FromList :configObj="bannerListConfig"></FromList>
        <el-button v-hasPermi="['platform:pc:shopping:home:banner:save']" type="primary" @click="handleBannerSave">{{
          loadingBtn ? '提交中 ...' : '保存'
        }}</el-button>
      </template>
      <!-- 首页推荐-->
      <template v-if="currentTab === '2'">
        <el-button
          v-hasPermi="['platform:pc:shopping:home:recommended:add']"
          :disabled="tableData.data.length >= 10"
          type="primary"
          size="small"
          class="mb20"
          @click="handleAdd"
          >添加板块</el-button
        >
        <el-table
          v-loading="listLoading"
          :data="tableData.data"
          style="width: 100%"
          size="small"
          row-key="brand_id"
          :default-expand-all="false"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <el-table-column prop="id" label="ID" min-width="60" />
          <el-table-column label="板块名称" prop="name" min-width="150" />
          <el-table-column prop="sort" label="排序" min-width="50" />
          <el-table-column prop="status" label="是否显示" min-width="100" fixed="right">
            <template slot-scope="scope">
              <el-switch
                v-if="checkPermi(['platform:pc:shopping:home:recommended:switch'])"
                v-model="scope.row.status"
                :active-value="true"
                :inactive-value="false"
                active-text="显示"
                inactive-text="隐藏"
                @change="onchangeIsShow(scope.row)"
              />
              <div v-else>{{ scope.row.status ? '显示' : '隐藏' }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" fixed="right">
            <template slot-scope="scope">
              <a v-hasPermi="['platform:pc:shopping:home:recommended:edit']" @click="handleEdit(scope.row)">编辑</a>
              <el-divider direction="vertical"></el-divider>
              <a
                v-hasPermi="['platform:pc:shopping:home:recommended:delete']"
                @click="handleDelete(scope.row.id, scope.$index)"
                >删除</a
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 顶部菜单-->
      <template v-if="currentTab === '3'">
        <FromList :configObj="menuListConfig"></FromList>
        <el-button v-hasPermi="['platform:pc:shopping:home:navigation:save']" type="primary" @click="handleMenuSave">{{
          loadingBtn ? '提交中 ...' : '保存'
        }}</el-button>
      </template>
    </el-card>

    <!--添加首页推荐模板-->
    <el-drawer size="1000px" :visible.sync="drawer" direction="rtl" class="showHeader" :before-close="handleClose">
      <div slot="title" class="demo-drawer_title">{{ dataForm.id ? '编辑推荐板块' : '添加推荐板块' }}</div>
      <div v-if="drawer" class="demo-drawer__content detailSection">
        <el-form
          ref="dataForm"
          v-loading="fullscreenLoading"
          class="dataForm mt20"
          :rules="ruleValidate"
          :model="dataForm"
          label-width="120px"
          @submit.native.prevent
        >
          <el-form-item label="板块名称：" prop="name">
            <el-input
              v-model="dataForm.name"
              maxlength="6"
              size="small"
              class="from-ipt-width"
              placeholder="请输入板块名称"
            />
          </el-form-item>
          <el-form-item label="广告图链接：">
            <el-input v-model="dataForm.linkUrl" size="small" class="from-ipt-width" placeholder="请输入广告图链接" />
          </el-form-item>
          <el-form-item label="广告图(471*350)：" prop="imageUrl">
            <div class="upLoadPicBox" @click="modalPicTap(false, 'dan')">
              <div v-if="dataForm.imageUrl" class="pictrue"><img :src="dataForm.imageUrl" /></div>
              <div v-else class="upLoad">
                <i class="el-icon-camera cameraIconfont" />
              </div>
            </div>
          </el-form-item>
          <el-form-item label="排序：">
            <el-input-number
              v-model.trim="dataForm.sort"
              :min="0"
              :max="99"
              :step="1"
              step-strictly
              label="排序"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="是否开启：">
            <el-switch
              :width="56"
              v-model="dataForm.status"
              :active-value="true"
              :inactive-value="false"
              active-text="开启"
              inactive-text="关闭"
            />
          </el-form-item>
          <el-form-item label="选择商品：" prop="playType">
            <el-radio-group v-model="dataForm.playType" @input="handlePlayTypeChange">
              <el-radio label="product">指定商品参与</el-radio>
              <el-radio label="brand">指定品牌参与</el-radio>
              <el-radio label="category">指定分类参与</el-radio>
              <el-radio label="merchant">指定商户参与</el-radio>
            </el-radio-group>
            <product-association-form
              :productAssociationType="dataForm.playType"
              :formValidate="dataForm"
              :multipleBrand="false"
              :multipleCategory="false"
              :isBatchDelete="false"
              :multipleMer="multipleMer"
              class="mt20"
              @getProductAssociationData="getProductAssociationData"
            ></product-association-form>
          </el-form-item>
          <el-form-item class="btn">
            <div>
              <div class="acea-row justify-content">
                <el-button
                  type="primary"
                  v-debounceClick="
                    () => {
                      handleRecommendedSave('dataForm');
                    }
                  "
                  >{{ loadingBtn ? '提交中 ...' : '保存' }}</el-button
                >
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import FromList from '@/components/FromList';
import productAssociationForm from '@/components/productAssociationForm';
import {
  pcRecommendedAddApi,
  pcRecommendedDeleteApi,
  pcRecommendedEditApi,
  pcRecommendedListApi,
  pcRecommendedSwitchApi,
  pcHomeBannerSaveApi,
  pcHomeBannerGetApi,
  pcHomeAdvertisementEditApi,
  pcHomeAdvertisementGetApi,
  pcHomeNavigationSaveApi,
  pcHomeNavigationGetApi,
} from '@/api/systemPcConfig';
import { mapGetters } from 'vuex';
import { checkPermi } from '@/utils/permission';
import { advertisementDefault, bannerDefault, menuDefault } from '@/views/systemSetting/pcConfig/defaultPcConfig';
const fromData = {
  imageUrl: '',
  name: '',
  playType: 'product',
  sort: 0,
  status: false,
  data: '',
  id: 0,
  linkUrl: '',
  merIds: null,
  proBrandList: [],
  proCategorylist: [],
};
export default {
  name: 'homeSettings',
  components: { productAssociationForm, FromList },
  data() {
    // 自定义组件校验规则
    let validatePlayTypeAndPlayProducts = (rule, value, callback) => {
      if (value === '' || this.dataForm.playProducts.length === 0) {
        callback(new Error('请选择参与类型和对应规则'));
      } else {
        callback();
      }
    };
    return {
      currentTab: '0',
      tabList: [
        { value: '0', title: '首页广告' },
        { value: '1', title: '首页banner' },
        { value: '2', title: '首页推荐' },
        { value: '3', title: '顶部菜单' },
      ],
      drawer: false,
      fullscreenLoading: false,
      ruleValidate: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        imageUrl: [{ required: true, message: '请选择图片', trigger: 'blur' }],
        playType: [
          {
            required: true,
            message: '请选择商品关联类型',
            trigger: 'blur',
            validator: validatePlayTypeAndPlayProducts,
          },
        ],
      },
      dataForm: Object.assign({}, fromData),
      loadingBtn: false,
      tableData: {
        data: [],
      },
      listLoading: false,
      productData: [], //选中的商品类型值
      // 首页广告语
      advertisementlistConfig: Object.assign({}, advertisementDefault()),
      // banner数据
      bannerListConfig: Object.assign({}, bannerDefault()),
      playValues: null, // 待添加的商品参与类型
      //顶部菜单
      menuListConfig: Object.assign({}, menuDefault()),
      multipleMer: true,
    };
  },
  mounted() {
    // if (this.id > 0) {
    //   this.getRecommendedInfo(this.id);
    // }
    if (checkPermi(['platform:pc:shopping:home:banner:get'])) this.getPcHomeBanner();
    if (checkPermi(['platform:pc:shopping:home:recommended:list'])) this.getList();
    if (checkPermi(['platform:pc:shopping:home:advertisement:get'])) this.getAdvertisement();
    if (checkPermi(['platform:pc:shopping:home:navigation:get'])) this.getPcHomeNavigation();
  },
  computed: {
    ...mapGetters(['merPlatProductClassify', 'productBrand']),
    isEdit() {
      return this.dataForm.id > 0 ? true : false;
    },
  },
  methods: {
    checkPermi,
    //顶部菜单保存
    handleMenuSave() {
      this.menuListConfig.list.map((item, index) => {
        item.sort = index + 1;
      });
      this.loadingBtn = true;
      pcHomeNavigationSaveApi(this.menuListConfig.list)
        .then((res) => {
          this.$message.success('保存成功');
          this.loadingBtn = false;
          this.getPcHomeNavigation();
        })
        .catch(() => {
          this.loadingBtn = false;
        });
    },
    //获取顶部菜单
    getPcHomeNavigation() {
      pcHomeNavigationGetApi().then((res) => {
        this.menuListConfig.list = res;
      });
    },
    //首页推荐模板列表
    getList(num) {
      this.listLoading = true;
      pcRecommendedListApi()
        .then((res) => {
          this.tableData.data = res;
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    //模板弹窗
    handleClose() {
      //this.$refs['formValidate'].resetFields();
      this.drawer = false;
    },
    //新增模板
    handleAdd() {
      this.dataForm = Object.assign({}, fromData);
      this.drawer = true;
      this.loadingBtn = false;
    },
    //模板状态
    onchangeIsShow(row) {
      pcRecommendedSwitchApi(row.id).then((res) => {
        this.$message.success('操作成功');
        this.getList();
      });
    },
    //编辑首页推荐模板
    handleEdit(row) {
      this.dataForm.id = row.id;
      Object.assign(this.dataForm, row);

      this.getRecommendedInfo(this.dataForm);
      this.drawer = true;
      this.loadingBtn = false;
    },
    //首页推荐模板数据
    getRecommendedInfo() {
      // 以下两个属性的转换为组件和业务之间的，后期优化选择器统一所有业务数据后再配合后台修改统一优化
      this.dataForm.playType = this.dataForm.productAssociationType;
      this.dataForm.playProducts = this.dataForm.data;
      switch (this.dataForm.playType) {
        case 'product':
          this.dataForm.playProducts = this.dataForm.data;
          break;
        case 'brand':
          this.dataForm.proBrandList = Number(this.dataForm.data);
          break;
        case 'category':
          this.dataForm.proCategorylist = Number(this.dataForm.data);
          break;
        case 'merchant':
          this.dataForm.merIds = this.multipleMer
            ? this.dataForm.data.split(',').map((item) => Number(item))
            : this.dataForm.data ? Number(this.dataForm.data): '';
          break;
      }
    },
    // 删除首页推荐
    handleDelete(id, idx) {
      this.$modalSure('删除该模块吗？').then(() => {
        pcRecommendedDeleteApi(id).then((res) => {
          this.$message.success('删除成功');
          this.getList();
        });
      });
    },
    //选择商品类型中，商品列表、商户（merchant）选中回调
    getProductAssociationData(res) {
      this.playValues = res;
      this.dataForm.playProducts = this.playValues;
      this.dataForm.merIds = this.playValues;
      this.dataForm.proBrandList = JSON.parse(JSON.stringify(this.playValues));
    },
    //上传图片
    modalPicTap(multiple) {
      const _this = this;
      this.$modalUpload(
        function (img) {
          if (!img) return;
          _this.dataForm.imageUrl = img[0].sattDir;
        },
        multiple,
        'imageUrl',
      );
    },
    //推荐模板保存
    handleRecommendedSave(formName) {
      if (this.playValues) {
        // 如果编辑过数据那么再转换格式
        if (this.dataForm.playType === 'product') {
          this.dataForm.data = this.playValues.map((item) => item.id).join(',');
        } else if (this.dataForm.playType === 'merchant') {
          this.dataForm.data = this.multipleMer
            ? this.playValues.map((item) => item).join(',')
            : this.playValues.toString();
        } else {
          this.dataForm.data = this.playValues;
        }
        this.dataForm.productAssociationType = this.dataForm.playType;
      }
      if (this.dataForm.style == '') return this.$message.error('请上传氛围图');

      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loadingBtn = true;
          this.isEdit
            ? pcRecommendedEditApi(this.dataForm)
                .then((res) => {
                  this.$message.success('编辑成功');
                  this.handleClose();
                  this.getList();
                })
                .catch(() => {
                  this.loadingBtn = false;
                })
            : pcRecommendedAddApi(this.dataForm)
                .then((res) => {
                  this.$message.success('新增成功');
                  this.handleClose();
                  this.getList();
                })
                .catch(() => {
                  this.loadingBtn = false;
                });
        } else {
          return false;
        }
      });
    },
    //广告语数据
    getAdvertisement() {
      pcHomeAdvertisementGetApi().then((res) => {
        this.advertisementlistConfig.list[0].id = res.id;
        this.advertisementlistConfig.list[0].imageUrl = res.imageUrl;
        this.advertisementlistConfig.list[0].linkUrl = res.linkUrl;
        this.advertisementlistConfig.list[0].status = res.status;
      });
    },
    //广告语
    handleAdvertisementSave() {
      this.loadingBtn = true;
      pcHomeAdvertisementEditApi({
        id: this.advertisementlistConfig.list[0].id,
        imageUrl: this.advertisementlistConfig.list[0].imageUrl,
        linkUrl: this.advertisementlistConfig.list[0].linkUrl,
        status: this.advertisementlistConfig.list[0].status,
      })
        .then((res) => {
          this.$message.success('保存成功');
          this.loadingBtn = false;
          this.getAdvertisement();
        })
        .catch(() => {
          this.loadingBtn = false;
        });
    },
    //banner新增
    handleBannerSave() {
      this.bannerListConfig.list.map((item, index) => {
        item.sort = index + 1;
      });
      this.loadingBtn = true;
      pcHomeBannerSaveApi({ bannerList: this.bannerListConfig.list })
        .then((res) => {
          this.$message.success('保存成功');
          this.loadingBtn = false;
          this.getPcHomeBanner();
        })
        .catch(() => {
          this.loadingBtn = false;
        });
    },
    //banner数据
    getPcHomeBanner() {
      pcHomeBannerGetApi().then((res) => {
        this.bannerListConfig.list = res.bannerList;
      });
    },
    handlePlayTypeChange() {
      this.playValues = '';
      this.dataForm.playProducts = '';
      this.dataForm.data = '';
      this.dataForm.proBrandList = [];
      this.dataForm.proCategorylist = [];
      this.dataForm.merIds = null;
    },
  },
};
</script>
<style scoped lang="scss">
.demo-drawer__content {
  padding: 0 40px;
}
.selWidth {
  width: 500px;
}
</style>
