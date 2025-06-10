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
 * @description 分销设置 -- 详情
 */
export function configApi() {
  return request({
    url: '/admin/platform/retail/store/config/get',
    method: 'get',
  });
}

/**
 * @description 分销设置 -- 表单提交
 */
export function configUpdateApi(data) {
  return request({
    url: '/admin/platform/retail/store/config/save',
    method: 'post',
    data,
  });
}

/**
 * @description 分销员 -- 列表
 */
export function promoterListApi(params) {
  return request({
    url: '/admin/platform/retail/store/people/list',
    method: 'get',
    params,
  });
}

/**
 * @description 根据条件获取下级推广用户列表
 */
export function spreadListApi(params) {
  return request({
    url: '/admin/platform/retail/store/sub/user/list',
    method: 'get',
    params,
  });
}

/**
 * @description 推广人订单 -- 列表
 */
export function spreadOrderListApi(params) {
  return request({
    url: '/admin/platform/retail/store/promotion/order/list',
    method: 'get',
    params,
  });
}

/**
 * @description 推广人 -- 清除上级推广人
 */
export function spreadClearApi(id) {
  return request({
    url: `/admin/platform/retail/store/clean/spread/${id}`,
    method: 'get',
  });
}
