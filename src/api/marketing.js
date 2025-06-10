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
 * 优惠券 添加
 * @param pram
 */
export function platformCouponAddApi(data) {
  return request({
    url: '/admin/platform/coupon/add',
    method: 'post',
    data,
  });
}

/**
 * 优惠券 列表
 * @param pram
 */
export function platformCouponListApi(params) {
  return request({
    url: '/admin/platform/coupon/list',
    method: 'get',
    params,
  });
}

/**
 * 用户管理 发送优惠券
 * @param pram
 */
export function couponSendApi(data) {
  return request({
    url: '/admin/platform/coupon/batch/send',
    method: 'post',
    data,
  });
}

/**
 * 优惠券 可发送优惠券列表
 * @param pram
 */
export function canSendListApi(params) {
  return request({
    url: '/admin/platform/coupon/can/send/list',
    method: 'get',
    params,
  });
}

/**
 * 优惠券 详情
 * @param pram
 */
export function couponInfoApi(id) {
  return request({
    url: `/admin/platform/coupon/detail/${id}`,
    method: 'get',
  });
}

/**
 * 优惠券 修改状态
 * @param pram
 */
export function couponStatusApi(id) {
  return request({
    url: `/admin/platform/coupon/switch/${id}`,
    method: 'post',
  });
}

/**
 * 优惠券 删除
 * @param pram
 */
export function couponDeleteApi(data) {
  return request({
    url: '/admin/platform/coupon/delete',
    method: 'post',
    data,
  });
}

/**
 * 优惠券 优惠券记录列表
 * @param pram
 */
export function couponUserListApi(params) {
  return request({
    url: '/admin/platform/coupon/user/list',
    method: 'get',
    params,
  });
}

/**
 * 优惠券 编辑
 * @param pram
 */
export function platformCouponEditApi(data) {
  return request({
    url: '/admin/platform/coupon/update',
    method: 'post',
    data,
  });
}

/**
 * 新人礼 获取
 * @param pram
 */
export function newPeoplePresentConfigApi() {
  return request({
    url: '/admin/platform/marketing/activity/new/people/present/config',
    method: 'get',
  });
}

/**
 * 生日礼 获取
 * @param pram
 */
export function birthdayPresentConfigApi() {
  return request({
    url: '/admin/platform/marketing/activity/birthday/present/config',
    method: 'get',
  });
}

/**
 * 新人礼 编辑
 * @param pram
 */
export function newPeoplePresentEditApi(data) {
  return request({
    url: '/admin/platform/marketing/activity/new/people/present/edit',
    method: 'post',
    data,
  });
}

/**
 * 生日礼 编辑
 * @param pram
 */
export function birthdayPresentEditApi(data) {
  return request({
    url: '/admin/platform/marketing/activity/birthday/present/edit',
    method: 'post',
    data,
  });
}

/**
 * 积分日志 列表
 * @param pram
 */
export function integralListApi(params, data) {
  return request({
    url: '/admin/platform/integral/list',
    method: 'get',
    params,
    data,
  });
}

/**
 * 签到 基础签到配置
 */
export function signBaseConfigApi(data) {
  return request({
    url: `/admin/platform/sign/edit/base/config`,
    method: 'post',
    data,
  });
}

/**
 * 签到 新增连续签到配置
 */
export function signAddConfigApi(data) {
  return request({
    url: `/admin/platform/sign/add/config`,
    method: 'post',
    data,
  });
}

/**
 * 签到 编辑连续签到配置
 */
export function signeEditConfigApi(data) {
  return request({
    url: `/admin/platform/sign/edit/award/config`,
    method: 'post',
    data,
  });
}

/**
 * 签到 删除连续签到配置
 */
export function signeDelConfigApi(id) {
  return request({
    url: `/admin/platform/sign/delete/config/${id}`,
    method: 'post',
  });
}

/**
 * 签到 获取签到配置
 */
export function signeGetConfigApi() {
  return request({
    url: `/admin/platform/sign/get/config`,
    method: 'get',
  });
}

/**
 * 签到 用户签到记录分页列表
 */
export function signeRecordListApi(params) {
  return request({
    url: `/admin/platform/sign/user/record/list`,
    method: 'get',
    params,
  });
}

/**
 * 秒杀 秒杀时段列表
 */
export function seckillIntervalListApi(params) {
  return request({
    url: `/admin/platform/seckill/time/interval/list`,
    method: 'get',
    params,
  });
}

