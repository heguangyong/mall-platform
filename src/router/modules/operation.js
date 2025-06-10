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

const operationRouter = {
  path: '/operation',
  component: Layout,
  redirect: '/operation/setting',
  name: 'Operation',
  meta: {
    title: '设置',
    icon: 'clipboard',
    roles: ['admin'],
  },
  children: [
    {
      path: 'setting',
      name: 'setting',
      component: () => import('@/views/systemSetting/setting'),
      meta: {
        title: '平台设置',
        icon: 'clipboard',
      },
    },
    {
      path: 'agreement',
      name: 'OperationAgreement',
      component: () => import('@/views/systemSetting/agreement'),
      meta: {
        title: '协议管理',
        icon: 'clipboard',
      },
    },
    {
      path: 'notification',
      name: 'notification',
      component: () => import('@/views/systemSetting/notification'),
      meta: {
        title: '消息通知',
        icon: 'clipboard',
      },
    },
    {
      path: 'roleManager',
      name: 'RoleManager',
      component: () => import('@/views/systemSetting/administratorAuthority'),
      meta: {
        title: '管理权限',
        icon: 'clipboard',
        roles: ['admin'],
      },
      children: [
        {
          path: 'identityManager',
          component: () => import('@/views/systemSetting/administratorAuthority/identityManager'),
          name: 'identityManager',
          meta: { title: '角色管理', icon: '' },
        },
        {
          path: 'adminList',
          component: () => import('@/views/systemSetting/administratorAuthority/adminList'),
          name: 'adminList',
          meta: { title: '管理员列表', icon: '' },
        },
        {
          path: 'promiseRules',
          component: () => import('@/views/systemSetting/administratorAuthority/permissionRules'),
          name: 'promiseRules',
          meta: { title: '权限规则', icon: '' },
        },
      ],
    },
    {
      path: 'logistics',
      name: 'Logistics',
      component: () => import('@/views/maintain/logistics'),
      meta: {
        title: '物流设置',
        icon: 'clipboard',
      },
      children: [
        {
          path: 'companyList',
          component: () => import('@/views/maintain/logistics/companyList/index'),
          name: 'companyList',
          meta: { title: '物流公司', icon: '' },
        },
      ],
    },
    {
      path: 'maintain',
      name: 'Maintain',
      meta: {
        title: '系统维护',
        noCache: true,
      },
      redirect: 'noRedirect',
      component: () => import('@/views/maintain'),
      children: [
        {
          path: 'devconfiguration',
          name: 'devconfiguration',
          component: () => import('@/views/maintain'),
          redirect: 'configCategory',
          meta: {
            title: '开发配置',
            icon: 'clipboard',
          },
          children: [
            {
              path: 'configCategory',
              name: 'configCategory',
              component: () => import('@/views/maintain/devconfig/configCategroy'),
              meta: {
                title: '配置分类',
                icon: 'clipboard',
              },
            },
            {
              path: 'combineddata',
              name: 'combineddata',
              component: () => import('@/views/maintain/devconfig/combinedData'),
              meta: {
                title: '组合数据',
                icon: 'clipboard',
              },
            },
            {
              path: 'formConfig',
              name: 'formConfig',
              component: () => import('@/views/maintain/formConfig/index'),
              meta: {
                title: '表单配置',
                icon: 'clipboard',
              },
            },
          ],
        },
        {
          path: 'authCRMEB',
          name: 'authCRMEB',
          component: () => import('@/views/maintain/authCRMEB'),
          meta: {
            title: '授权',
            icon: 'clipboard',
          },
          hidden: false,
        },
        {
          path: 'schedule',
          name: 'schedule',
          component: () => import('@/views/maintain'),
          meta: {
            title: '定时任务管理',
            icon: 'clipboard',
            roles: ['admin'],
          },
          children: [
            {
              path: 'list',
              component: () => import('@/views/maintain/schedule/list'),
              name: 'list',
              meta: { title: '定时任务', icon: '' },
            },
            {
              path: 'logList',
              component: () => import('@/views/maintain/schedule/logList'),
              name: 'logList',
              meta: { title: '定时任务日志', icon: '' },
            },
          ],
        },
        {
          path: 'sensitiveLog',
          name: 'sensitiveLog',
          component: () => import('@/views/maintain/sensitiveList'),
          meta: {
            title: '敏感操作日志',
            icon: 'clipboard',
          },
          hidden: false,
        },
        {
          path: 'user/:type?',
          name: 'MaintainUser',
          component: () => import('@/views/maintain/user'),
          meta: {
            title: '个人中心',
            icon: 'clipboard',
          },
          hidden: true,
        },
      ],
    },
    {
      path: 'onePass',
      name: 'OnePass',
      meta: {
        title: '一号通',
        noCache: true,
      },
      redirect: 'onePass/home',
      component: () => import('@/views/onePass'),
      children: [
        {
          path: 'home',
          name: 'onePass',
          component: () => import('@/views/onePass/home'),
          meta: {
            title: '一号通',
            icon: 'clipboard',
          },
        },
        {
          path: 'onePassConfig',
          component: () => import('@/views/onePass/onePassConfig'),
          name: 'OnePassConfig',
          meta: { title: '一号通配置', noCache: true },
        },
        {
          path: 'pay',
          component: () => import('@/views/onePass/smsPay'),
          name: 'SmsPay',
          meta: { title: '短信购买', noCache: true },
        },
        {
          path: 'template',
          component: () => import('@/views/onePass/smsTemplate'),
          name: 'SmsTemplate',
          meta: { title: '短信模板', noCache: true },
        },
      ],
    },
    {
      path: 'application',
      name: 'Application',
      meta: {
        title: '应用设置',
        noCache: true,
      },
      redirect: 'noRedirect',
      component: () => import('@/views/application/wxAccount'),
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
        {
          path: 'publicRoutine',
          name: 'PublicRoutine',
          component: () => import('@/views/application/routine'),
          meta: {
            title: '小程序',
            icon: 'clipboard',
            roles: ['admin'],
            hidden: true,
          },
          children: [
            {
              path: 'deliveryManagement',
              component: () => import('@/views/application/routine/deliveryManagement/index.vue'),
              name: 'deliveryManagement',
              meta: { title: '发货管理', icon: '' },
            },
            {
              path: 'linkGenerator',
              component: () => import('@/views/application/routine/linkGenerator/index.vue'),
              name: 'linkGenerator',
              meta: { title: '链接生成器', icon: '' },
            },
          ],
        },
      ],
    },
    {
      path: 'pcConfig',
      name: 'PcConfig',
      component: () => import('@/views/systemSetting/pcConfig'),
      meta: {
        title: 'PC商城设置',
        icon: 'clipboard',
      },
      children: [
        {
          path: 'basicSettings',
          component: () => import('@/views/systemSetting/pcConfig/basicSettings/index'),
          name: 'basicSettings',
          meta: { title: '基础设置', icon: '' },
        },
        {
          path: 'homeSettings',
          component: () => import('@/views/systemSetting/pcConfig/homeSettings/index'),
          name: 'homeSettings',
          meta: { title: '首页设置', icon: '' },
        },
        {
          path: 'empower',
          component: () => import('@/views/systemSetting/pcConfig/empower/index'),
          name: 'empower',
          meta: { title: '底部授权', icon: '' },
        },
      ],
    },
  ],
};

export default operationRouter; //collate
