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

const merchantRouter = {
  path: '/merchant',
  component: Layout,
  redirect: '/merchant/classify',
  name: 'Merchant',
  meta: {
    title: '商户',
    icon: 'clipboard',
  },
  children: [
    {
      path: 'classify',
      name: 'MerchantAlassify',
      component: () => import('@/views/merchant/classify'),
      meta: { title: '商户分类', icon: '' },
    },
    {
      path: 'list',
      name: 'MerchantList',
      component: () => import('@/views/merchant/list'),
      meta: { title: '商户列表', icon: '' },
    },
    {
      path: 'system',
      name: 'MerchantAystem',
      component: () => import('@/views/merchant/system'),
      meta: { title: '商户菜单管理', icon: '' },
    },
    {
      path: 'application',
      name: 'MerchantApplication',
      component: () => import('@/views/merchant/application'),
      meta: { title: '商户入驻申请', icon: '' },
    },
    {
      path: 'type',
      name: 'MerchantType',
      component: () => import('@/views/merchant/type'),
      meta: {
        title: '店铺类型',
        icon: 'clipboard',
      },
      children: [
        {
          path: 'list',
          component: () => import('@/views/merchant/type/list'),
          name: 'MerchantTypeList',
          meta: { title: '店铺类型', icon: '' },
        },
      ],
    },
  ],
};

export default merchantRouter;
