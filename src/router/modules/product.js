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

const productRouter = {
  path: '/product',
  component: Layout,
  redirect: '/product/category',
  name: 'Product',
  meta: {
    title: '商品',
    icon: 'clipboard',
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/product/index'),
      name: 'ProductIndex',
      meta: { title: '商品列表', icon: '' },
    },
    {
      path: 'category',
      component: () => import('@/views/product/category/index'),
      name: 'ProductCategory',
      meta: { title: '商品分类', icon: '' },
    },
    {
      path: 'comment',
      component: () => import('@/views/product/comment/index'),
      name: 'ProductComment',
      meta: { title: '商品评论', icon: '' },
    },
    {
      path: 'brand',
      component: () => import('@/views/product/brand/index'),
      name: 'ProductBrand',
      meta: { title: '品牌管理', icon: '' },
    },
    {
      path: 'guarantee',
      component: () => import('@/views/product/guarantee/index'),
      name: 'ProductGuarantee',
      meta: { title: '保障服务', icon: '' },
    },
    {
      path: 'tag',
      component: () => import('@/views/product/tag/index'),
      name: 'ProductTag',
      meta: { title: '商品标签', icon: '' },
    },
    {
      path: 'tag/creatTag/:id?',
      component: () => import('@/views/product/tag/creatTag'),
      name: 'CreatTag',
      meta: { title: '添加商品标签', icon: '', noCache: true, activeMenu: `/product/tag` },
    },
  ],
};

export default productRouter;
