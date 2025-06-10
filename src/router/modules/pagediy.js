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

const pageDiyRouter = {
  path: '/page',
  component: Layout,
  redirect: '/page/design/devise',
  name: 'PageDiy',
  meta: {
    title: '装修',
    icon: 'clipboard',
  },
  children: [
    {
      path: 'design',
      name: 'design',
      alwaysShow: true,
      component: () => import('@/views/pagediy'),
      meta: {
        title: '页面管理',
        roles: ['admin'],
      },
      children: [
        {
          path: 'devise',
          component: () => import('@/views/pagediy/devise/index'),
          name: 'viewDevise',
          meta: { title: '页面装修', noCache: true },
        },
        {
          path: 'viewDesign',
          component: () => import('@/views/pagediy/viewDesign'),
          name: 'viewDesign',
          meta: { title: '页面设计', noCache: true },
        },
        {
          path: 'theme',
          component: () => import('@/views/pagediy/theme'),
          name: 'theme',
          meta: { title: '一键换色', noCache: true },
        },
        {
          path: 'picture',
          name: 'picture',
          component: () => import('@/views/maintain/picture'),
          meta: {
            title: '素材管理',
            icon: 'clipboard',
          },
          hidden: false,
        },
        {
          path: 'advertisement',
          name: 'advertisement',
          component: () => import('@/views/pagediy/advertisement'),
          meta: {
            title: '开屏广告',
            icon: 'clipboard',
          },
          hidden: false,
        },
      ],
    },
  ],
};

export default pageDiyRouter;
