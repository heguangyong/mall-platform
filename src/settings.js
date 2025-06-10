// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

// 请求接口地址 如果没有配置自动获取当前网址路径
const VUE_APP_API_URL = process.env.VUE_APP_BASE_API || `${location.origin}/api/`;

module.exports = {
  // 接口请求地址
  apiBaseURL: VUE_APP_API_URL,

  title: '加载中...',

  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   * 是否显示设置右侧面板
   */
  showSettings: true,

  /**
   * @type {boolean} true | false
   * @description Whether need tagsView
   * 是否使用tagsView
   */
  tagsView: true,

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   * 是否固定header
   */
  fixedHeader: true,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   * 是否在侧边栏中显示logo
   */
  sidebarLogo: true,

  /**
   * @type {boolean} true | false
   * @description Whether to turn on top bar navigation
   * 是否开启顶栏导航
   */
  topNav: true,

  /**
   * @type {boolean} true | false
   * @description Whether to navigation icon
   * 是否显示导航icon
   */
  navIcon: true,
  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production',
};
