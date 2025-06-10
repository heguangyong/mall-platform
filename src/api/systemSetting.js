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
 * 文件上传
 * @param data
 */
export function fileFileApi(data, params) {
  return request({
    url: '/admin/platform/upload/file',
    method: 'POST',
    params,
    data,
  });
}

/**
 * 图片上传
 * @param data
 */
export function fileImageApi(data, params) {
  return request({
    url: '/admin/platform/upload/image',
    method: 'POST',
    params,
    data,
  });
}

/**
 * 图片列表
 * @param data
 */
export function fileListApi(params) {
  return request({
    url: '/admin/platform/attachment/list',
    method: 'get',
    params,
  });
}

/**
 * 图片列表 删除图片
 * @param data
 */
export function fileDeleteApi(id) {
  return request({
    url: `/admin/platform/attachment/delete`,
    method: 'post',
    data: { ids: id },
  });
}

/**
 * 图片列表 移動分類
 * @param data
 */
export function attachmentMoveApi(data) {
  return request({
    url: `/admin/platform/attachment/move`,
    method: 'post',
    data,
  });
}

/**
 * 微信开放平台上传素材
 * @param data
 */
export function wechatUploadApi(data, params) {
  return request({
    url: `/admin/platform/wechat/open/media/upload`,
    method: 'post',
    data,
    params,
  });
}
