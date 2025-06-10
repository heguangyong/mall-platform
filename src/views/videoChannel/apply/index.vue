<template>
  <div class="divBox">
    <el-card class="box-card" :bordered="false" shadow="never">
      <div slot="header" class="clearfix">接入微信视频号步骤</div>
      <div class="mb20">
        <h1 v-if="toRegister.errcode === 1040002">已经接入自定义交易组件</h1>
        <h1 v-else>接入中{{ toRegister }}</h1>
      </div>
      <el-timeline>
        <el-timeline-item timestamp="创建视频号" placement="top">
          <el-card shadow="never" :bordered="false">
            <el-form inline>
              <el-form-item>
                <p>在微信平台中设置, 申请自定义交易组件，如果平台已有自定义交易组件跳过此步</p>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click.native="">去申请(跳转文档链接)</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-timeline-item>
        <el-timeline-item timestamp="申请开通自定义交易组件" placement="top">
          <el-card :bordered="false" shadow="never">
            <el-form inline>
              <el-form-item>
                <p>
                  完成自定义版交易组件接入后，小程序即可在视频号中实现商品展示和带货等功能，进一步提升经营能力。若您已开通标准化交易组件，则暂不支持切换
                </p>
              </el-form-item>
              <el-form-item v-hasPermi="['platform:pay:component:shop:register:finish']">
                <el-button type="primary" @click.native="handleRegisterCheck()">完成</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-timeline-item>
        <el-timeline-item timestamp="自定义版交易组件申请通过，接口调用场景检测" placement="top">
          <el-card :bordered="false" shadow="never">
            <el-form>
              <el-form-item>
                <p>
                  自定义交易组件开通后，小程序版本必须大于等于4.1.5，如果不是 需要更新小程序
                  发布新的小程序(跳转小程序下载页面)
                </p>
                <router-link to="/marketing/videoChannel/draftList">
                  <el-tag type="warning">初次需要去审核商家提审的视频号商品</el-tag>
                </router-link>
              </el-form-item>
              <el-form-item>
                <el-form>
                  <el-form-item>
                    <span
                      >接入场景
                      {{ registerCheckData.data.scene_group_list[0].group_id === 1 ? '视频号' : '公众号场景' }}</span
                    >
                  </el-form-item>
                  <el-form-item>
                    <span>场景名称 {{ registerCheckData.data.scene_group_list[0].name }}</span>
                  </el-form-item>
                  <el-form-item>
                    <span
                      >审核状态
                      <span v-if="registerCheckData.data.scene_group_list[0].status === 0">审核中</span>
                      <span v-if="registerCheckData.data.scene_group_list[0].status === 1">审核完成</span>
                      <span v-if="registerCheckData.data.scene_group_list[0].status === 2">审核失败</span>
                    </span>
                  </el-form-item>
                  <el-form-item>
                    <span
                      >场景审核结果
                      <span
                        v-for="(item, key) in registerCheckData.data.scene_group_list[0].scene_group_ext_list"
                        :key="key"
                      >
                        <span v-if="item.ext_id === 1">客服售后 -》</span>
                        <span v-if="item.ext_id === 2">电商平台 -》</span>
                        <el-tag>
                          <span v-if="item.status === 0">审核中</span>
                          <span v-if="item.status === 1">审核成功</span>
                          <span v-if="item.status === 2">审核失败</span>
                          <span v-if="item.status === 3">未审核</span>
                        </el-tag>
                      </span>
                    </span>
                  </el-form-item>
                  <el-form-item>
                    <span>审核理由 {{ registerCheckData.data.scene_group_list[0].reason }}</span>
                  </el-form-item>
                  <el-form-item>
                    <span>上传商品并审核成功 </span>
                    <el-tag>{{
                      registerCheckData.data.access_info.spu_audit_success === 0 ? '未成功' : '成功'
                    }}</el-tag>
                  </el-form-item>
                  <el-form-item>
                    <span>商品接口调试完成</span>
                    <el-tag>{{
                      registerCheckData.data.access_info.spu_audit_finished === 0 ? '未成功' : '成功'
                    }}</el-tag>
                  </el-form-item>
                  <el-form-item>
                    <span>发起一笔订单并支付成功</span>
                    <el-tag>{{ registerCheckData.data.access_info.ec_order_success === 0 ? '未成功' : '成功' }}</el-tag>
                  </el-form-item>
                  <el-form-item>
                    <span>订单接口调试完成</span>
                    <el-tag>{{
                      registerCheckData.data.access_info.ec_order_finished === 0 ? '未成功' : '成功'
                    }}</el-tag>
                  </el-form-item>
                  <el-form-item>
                    <span>物流接口调用成功</span>
                    <el-tag>{{
                      registerCheckData.data.access_info.send_delivery_success === 0 ? '未成功' : '成功'
                    }}</el-tag>
                  </el-form-item>
                  <el-form-item>
                    <span>物流接口调试完成</span>
                    <el-tag>{{
                      registerCheckData.data.access_info.send_delivery_finished === 0 ? '未成功' : '成功'
                    }}</el-tag>
                  </el-form-item>
                  <el-form-item>
                    <span>售后接口调用成功</span>
                    <el-tag>{{
                      registerCheckData.data.access_info.ec_after_sale_success === 0 ? '未成功' : '成功'
                    }}</el-tag>
                  </el-form-item>
                  <el-form-item>
                    <span>售后接口调试完成</span>
                    <el-tag>{{
                      registerCheckData.data.access_info.ec_after_sale_finished === 0 ? '未成功' : '成功'
                    }}</el-tag>
                  </el-form-item>
                  <el-form-item>
                    <span>测试完成</span>
                    <el-tag>{{
                      registerCheckData.data.access_info.test_api_finished === 0 ? '未成功' : '成功'
                    }}</el-tag>
                  </el-form-item>
                  <el-form-item>
                    <span>发版完成</span>
                    <el-tag>{{
                      registerCheckData.data.access_info.deploy_wxa_finished === 0 ? '未成功' : '成功'
                    }}</el-tag>
                  </el-form-item>
                </el-form>
              </el-form-item>
            </el-form>
          </el-card>
        </el-timeline-item>
        <el-timeline-item timestamp="自定义版交易组件开通成功" placement="top"> </el-timeline-item>
      </el-timeline>
    </el-card>
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
// 开通视频号步骤页面
import { videoChanelRegisterApply, registerCheck } from '@/api/videoChannel';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
export default {
  name: 'index',
  data() {
    return {
      // 申请接入
      toRegister: {
        errcode: 0, // 1040002 已经接入
        errmsg: '',
      },
      // 接入状态检查
      registerCheckData: {
        errcode: 0,
        errmsg: null,
        data: {
          status: 2,
          reject_reason: '',
          access_info: {
            spu_audit_success: 0, // 上传商品并审核成功，0:未成功，1:成功
            spu_audit_finished: 0, // 商品接口调试完成，0:未完成，1:已完成
            ec_order_success: 0, // 发起一笔订单并支付成功，0:未成功，1:成功
            ec_order_finished: 0, // 订单接口调试完成，0:未完成，1:已完成
            send_delivery_finished: 0, // 物流接口调试完成，0:未完成，1:已完成
            send_delivery_success: 0, // 物流接口调用成功，0:未成功，1:成功
            ec_after_sale_finished: 0, // 售后接口调试完成，0:未完成，1:已完成
            ec_after_sale_success: 0, // 售后接口调用成功，0:未成功，1:成功
            test_api_finished: 0, // 测试完成，0:未完成，1:已完成
            deploy_wxa_finished: 0, // 发版完成，0:未完成，1:已完成
            open_product_task_finished: 0, // 完成自定义组件全部任务 0:未完成 1:已完成
          },
          scene_group_list: [
            {
              group_id: 1, // 场景枚举，1:视频号、公众号场景
              reason: '', // 审核理由
              name: '', // 场景名称
              status: 0, // 审核状态，0:审核中，1:审核完成，2:审核失败，3未审核
              scene_group_ext_list: [
                // 场景相关审核结果
                {
                  ext_id: 1, // 审核事项id，1:客服售后，2:电商平台
                  status: 1, // 场景相关审核结果，0:审核中，1:审核成功，2:审核失败，3未审核
                },
              ],
            },
          ],
        },
      },
    };
  },
  created() {
    if (checkPermi(['platform:pay:component:shop:register:scene', 'platform:pay:component:shop:register']))
      this.registerApply();
    if (checkPermi(['platform:pay:component:shop:register:check'])) this.handleRegisterCheck();
  },
  methods: {
    checkPermi,
    // 申请接入 如果多次接入及时关闭再次开启 这个状态检查有可能直接 开通
    registerApply() {
      videoChanelRegisterApply().then((res) => {
        this.toRegister = res;
      });
    },
    // 接入状态检查
    handleRegisterCheck() {
      registerCheck()
        .then((res) => {
          this.registerCheckData = res;
        })
        .finally(() => {
          this.$message.success('检查接入状态已更新');
        });
    },
  },
};
</script>

<style scoped></style>
