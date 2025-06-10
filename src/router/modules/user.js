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

const userRouter = {
  path: '/user',
  component: Layout,
  redirect: '/user/index',
  name: 'User',
  meta: {
    title: '用户',
    icon: 'clipboard',
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/user/list/index'),
      name: 'UserIndex',
      meta: { title: '用户列表', icon: '' },
    },
    {
      path: 'level',
      component: () => import('@/views/user/level'),
      name: 'Level',
      meta: { title: '用户等级', icon: '' },
      children: [
        {
          path: 'list',
          name: 'levelList',
          meta: {
            title: '等级列表',
            noCache: true,
          },
          component: () => import('@/views/user/level/list'),
        },
        {
          path: 'config',
          name: 'levelConfig',
          meta: {
            title: '等级配置',
            noCache: true,
          },
          component: () => import('@/views/user/level/levelConfig'),
        },
        {
          path: 'description',
          name: 'levelDescription',
          meta: {
            title: '等级说明',
            noCache: true,
          },
          component: () => import('@/views/user/level/description'),
        },
      ],
    },
    {
      path: 'label',
      component: () => import('@/views/user/label/index'),
      name: 'Label',
      meta: { title: '用户标签', icon: '' },
    },
    {
      path: 'paidMembers',
      component: () => import('@/views/user/paidMembers'),
      name: 'PaidMembers',
      meta: { title: '付费会员', icon: '' },
      children: [
        {
          path: 'configure',
          name: 'Configure',
          meta: {
            title: '会员配置',
            noCache: true,
          },
          component: () => import('@/views/user/paidMembers/configure'),
        },
        {
          path: 'order',
          name: 'MembersOrder',
          meta: {
            title: '购买记录',
            noCache: true,
          },
          component: () => import('@/views/user/paidMembers/order'),
        },
      ],
    },
  ],
};

export default userRouter;
