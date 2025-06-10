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

// ------------------------拼团活动----------------------------------------

/**
 * 分页列表
 * @param
 */
export function groupActivityList(pram) {
  return request({
    url: '/admin/platform/groupbuy/activity/list',
    method: 'get',
    params: pram,
  });
}
/**
 * 详情
 * @param
 */
export function groupActivityInfo(id) {
  const data = {
    id: id,
  };
  return request({
    url: `/admin/platform/groupbuy/activity/info`,
    method: 'get',
    params: data,
  });
}
/**
 * 拼团头部
 * @param
 */
export function groupActivityCount(data) {
  return request({
    url: '/admin/platform/groupbuy/activity/list/count',
    method: 'get',
    params: data,
  });
}
/**
 * 强制关闭
 * @param
 */
export function groupActivityClose(id) {
  const data = {
    id: id,
  };
  return request({
    url: '/admin/platform/groupbuy/activity/review/close',
    method: 'get',
    params: data,
  });
}
/**
 * 审核通过
 * @param
 */
export function groupActivityPass(id) {
  const data = {
    id: id,
  };
  return request({
    url: '/admin/platform/groupbuy/activity/review/pass',
    method: 'get',
    params: data,
  });
}

/**
 * 审核拒绝
 * @param
 */
export function groupActivityRefuse(pram) {
  const data = {
    id: pram.id,
    reason: pram.reason,
  };
  return request({
    url: '/admin/platform/groupbuy/activity/review/refuse',
    method: 'get',
    params: data,
  });
}
// ------------------------拼团记录----------------------------------------
/**
 * 分页列表
 * @param
 */
export function groupRecordList(pram) {
  return request({
    url: '/admin/platform/groupbuy/record/list',
    method: 'get',
    params: pram,
  });
}
/**
 * 头部
 * @param
 */
export function groupRecordCount(data) {
  return request({
    url: '/admin/platform/groupbuy/record/list/count',
    method: 'get',
    params: data,
  });
}
/**
 * 详情
 * @param
 */
export function groupRecordInfo(id) {
  return request({
    url: `/admin/platform/groupbuy/record/info/${id}`,
    method: 'get',
  });
}