/**
 * 秒杀 新增秒杀时段
 */
export function seckillIntervalAddApi(data) {
  return request({
    url: `/admin/platform/seckill/time/interval/add`,
    method: 'POST',
    data,
  });
}

/**
 * 秒杀 编辑秒杀时段
 */
export function seckillIntervalUpdateApi(data) {
  return request({
    url: `/admin/platform/seckill/time/interval/update`,
    method: 'POST',
    data,
  });
}

/**
 * 秒杀 删除秒杀时段
 */
export function seckillIntervalDeleteApi(id) {
  return request({
    url: `admin/platform/seckill/time/interval/delete/${id}`,
    method: 'POST',
  });
}

/**
 * 秒杀 秒杀时段开关
 */
export function seckillIntervalSwitcheApi(id) {
  return request({
    url: `admin/platform/seckill/time/interval/switch/${id}`,
    method: 'POST',
  });
}

/**
 * 秒杀 新增秒杀活动
 */
export function seckillActivityAddApi(data) {
  return request({
    url: `/admin/platform/seckill/activity/add`,
    method: 'POST',
    data,
  });
}

/**
 * 秒杀 秒杀活动详情
 */
export function seckillActivityDetailApi(id) {
  return request({
    url: `/admin/platform/seckill/activity/detail/${id}`,
    method: 'get',
  });
}

/**
 * 秒杀 秒杀活动分页列表
 */
export function seckillActivityListApi(params) {
  return request({
    url: `/admin/platform/seckill/activity/page`,
    method: 'get',
    params,
  });
}

/**
 * 秒杀 删除秒杀活动
 */
export function seckillAtivityDelApi(id) {
  return request({
    url: `/admin/platform/seckill/activity/delete/${id}`,
    method: 'POST',
  });
}

/**
 * 秒杀 编辑秒杀活动
 */
export function seckillAtivityUpdateApi(data) {
  return request({
    url: `/admin/platform/seckill/activity/update`,
    method: 'POST',
    data,
  });
}

/**
 * 秒杀 秒杀活动开关
 */
export function seckillAtivitySwitchApi(id) {
  return request({
    url: `/admin/platform/seckill/activity/switch/${id}`,
    method: 'POST',
  });
}

/**
 * 秒杀 秒杀商品列表
 */
export function seckillProListApi(params) {
  return request({
    url: `/admin/platform/seckill/product/page`,
    method: 'get',
    params,
  });
}

/**
 * 秒杀 秒杀商品删除
 */
export function seckillProDelApi(data) {
  return request({
    url: `/admin/platform/seckill/product/delete`,
    method: 'POST',
    data,
  });
}

/**
 * 秒杀 秒杀商品设置活动价
 */
export function seckillProSetPriceApi(data) {
  return request({
    url: `/admin/platform/seckill/product/set/price`,
    method: 'post',
    data,
  });
}

/**
 * 秒杀 秒杀商品下架
 */
export function seckillProDownApi(data) {
  return request({
    url: `/admin/platform/seckill/product/down`,
    method: 'post',
    data,
  });
}

/**
 * 秒杀 秒杀商品审核
 */
export function seckillProAuditApi(data) {
  return request({
    url: `/admin/platform/seckill/product/audit`,
    method: 'post',
    data,
  });
}
/**
 * @description 氛围图 -- 选择商品列表 氛围图、活动边框公用同一接口，type传值判断
 */
export function selectProductList(data) {
  return request.get(`marketing/spu/lst`, data);
}
/**
 * @description 氛围图 -- 创建氛围图
 */
export function createAtuosphere(data) {
  return request.post(`admin/platform/activitystyle/save`, data);
}
/**
 * @description 氛围图 -- 编辑氛围图
 */
export function atuosphereUpdateApi(data) {
  return request.post(`admin/platform/activitystyle/update`, data);
}
/**
 * @description 活动样式
 */
export function atuosphereList(params) {
  return request({
    url: `/admin/platform/activitystyle/list`,
    method: 'get',
    params,
  });
}
/**
 * @description 活动样式
 */
export function atmosphereStatusApi(data) {
  return request({
    url: `/admin/platform/activitystyle/status`,
    method: 'post',
    data,
  });
}
/**
 * @description 活动样式
 */
export function atmosphereDelete(params) {
  return request({
    url: `/admin/platform/activitystyle/delete`,
    method: 'get',
    params,
  });
}
/**
 * @description 秒杀商品添加
 */
