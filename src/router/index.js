// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

/* Layout */
import Layout from '@/layout';

/* Router Modules */
// import componentsRouter from './modules/components'
import productRouter from './modules/product';
import orderRouter from './modules/order';
import userRouter from './modules/user';
import distributionRouter from './modules/distribution';
import marketingRouter from './modules/marketing';
import financeRouter from './modules/finance';
import operationRouter from './modules/operation';
import merchant from './modules/merchant';
import pagediy from '@/router/modules/pagediy';
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 *
 */

export const constantRoutes = [
  // 商品
  productRouter,
  // 订单
  orderRouter,
  // 会员
  userRouter,
  // 分销
  distributionRouter,
  // 营销
  marketingRouter,
  // 财务
  financeRouter,
  // 设置
  operationRouter,
  //商户管理
  merchant,
  // 页面diy
  pagediy,
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true,
  },
  {
    path: '/page/design/creatDevise/:id?/:type?',
    component: () => import('@/views/pagediy/devise/creatDevise'),
    hidden: true,
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index'),
      },
    ],
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true,
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true,
  },
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   name: 'Dashboard',
  //   meta: {
  //     title: '控制台',
  //     icon: 'clipboard',
  //   },
  //   children: [
  //     {
  //       path: '/dashboard',
  //       component: () => import('@/views/dashboard/index'),
  //       name: 'DashboardIndex',
  //       meta: { title: '主页', icon: 'dashboard' },
  //     },
  //   ],
  // },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '主页', icon: 'dashboard', isAffix: true },
      },
    ],
  },
  {
    path: '/setting/uploadPicture',
    component: () => import('@/components/base/uploadPicture.vue'),
    name: 'uploadPicture',
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true },
];

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    mode: 'hash',
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
