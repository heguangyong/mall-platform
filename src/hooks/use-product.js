// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
import { brandListApi, productDetailApi } from '@/api/product';
const defaultObj = {
  image: '',
  sliderImages: [],
  videoLink: '',
  sliderImage: '',
  name: '',
  intro: '',
  keyword: '',
  couponList: [],
  unitName: '',
  sort: 0,
  giveIntegral: 0,
  ficti: 0,
  isShow: false,
  attrValue: [
    {
      image: '',
      price: 0,
      vipPrice: 0,
      cost: 0,
      otPrice: 0,
      stock: 0,
      weight: 0,
      volume: 0,
      brokerage: 0,
      brokerageTwo: 0,
    },
  ],
  attr: [],
  selectRule: '',
  isSub: false,
  content: '',
  specType: false,
  id: undefined,
  couponIds: [],
  coupons: [],
  postage: '1',
  categoryId: '',
  guaranteeIds: '',
  guaranteeIdsList: [],
  brandId: '',
  deliveryMethod: '',
};
export function useProduct() {
  //商品类型
  const productTypeList = [
    {
      label: '普通商品',
      value: 0,
    },
    {
      label: '虚拟商品',
      value: 2,
    },
    {
      label: '云盘商品',
      value: 5,
    },
    {
      label: '卡密商品',
      value: 6,
    },
  ];
  return {
    productTypeList,
  };
}