export function seckillProAdd(data) {
  return request({
    url: `/admin/platform/seckill/product/add`,
    method: 'POST',
    data,
  });
}

/**
 * @description 直播-商品-删除
 */
export function liveGoodsDelApi(id) {
  return request({
    url: `/admin/platform/mp/live/goods/delete/${id}`,
    method: 'get',
  });
}

/**
 * @description 直播-商品-详情
 */
export function liveGoodsInfoApi(id) {
  return request({
    url: `/admin/platform/mp/live/goods/info/${id}`,
    method: 'get',
  });
}

/**
 * @description 直播-商品-分页列表
 */
export function liveGoodsListApi(params) {
  return request({
    url: `/admin/platform/mp/live/goods/list`,
    method: 'get',
    params,
  });
}

/**
 * @description 直播-商品-平台审核
 */
export function liveGoodsReviewApi(data) {
  return request({
    url: `/admin/platform/mp/live/goods/review`,
    method: 'POST',
    data,
  });
}

/**
 * @description 直播-商品-修改排序
 */
export function liveGoodsSortApi(id, sort) {
  return request({
    url: `/admin/platform/mp/live/goods/sort/${id}/${sort}`,
    method: 'GET',
  });
}

/**
 * @description 直播-直播间 列表
 */
export function liveRoomListApi(data) {
  return request({
    url: `/admin/platform/mp/live/room/list`,
    method: 'post',
    data: {
      pageParamRequest: {
        limit: data.limit,
        page: data.page,
      },
      searchRequest: {
        reviewStatus: data.reviewStatus,
        liveStatus: data.liveStatus,
        keywords: data.keywords,
        storeShow: data.storeShow,
        merType: data.merType,
        star: data.star,
      },
    },
  });
}

/**
 * 直播 直播间 删除直播室
 */
export function liveRoomDeleteApi(roomId) {
  return request({
    url: `/admin/platform/mp/live/room/delete/${roomId}`,
    method: 'GET',
  });
}

/**
 * 直播 直播间 商品排序
 */
export function liveRoomGoodsortApi(data) {
  return request({
    url: `/admin/platform/mp/live/room/goodsort`,
    method: 'post',
    data,
  });
}

/**
 * 直播 直播间 关闭评论
 */
export function liveRoomUpdatecommentApi(id, banComment) {
  return request({
    url: `/admin/platform/mp/live/room/updatecomment/${id}/${banComment}`,
    method: 'get',
  });
}

/**
 * 直播 直播间 客服管理
 */
export function liveRoomUpdatefeedpublicApi(id, closeKf) {
  return request({
    url: `/admin/platform/mp/live/room/updatefeedpublic/${id}/${closeKf}`,
    method: 'get',
  });
}

/**
 * 直播 直播间 官方收录管理
 */
export function liveRoomIsFeedsPublicApi(id, isFeedsPublic) {
  return request({
    url: `/admin/platform/mp/live/room/updatefeedpublic/${id}/${isFeedsPublic}`,
    method: 'get',
  });
}

/**
 * 直播 直播间 开启回放
 */
export function liveRoomUpdatereplayApi(id, closeReplay) {
  return request({
    url: `/admin/platform/mp/live/room/updatereplay/${id}/${closeReplay}`,
    method: 'get',
  });
}

/**
 * 直播 直播间 直播间商品列表
 */
export function liveRoomGoodsListApi(id) {
  return request({
    url: `/admin/platform/mp/live/room/goodslist/${id}`,
    method: 'get',
  });
}

/**
 * 直播 直播间 直播室审核
 */
export function liveRoomReviewApi(data) {
  return request({
    url: `/admin/platform/mp/live/room/review`,
    method: 'post',
    data,
  });
}

/**
 * 直播 直播间 显示在商城
 */
export function liveRoomShowApi(id, show) {
  return request({
    url: `/admin/platform/mp/live/room/showstore/${id}/${show}`,
    method: 'get',
  });
}

/**
 * 获取秒杀样式
 */
export function getSeckillStyleApi() {
  return request({
    url: `/admin/platform/system/config/get/seckill/style`,
    method: 'get',
  });
}

/**
 * 保存秒杀样式
 */
export function saveSeckillStyleApi(data) {
  return request({
    url: `/admin/platform/system/config/save/seckill/style`,
    method: 'post',
    data
  });
}