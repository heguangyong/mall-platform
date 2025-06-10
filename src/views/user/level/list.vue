<template>
  <div class="divBox">
    <el-card class="box-card" shadow="never" :bordered="false">
      <el-button type="primary" @click="add" size="small" v-hasPermi="['platform:system:user:level:save']"
        >添加用户等级</el-button
      >
      <el-table v-loading="listLoading" :data="tableData.data" size="small" class="mt20">
        <el-table-column prop="grade" label="等级级别" min-width="100" />
        <el-table-column label="等级图标" min-width="80">
          <template slot-scope="scope">
            <div class="demo-image__preview line-heightOne">
              <el-image :src="scope.row.icon" :preview-src-list="[scope.row.icon]" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="等级名称" min-width="100" />
        <el-table-column prop="experience" label="所需成长值" min-width="100" />
        <!-- <el-table-column prop="discount" label="享受折扣(%)" min-width="100" /> -->
        <el-table-column label="状态" min-width="100" fixed="right">
          <template slot-scope="scope">
            <el-switch
              v-if="checkPermi(['platform:system:user:level:use'])"
              v-model="scope.row.isShow"
              :active-value="true"
              :inactive-value="false"
              active-text="开启"
              inactive-text="关闭"
              disabled
              @click.native="onchangeIsShow(scope.row)"
            />
            <div v-else>{{ scope.row.isShow ? '开启' : '关闭' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template slot-scope="scope">
            <a @click="handleEdit(scope.row)" v-hasPermi="['platform:system:user:level:update']">编辑</a>
            <el-divider direction="vertical"></el-divider>
            <a @click="handleDelete(scope.row.id, scope.$index)" v-hasPermi="['platform:system:user:level:delete']"
              >删除</a
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <creat-level ref="grades" v-if="userInfo" :userInfo="userInfo" :levelNumData="levelNumData"></creat-level>
  </div>
</template>

<script>
// +---------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +---------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +---------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +---------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +---------------------------------------------------------------------
import { userListApi, groupListApi, levelListApi, levelUseApi, levelDeleteApi } from '@/api/user';
import creatLevel from './creatLevel';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
const obj = {
  name: '',
  grade: 1,
  icon: '',
  backImage: '',
  id: null,
  backColor: '',
  experience: '',
};
export default {
  name: 'Grade',
  filters: {
    typeFilter(status) {
      const statusMap = {
        wechat: '微信用户',
        routine: '小程序你用户',
        h5: 'H5用户',
      };
      return statusMap[status];
    },
  },
  components: { creatLevel },
  data() {
    return {
      listLoading: true,
      userInfo: Object.assign({}, obj),
      tableData: {
        data: [],
        total: 0,
      },
      levelNumData: [],
    };
  },
  mounted() {
    if (checkPermi(['platform:system:user:level:list'])) this.getList();
  },
  methods: {
    checkPermi,
    seachList() {
      this.getList();
    },
    add() {
      this.userInfo = Object.assign({}, obj);
      this.$refs.grades.dialogVisible = true;
    },
    //编辑
    handleEdit(row) {
      this.tableData.data.map((item) => {
        this.levelNumData.push(item.grade);
      });
      this.userInfo = JSON.parse(JSON.stringify(row));
      this.$refs.grades.dialogVisible = true;
    },
    // 列表
    getList() {
      this.listLoading = true;
      this.levelNumData = [];
      levelListApi()
        .then((res) => {
          this.tableData.data = res;
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    // 删除
    handleDelete(id, idx) {
      this.$modalSure('删除吗？删除会导致对应用户等级数据清空，请谨慎操作！').then(() => {
        levelDeleteApi(id).then(() => {
          this.$message.success('删除成功');
          this.tableData.data.splice(idx, 1);
        });
      });
    },
    onchangeIsShow(row) {
      if (row.isShow == false) {
        row.isShow = !row.isShow;
        levelUseApi({ id: row.id, isShow: row.isShow })
          .then(() => {
            this.$message.success('修改成功');
            this.getList();
          })
          .catch(() => {
            row.isShow = !row.isShow;
          });
      } else {
        this.$modalSure('修改吗？该操作会导致对应用户等级隐藏，请谨慎操作').then(() => {
          row.isShow = !row.isShow;
          levelUseApi({ id: row.id, isShow: row.isShow })
            .then(() => {
              this.$message.success('修改成功');
              this.getList();
            })
            .catch(() => {
              row.isShow = !row.isShow;
            });
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.el-switch.is-disabled {
  opacity: 1;
}
::v-deep .el-switch__label {
  cursor: pointer !important;
}
</style>
