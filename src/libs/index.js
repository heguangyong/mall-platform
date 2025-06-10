// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
import modalIcon from '@/libs/modal-icon';
import modalParserFrom from '@/libs/modal-parserFrom';
import modalSure from '@/libs/modal-sure';
import modalPrompt from '@/libs/modal-prompt';
import timeOptions from '@/libs/timeOptions';
//import modalCoupon from '@/libs/modal-coupon';
import dialog from '@/libs/dialog';
import * as constants from '@/utils/constants.js';
import * as selfUtil from '@/utils/ZBKJIutil.js';
import * as Auth from '@/libs/wechat';
import schema from 'async-validator';
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, handleTree } from '@/utils/parsing';

export default {
  install(Vue) {
    Vue.prototype.$modalSure = modalSure;
    Vue.prototype.$modalIcon = modalIcon;
    Vue.prototype.$modalParserFrom = modalParserFrom;
    Vue.prototype.$timeOptions = timeOptions;
    Vue.prototype.$constants = constants;
    Vue.prototype.$selfUtil = selfUtil;
    Vue.prototype.handleTree = handleTree;
    Vue.prototype.parseTime = parseTime;
    Vue.prototype.resetForm = resetForm;
    Vue.prototype.$dialog = dialog;
    Vue.prototype.$scroll = scroll;
    Vue.prototype.$wechat = Auth;
    Vue.prototype.$modalPrompt = modalPrompt;
    //Vue.prototype.$modalCoupon= modalCoupon;
    Vue.prototype.$validator = function (rule) {
      return new schema(rule);
    };
  },
};
