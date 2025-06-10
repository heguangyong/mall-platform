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
 * 新增分类
 * @param pram
 */
export function addCategroy(pram) {
  const data = {
    extra: pram.extra,
    name: pram.name,
    pid: pram.pid,
    sort: pram.sort,
    status: pram.status,
    type: pram.type,
    url: pram.url,
  };
  return request({
    url: '/admin/platform/category/save',
    method: 'POST',
    data: data,
  });
}

/**
 * 分类详情
 * @param pram
 */
export function infoCategroy(id) {
  return request({
    url: `/admin/platform/category/info/${id}`,
    method: 'GET',
  });
}

/**
 * 删除分类
 * @param pram
 */
export function deleteCategroy(id) {
  return request({
    url: `/admin/platform/category/delete/${id}`,
    method: 'post',
  });
}

/**
 * 分类数据tree数据
 * @param pram
 */
export function treeCategroy(pram) {
  const data = {
    type: pram.type,
    status: pram.status,
    name: pram.name,
  };
  return request({
    url: '/admin/platform/category/list/tree',
    method: 'GET',
    params: data,
  });
}

/**
 * 更新分类
 * @param pram
 */
export function updateCategroy(pram) {
  const data = {
    extra: pram.extra,
    name: pram.name,
    pid: pram.pid,
    sort: pram.sort,
    status: pram.status,
    type: pram.type,
    url: pram.url,
    id: pram.id,
  };
  return request({
    url: `/admin/platform/category/update/${pram.id}`,
    method: 'POST',
    data: data,
  });
}

/**
 * 根据id集合查询对应分类列表
 * @param pram
 */
export function categroyByIds(pram) {
  const data = {
    ids: pram.ids,
  };
  return request({
    url: '/admin/platform/category/list/ids',
    method: 'GET',
    params: data,
  });
}

/**
 * 修改 显示关闭状态
 * @param pram
 */
export function categroyUpdateStatus(id) {
  return request({
    url: `/admin/platform/category/updateStatus/${id}`,
    method: 'post',
  });
}
