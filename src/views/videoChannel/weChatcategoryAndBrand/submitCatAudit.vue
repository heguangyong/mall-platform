<template>
  <div class="divBox">
    <el-form label-width="150px">
      <el-form-item label="服务类目：">
        {{ catTitle }}
      </el-form-item>
      <el-form-item label="营业执照或组织机构证件：" prop="license">
        <div class="upLoadPicBox" @click="modalPicTap(false)">
          <div v-if="catImages.license" class="pictrue">
            <img :src="catImages.license" />
          </div>
          <div v-else class="upLoad">
            <i class="el-icon-camera cameraIconfont" />
          </div>
        </div>
      </el-form-item>
      <el-form-item label="类目资质：" prop="certificate">
        <div class="acea-row">
          <div
            v-for="(item, index) in catImages.certificate"
            :key="index"
            class="pictrue"
            draggable="true"
            @dragstart="handleDragStart($event, item, 'certificate')"
            @dragover.prevent="handleDragOver($event, item, 'certificate')"
            @dragenter="handleDragEnter($event, item, 'certificate')"
            @dragend="handleDragEnd($event, item, 'certificate')"
          >
            <img :src="item" />
            <i class="el-icon-error btndel" @click="handleRemove(index, 'certificate')" />
          </div>
          <div v-if="catImages.certificate.length < 10" class="upLoadPicBox" @click="modalPicTap(true)">
            <div class="upLoad">
              <i class="el-icon-camera cameraIconfont" />
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item align="right">
        <el-button @click.native="$emit('closeDia')">取消</el-button>
        <el-button
          type="primary"
          v-hasPermi="['platform:pay:component:shop:category:audit']"
          @click.native="handleSubmitCatAudit()"
          >提交</el-button
        >
      </el-form-item>
    </el-form>
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
import { shopImgUploadApi, catAuditApi } from '@/api/videoChannel';

export default {
  name: 'submitCatAudit',
  props: {
    catTitle: {
      type: String,
      require: true,
    },
    params: {
      audit_req: {
        category_info: {
          certificate: [], //证件素材地址
          level1: null,
          level2: null,
          level3: null,
        },
        license: '',
        scene_group_list: [1], // 类目使用场景,1:视频号 ，3:订单中心（非视频号订单中心，未明确开通此场景的商家请勿传值）。 组件开通流程中以及未接入场景时，请保持为空"scene_group_list":[]
      },
    },
  },
  data() {
    return {
      catImages: {
        license: null,
        certificate: [],
      },
    };
  },
  mounted() {},
  create() {},
  methods: {
    // 提交类目审核
    async handleSubmitCatAudit() {
      if (!this.catImages.license && this.catImages.certificate.length === 0) {
        this.$message.warning('正确填写类目审核表单');
      }
      const license_wximg = await this.getShopImgUpload([this.catImages.license], []);
      const certificate_wximg = await this.getShopImgUpload(this.catImages.certificate, []);
      this.params.audit_req.license = license_wximg[0];
      this.params.audit_req.category_info.certificate = certificate_wximg;
      catAuditApi(this.params)
        .then((res) => {
          this.$message.success('提交类目审核成功');
          this.$emit('auditSuccess');
        })
        .catch((e) => {
          this.$message.error(e);
        });
    },
    // 点击商品图
    modalPicTap(multiple) {
      const _this = this;
      this.$modalUpload(
        function (img) {
          if (!img) return;
          if (!multiple) {
            // 设置第一个值 营业执照或组织机构证件
            _this.catImages.license = img[0].sattDir;
          }
          if (multiple) {
            // 设置第二个值 类目资质
            img.map((item) => {
              _this.catImages.certificate.push(item.sattDir);
            });
          }
        },
        multiple,
        'payComponent',
      );
    },
    async getShopImgUpload(attrs, arr) {
      for (const key in attrs) {
        let res = await this.getImgData(attrs[key]);
        arr.push(res);
      }
      return arr;
    },
    // 转换当前素材为视频号素材链接
    getImgData(imgUrl) {
      return new Promise((resolve, reject) => {
        shopImgUploadApi({
          imgUrl: imgUrl,
          respType: 1,
          uploadType: 1,
        }).then((res) => {
          resolve(res.img_info.temp_img_url);
        });
      });
    },
    // 移动
    handleDragStart(e, item) {
      this.dragging = item;
    },
    handleDragEnd(e, item) {
      this.dragging = null;
    },
    handleDragOver(e) {
      e.dataTransfer.dropEffect = 'move';
    },
    handleDragEnter(e, item, val) {
      e.dataTransfer.effectAllowed = 'move';
      if (item === this.dragging) {
        return;
      }
      let newItems = [];
      if (val === 'certificate') {
        newItems = [...this.catImages.certificate];
      }
      const src = newItems.indexOf(this.dragging);
      const dst = newItems.indexOf(item);
      newItems.splice(dst, 0, ...newItems.splice(src, 1));
      if (val === 'certificate') {
        this.catImages.certificate = newItems;
      }
    },
    handleRemove(i, val) {
      if (val === 'certificate') {
        this.catImages.certificate.splice(i, 1);
      }
    },
  },
};
</script>

<style scoped></style>
