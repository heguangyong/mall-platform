// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

//会员过滤器

/**
 * 用户注册类型
 */
export function registerTypeFilter(status) {
  const statusMap = {
    wechat: '公众号',
    routine: '小程序',
    h5: 'H5',
    iosWx: '微信ios',
    androidWx: '微信安卓',
    ios: 'ios',
  };
  return statusMap[status];
}

/**
 * 用户类型
 */
export function filterIsPromoter(status) {
  const statusMap = {
    true: '推广员',
    false: '普通用户',
  };
  return statusMap[status];
}

/**
 * 标签
 */
export function tagFilter(status) {
  if (!status) {
    return '-';
  }
  if (!localStorage.getItem('tagAllList')) return;
  let arr = JSON.parse(localStorage.getItem('tagAllList'));
  let obj = {};
  for (let i in arr) {
    obj[arr[i].id] = arr[i];
  }
  let strArr = status.split(',');
  let newArr = [];
  for (let item of strArr) {
    if (obj[item]) {
      newArr.push(obj[item].name);
    }
  }
  return newArr.join(',');
}

/**
 * 会员权益
 */
export function filterMemberBenefits(status) {
  const statusMap = {
    experienceDoubling: '经验值翻倍',
    integralDoubling: '积分翻倍',
    memberExclusivePrice: '会员专享价',
    exclusiveCustomer: '专属客服',
  };
  return statusMap[status];
}

/**
 * 会员权益
 */
export function filterMemberType(status) {
  const statusMap = {
    0: '试用',
    1: '期限',
    2: '永久',
  };
  return statusMap[status];
}

/**
 * 会员卡支付方式
 */
export function filterCardPayType(status) {
  const statusMap = {
    weixin: '微信',
    alipay: '支付宝',
    give: '平台赠送',
    yue: '余额',
  };
  return statusMap[status];
}

/**
 * 会员卡类型
 */
export function filterCardType(status) {
  const statusMap = {
    0: '试用',
    1: '期限',
    2: '永久',
  };
  return statusMap[status];
}
/**
 * 移动端主题色
 */
export function filterTheme(status) {
  const statusMap = {
    0: '#e93323',
    1: '#fe5c2d',
    2: '#42ca4d',
    3: '#1ca5e9',
    4: '#ff448f',
  };
  return statusMap[status];
}
