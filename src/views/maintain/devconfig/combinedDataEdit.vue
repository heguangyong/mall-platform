<template>
  <div class="components-container">
    <el-form ref="editPram" :model="editPram" label-width="90px">
      <el-form-item
        label="数据组名称："
        prop="name"
        :rules="[{ required: true, message: '填写数据组名称', trigger: ['blur', 'change'] }]"
      >
        <el-input v-model.trim="editPram.name" placeholder="数据组名称" clearable />
      </el-form-item>
      <el-form-item
        label="数据简介："
        prop="info"
        :rules="[{ required: true, message: '填写数据简介', trigger: ['blur', 'change'] }]"
      >
        <el-input v-model.trim="editPram.info" placeholder="数据简介" clearable />
      </el-form-item>
      <el-form-item
        label="表单数据ID："
        prop="formId"
        :rules="[{ required: true, message: '请选择表单数据', trigger: ['change'] }]"
      >
        <span>{{ editPram.formId }}</span>
        <el-button type="primary" @click="selectFormDialogConfig.visible = true">选择模板数据</el-button>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer-inner">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="handlerSubmit('editPram')">确定</el-button>
    </div>
    <el-dialog style="width: 100%" title="选择表单模板" :visible.sync="selectFormDialogConfig.visible" append-to-body>
      <form-config-list select-model @selectedRowData="handlerSelectedRowData" />
    </el-dialog>
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
import formConfigList from '@/views/maintain/formConfig';
import * as systemGroupApi from '@/api/systemGroup';
import { Debounce } from '@/utils/validate';
export default {
  // name: "combinedDataEdit"
  components: { formConfigList },
  props: {
    isCreate: {
      type: Number,
      default: 0,
    },
    editData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      editPram: {
        formId: null,
        info: null,
        name: null,
        id: null,
      },
      selectedFormConfigData: {},
      selectFormDialogConfig: {
        visible: false,
      },
    };
  },
  mounted() {
    this.handlerInitEditData();
  },
  methods: {
    close() {
      this.$emit('closeDialog', null);
    },
    handlerInitEditData() {
      if (this.isCreate !== 1) return;
      const { id, name, info, formId, createTime, updateTime } = this.editData;
      this.editPram.id = id;
      this.editPram.name = name;
      this.editPram.info = info;
      this.editPram.formId = formId;
    },
    handlerSelectedRowData(rowData) {
      this.selectedFormConfigData = rowData;
      this.editPram.formId = this.selectedFormConfigData.id;
      this.selectFormDialogConfig.visible = false;
    },
    handlerSubmit: Debounce(function (form) {
      this.$refs[form].validate((result) => {
        if (!result) return;
        this.isCreate === 0 ? this.handlerSave(this.editPram) : this.handlerEdit(this.editPram);
      });
    }),
    handlerSave(pram) {
      systemGroupApi.groupSave(pram).then((data) => {
        this.$message.success('添加组合数据成功');
        this.$emit('hideDialog');
      });
    },
    handlerEdit(pram) {
      systemGroupApi.groupEdit(pram).then((data) => {
        this.$message.success('编辑组合数据成功');
        this.$emit('hideDialog');
      });
    },
  },
};
</script>

<style scoped>
::v-deep .el-dialog__wrapper {
  width: 100%;
}
</style>
