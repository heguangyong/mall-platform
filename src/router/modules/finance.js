// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

import Layout from '@/layout';

const financeRouter = {
  path: '/finance',
  component: Layout,
  redirect: '/finance/closingSetting',
  name: 'Financial',
  meta: {
    title: '财务',
    icon: 'clipboard',
  },
  children: [
    {
      path: 'statement',
      name: 'FinanceStatement',
      meta: {
        title: '账单管理',
        noCache: true,
      },
      component: () => import('@/views/finance/statement/index'),
    },
    {
      path: 'closingSetting',
      component: () => import('@/views/finance/setting/index'),
      name: 'ClosingSetting',
      meta: { title: '商户结算设置', icon: '' },
    },
    {
      path: 'closing',
      component: () => import('@/views/finance/closing/index'),
      name: 'FinancialClosing',
      meta: { title: '结算管理', icon: '' },
      alwaysShow: true,
      children: [
        {
          path: 'merchantClosing',
          component: () => import('@/views/finance/closing/merchantClosing/index'),
          name: 'MerchantClosing',
          meta: { title: '商户结算', icon: '' },
        },
        {
          path: 'userClosing',
          component: () => import('@/views/finance/closing/userClosing/index'),
          name: 'UserClosing',
          meta: { title: '用户结算', icon: '' },
        },
      ],
    },
    {
      path: 'charge',
      component: () => import('@/views/finance/charge/index'),
      name: 'FinanceCharge',
      meta: { title: '充值记录', icon: '' },
    },
    {
      path: 'journalAccount',
      component: () => import('@/views/finance/journalAccount/index'),
      name: 'FinanceJournalAccount',
      meta: { title: '流水管理', icon: '' },
      alwaysShow: true,
      children: [
        {
          path: 'capitalFlow',
          name: 'FinanceCapitalFlow',
          meta: {
            title: '资金流水',
            noCache: true,
          },
          component: () => import('@/views/finance/journalAccount/capitalFlow/index'),
        },
        {
          path: 'summaryCapitalFlow',
          component: () => import('@/views/finance/journalAccount/summaryCapitalFlow/index'),
          name: 'SummaryCapitalFlow',
          meta: { title: '流水汇总', icon: '' },
        },
      ],
    },
  ],
};

export default financeRouter;
