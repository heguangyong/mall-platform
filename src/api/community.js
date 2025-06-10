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
 * 添加社区分类
 * @param pram
 */
export function communityCategoryAddApi(data) {
  return request({
    url: `/admin/platform/community/category/add`,
    method: 'post',
    data,
  });
}

/**
 * 删除社区分类
 * @param pram
 */
export function communityCategoryDelApi(id) {
  return request({
    url: `/admin/platform/community/category/delete/${id}`,
    method: 'post',
  });
}

/**
 * 社区分类显示开关
 * @param pram
 */
export function communityCategoryShowApi(id) {
  return request({
    url: `/admin/platform/community/category/show/${id}`,
    method: 'post',
  });
}

/**
 * 社区分类分页列表
 * @param pram
 */
export function communityCategoryListApi(params) {
  return request({
    url: `/admin/platform/community/category/page/list`,
    method: 'get',
    params,
  });
}

/**
 * 编辑社区分类
 * @param pram
 */
export function communityCategoryUpdateApi(data) {
  return request({
    url: `/admin/platform/community/category/update`,
    method: 'post',
    data,
  });
}

/**
 * 社区内容审核
 * @param pram
 */
export function communityNoteAuditApi(data) {
  return request({
    url: `/admin/platform/community/note/audit`,
    method: 'post',
    data,
  });
}

/**
 * 社区内容分类批量修改
 * @param pram
 */
export function communityNoteBatchUpdateApi(data) {
  return request({
    url: `/admin/platform/community/note/category/batch/update`,
    method: 'post',
    data,
  });
}

/**
 * 社区内容删除
 * @param pram
 */
export function communityNoteDelApi(id) {
  return request({
    url: `/admin/platform/community/note/delete/${id}`,
    method: 'post',
  });
}

/**
 * 社区内容详情
 * @param pram
 */
export function communityNoteDetailApi(id) {
  return request({
    url: `/admin/platform/community/note/detail/${id}`,
    method: 'GET',
  });
}

/**
 * 社区内容强制下架
 * @param pram
 */
export function communityNoteForcedDownApi(data) {
  return request({
    url: `/admin/platform/community/note/forced/down/${data.id}`,
    method: 'POST',
    data,
  });
}

/**
 * 社区笔记评论强制关闭开关
 * @param pram
 */
export function communityNoteReplyOffApi(id) {
  return request({
    url: `/admin/platform/community/note/reply/force/off/${id}`,
    method: 'POST',
  });
}

/**
 * 社区内容分页列表
 * @param pram
 */
export function communityNoteListApi(params) {
  return request({
    url: `/admin/platform/community/note/page/list`,
    method: 'GET',
    params,
  });
}

/**
 * 获取社区配置
 * @param pram
 */
export function communityConfigApi() {
  return request({
    url: `/admin/platform/community/category/get/config`,
    method: 'GET',
  });
}

/**
 * 更新社区配置
 * @param pram
 */
export function communityConfigUpdateApi(data) {
  return request({
    url: `/admin/platform/community/category/update/config`,
    method: 'post',
    data,
  });
}

/**
 * 社区评论审核
 * @param pram
 */
export function communityReplyAuditApi(data) {
  return request({
    url: `/admin/platform/community/reply/audit`,
    method: 'post',
    data,
  });
}

/**
 * 社区评论删除
 * @param pram
 */
export function communityReplyDelApi(id) {
  return request({
    url: `/admin/platform/community/reply/delete/${id}`,
    method: 'post',
  });
}

/**
 * 社区评论-文章分页列表
 * @param pram
 */
export function communityReplyNoteListApi(params) {
  return request({
    url: `/admin/platform/community/reply/note/page/list/${params.nid}`,
    method: 'get',
    params,
  });
}

/**
 * 社区评论分页列表
 * @param pram
 */
export function communityReplyListApi(params) {
  return request({
    url: `/admin/platform/community/reply/page/list`,
    method: 'get',
    params,
  });
}

/**
 * 添加社区话题
 * @param pram
 */
export function communityTopicAddApi(data) {
  return request({
    url: `/admin/platform/community/topic/add`,
    method: 'post',
    data,
  });
}

/**
 * 删除社区话题
 * @param pram
 */
export function communityTopicDelApi(id) {
  return request({
    url: `/admin/platform/community/topic/delete/${id}`,
    method: 'post',
  });
}

/**
 * 社区话题分页列表
 * @param pram
 */
export function communityTopicListApi(params) {
  return request({
    url: `/admin/platform/community/topic/page/list`,
    method: 'get',
    params,
  });
}

/**
 * 社区话题开启/关闭推荐
 * @param pram
 */
export function communityTopicRecommendApi(id) {
  return request({
    url: `/admin/platform/community/topic/recommend/${id}`,
    method: 'POST',
  });
}

/**
 * 编辑社区话题
 * @param pram
 */
export function communityTopicUpdateApi(data) {
  return request({
    url: `/admin/platform/community/topic/update`,
    method: 'POST',
    data,
  });
}

/**
 * 推荐星级编辑
 * @param data
 */
export function communityStarUpdateApi(data) {
  return request({
    url: `/admin/platform/community/note/star/update`,
    method: 'POST',
    data,
  });
}

/**
 * 社区笔记分类批量修改
 */
export function communitycCategoryBatchApi(data) {
  return request({
    url: `/admin/platform/community/note/category/batch/update`,
    method: 'POST',
    data,
  });
}
