import { validatePhone } from '@/utils/toolsValidate';

export const postRules = {
  expressCode: [{ required: true, message: '请选择快递公司', trigger: 'change' }],
  expressNumber: [{ required: true, message: '请输入快递单号', trigger: 'blur' }],
  deliveryCarrier: [{ required: true, message: '请输入配送人员', trigger: 'blur' }],
  carrierPhone: [{ required: true, validator: validatePhone, trigger: 'blur' }],
  isSplit: [{ required: true, message: '请选择分单发货', trigger: 'change' }],
};

//普通商品规格默认数据
export const objTitle = {
  price: {
    title: '售价',
  },
  vipPrice: {
    title: '会员价',
  },
  cost: {
    title: '成本价',
  },
  otPrice: {
    title: '划线价',
  },
  stock: {
    title: '库存',
  },
  weight: {
    title: '重量（KG）',
  },
  volume: {
    title: '体积(m³)',
  },
  brokerage: {
    title: '一级返佣(%)',
  },
  brokerageTwo: {
    title: '二级返佣(%)',
  },
  barCode: {
    title: '商品编码',
  },
};
//积分商品规格默认数据
export const objTitlePoints = {
  price: {
    title: '兑换金额（元）',
  },
  redeemIntegral: {
    title: '兑换积分',
  },
  cost: {
    title: '划线价（元）',
  },
  stock: {
    title: '库存',
  },
  weight: {
    title: '重量（KG）',
  },
  volume: {
    title: '体积(m³)',
  },
  barCode: {
    title: '商品编码',
  },
};

// 积分商城默认规格数据
const defaultObjAttrValue = {
  image: '',
  price: 0.0,
  redeemIntegral: 1,
  cost: 0.0,
  stock: 0,
  barCode: '',
  weight: 0,
  volume: 0,
};

export const defaultObj = {
  image: '',
  sliderImages: [],
  sliderImage: '',
  name: '',
  intro: '',
  keyword: '',
  unitName: '',
  sort: 0,
  exchangeNum: 0, //兑换数量
  isShow: false,
  header: [],
  attrValueList: [
    {
      image: '',
      price: 0.0,
      vipPrice: 0.0,
      redeemIntegral: 1,
      otPrice: 0.0,
      cost: 0.0,
      stock: 0,
      weight: 0,
      volume: 0,
      barCode: '',
      isShow: true,
    },
  ],
  attrList: [],
  attrs: [],
  content: '',
  specType: false,
  id: undefined,
};
