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
 * 删除文章
 * @param id
 * @constructor
 */
export function DelArticle(id) {
  return request({
    url: `/admin/platform/article/delete/${id}`,
    method: 'POST',
  });
}

/**
 * 文章详情
 * @param id
 * @constructor
 */
export function InfoArticle(id) {
  return request({
    url: `/admin/platform/article/info/${id}`,
    method: 'get',
  });
}

/**
 * 文章列表
 * @param pram
 * @constructor
 */
export function ListArticle(pram) {
  const data = {
    author: pram.author,
    cid: pram.cid,
    page: pram.page,
    limit: pram.limit,
    title: pram.title,
    searchType: pram.searchType,
    content: pram.content,
  };
  return request({
    url: '/admin/platform/article/list',
    method: 'GET',
    params: data,
  });
}

/**
 * 新增文章
 * @param pram
 * @constructor
 */
export function AddArticle(pram) {
  const data = {
    author: pram.author,
    cid: pram.cid,
    content: pram.content,
    cover: pram.cover,
    isBanner: pram.isBanner,
    isHot: pram.isHot,
    sort: pram.sort,
    synopsis: pram.synopsis,
    title: pram.title,
    url: pram.url,
  };
  return request({
    url: '/admin/platform/article/save',
    method: 'post',
    data: data,
  });
}

/**
 * 更新文章
 * @param pram
 * @constructor
 */
export function UpdateArticle(pram) {
  const data = {
    author: pram.author,
    cid: pram.cid,
    content: pram.content,
    cover: pram.cover,
    isBanner: pram.isBanner,
    isHot: pram.isHot,
    sort: pram.sort,
    synopsis: pram.synopsis,
    title: pram.title,
    id: pram.id,
  };
  return request({
    url: '/admin/platform/article/update',
    method: 'post',
    data,
  });
}

/**
 * 新增文章分类
 * @param data
 * @constructor
 */
export function articleCategoryAddApi(data) {
  return request({
    url: '/admin/platform/article/category/add',
    method: 'POST',
    data,
  });
}

/**
 * 删除文章分类
 * @param data
 * @constructor
 */
export function articleCategoryDelApi(row) {
  return request({
    url: `admin/platform/article/category/delete/${row.id}`,
    method: 'POST',
  });
}

/**
 * 文章分类分页列表
 * @constructor
 */
export function articleCategoryListApi() {
  return request({
    url: `admin/platform/article/category/list`,
    method: 'GET',
  });
}

/**
 * 修改文章分类
 * @param data
 * @constructor
 */
export function articleCategoryUpdateApi(data) {
  return request({
    url: `admin/platform/article/category/update`,
    method: 'POST',
    data,
  });
}

/**
 * 文章开关
 * @param data
 */
export function articleSwitchApi(id) {
  return request({
    url: `/admin/platform/article/switch/${id}`,
    method: 'POST',
  });
}

/**
 * 文章分类开关
 * @param data
 */
export function articleCategorySwitchApi(id) {
  return request({
    url: `/admin/platform/article/category/switch/${id}`,
    method: 'POST',
  });
}
