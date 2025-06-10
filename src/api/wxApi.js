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

// TODO 微信沟通难度大暂放 呵呵

export function menuCreate(data) {
  return request({
    url: '/admin/platform/wechat/menu/public/create',
    method: 'post',
    params: data,
  });
}

export function menuDelete(data) {
  return request({
    url: '/admin/platform/wechat/menu/public/delete',
    method: 'post',
    params: data,
  });
}

/**
 * 微信模板消息 列表
 * @param pram
 */
export function wechatTemplateListApi(params) {
  return request({
    url: `/admin/wechat/template/list`,
    method: 'get',
    params,
  });
}

/**
 * 微信模板消息 新增
 * @param pram
 */
export function wechatTemplateSaveApi(data) {
  return request({
    url: `/admin/wechat/template/save`,
    method: 'post',
    data,
  });
}

/**
 * 微信模板消息 编辑
 * @param pram
 */
export function wechatTemplateUpdateApi(id, data) {
  return request({
    url: `/admin/wechat/template/update/${id}`,
    method: 'post',
    data,
  });
}

/**
 * 微信模板消息 详情
 * @param pram
 */
export function wechatTemplateInfoApi(id) {
  return request({
    url: `/admin/wechat/template/info/${id}`,
    method: 'get',
  });
}

/**
 * 微信模板消息 修改状态
 * @param pram
 */
export function wechatTemplateStatusApi(id, params) {
  return request({
    url: `/admin/wechat/template/update/status/${id}`,
    method: 'post',
    params,
  });
}

/**
 * 微信模板消息 删除
 * @param pram
 */
export function wechatTemplateDeleteApi(id) {
  return request({
    url: `/admin/wechat/template/delete/${id}`,
    method: 'get',
  });
}

/**
 * 关键字回复 列表
 * @param pram
 */
export function wechatReplyListApi(params) {
  return request({
    url: `/admin/platform/wechat/public/keywords/reply/list`,
    method: 'get',
    params,
  });
}

/**
 * 关键字回复 新增
 * @param pram
 */
export function wechatReplySaveApi(data) {
  return request({
    url: `/admin/platform/wechat/public/keywords/reply/save`,
    method: 'post',
    data,
  });
}

/**
 * 关键字回复 修改状态
 * @param pram
 */
export function wechatReplyStatusApi(id) {
  return request({
    url: `/admin/platform/wechat/public/keywords/reply/status/${id}`,
    method: 'post',
  });
}
/**
 * 关键字回复 编辑
 * @param pram
 */
export function wechatReplyUpdateApi(data) {
  return request({
    url: `/admin/platform/wechat/public/keywords/reply/update`,
    method: 'post',
    data,
  });
}

/**
 * 关键字回复 详情
 * @param pram
 */
export function wechatReplyInfoApi(id) {
  return request({
    url: `/admin/platform/wechat/public/keywords/reply/info/${id}`,
    method: 'get',
  });
}

/**
 * 关键字回复 删除
 * @param pram
 */
export function wechatReplyDeleteApi(id) {
  return request({
    url: `/admin/platform/wechat/public/keywords/reply/delete/${id}`,
    method: 'get',
  });
}

/**
 * 根据关键字查询微信关键字回复
 * @param pram
 */
export function keywordsInfoApi(params) {
  return request({
    url: `/admin/platform/wechat/public/keywords/reply/info/keywords`,
    method: 'get',
    params,
  });
}

/**
 * 微信菜单 获取数据
 * @param pram
 */
export function wechatMenuApi() {
  return request({
    url: `/admin/platform/wechat/public/customize/menu`,
    method: 'get',
  });
}

/**
 * 微信菜单 新增
 * @param pram
 */
export function wechatMenuAddApi(data) {
  return request({
    url: `/admin/platform/wechat/public/customize/menu/create`,
    method: 'post',
    data,
  });
}

/**
 * 小程序 公共模板列表
 */
export function publicTempListApi(params) {
  return request({
    url: `/admin/wechat/program/public/temp/list`,
    method: 'get',
    params,
  });
}

/**
 * 小程序 模版所属类目
 */
