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
 * 新增商品
 * @param pram
 */
export function productCreateApi(data) {
  return request({
    url: '/admin/platform/integral/product/save',
    method: 'POST',
    data,
  });
}

/**
 * 编辑商品
 * @param pram
 */
export function productUpdateApi(data) {
  return request({
    url: '/admin/platform/integral/product/update',
    method: 'POST',
    data,
  });
}

/**
 * 商品详情
 * @param pram
 */
export function pointsProductDetailApi(id) {
  return request({
    url: `/admin/platform/integral/product/detail/${id}`,
    method: 'GET',
  });
}

/**
 * 删除商品
 * @param pram
 */
export function productDeleteApi(id) {
  return request({
    url: `/admin/platform/integral/product/delete/${id}`,
    method: 'post',
  });
}

/**
 * 商品列表 表头数量
 */
export function productHeadersApi(params) {
  return request({
    url: '/admin/platform/integral/product/tabs/headers',
    method: 'GET',
    params,
  });
}

/**
 * 商品列表
 * @param pram
 */
export function productLstApi(params) {
  return request({
    url: '/admin/platform/integral/product/page',
    method: 'GET',
    params,
  });
}

/**
 * 商品上架
 * @param pram
 */
export function putOnShellApi(id) {
  return request({
    url: `/admin/platform/integral/product/update/show/${id}`,
    method: 'post',
  });
}
/**
 * 商品下架
 * @param pram
 */
export function offShellApi(id) {
  return request({
    url: `/admin/platform/integral/product/down/${id}`,
    method: 'post',
  });
}
/**
 * 删除积分区间
 * @param pram
 */
export function intervalDeleteApi(id) {
  return request({
    url: `/admin/platform/integral/interval/delete/${id}`,
    method: 'post',
  });
}
/**
 * 积分区间分页列表
 * @param pram
 */
export function intervalPageApi(params) {
  return request({
    url: `/admin/platform/integral/interval/page`,
    method: 'get',
    params,
  });
}
/**
 * 新增积分区间
 * @param pram
 */
export function intervalSaveApi(data) {
  return request({
    url: `/admin/platform/integral/interval/save`,
    method: 'post',
    data,
  });
}
/**
 * 修改积分区间
 * @param pram
 */
export function intervalUpdateApi(data) {
  return request({
    url: `/admin/platform/integral/interval/update`,
    method: 'post',
    data,
  });
}
/**
 * 积分订单详情
 * @param pram
 */
export function intervalOrderDetailApi(orderNo) {
  return request({
    url: `/admin/platform/integral/order/detail/${orderNo}`,
    method: 'get',
  });
}
/**
 * 积分订单分页列表
 * @param pram
 */
export function intervalOrderListApi(params) {
  return request({
    url: `/admin/platform/integral/order/list`,
    method: 'get',
    params,
  });
}
/**
 * 积分订单备注
 * @param pram
 */
export function intervalOrderMarkApi(data) {
  return request({
    url: `/admin/platform/integral/order/mark`,
    method: 'post',
    data,
  });
}
/**
 * 积分订单发货
 * @param pram
 */
export function intervalOrderSendApi(data) {
  return request({
    url: `/admin/platform/integral/order/send`,
    method: 'post',
    data,
  });
}
/**
 * 积分订单各状态数量
 * @param pram
 */
export function intervalOrderNumApi(params) {
  return request({
    url: `/admin/platform/integral/order/status/num`,
    method: 'get',
    params,
  });
}

/**
 * 修改发货单配送信息
 * @param data
 */
export function orderInvoiceUpdateApi(data) {
  return request({
    url: `/admin/platform/integral/order/invoice/update`,
    method: 'post',
    data,
  });
}

/**
 * 获取订单发货单列表
 * @param orderNo 订单号
 */
export function orderInvoiceListApi(orderNo) {
  return request({
    url: `/admin/platform/integral/order/${orderNo}/invoice/list`,
    method: 'get',
  });
}

/**
 * 订单物流详情
 */
export function getLogisticsInfoApi(invoiceId) {
  return request({
    url: `/admin/platform/integral/order/get/${invoiceId}/logistics/info`,
    method: 'get',
  });
}

/**
 * 修改积分区间状态
 */
export function integralSwitcheApi(id) {
  return request({
    url: `/admin/platform/integral/interval/update/status/${id}`,
    method: 'post',
  });
}
