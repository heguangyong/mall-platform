 // +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout';

const marketingRouter = {
  path: '/marketing',
  component: Layout,
  redirect: '/marketing/PlatformCoupon/list',
  name: 'Marketing',
  meta: {
    title: '营销',
    icon: 'clipboard',
  },
  children: [
    {
      path: 'sign',
      component: () => import('@/views/marketing/sign'),
      name: 'Sign',
      meta: { title: '签到', icon: '' },
      children: [
        {
          path: 'config',
          component: () => import('@/views/marketing/sign/config/index'),
          name: 'signConfig',
          hidden: true,
          meta: { title: '签到配置', icon: '' },
        },
        {
          path: 'record',
          component: () => import('@/views/marketing/sign/record/index'),
          name: 'signRecord',
          hidden: true,
          meta: { title: '签到记录', icon: '' },
        },
      ],
    },
    {
      path: 'integral',
      component: () => import('@/views/marketing/integral/index'),
      name: 'Integral',
      meta: { title: '积分', icon: '' },
      children: [
        {
          path: 'integralconfig',
          component: () => import('@/views/marketing/integral/config/index'),
          name: 'integralConfig',
          meta: { title: '积分配置', icon: '' },
        },
        {
          path: 'integrallog',
          component: () => import('@/views/marketing/integral/integralLog/index'),
          name: 'integralLog',
          meta: { title: '积分日志', icon: '' },
        },
      ],
    },
    {
      path: 'seckill',
      component: () => import('@/views/marketing/seckill/index'),
      name: 'Seckill',
      meta: { title: '秒杀', icon: '' },
      children: [
        {
          path: 'config',
          component: () => import('@/views/marketing/seckill/seckillConfig/index'),
          name: 'SeckillConfig',
          meta: { title: '秒杀配置', icon: '' },
        },
        {
          path: 'list/:timeId?',
          component: () => import('@/views/marketing/seckill/seckillList/index'),
          name: 'SeckillList',
          meta: { title: '秒杀商品', icon: '' },
        },
        {
          path: 'seckillActivity',
          component: () => import('@/views/marketing/seckill/seckillActivity/index'),
          name: 'SeckillActivity',
          meta: { title: '秒杀活动', icon: '' },
        },
        {
          path: 'creatSeckill/:id?/:type?',
          component: () => import('@/views/marketing/seckill/seckillActivity/creatSeckill'),
          name: 'CreatSeckill',
          meta: { title: '添加秒杀商品', icon: '', noCache: true, activeMenu: `/marketing/seckill/seckillActivity` },
        },
        {
          path: 'styleConfig',
          component: () => import('@/views/marketing/seckill/seckillStyleConfig/index'),
          name: 'SeckillStyleConfig',
          meta: { title: '秒杀配置', icon: '' },
        },
      ],
    },
    {
      path: 'group',
      component: () => import('@/views/marketing/group/index'),
      name: 'Group',
      meta: { title: '拼团', icon: '' },
      children: [
        {
          path: 'activity',
          component: () => import('@/views/marketing/group/groupActivity/index'),
          name: 'GroupActivity',
          meta: { title: '拼团活动', icon: '' },
        },
        {
          path: 'list',
          component: () => import('@/views/marketing/group/groupList/index'),
          name: 'GroupList',
          meta: { title: '拼团记录', icon: '' },
        },
      ],
    },
    {
      path: 'atmosphere',
      name: 'atmosphere',
      meta: {
        title: '活动氛围',
        noCache: true,
      },
      component: () => import('@/views/marketing/atmosphere/index'),
      children: [
        {
          path: 'list',
          name: `atmosphereList`,
          meta: {
            title: '氛围列表',
            noCache: true,
          },
          component: () => import('@/views/marketing/atmosphere/atmosphereList/list'),
        },
        {
          path: 'add/:id?',
          name: `addAtmosphere`,
          meta: {
            title: '活动氛围',
            noCache: true,
            activeMenu: `/marketing/atmosphere/list`,
          },
          component: () => import('@/views/marketing/atmosphere/atmosphereList/addAtmosphere'),
        },
      ],
    },
    {
      path: 'border',
      name: 'border',
      meta: { title: '活动边框', icon: '' },
      component: () => import('@/views/marketing/border/index'),
      children: [
        {
          path: 'list',
          name: `borderList`,
          meta: {
            title: '活动边框列表',
            noCache: true,
          },
          component: () => import('@/views/marketing/atmosphere/atmosphereList/list'),
        },
        {
          path: 'add/:id?',
          name: `addBorder`,
          meta: {
            title: '活动边框',
            noCache: true,
            activeMenu: `/marketing/border/list`,
          },
          component: () => import('@/views/marketing/atmosphere/atmosphereList/addAtmosphere'),
        },
      ],
    },
    {
      path: 'broadcast',
      name: 'Broadcast',
      meta: {
        title: '直播',
        noCache: true,
      },
      component: () => import('@/views/marketing/broadcast/index'),
      children: [
        {
          path: 'list',
          name: 'BroadcastList',
          meta: {
            title: '直播间管理',
            noCache: true,
          },
          component: () => import('@/views/marketing/broadcast/list/index'),
        },
        {
          path: 'product',
          name: 'BroadcastProduct',
          meta: {
            title: '直播商品列表',
            noCache: true,
          },
          component: () => import('@/views/marketing/broadcast/product/index'),
        },
      ],
    },
    {
      path: 'PlatformCoupon',
      name: 'PlatformCoupon',
      meta: {
        title: '平台优惠券',
        noCache: true,
      },
      component: () => import('@/views/marketing/platformCoupon/index'),
      children: [
        {
          path: 'list',
          name: 'PlatformCouponlist',
          meta: {
            title: '优惠劵列表',
            noCache: true,
          },
          component: () => import('@/views/marketing/platformCoupon/couponList/index'),
        },
        {
          path: 'creatCoupon/:id?/:copy?',
          name: 'CreatCoupon',
          meta: {
            title: '添加优惠劵',
            noCache: true,
            activeMenu: `/marketing/PlatformCoupon/list`,
          },
          component: () => import('@/views/marketing/platformCoupon/couponList/creatCoupon'),
        },
        {
          path: 'couponRecord',
          name: 'couponRecord',
          meta: {
            title: '领取记录',
            noCache: true,
          },
          component: () => import('@/views/marketing/platformCoupon/couponList/record'),
        },
        {
          path: 'newGift',
          name: 'newGift',
          meta: {
            title: '用户有礼',
            noCache: true,
          },
          component: () => import('@/views/marketing/platformCoupon/couponList/newGift'),
        },
      ],
    },
    {
      path: 'videoChannel',
      name: 'VideoChannel',
      meta: {
        title: '视频号',
        noCache: true,
      },
      component: () => import('@/views/videoChannel'),
      children: [
        {
          path: 'list',
          component: () => import('@/views/videoChannel/videoList/index'),
          name: 'VideoChannelList',
          meta: { title: '商品列表', icon: '', noCache: true },
        },
        {
          path: 'draftList',
          component: () => import('@/views/videoChannel/draftList/index'),
          name: 'draftList',
          meta: { title: '草稿列表', icon: '', noCache: true },
        },
        {
          path: 'apply',
          component: () => import('@/views/videoChannel/apply/index'),
          name: 'videoApply',
          meta: { title: '申请接入', icon: '', noCache: true },
        },
        {
          path: 'weChatcategory',
          component: () => import('@/views/videoChannel/weChatcategoryAndBrand/index'),
          name: 'videoWeChatcategory',
          meta: { title: '微信商品类目', icon: '', noCache: true },
        },
      ],
    },
    {
      path: 'community',
      name: 'Community',
      meta: {
        title: '种草社区',
        noCache: true,
      },
      component: () => import('@/views/community'),
      children: [
        {
          path: 'classification',
          name: 'communityClassification',
          component: () => import('@/views/community/classification/index'),
          meta: {
            title: '社区分类',
            icon: 'clipboard',
          },
        },
        {
          path: 'topics',
          name: 'communityTopics',
          component: () => import('@/views/community/topics/index'),
          meta: {
            title: '社区话题',
            icon: 'clipboard',
          },
        },
        {
          path: 'content',
          name: 'communityContent',
          component: () => import('@/views/community/content/index'),
          meta: {
            title: '社区内容',
            icon: 'clipboard',
          },
        },
        {
          path: 'comments',
          name: 'communityComments',
          component: () => import('@/views/community/comments/index'),
          meta: {
            title: '社区评论',
            icon: 'clipboard',
          },
        },
        {
          path: 'config',
          name: 'communityConfig',
          component: () => import('@/views/community/config/index'),
          meta: {
            title: '社区配置',
            icon: 'clipboard',
          },
        },
      ],
    },
    {
      path: 'content',
      name: 'Content',
      meta: {
        title: '公告内容',
        noCache: true,
      },
      component: () => import('@/views/content'),
      children: [
        {
          path: 'articleManager',
          name: 'articleManager',
          component: () => import('@/views/content/article/list'),
          meta: {
            title: '文章管理',
            icon: 'clipboard',
          },
        },
        {
          path: 'articleCreat/:id?',
          name: 'articleCreat',
          component: () => import('@/views/content/article/edit'),
          meta: {
            title: '添加文章',
            noCache: true,
            activeMenu: `/marketing/content/articleManager`,
          },
        },
        {
          path: 'classifManager',
          name: 'classifManager',
          component: () => import('@/views/content/articleclass/list'),
          meta: {
            title: '文章分类',
            icon: 'clipboard',
          },
        },
      ],
    },
    {
      path: 'pointsMall',
      name: 'pointsMall',
      meta: {
        title: '积分商城',
        noCache: true,
      },
      component: () => import('@/views/marketing/pointsMall'),
      children: [
        {
          path: 'productManage',
          component: () => import('@/views/marketing/pointsMall/productManage/index'),
          name: 'ProductManage',
          meta: { title: '商品管理', icon: '' },
        },
        {
          //id:商品id，isDisabled：是否能编辑(1不能，2能)，isChoose：是否是采集商品(1是，2不是),productType:商品类型
          path: 'productManage/creatProduct/:id?/:isDisabled/:isChoose/:isCopy?',
          component: () => import('@/views/marketing/pointsMall/creatProduct/index'),
          name: 'creatProduct',
          meta: { title: '商品添加', noCache: true, activeMenu: `/marketing/pointsMall/productManage` },
          hidden: true,
        },
        {
          path: 'section',
          name: 'Section',
          component: () => import('@/views/marketing/pointsMall/section/index'),
          meta: {
            title: '积分区间',
            icon: 'clipboard',
          },
        },
        {
          path: 'order',
          name: 'pointsOrder',
          component: () => import('@/views/marketing/pointsMall/order/index'),
          meta: {
            title: '积分订单',
            icon: 'clipboard',
          },
        },
      ],
    },
  ],
};

export default marketingRouter;
