// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
import articleFromComponent from './index.vue';
const articleFrom = {};
articleFrom.install = function (Vue, options) {
  const ToastConstructor = Vue.extend(articleFromComponent);
  // 生成一个该子类的实例
  const instance = new ToastConstructor();
  instance.$mount(document.createElement('div'));
  document.body.appendChild(instance.$el);
  Vue.prototype.$modalArticle = function (callback, handle) {
    instance.visible = true;
    instance.callback = callback;
    instance.handle = handle;
  };
};
export default articleFrom;
