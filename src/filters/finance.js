// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

//财务过滤器
/**
 * 资金流水 交易类型
 */
export function transactionTypeFilter(status) {
  const statusMap = {
    pay_order: '订单支付',
    refund_order: '订单退款',
  };
  return statusMap[status];
}

/**
 * 结算类型
 */
export function closingTypeFilter(status) {
  const statusMap = {
    bank: '银行卡',
    wechat: '微信',
    alipay: '支付宝',
  };
  return statusMap[status];
}
