<template>
  <div class="divBox relative">
    <el-card
      v-if="checkPermi(['platform:integral:interval:page'])"
      :bordered="false"
      shadow="never"
      class="ivu-mt"
      :body-style="{ padding: 0 }"
    >
      <div class="padding-add">
        <el-form inline size="small" label-position="right" @submit.native.prevent>
          <el-form-item label="区间名称：">
            <el-input
              v-model.trim="name"
              placeholder="请输入区间名称"
              class="form_content_width"
              size="small"
              @keyup.enter.native="getList(1)"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="区间状态：">
            <el-select v-model="tableFrom.status" placeholder="请选择" class="selWidth" @change="getList(1)" clearable>
              <el-option label="显示" :value="true" />
              <el-option label="隐藏" :value="false" />
            </el-select>
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
            <el-button type="primary" size="small" @click="getList(1)">查询</el-button>
            <el-button size="small" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card mt14" :body-style="{ padding: '0 20px 20px' }" shadow="never" :bordered="false">
      <el-button
        size="small"
        class="mt20"
        type="primary"
        v-hasPermi="['platform:integral:interval:save']"
        @click="handleAdd()"
        >添加积分区间</el-button
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
        <el-table-column prop="name" label="区间名称" min-width="200" :show-overflow-tooltip="true"> </el-table-column>
        <el-table-column prop="value" label="积分范围" min-width="200" />
        <el-table-column prop="sort" label="排序" min-width="90" />
        <el-table-column prop="createTime" label="创建时间" min-width="150" />
        <el-table-column label="区间状态" min-width="100" fixed="right">
          <template slot-scope="scope">
            <el-switch
              v-if="checkPermi(['platform:integral:interval:update:status'])"
              v-model="scope.row.status"
              :active-value="true"
              :inactive-value="false"
              active-text="显示"
              inactive-text="隐藏"
              @change="onchangeIsShow(scope.row)"
            />
            <div v-else>{{ scope.row.isShow ? '上架' : '下架' }}</div>
          </template>
        </el-table-column>
        <el-table-column width="120" fixed="right" label="操作">
          <template slot-scope="scope">
            <a v-if="checkPermi(['platform:integral:interval:update'])" @click="handleEdit(scope.row)">编辑</a>
            <template v-if="checkPermi(['platform:integral:interval:delete'])">
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

    <CreatSection ref="CreatSectionRef" :editData="editData" @getList="getList"></CreatSection>
  </div>
</template>

<script>
import { checkPermi } from '@/utils/permission'; // 权限判断函数
import * as $constants from '@/utils/constants';
import {
  integralSwitcheApi,
  intervalDeleteApi,
  intervalPageApi,
  productDeleteApi,
  productLstApi,
} from '@/api/pointsMall';
import { handleDeleteTable } from '@/libs/public';
import CreatSection from '@/views/marketing/pointsMall/section/creatSection';
import { seckillIntervalSwitcheApi } from '@/api/marketing';
const defaultObj = {
  id: 0,
  name: '',
  sort: 0,
  status: true,
  value: '',
};
export default {
  name: 'index',
  components: { CreatSection },
  data() {
    return {
      listLoading: false,
      tableData: {
        data: [],
        total: 0,
      },
      tableFrom: {
        dateLimit: '',
        page: 1,
        limit: $constants.page.limit[0],
        status: null,
        name: '',
      },
      name: '',
      timeVal: [],
      editData: Object.assign({}, defaultObj),
    };
  },
  mounted() {
    if (checkPermi(['platform:integral:interval:page'])) this.getList();
  },
  methods: {
    checkPermi,
    // 修改状态
    onchangeIsShow(row) {
      integralSwitcheApi(row.id)
        .then(async () => {
          this.$message.success('修改成功');
          this.getList();
        })
        .catch(() => {
          row.status = !row.status;
        });
    },
    //添加
    handleAdd() {
      this.editData = Object.assign({}, defaultObj);
      this.$refs.CreatSectionRef.dialogVisible = true;
    },
    //编辑
    handleEdit(row) {
      this.editData = row;
      this.$refs.CreatSectionRef.dialogVisible = true;
    },
    // 具体日期
    onchangeTime(e) {
      this.timeVal = e;
      this.tableFrom.dateLimit = e ? this.timeVal.join(',') : '';
      this.tableFrom.page = 1;
      this.getList();
    },
    //重置
    handleReset() {
      this.tableFrom.name = '';
      this.tableFrom.dateLimit = '';
      this.tableFrom.status = null;
      this.name = '';
      this.timeVal = [];
      this.getList(1);
    },
    // 列表
    getList(num) {
      this.listLoading = true;
      this.tableFrom.page = num ? num : this.tableFrom.page;
      this.tableFrom.name = encodeURIComponent(this.name);
      intervalPageApi(this.tableFrom)
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
    // 删除成功
    delSuccess() {
      handleDeleteTable(this.tableData.data.length, this.tableFrom);
      this.getList('');
    },
    // 删除
    handleDelete(id, type) {
      this.$modalSure(`要删除此积分区间吗？`).then(() => {
        intervalDeleteApi(id).then(() => {
          this.$message.success('删除成功');
          this.delSuccess();
        });
      });
    },
  },
};
</script>

<style scoped></style>
