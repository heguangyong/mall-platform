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

export function login(data) {
  return request({
    url: '/admin/platform/login',
    method: 'post',
    data,
  });
}

export function getInfo() {
  return request({
    url: '/admin/platform/getAdminInfoByToken',
    method: 'get',
  });
}

export function logout() {
  return request({
    url: '/admin/platform/logout',
    method: 'get',
  });
}

/**
 * 会员管理 列表
 * @param pram
 */
export function userListApi(params) {
  return request({
    url: `/admin/platform/user/list`,
    method: 'get',
    params,
  });
}

/**
 * 会员管理 修改
 * @param pram
 */
export function userUpdateApi(params, data) {
  return request({
    url: `/admin/platform/user/update`,
    method: 'post',
    params,
    data,
  });
}

/**
 * 会员管理等级 修改
 * @param pram
 */
export function userLevelUpdateApi(data) {
  return request({
    url: `/admin/user/update/level`,
    method: 'post',
    data,
  });
}

/**
 * 会员管理 详情
 * @param pram
 */
export function userInfoApi(params) {
  return request({
    url: `/admin/user/info`,
    method: 'get',
    params,
  });
}

/**
 * 会员管理 账户详情
 * @param pram
 */
export function infobyconditionApi(params) {
  return request({
    url: `/admin/user/infobycondition`,
    method: 'get',
    params,
  });
}

/**
 * 会员管理 账户详情top数据
 * @param pram
 */
export function topdetailApi(params) {
  return request({
    url: `/admin/user/topdetail`,
    method: 'get',
    params,
  });
}

/**
 * 会员管理 批量设置分组
 * @param pram
 */
export function groupPiApi(params) {
  return request({
    url: `/admin/user/group`,
    method: 'post',
    params,
  });
}

/**
 * 会员管理 批量设置标签
 * @param pram
 */
export function tagPiApi(data) {
  return request({
    url: `/admin/platform/user/tag`,
    method: 'post',
    data,
  });
}

/**
 * 会员管理 积分余额
 * @param pram
 */
export function foundsApi(params) {
  return request({
    url: `/admin/platform/user/operate/integer`,
    method: 'get',
    params,
  });
}

/**
 * 会员管理 积分余额
 * @param pram
 */
export function balanceApi(params) {
  return request({
    url: `/admin/platform/user/operate/balance`,
    method: 'get',
    params,
  });
}

/**
 * 会员管理 删除
 * @param pram
 */
export function userDeleteApi(params) {
  return request({
    url: `/admin/user/delete`,
    method: 'get',
    params,
  });
}

/**
 * 会员等级 列表
 * @param pram
 */
export function levelListApi() {
  return request({
    url: `/admin/platform/system/user/level/list`,
    method: 'get',
  });
}

/**
 * 会员等级 新增
 * @param pram
 */
export function levelSaveApi(data) {
  return request({
    url: `/admin/platform/system/user/level/save`,
    method: 'post',
    data,
  });
}

/**
 * 会员等级 编辑
 *  @param pram
 */
export function levelUpdateApi(data) {
  return request({
    url: `/admin/platform/system/user/level/update`,
    method: 'post',
    data,
  });
}

/**
 * 会员等级 详情
 * @param pram
 */
export function levelInfoApi(params) {
  return request({
    url: `/admin/system/user/level/info`,
    method: 'get',
    params,
  });
}

/**
 * 会员等级 删除
 * @param pram
 */
export function levelDeleteApi(id) {
  return request({
    url: `/admin/platform/system/user/level/delete/${id}`,
    method: 'post',
  });
}

/**
 * 会员等级 是否显示
 * @param pram
 */
export function levelUseApi(data) {
  return request({
    url: `/admin/platform/system/user/level/use`,
    method: 'post',
    data,
  });
}

/**
 * 会员标签 列表
 * @param pram
 */
export function tagListApi(params) {
  return request({
    url: `/admin/platform/user/tag/list`,
    method: 'get',
    params,
  });
}

/**
 * 会员标签 新增
 * @param pram
 */
export function tagSaveApi(data) {
  return request({
    url: `/admin/platform/user/tag/save`,
    method: 'post',
    data,
  });
}

/**
 * 会员标签 编辑
 * @param pram
 */
export function tagUpdateApi(data) {
  return request({
    url: `/admin/platform/user/tag/update`,
    method: 'post',
    data,
  });
}

/**
 * 会员标签 详情
 * @param pram
 */
export function tagInfoApi(params) {
  return request({
    url: `/admin/user/tag/info`,
    method: 'get',
    params,
  });
}

/**
 * 会员标签 删除
 * @param pram
 */
export function tagDeleteApi(id) {
  return request({
    url: `/admin/platform/user/tag/delete/${id}`,
    method: 'post',
  });
}

/**
 * 用户标签全部列表
 */
export function tagAllListApi(id) {
  return request({
    url: `/admin/platform/user/tag/all/list`,
    method: 'get',
  });
}

/**
 *获取登录页图片
 */
export function getLoginPicApi() {
  return request({
    url: `/admin/platform/getLoginPic`,
    method: 'get',
  });
}

/**
 * @description 验证码
 */
export function captchaApi() {
  return request({
    url: `/publicly/validate/code/get`,
    method: 'get',
  });
}

/**
 * @description 修改上级推广人
 */
