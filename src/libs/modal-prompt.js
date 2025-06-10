// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

/**
 * $prompt一行内容input提交封装
 * @param inputType input type 类型
 * @param title 标题
 * @param val 回显的值
 * @returns {Promise<any>}
 */
export default function modalPrompt(inputType, title, val) {
  return new Promise((resolve, reject) => {
    this.$prompt('', `${title}`, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputErrorMessage: `请输入${title}`,
      inputType: inputType,
      inputValue: val ? val : '',
      showClose: true,
      closeOnClickModal: false,
      customClass: 'prompt-form',
      inputPlaceholder: `请输入${title}`,
      // inputValidator: (val) => {
      //   if (val === null) {
      //     return true;
      //   }
      //   return !(val.length > 11 || val.length < 11)
      // },
      //inputErrorMessage: '格式不正确',
      inputValidator: (value) => {
        if (value === null) {
          return true;
        }
        if (!value) return '输入不能为空';
        if (value.indexOf(' ') !== -1) return '输入不能为空';
        if (value.length > 50) return '输入限制50字以内';
      },
      beforeClose: (action, instance, done) => {
        if (action === 'confirm') {
          instance.confirmButtonLoading = true;
          instance.confirmButtonText = '执行中...';
          setTimeout(() => {
            done();
            instance.confirmButtonLoading = false;
          }, 200);
        } else {
          done();
        }
      },
    })
      .then(({ value }) => {
        resolve(value);
      })
      .catch(() => {
        this.$message.info('取消输入');
      });
  });
}
