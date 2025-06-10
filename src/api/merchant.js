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
 * 商户分类 列表
 */
export function merchantCategoryListApi(params) {
  return request({
    url: '/admin/platform/merchant/category/list',
    method: 'get',
    params,
  });
}

/**
 * 商户分类 全部列表
 */
export function merchantCategoryAllListApi() {
  return request({
    url: '/admin/platform/merchant/category/all/list',
    method: 'get',
  });
}

/**
 * 商户分类 添加
 */
export function merchantCategoryAddApi(data) {
  return request({
    url: '/admin/platform/merchant/category/add',
    method: 'post',
    data,
  });
}

/**
 * 商户分类 编辑
 */
export function merchantCategoryUpdateApi(data) {
  return request({
    url: '/admin/platform/merchant/category/update',
    method: 'post',
    data,
  });
}

/**
 * 商户分类 删除
 */
export function merchantCategoryDeleteApi(id) {
  return request({
    url: `/admin/platform/merchant/category/delete/${id}`,
    method: 'post',
  });
}

/**
 * 店铺类型 列表
 */
export function merchantTypeListApi(params) {
  return request({
    url: '/admin/platform/merchant/type/list',
    method: 'get',
    params,
  });
}

/**
 * 店铺类型 全部列表
 */
export function merchantTypeAllListApi() {
  return request({
    url: '/admin/platform/merchant/type/all/list',
    method: 'get',
  });
}

/**
 * 店铺类型 添加
 */
export function merchantTypeAddApi(data) {
  return request({
    url: '/admin/platform/merchant/type/add',
    method: 'post',
    data,
  });
}

/**
 * 店铺类型 编辑
 */
export function merchantTypeUpdateApi(data) {
  return request({
    url: '/admin/platform/merchant/type/update',
    method: 'post',
    data,
  });
}

/**
 * 店铺类型 删除
 */
export function merchantTypeDeleteApi(id) {
  return request({
    url: `/admin/platform/merchant/type/delete/${id}`,
    method: 'post',
  });
}

/**
 * 商户 列表
 */
export function merchantListApi(params) {
  return request({
    url: '/admin/platform/merchant/list',
    method: 'get',
    params,
  });
}

/**
 * 商户 添加
 */
export function merchantAddApi(data) {
  return request({
    url: '/admin/platform/merchant/add',
    method: 'post',
    data,
  });
}

/**
 * 商户 编辑
 */
export function merchantUpdateApi(data) {
  return request({
    url: '/admin/platform/merchant/update',
    method: 'post',
    data,
  });
}

/**
 * 商户 关闭
 */
export function merchantCloseApi(id) {
  return request({
    url: `/admin/platform/merchant/close/${id}`,
    method: 'post',
  });
}

/**
 * 商户 详情
 */
export function merchantDetailApi(id) {
  return request({
    url: `/admin/platform/merchant/detail/${id}`,
    method: 'get',
  });
}

/**
 * 商户 开启
 */
export function merchantOpenApi(id) {
  return request({
    url: `/admin/platform/merchant/open/${id}`,
    method: 'post',
  });
}

/**
 * 商户 推荐开关
 */
export function merchantSwitchApi(id) {
  return request({
    url: `/admin/platform/merchant/recommend/switch/${id}`,
    method: 'post',
  });
}

/**
 * 商户 修改复制商品数量
 */
export function merchantCopyNumApi(data) {
  return request({
    url: `/admin/platform/merchant/update/copy/product/num`,
    method: 'post',
    data,
  });
}

/**
 * 商户 修改商户手机号
 */
export function merchantupdatePhoneApi(data) {
  return request({
    url: `/admin/platform/merchant/update/phone`,
    method: 'post',
    data,
  });
}

/**
 * 商户 权限规则菜单列表
 * @param pram
 */
export function menuMerListApi(params) {
  const data = {
    menuType: params.menuType, //菜单类型:M-目录，C-菜单，A-按钮
    name: params.name, //菜单名称
  };
  return request({
    url: `/admin/platform/merchant/menu/list`,
    method: 'get',
    params: data,
  });
}

/**
 * 商户 权限规则新增菜单
 * @param data
 */
export function menuMerAdd(data) {
  let systemMenuRequest = data;
  return request({
    url: `/admin/platform/merchant/menu/add`,
    method: 'post',
    data: systemMenuRequest,
  });
}

/**
 * 商户 权限规则删除菜单
 * @param data
 */
export function menuMerDelete(id) {
  return request({
    url: `/admin/platform/merchant/menu/delete/${id}`,
    method: 'post',
  });
}

/**
 * 商户 权限规则菜单详情
 * @param data
 */
export function menuMerInfo(id) {
  return request({
    url: `/admin/platform/merchant/menu/info/${id}`,
    method: 'get',
  });
}

/**
 * 商户 权限规则菜单修改
 * @param data
 */
export function menuMerUpdate(data) {
  let systemMenuRequest = data;
  return request({
    url: `/admin/platform/merchant/menu/update`,
    method: 'post',
    data: systemMenuRequest,
  });
}

/**
 * 权限规则修改菜单显示状态
 * @param data
 */
export function menuMerUpdateShowStatus(params) {
  return request({
    url: `/admin/platform/merchant/menu/update/show/${params.id}`,
    method: 'post',
  });
}

/**
 * 商户入驻分页列表
 * @param data
 */
export function merApplyListApi(params) {
  return request({
    url: `/admin/platform/merchant/apply/list`,
    method: 'get',
    params,
  });
}

/**
 * 商户入驻审核
 * @param data
 */
export function merApplyAuditApi(data) {
  return request({
    url: `/admin/platform/merchant/apply/audit`,
    method: 'post',
    data,
  });
}

/**
 * 商户入驻备注
 * @param data
 */
export function merApplyRemarkApi(data) {
  return request({
    url: `/admin/platform/merchant/apply/remark`,
    method: 'post',
    data,
  });
}

/**
 * 商户分页列表表头数量
 * @param data
 */
export function merHeaderNumApi(params) {
  return request({
    url: `/admin/platform/merchant/list/header/num`,
    method: 'get',
    params,
  });
}

/**
 * 重置商户密码
 * @param data
 */
export function merRsetPasswordApi(id) {
  return request({
    url: `/admin/platform/merchant/reset/password/${id}`,
    method: 'post',
  });
}

/**
 * 可用分类商户列表
 * @param data
 */
export function merCategoryListApi() {
  return request({
    url: `/admin/platform/merchant/use/category/list`,
    method: 'get',
  });
}
