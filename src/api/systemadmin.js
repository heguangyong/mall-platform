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

export function adminDel(pram) {
  const data = {
    id: pram.id,
  };
  return request({
    url: '/admin/platform/admin/delete',
    method: 'GET',
    params: data,
  });
}

export function adminInfo(pram) {
  const data = {
    id: pram.id,
  };
  return request({
    url: '/admin/platform/admin/info',
    method: 'GET',
    params: data,
  });
}

export function adminList(params) {
  return request({
    url: '/admin/platform/admin/list',
    method: 'GET',
    params,
  });
}

export function adminAdd(pram) {
  const data = {
    account: pram.account,
    level: pram.level,
    pwd: pram.pwd,
    realName: pram.realName,
    roles: pram.roles.join(','),
    status: pram.status,
    phone: pram.phone,
  };
  return request({
    url: '/admin/platform/admin/save',
    method: 'POST',
    data: data,
  });
}

export function adminUpdate(pram) {
  const data = {
    account: pram.account,
    phone: pram.phone,
    pwd: pram.pwd,
    roles: pram.roles,
    realName: pram.realName,
    status: pram.status,
    id: pram.id,
    isDel: pram.isDel,
  };
  return request({
    url: '/admin/platform/admin/update',
    method: 'POST',
    data,
  });
}

/**
 * 修改状态
 * @param pram
 */
export function updateStatusApi(params) {
  return request({
    url: `/admin/platform/admin/updateStatus`,
    method: 'get',
    params,
  });
}

/**
 * 权限规则菜单列表
 * @param pram
 */
export function menuListApi(params) {
  const data = {
    menuType: params.menuType, //菜单类型:M-目录，C-菜单，A-按钮
    name: params.name, //菜单名称
  };
  return request({
    url: `/admin/platform/menu/list`,
    method: 'get',
    params: data,
  });
}

/**
 * 权限规则新增菜单
 * @param data
 */
export function menuAdd(data) {
  let systemMenuRequest = data;
  return request({
    url: `/admin/platform/menu/add`,
    method: 'post',
    data: systemMenuRequest,
  });
}

/**
 * 权限规则删除菜单
 * @param data
 */
export function menuDelete(id) {
  return request({
    url: `/admin/platform/menu/delete/${id}`,
    method: 'post',
  });
}

/**
 * 权限规则菜单详情
 * @param data
 */
export function menuInfo(id) {
  return request({
    url: `/admin/platform/menu/info/${id}`,
    method: 'get',
  });
}

/**
 * 权限规则菜单修改
 * @param data
 */
export function menuUpdate(data) {
  let systemMenuRequest = data;
  return request({
    url: `/admin/platform/menu/update`,
    method: 'post',
    data: systemMenuRequest,
  });
}

/**
 * 权限规则修改菜单显示状态
 * @param data
 */
export function menuUpdateShowStatus(id) {
  return request({
    url: `admin/platform/menu/update/show/${id}`,
    method: 'post',
  });
}

/**
 * 敏感操作日志
 * @param data
 */
export function sensitiveListApi(params) {
  return request({
    url: `/admin/platform/log/sensitive/list`,
    method: 'get',
    params,
  });
}

/**
 * 修改登录用户信息
 * @param data
 */
export function adminAccountUpdate(pram) {
  const data = {
    realName: pram.realName,
  };
  return request({
    url: '/admin/platform/login/admin/update',
    method: 'POST',
    data,
  });
}

/**
 * 修改登录用户密码
 * @param data
 */
export function adminPasswordUpdate(pram) {
  const data = {
    confirmPassword: pram.confirmPassword,
    password: pram.password,
    oldPassword: pram.oldPassword,
  };
  return request({
    url: '/admin/platform/login/admin/update/password',
    method: 'POST',
    data,
  });
}

/**
 * 修改管理员密码
 * @param data
 */
export function editPassWordApi(data) {
  return request({
    url: '/admin/platform/admin/update/password',
    method: 'POST',
    data,
  });
}

/**
 * 商户后台管理员短信开关
 * @param pram
 */
export function updateReceiveSmsApi(id) {
  return request({
    url: `/admin/platform/admin/update/receive/sms/${id}`,
    method: 'post',
  });
}