export function updateSpreadApi(data) {
  return request({
    url: `/admin/platform/retail/store/update/user/spread`,
    method: 'post',
    data,
  });
}

/**
 * @description 修改手机号
 */
export function updatePhoneApi(params) {
  return request({
    url: `/admin/user/update/phone`,
    method: 'get',
    params,
  });
}

/**
 * @description 用户详情列表
 */
export function userDetailApi(id) {
  return request({
    url: `/admin/platform/user/detail/${id}`,
    method: 'get',
  });
}

/**
 * @description 获取用户等级配置
 */
export function systemUserLevelConfigApi(id) {
  return request({
    url: `/admin/platform/system/user/level/get/config`,
    method: 'GET',
  });
}

/**
 * @description 编辑用户等级配置
 */
export function systemUserLevelUpdateConfigApi(data) {
  return request({
    url: `/admin/platform/system/user/level/update/config`,
    method: 'POST',
    data,
  });
}

/**
 * @description 获取用户等级规则
 */
export function systemUserLevelRuleApi(id) {
  return request({
    url: `/admin/platform/system/user/level/get/rule`,
    method: 'GET',
  });
}

/**
 * @description 编辑用户等级规则
 */
export function systemUserLevelUpdateRuleApi(data) {
  return request({
    url: `/admin/platform/system/user/level/update/rule`,
    method: 'POST',
    data,
  });
}

/**
 * @description 编辑付费会员基础配置
 */
export function memberConfigEditApi(data) {
  return request({
    url: `/admin/platform/paid/member/base/config/edit`,
    method: 'POST',
    data,
  });
}

/**
 * @description 付费会员基础配置信息获取
 */
export function memberConfigGetApi() {
  return request({
    url: `/admin/platform/paid/member/base/config/get`,
    method: 'get',
  });
}

/**
 * @description 编辑付费会员会员权益
 */
export function memberBenefitsEditApi(data) {
  return request({
    url: `/admin/platform/paid/member/benefits/edit`,
    method: 'post',
    data,
  });
}

/**
 * @description 获取付费会员会员权益
 */
export function memberBenefitsListApi() {
  return request({
    url: `/admin/platform/paid/member/benefits/list`,
    method: 'get',
  });
}

/**
 * @description 编辑付费会员会员权益说明
 */
export function memberBenefitsStatementEditApi(data) {
  return request({
    url: `/admin/platform/paid/member/benefits/statement/edit`,
    method: 'post',
    data,
  });
}

/**
 * @description 付费会员会员权益开关
 */
export function memberBenefitsStatementSwitchApi(id) {
  return request({
    url: `/admin/platform/paid/member/benefits/switch/${id}`,
    method: 'post',
  });
}

/**
 * @description 添加付费会员卡
 */
export function memberCardAddApi(data) {
  return request({
    url: `/admin/platform/paid/member/card/add`,
    method: 'post',
    data,
  });
}

/**
 * @description 删除付费会员卡
 */
export function memberCardDeleteApi(id) {
  return request({
    url: `/admin/platform/paid/member/card/delete/${id}`,
    method: 'post',
  });
}

/**
 * @description 编辑付费会员卡
 */
export function memberCardEditApi(data) {
  return request({
    url: `/admin/platform/paid/member/card/edit`,
    method: 'post',
    data,
  });
}

/**
 * @description 付费会员卡开关
 */
export function memberCardSwitchApi(id) {
  return request({
    url: `/admin/platform/paid/member/card/switch/${id}`,
    method: 'post',
  });
}

/**
 * @description 付费会员卡列表
 */
export function memberCardListApi(params) {
  return request({
    url: `/admin/platform/paid/member/list`,
    method: 'get',
    params,
  });
}

/**
 * @description 付费会员订单详情
 */
export function memberOrderInfoApi(orderNo) {
  return request({
    url: `/admin/platform/paid/member/order/info/${orderNo}`,
    method: 'get',
  });
}

/**
 * @description 付费会员订单分页列表
 */
export function memberOrderListApi(params) {
  return request({
    url: `/admin/platform/paid/member/order/page/list`,
    method: 'get',
    params,
  });
}

/**
 * @description 赠送用户付费会员
 */
export function giftPaidMemberApi(data) {
  return request({
    url: `/admin/platform/user/gift/paid/member`,
    method: 'post',
    data,
  });
}

/**
 * @description 越权登录商户
 */
export function merchantLogin(id) {
  return request({
    url: `/admin/platform/merchant/ultra/vires/login/${id}`,
    method: 'post',
  });
}

/**
 * @description 用户余额记录
 */
export function userBalanceRecord(params) {
  return request({
    url: `/admin/platform/user/balance/record`,
    method: 'get',
    params,
  });
}

/**
 * @description 用户佣金记录
 */
export function userBrokerageRecord(params) {
  return request({
    url: `/admin/platform/user/brokerage/record`,
    method: 'get',
    params,
  });
}

/**
 * @description 用户经验记录
 */
export function userExperienceRecord(params) {
  return request({
    url: `/admin/platform/user/experience/record`,
    method: 'get',
    params,
  });
}

/**
 * @description 用户积分记录
 */
export function userIntegralRecord(params) {
  return request({
    url: `/admin/platform/user/integral/record`,
    method: 'get',
    params,
  });
}

/**
 * @description 用户签到记录
 */
export function userSignRecord(params) {
  return request({
    url: `/admin/platform/user/sign/record`,
    method: 'get',
    params,
  });
}