export function categoryApi() {
  return request({
    url: `/admin/wechat/program/category`,
    method: 'get',
  });
}

/**
 * 小程序 通过微信模板tid获取关键字列表
 */
export function getWeChatKeywordsByTidApi(params) {
  return request({
    url: `/admin/wechat/program/getWeChatKeywordsByTid`,
    method: 'get',
    params,
  });
}

/**
 * 小程序 模板详情，主要是获取左侧标题
 */
export function publicTempInfoApi(params) {
  return request({
    url: `/admin/wechat/program/public/temp/info`,
    method: 'get',
    params,
  });
}

/**
 * 小程序 我的模板列表
 */
export function myTempListApi(params) {
  return request({
    url: `/admin/wechat/program/my/temp/list`,
    method: 'get',
    params,
  });
}

/**
 * 小程序 我的模板详情
 */
export function myTempInfoApi(params) {
  return request({
    url: `/admin/wechat/program/my/temp/info`,
    method: 'get',
    params,
  });
}

/**
 * 小程序 模板新增
 */
export function myTempSaveApi(data) {
  return request({
    url: `/admin/wechat/program/my/temp/save`,
    method: 'post',
    data,
  });
}

/**
 * 小程序 模板修改
 */
export function myTempUpdateApi(params, data) {
  return request({
    url: `/admin/wechat/program/my/temp/update`,
    method: 'post',
    params,
    data,
  });
}

/**
 * 小程序 我的模板修改状态
 */
export function myTempStatusApi(params) {
  return request({
    url: `/admin/wechat/program/my/temp/update/status`,
    method: 'get',
    params,
  });
}

/**
 * 小程序 我的模板修改应用场景
 */
export function myTempTypeApi(params) {
  return request({
    url: `/admin/wechat/program/my/temp/update/type`,
    method: 'get',
    params,
  });
}

/**
 * 获取微信sdk配置
 * @returns {*}
 */
export function getWechatConfig() {
  return request({
    url: `/admin/platform/wechat/get/public/js/config`,
    method: 'get',
    params: { url: encodeURIComponent(location.href.split('#')[0]) }, // for Test
  });
}

/**
 * 微信授权登录
 * @returns {*}
 */
export function wechatAuth(code) {
  return request({
    url: `/admin/authorize/login`,
    method: 'get',
    params: { code },
  });
}

/**
 * 与微信解绑账号
 */
export function unbindApi() {
  return request({
    url: `/admin/unbind`,
    method: 'get',
  });
}

/**
 * 一键同步我的模板到小程序
 */
export function tempAsyncApi() {
  return request({
    url: `/admin/platform/wechat/program/my/temp/async`,
    method: 'get',
  });
}

/**
 * 公众号模板消息同步
 */
export function wechatAsyncApi() {
  return request({
    url: `/admin/platform/wechat/template/whcbqhn/sync`,
    method: 'post',
  });
}

/**
 * 小程序模板消息同步
 */
export function routineAsyncApi() {
  return request({
    url: `/admin/platform/wechat/template/routine/sync`,
    method: 'post',
  });
}

/**
 * 获取微信小程序发货开关
 */
export function wechatGetShippingSwitchApi() {
  return request({
    url: `/admin/platform/wechat/get/shipping/switch`,
    method: 'get',
  });
}

/**
 * 更新微信小程序发货开关
 */
export function wechatUpdateShippingSwitchApi(data) {
  return request({
    url: `/admin/platform/wechat/update/shipping/switch`,
    method: 'post',
    data,
  });
}

/**
 * 删除微信小程序加密URLLink
 */
export function wechatUrlLinkDeleteApi(id) {
  return request({
    url: `/admin/platform/wechat/url/link/mini/delete/${id}`,
    method: 'post',
  });
}

/**
 * 生成微信小程序加密URLLink
 */
export function wechatUrlLinkGenerateApi(data) {
  return request({
    url: `/admin/platform/wechat/url/link/mini/generate`,
    method: 'post',
    data,
  });
}

/**
 * 微信小程序url链接分页列表
 */
export function wechatUrlLinkListApi(params) {
  return request({
    url: `/admin/platform/wechat/url/link/mini/list`,
    method: 'get',
    params,
  });
}
