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
 * 添加PC商城首页推荐板块
 */
export function pcRecommendedAddApi(data) {
  return request({
    url: `/admin/platform/pc/shopping/recommended/add`,
    method: 'post',
    data,
  });
}

/**
 * 编辑PC商城首页推荐板块
 */
export function pcRecommendedEditApi(data) {
  return request({
    url: `/admin/platform/pc/shopping/recommended/edit`,
    method: 'post',
    data,
  });
}

/**
 * 编辑PC商城首页推荐板块
 */
export function pcRecommendedListApi() {
  return request({
    url: `/admin/platform/pc/shopping/get/recommended/list`,
    method: 'get',
  });
}

/**
 * PC商城首页推荐板块开关
 */
export function pcRecommendedSwitchApi(id) {
  return request({
    url: `/admin/platform/pc/shopping/recommended/switch/${id}`,
    method: 'post',
  });
}

/**
 * 删除PC商城首页推荐板块
 */
export function pcRecommendedDeleteApi(id) {
  return request({
    url: `/admin/platform/pc/shopping/recommended/delete/${id}`,
    method: 'post',
  });
}

/**
 * 保存PC商城首页banner
 */
export function pcHomeBannerSaveApi(data) {
  return request({
    url: `/admin/platform/pc/shopping/home/banner/save`,
    method: 'post',
    data,
  });
}

/**
 * 获取PC商城首页banner
 */
export function pcHomeBannerGetApi() {
  return request({
    url: `/admin/platform/pc/shopping/home/banner/get`,
    method: 'get',
  });
}

/**
 * 获取PC商城经营理念配置
 */
export function pcPhilosophyGetApi() {
  return request({
    url: `/admin/platform/pc/shopping/philosophy/get`,
    method: 'get',
  });
}

/**
 * 保存PC商城经营理念配置
 */
export function pcPhilosophySaveApi(data) {
  return request({
    url: `/admin/platform/pc/shopping/philosophy/save`,
    method: 'post',
    data,
  });
}

/**
 * 保存PC商城底部授权配置
 */
export function pcBottomAuthorizeSaveApi(data) {
  return request({
    url: `/admin/platform/pc/shopping/bottom/authorize/save`,
    method: 'post',
    data,
  });
}

/**
 * 获取PC商城底部授权配置
 */
export function pcBottomAuthorizGetApi() {
  return request({
    url: `/admin/platform/pc/shopping/bottom/authorize/get`,
    method: 'get',
  });
}

/**
 * 获取PC商城基础配置
 */
export function pcBaseConfigGetApi() {
  return request({
    url: `/admin/platform/pc/shopping/base/config/get`,
    method: 'get',
  });
}

/**
 * 编辑PC商城基础配置
 */
export function pcBaseConfigEditApi(data) {
  return request({
    url: `/admin/platform/pc/shopping/base/config/edit`,
    method: 'post',
    data,
  });
}

/**
 * 保存PC商城友情链接配置
 */
export function pcFriendlyLinkSaveApi(data) {
  return request({
    url: `/admin/platform/pc/shopping/friendly/link/save`,
    method: 'post',
    data,
  });
}

/**
 * 获取PC商城友情链接配置
 */
export function pcFriendlyLinkGetApi() {
  return request({
    url: `/admin/platform/pc/shopping/friendly/link/get`,
    method: 'get',
  });
}

/**
 * 保存PC商城友情链接配置
 */
export function bottomQrcodeSaveApi(data) {
  return request({
    url: `/admin/platform/pc/shopping/bottom/qrcode/save`,
    method: 'post',
    data,
  });
}

/**
 * 获取PC商城友情链接配置
 */
export function bottomQrcodeGetApi() {
  return request({
    url: `/admin/platform/pc/shopping/bottom/qrcode/get`,
    method: 'get',
  });
}

/**
 * 保存PC商城快捷入口配置
 */
export function shoppingQuickEntrySaveApi(data) {
  return request({
    url: `/admin/platform/pc/shopping/quick/entry/save`,
    method: 'post',
    data,
  });
}

/**
 * 获取PC商城快捷入口配置
 */
export function shoppingQuickEntryGetApi() {
  return request({
    url: `/admin/platform/pc/shopping/quick/entry/get`,
    method: 'get',
  });
}

/**
 * 编辑PC商城首页广告
 */
export function pcHomeAdvertisementEditApi(data) {
  return request({
    url: `/admin/platform/pc/shopping/home/advertisement/edit`,
    method: 'post',
    data,
  });
}

/**
 * 获取PC商城首页广告
 */
export function pcHomeAdvertisementGetApi() {
  return request({
    url: `/admin/platform/pc/shopping/home/advertisement/get`,
    method: 'get',
  });
}

/**
 * 保存PC商城首页导航配置
 */
export function pcHomeNavigationSaveApi(data) {
  return request({
    url: `/admin/platform/pc/shopping/home/navigation/save`,
    method: 'post',
    data,
  });
}

/**
 * 获取PC商城首页导航配置
 */
export function pcHomeNavigationGetApi() {
  return request({
    url: `/admin/platform/pc/shopping/home/navigation/get`,
    method: 'get',
  });
}
