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
 * @description diy 新增
 */
export function pagediySaveApi(data) {
  return request({
    url: '/admin/platform/pagediy/save',
    method: 'post',
    data,
  });
}

/**
 * @description diy 列表
 */
export function pagediyListApi(params) {
  return request({
    url: '/admin/platform/pagediy/list',
    method: 'get',
    params,
  });
}

/**
 * @description diy 详情
 */
export function pagediyInfoApi(id) {
  return request({
    url: `/admin/platform/pagediy/info/${id}`,
    method: 'get',
  });
}

/**
 * @description diy 修改
 */
export function pagediyUpdateApi(data) {
  return request({
    url: `/admin/platform/pagediy/update`,
    method: 'post',
    data,
  });
}

/**
 * @description diy 设置商城首页
 */
export function pagediySetdefaultApi(id) {
  return request({
    url: `/admin/platform/pagediy/setdefault/${id}`,
    method: 'get',
  });
}

/**
 * @description diy 设置商城删除
 */
export function pagediyDeleteApi(params) {
  return request({
    url: `/admin/platform/pagediy/delete`,
    method: 'get',
    params,
  });
}

/**
 * 查询已经设置的首页diy 模版id
 * @returns {*}
 */
export function pagediyGetSetHome() {
  return request({
    url: `/admin/platform/pagediy/getdefault`,
    method: 'get',
  });
}

/**
 * 获取小程序二维码
 * @returns {*}
 */
export function wechatQrcodeApi(data) {
  return request({
    url: `/publicly/wechat/mini/get/qrcode`,
    method: 'post',
    data,
  });
}

/**
 * DIY 模版名称更新
 * @returns {*}
 */
export function pagediyUpdatenameApi(data) {
  return request({
    url: `/admin/platform/pagediy/updatename`,
    method: 'post',
    data,
  });
}

/**
 * 获取开屏广告配置
 * @returns {*}
 */
export function splashGetApi() {
  return request({
    url: `/admin/platform/page/layout/splash/ad/get`,
    method: 'get',
  });
}

/**
 * 编辑开屏广告配置
 * @returns {*}
 */
export function splashSaveApi(data) {
  return request({
    url: `/admin/platform/page/layout/splash/ad/save`,
    method: 'post',
    data,
  });
}
