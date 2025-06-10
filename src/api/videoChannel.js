// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

import request from '@/utils/request';

/**
 * 微信自定义交易组件 检查接入状态
 */
export function registerCheck() {
  return request({
    url: '/admin/platform/pay/component/register/register/check',
    method: 'get',
  });
}

/**
 * 视频号 草稿列表
 */
export function videoChanelRegisterApply(params) {
  return request({
    url: `/admin/platform/pay/component/register/apply`,
    method: 'get',
    params,
  });
}

/**
 * 视频号 草稿列表
 */
export function draftListApi(params) {
  return request({
    url: `/admin/platform/pay/component/draftproduct/draft/list`,
    method: 'get',
    params,
  });
}

/**
 * 视频号 商品列表
 */
export function videoProductListApi(params) {
  return request({
    url: `/admin/platform/pay/component/product/list`,
    method: 'get',
    params,
  });
}

/**
 * 视频号 类目
 */
export function catListApi(params) {
  return request({
    url: `/admin/platform/pay/component/cat/get/list`,
    method: 'get',
    params,
  });
}

/**
 * 视频号 类目资质提交
 */
export function catAuditApi(data) {
  return request({
    url: `/admin/platform/pay/component/shop/category/audit`,
    method: 'post',
    data,
  });
}

/**
 * 视频号 草稿商品
 */
export function videoAddApi(data) {
  return request({
    url: `/admin/platform/pay/component/draftproduct/add`,
    method: 'post',
    data,
  });
}

/**
 * 视频号 上架
 */
export function videoUpApi(proId) {
  return request({
    url: `/admin/pay/component/product/listing/${proId}`,
    method: 'post',
  });
}

/**
 * 视频号 下架
 */
export function videoDownApi(proId) {
  return request({
    url: `/admin/pay/component/product/delisting/${proId}`,
    method: 'post',
  });
}

/**
 * 视频号 删除
 */
export function videoDelApi(proId) {
  return request({
    url: `/admin/pay/component/product/delete/${proId}`,
    method: 'post',
  });
}

/**
 * 视频号 草稿商品详情
 */
export function draftInfoApi(id) {
  return request({
    url: `/admin/platform/pay/component/draftproduct/draft/get/${id}`,
    method: 'get',
  });
}

/**
 * 视频号 草稿商品编辑
 */
export function draftUpdateApi(data) {
  return request({
    url: `/admin/platform/pay/component/draftproduct/update`,
    method: 'post',
    data,
  });
}

/**
 * 视频号 草稿商品平台审核
 */
export function draftProductReviewApi(data) {
  return request({
    url: `/admin/platform/pay/component/draftproduct/review`,
    method: 'post',
    data,
  });
}

/**
 * 视频号 草稿商品图片上传至微信
 */
export function shopImgUploadApi(data) {
  return request({
    url: `/admin/platform/pay/component/shop/img/upload`,
    method: 'post',
    data,
  });
}

/**
 * 视频号 品牌列表
 * @param data 行业参数
 * @returns {*} 查询结果
 */
export function brandListApi(data) {
  return request({
    url: `/admin/platform/pay/component/shop/brand/list`,
    method: 'get',
    data,
  });
}

/**
 * 视频号 品牌和类目结果查询
 * @param data 行业和类目参数
 * @returns {*} 查询结果
 */
export function brandCatAuditResultApi(data) {
  return request({
    url: `/admin/platform/pay/component/shop/audit/result`,
    method: 'post',
    data,
  });
}

/**
 * 提交品牌审核
 * @param data 品牌参数
 * @returns {*} 提交结果
 */
export function submitBrandAuditApi(data) {
  return request({
    url: `/admin/platform/pay/component/shop/brand/audit`,
    method: 'post',
    data,
  });
}
