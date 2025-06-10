// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

import * as constants from '@/utils/constants.js';
import { formatDates } from '@/utils/index';

// 公共过滤器
export function filterEmpty(val) {
  let _result = '-';
  if (!val) {
    return _result;
  }
  _result = val;
  return _result;
}

// 时间过滤器
export function formatDate(time) {
  if (time !== 0) {
    const date = new Date(time * 1000);
    return formatDates(date, 'yyyy-MM-dd hh:mm');
  }
}

export function filterYesOrNo(value) {
  return value ? '是' : '否';
}

export function filterShowOrHide(value) {
  return value ? '显示' : '不显示';
}

export function filterShowOrHideForFormConfig(value) {
  return value === '‘0’' ? '显示' : '不显示';
}

export function filterYesOrNoIs(value) {
  return value ? '否' : '是';
}

export function filterCategroyType(value) {
  return constants.categoryType.filter((item) => value === item.value)[0].name;
}

export function filterConfigCategory(value) {
  return constants.configCategory.filter((item) => value === item.value)[0].label;
}

/**
 * @description 公众号回复类型
 */
export function keywordStatusFilter(status) {
  const statusMap = {
    text: '文字消息',
    image: '图片消息',
    news: '图文消息',
    voice: '声音消息',
  };
  return statusMap[status];
}

/**
 * @description 优惠券领取方式
 */
export function couponTypeFilter(status) {
  const statusMap = {
    1: '手动领取',
    2: '新人券',
    3: '赠送券',
  };
  return statusMap[status];
}

/**
 * @description 文章分类
 */
export function articleTypeFilter(status) {
  if (!status) {
    return '';
  }
  let arrayList = JSON.parse(localStorage.getItem('articleClass'));
  if (arrayList.filter((item) => Number(status) === Number(item.id)).length < 1) {
    return '';
  }
  return arrayList.filter((item) => Number(status) === Number(item.id))[0].name;
}

/**
 * @description 支付状态
 */
export function payStatusFilter(status) {
  const statusMap = {
    false: '未支付',
    true: '已支付',
  };
  return statusMap[status];
}

/**
 * @description 提现方式
 */
export function extractTypeFilter(status) {
  const statusMap = {
    bank: '银行卡',
    alipay: '支付宝',
    weixin: '微信',
  };
  return statusMap[status];
}

/**
 * @description 充值类型
 */
export function rechargeTypeFilter(status) {
  const statusMap = {
    public: '微信公众号',
    h5: '网页支付',
    mini: '小程序',
    wechatIos: '微信Ios',
    wechatAndroid: '微信Android',
    alipay: '支付宝',
    alipayApp: '支付宝App',
  };
  return statusMap[status];
}

/**
 * @description 财务审核状态
 */
export function extractStatusFilter(status) {
  const statusMap = {
    '-1': '已拒绝',
    0: '审核中',
    1: '已提现',
  };
  return statusMap[status];
}

/**
 * @description 砍价状态
 */
export function bargainStatusFilter(status) {
  const statusMap = {
    1: '进行中',
    2: '未完成',
    3: '已成功',
  };
  return statusMap[status];
}

/**
 * @description 砍价状态
 */
export function bargainColorFilter(status) {
  const statusMap = {
    1: '',
    2: 'danger',
    3: 'success',
  };
  return statusMap[status];
}

/**
 * @description 拼团状态
 */
export function groupStatusFilter(status) {
  const statusMap = {
    1: '进行中',
    2: '已成功',
    3: '未完成',
  };
  return statusMap[status];
}

/**
 * @description 拼团状态
 */
export function groupColorFilter(status) {
  const statusMap = {
    1: '',
    2: 'success',
    3: 'danger',
  };
  return statusMap[status];
}

/**
 * @description 一号通tab值
 */
export function onePassTypeFilter(status) {
  const statusMap = {
    sms: '短信',
    copy: '商品采集',
    expr_query: '物流查询',
    expr_dump: '电子面单打印',
  };
  return statusMap[status];
}

/**
 * @description 积分状态
 */
export function integralStatusFilter(status) {
  const statusMap = {
    1: '订单创建',
    2: '冻结期',
    3: '完成',
    4: '失效',
  };
  return statusMap[status];
}

/**
 * @description 关联类型
 */
export function integralLinkTypeFilter(status) {
  const statusMap = {
    order: '订单',
    refund: '退款',
    sign: '签到',
    system: '系统操作',
  };
  return statusMap[status];
}

/**
 * @description 关联id
 */
export function integralLinkIdFilter(status) {
  const statusMap = {
    orderNo: '订单号',
    refundOrderNo: '退款单号',
    0: '-',
  };
  return statusMap[status];
}

/**
 * @description 氛围图、活动边框使用范围类型
 */
export function activityMethodFilter(status) {
  const statusMap = {
    0: '全部商品',
    1: '指定商品',
    2: '指定品牌',
    3: '指定商品分类',
    4: '指定商户',
  };
  return statusMap[status];
}

/**
 * @description 秒杀商品活动状态
 *
 */
export function activityStatusFilter(status) {
  const statusMap = {
    0: '未开始',
    1: '进行中',
    2: '已结束',
  };
  return statusMap[status];
}

/**
 * @description 社区评论审核状态
 *
 */
export function communityStatusFilter(status) {
  const statusMap = {
    0: '待审核',
    1: '已通过',
    2: '已拒绝',
  };
  return statusMap[status];
}

/**
 * @description 社区评论审核状态
 *
 */
export function communityReplyStatusFilter(status) {
  const statusMap = {
    1: '开启',
    2: '关闭',
    3: '平台关闭',
  };
  return statusMap[status];
}

/**
 * @description 社区内容审核状态
 *
 */
export function communityAuditStatusFilter(status) {
  const statusMap = {
    0: '待审核',
    1: '审核成功',
    2: '审核失败',
    3: '平台关闭',
  };
  return statusMap[status];
}
