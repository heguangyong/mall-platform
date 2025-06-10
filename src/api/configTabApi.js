// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

import request from '@/utils/request';

// 配置分类管理
// 注意暂时没用到，使用无限极分类实现

export function configTabDelete(pram) {
  const data = {
    id: pram.id,
  };
  return request({
    url: 'admin/system/config/tab/delete',
    method: 'GET',
    params: data,
  });
}

export function configTabInfo(pram) {
  const data = {
    id: pram.id,
  };
  return request({
    url: 'admin/system/config/tab/info',
    method: 'GET',
    params: data,
  });
}

export function configTabList(pram) {
  const data = {
    id: pram.id,
    engTitle: pram.engTitle,
    icon: pram.icon,
    info: pram.info,
    title: pram.title,
    parameter: pram.parameter,
    status: pram.status,
    page: pram.page,
    limit: pram.limit,
  };
  return request({
    url: 'admin/system/config/tab/list',
    method: 'POST',
    params: data,
  });
}
