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

const applicationRouter = {
  path: '/application',
  component: Layout,
  redirect: '/application/publicAccount/wxMenus',
  name: 'application',
  meta: {
    title: '应用',
    icon: 'clipboard',
  },
  children: [
    {
      path: 'publicAccount',
      name: 'publicAccount',
      component: () => import('@/views/application/wxAccount'),
      meta: {
        title: '公众号',
        icon: 'clipboard',
        roles: ['admin'],
      },
      children: [
        {
          path: 'wxMenus',
          component: () => import('@/views/application/wxAccount/wxMenus'),
          name: 'wxMenus',
          meta: { title: '微信菜单', icon: '' },
        },
        {
          path: 'wxReply',
          component: () => import('@/views/application/wxAccount/reply/index'),
          name: 'wxReply',
          meta: { title: '自动回复', icon: '' },
          children: [
            {
              path: 'follow',
              component: () => import('@/views/application/wxAccount/reply/follow'),
              name: 'wxFollow',
              meta: { title: '微信关注回复', icon: '' },
            },
            {
              path: 'keyword',
              component: () => import('@/views/application/wxAccount/reply/keyword'),
              name: 'wxKeyword',
              meta: { title: '关键字回复', icon: '' },
            },
            {
              path: 'replyIndex',
              component: () => import('@/views/application/wxAccount/reply/follow'),
              name: 'wxReplyIndex',
              meta: { title: '无效关键词回复', icon: '' },
            },
            {
              path: 'keyword/save/:id?',
              name: 'wechatKeywordAdd',
              meta: {
                title: '关键字添加',
                noCache: true,
                activeMenu: `/application/publicAccount/wxReply/keyword`,
              },
              hidden: true,
              component: () => import('@/views/application/wxAccount/reply/follow'),
            },
          ],
        },
      ],
    },
  ],
};

export default applicationRouter;
