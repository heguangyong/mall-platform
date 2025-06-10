<template>
  <div class="divBox">
    <el-card
      :bordered="false"
      shadow="never"
      class="ivu-mt"
      :body-style="{ padding: 0 }"
      v-hasPermi="['platform:seckill:time:interval:list']"
    >
      <div class="padding-add">
        <el-form inline @submit.native.prevent>
          <el-form-item label="是否显示：">
            <el-select v-model="tableFrom.status" placeholder="请选择" class="selWidth" @change="getList(1)" clearable>
              <el-option label="关闭" :value="0" />
              <el-option label="开启" :value="1" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card mt14" :body-style="{ padding: '20px' }" :bordered="false" shadow="never">
      <el-button size="mini" type="primary" @click="add(0)" v-hasPermi="['platform:seckill:time:interval:add']"
        >添加秒杀配置</el-button
      >
      <el-table v-loading="listLoading" :data="tableData.data" size="small" ref="multipleTable" class="mt20">
        <el-table-column prop="id" label="ID" min-width="50" />
        <el-table-column prop="name" label="时段名称" min-width="150" :show-overflow-tooltip="true" />
        <el-table-column label="秒杀时段" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.startTime + '-' + scope.row.endTime }}
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="150">
          <template slot-scope="scope">
            <el-switch
              v-if="checkPermi(['platform:seckill:time:interval:switch'])"
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              active-text="开启"
              inactive-text="关闭"
              @change="onchangeIsShow(scope.row)"
            />
            <div v-else>{{ scope.row.status ? '开启' : '关闭' }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="130" />
        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="scope">
            <a @click="add(1, scope.row)" v-hasPermi="['platform:seckill:time:interval:update']">编辑</a>
            <el-divider direction="vertical"></el-divider>
            <a @click="handleDelete(scope.row.id, scope.$index)" v-hasPermi="['platform:seckill:time:interval:delete']"
              >删除</a
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import zbParser from '@/components/FormGenerator/components/parser/ZBParser';
import {
  seckillIntervalListApi,
  seckillIntervalAddApi,
  seckillIntervalUpdateApi,
  seckillIntervalDeleteApi,
  seckillIntervalSwitcheApi,
} from '@/api/marketing';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
import { Debounce } from '@/utils/validate';
export default {
  name: 'SeckillConfig',
  components: { zbParser },
  data() {
    return {
      dialogVisible: false,
      isShow: true,
      isCreate: 0,
      editData: {},
      formId: 123,
      listLoading: false,
      tableData: {
        data: [],
        total: 0,
      },
      tableFrom: {
        status: '',
      },
      seckillId: null,
      loading: false,
      keyNum: 0,
    };
  },
  mounted() {
    if (checkPermi(['platform:seckill:time:interval:list'])) this.getList();
  },
  methods: {
    checkPermi,
    resetForm(formValue) {
      this.dialogVisible = false;
    },
    // 删除
    handleDelete(id, idx) {
      this.$modalSure().then(() => {
        seckillIntervalDeleteApi(id).then(() => {
          this.$message.success('删除成功');
          this.tableData.data.splice(idx, 1);
        });
      });
    },
    onchangeIsShow(row) {
      seckillIntervalSwitcheApi(row.id)
        .then(async () => {
          this.$message.success('修改成功');
          this.getList();
        })
        .catch(() => {
          row.status = !row.status;
        });
    },
    // 提交
    handlerSubmit: Debounce(function (formValue) {
      if (formValue.time.split(',')[0].split(':')[0] > formValue.time.split(',')[1].split(':')[0])
        return this.$message.error('请填写正确的时间范围');
      this.isCreate === 0
        ? seckillSaveApi(formValue).then((res) => {
            this.isSuccess();
          })
        : seckillUpdateApi({ id: this.seckillId }, formValue).then((res) => {
            this.isSuccess();
          });
    }),
    isSuccess() {
      this.$message.success('操作成功');
      this.dialogVisible = false;
      this.getList();
    },
    // 列表
    getList() {
      this.listLoading = true;
      seckillIntervalListApi(this.tableFrom)
        .then((res) => {
          this.tableData.data = res;
          this.listLoading = false;
        })
        .catch((res) => {
          this.listLoading = false;
        });
    },
    submit(formValue) {
      const data = {
        id: this.seckillId,
        name: formValue.name,
        startTime: formValue.timeData[0],
        endTime: formValue.timeData[1],
        status: formValue.status,
      };
      !this.seckillId
        ? seckillIntervalAddApi(data)
            .then((res) => {
              this.$message.success('操作成功');
              this.$msgbox.close();
              this.getList(1);
            })
            .catch(() => {
              this.loading = false;
            })
        : seckillIntervalUpdateApi(data)
            .then((res) => {
              this.$message.success('操作成功');
              this.$msgbox.close();
              this.getList(1);
            })
            .catch(() => {
              this.loading = false;
            });
    },
    add(isCreate, editDate) {
      const _this = this;
      this.seckillId = editDate ? editDate.id : null;
      this.$modalParserFrom(
        isCreate === 0 ? '添加秒杀时段' : '编辑秒杀时段',
        '秒杀时段',
        isCreate,
        isCreate === 0
          ? {
              id: 0,
              name: '',
              timeData: [],
              status: 0,
            }
          : Object.assign(
              {},
              {
                id: editDate.id,
                name: editDate.name,
                timeData: [editDate.startTime, editDate.endTime],
                status: editDate.status,
              },
            ),
        function (formValue) {
          _this.submit(formValue);
        },
        (this.keyNum = Math.random()),
      );
    },
  },
};
</script>

<style scoped>
::v-deep .el-range-separator {
  width: 12%;
}

::v-deep .el-col-15:nth-of-type(1) {
  width: 100% !important;
}
</style>
