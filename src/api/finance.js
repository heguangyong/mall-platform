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
 * 商户结算分页列表
 * @param params
 */
export function merchantClosingListApi(params) {
  return request({
    url: '/admin/platform/finance/merchant/closing/list',
    method: 'get',
    params,
  });
}

/**
 * 商户结算备注
 * @param params
 */
export function merClosingRemarkApi(data) {
  return request({
    url: '/admin/platform/finance/merchant/closing/remark',
    method: 'post',
    data,
  });
}

/**
 * 商户结算记录详情
 * @param params
 */
export function merClosingDetailApi(closingNo) {
  return request({
    url: `admin/platform/finance/merchant/closing/detail/${closingNo}`,
    method: 'get',
  });
}

/**
 * @description 商户结算到账凭证
 */
export function transferProofApi(data) {
  return request({
    url: `admin/platform/finance/merchant/closing/proof`,
    method: 'POST',
    data,
  });
}

/**
 * @description商户结算申请审核
 */
export function closingAuditApi(data) {
  return request({
    url: `admin/platform/finance/merchant/closing/audit`,
    method: 'POST',
    data,
  });
}

/**
 * @获取商户结算设置
 */
export function closingConfigApi(data) {
  return request({
    url: `admin/platform/finance/merchant/closing/config`,
    method: 'get',
  });
}

/**
 * @编辑商户结算设置
 */
export function closingEditApi(data) {
  return request({
    url: `admin/platform/finance/merchant/closing/config/edit`,
    method: 'post',
    data,
  });
}
/**
 * 用户结算备注
 * @param params
 */
export function userClosingRemarkApi(data) {
  return request({
    url: '/admin/platform/finance/user/closing/remark',
    method: 'post',
    data,
  });
}

/**
 * 用户结算申请审核
 * @param params
 */
export function userClosingAuditApi(data) {
  return request({
    url: `/admin/platform/finance/user/closing/audit`,
    method: 'POST',
    data,
  });
}

/**
 * 用户结算分页列表
 * @param params
 */
export function userClosingListApi(params) {
  return request({
    url: `/admin/platform/finance/user/closing/list`,
    method: 'get',
    params,
  });
}

/**
 * 用户结算到账凭证
 * @param params
 */
export function userClosingProofApi(data) {
  return request({
    url: `/admin/platform/finance/user/closing/proof`,
    method: 'POST',
    data,
  });
}

/**
 * @description 账单管理 日帐单管理分页列表
 */
export function dayStatementApi(params) {
  return request({
    url: `admin/platform/finance/daily/statement/list`,
    method: 'get',
    params,
  });
}

/**
 * @description 账单管理 月帐单管理分页列表
 */
export function monthStatementApi(params) {
  return request({
    url: `admin/platform/finance/month/statement/list`,
    method: 'get',
    params,
  });
}

/**
 * @description 资金流水 -- 列表
 */
export function capitalFlowLstApi(params) {
  return request({
    url: `admin/platform/finance/funds/flow`,
    method: 'get',
    params,
  });
}

/**
 * @description 资金流水 -- 导出
 */
export function capitalFlowExportApi(data) {
  return request.get(`financial_record/export`, data);
}

/**
 * @description 充值订单分页列表
 */
export function rechargeLstApi(params) {
  return request({
    url: `admin/platform/recharge/order/list`,
    method: 'get',
    params,
  });
}

/**
 * @description 财务流水汇总
 */
export function statementsApi(params) {
  return request({
    url: `admin/platform/finance/summary/financial/statements`,
    method: 'get',
    params,
  });
}
