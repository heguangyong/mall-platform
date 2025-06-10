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

export function configCheckUnique(pram) {
  const data = {
    name: pram.name,
  };
  return request({
    url: '/admin/platform/system/config/check',
    method: 'GET',
    params: data,
  });
}

export function configInfo(pram) {
  const data = {
    formId: pram.id,
  };
  return request({
    url: '/admin/platform/system/config/info',
    method: 'GET',
    params: data,
  });
}

export function configSaveForm(pram) {
  return request({
    url: '/admin/platform/system/config/save/form',
    method: 'POST',
    data: pram,
  });
}

export function configUpdate(pram) {
  const data = {
    id: pram.id,
    systemConfigRequest: pram.systemConfigRequest,
  };
  return request({
    url: '/admin/platform/system/config/update',
    method: 'POST',
    params: data,
  });
}

export function configSaveUniq(pram) {
  const data = {
    key: pram.key,
    value: pram.value,
  };
  return request({
    url: '/admin/platform/system/config/saveuniq',
    method: 'POST',
    params: data,
  });
}

export function configGetUniq(pram) {
  const data = {
    key: pram.key,
  };
  return request({
    url: '/admin/platform/system/config/getuniq',
    method: 'GET',
    params: data,
  });
}

/**
 * 获取积分配置
 */
export function integralGetConfigApi() {
  return request({
    url: '/admin/platform/integral/get/config',
    method: 'GET',
  });
}

/**
 * 编辑积分配置
 */
export function integralSetConfigApi(data) {
  return request({
    url: '/admin/platform/integral/set/config',
    method: 'post',
    data,
  });
}

/**
 * 获取移动端域名
 */
export function frontDomainApi() {
  return request({
    url: '/publicly/config/get/front/domain',
    method: 'get',
  });
}

/**
 * 获取平台当前的素材地址
 */
export function mediadomainApi() {
  return request({
    url: '/publicly/config/get/admin/mediadomain',
    method: 'get',
  });
}

/**
 * 获取主题色
 */
export function getSystemColorApi() {
  return request({
    url: '/admin/platform/system/config/get/change/color',
    method: 'get',
  });
}

/**
 * 保存主题色
 */
export function saveSystemColorApi(data) {
  return request({
    url: '/admin/platform/system/config/save/change/color',
    method: 'post',
    data,
  });
}

/**
 * @description 一号通 应用保存
 */
export function passAppSaveApi(data) {
  return request({
    url: '/admin/platform/one/pass/app/info/save',
    method: 'post',
    data,
  });
}

/**
 * @description 一号通 应用详情获取
 */
export function passAppInfoApi() {
  return request({
    url: '/admin/platform/one/pass/app/info/get',
    method: 'get',
  });
}

/**
 * @description 账号登录检测
 */
export function accountDetectionApi(data) {
  return request({
    url: '/admin/platform/login/account/detection',
    method: 'post',
    data,
  });
}

/**
 * @description 验证行为验证码
 */
export function knowUserSmsCaptchaApi(data) {
  return request({
    url: '/publicly/safety/check',
    method: 'post',
    data,
  });
}

/**
 * @description 获取行为验证码
 */
export function knowUserCaptchaApi(data) {
  return request({
    url: '/publicly/safety/get',
    method: 'post',
    data,
  });
}
