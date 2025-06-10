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
 * 新增
 * @param
 */
export function addRole(pram) {
  const data = {
    level: pram.level,
    roleName: pram.roleName,
    status: pram.status,
    rules: pram.rules,
  };
  // data.rules = pram.rules.join(',')
  return request({
    url: '/admin/platform/role/save',
    method: 'POST',
    data: data,
  });
}

/**
 * 删除
 * @param
 */
export function delRole(id) {
  return request({
    url: `admin/platform/role/delete/${id}`,
    method: 'post',
  });
}

/**
 * 详情
 * @param
 */
export function getInfo(pram) {
  return request({
    url: `/admin/platform/role/info/${pram}`,
    method: 'GET',
  });
}

/**
 * 分页列表
 * @param
 */
export function getRoleList(pram) {
  const data = {
    createTime: pram.createTime,
    updateTime: pram.updateTime,
    level: pram.level,
    page: pram.page,
    limit: pram.limit,
    roleName: pram.roleName,
    rules: pram.rules,
    status: pram.status,
  };
  return request({
    url: '/admin/platform/role/list',
    method: 'get',
    params: data,
  });
}

/**
 * 修改
 * @param
 */
export function updateRole(pram) {
  const data = {
    id: pram.id,
    roleName: pram.roleName,
    rules: pram.rules,
    status: pram.status,
  };
  return request({
    url: '/admin/platform/role/update',
    method: 'post',
    params: { id: pram.id },
    data: data,
  });
}

/**
 * 修改身份状态
 * @param
 */
export function updateRoleStatus(data) {
  return request({
    url: '/admin/platform/role/updateStatus',
    method: 'post',
    data,
  });
}

/**
 * 缓存菜单
 * @param
 */
export function menuCacheList(pram) {
  return request({
    url: '/admin/platform/menu/cache/tree',
    method: 'get',
  });
}
