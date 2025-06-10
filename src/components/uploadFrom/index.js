// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
import uploadFromComponent from './index.vue';
const uploadFrom = {};
uploadFrom.install = function (Vue, options) {
  // 创建一个可以被多次使用的组件构造器
  const ToastConstructor = Vue.extend(uploadFromComponent);
  // 生成一个该子类的实例
  const instance = new ToastConstructor();
  // 挂载实例到元素上
  instance.$mount(document.createElement('div'));
  document.body.appendChild(instance.$el);
  // 挂载到本身的全局方法
  Vue.prototype.$modalUpload = function (callback, multiple, modelName, isShowVideo) {
    instance.visible = true;
    instance.callback = callback; //回调函数
    instance.multiple = multiple; //是否是多选
    instance.modelName = modelName; //上传文件包名字
    instance.isShowVideo = isShowVideo;
  };
};
export default uploadFrom;
