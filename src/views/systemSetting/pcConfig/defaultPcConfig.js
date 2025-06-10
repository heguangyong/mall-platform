/**
 * 经营理念
 */
export const philosophyDefault = () => {
  return {
    tips: '图片建议24*24px；鼠标拖拽左侧圆点可调整板块顺序；经营理念展示于PC商城底部授权板块，描述最多可输入10个字',
    maxLength: 10,
    title: '描述',
    placeWords: '请输入描述，最多可输入10个字',
    isShowAddBtn: false, //添加按钮
    isShowEdit: false, //删除按钮
    isShowStatus: false, //开启状态
    isShowLinkUrl: false, //链接地址
    isShowLinkUrlChose: false, //选择地址选项
    isShowImageUrl: true, //图片地址
    list: [
      {
        name: '',
        imageUrl: '',
        status: false,
        id: 0,
        sort: 0,
      },
      {
        name: '',
        imageUrl: '',
        status: false,
        id: 0,
        sort: 0,
      },
      {
        name: '',
        imageUrl: '',
        status: false,
        id: 0,
        sort: 0,
      },
      {
        name: '',
        imageUrl: '',
        status: false,
        id: 0,
        sort: 0,
      },
    ],
  };
};

/**
 * 友情链接
 */
export const friendlyLinkDefault = () => {
  return {
    tips: '鼠标拖拽左侧圆点可调整板块顺序',
    title: '链接名称',
    placeWords: '请输入链接名称',
    isShowAddBtn: true, //添加按钮
    isShowEdit: true, //删除按钮
    isShowStatus: false, //开启状态
    isShowLinkUrl: true, //链接地址
    isShowLinkUrlChose: false, //选择地址选项
    isShowImageUrl: false, //图片地址
    defaultList: {
      name: '',
      linkUrl: '',
      id: 0,
      sort: 0,
    },
    list: [
      {
        name: '',
        linkUrl: '',
        id: 0,
        sort: 0,
      },
    ],
  };
};

/**
 * 底部二维码配置
 */
export const bottomQrcodeDefault = () => {
  return {
    tips: '鼠标拖拽左侧圆点可调整板块顺序,标题最多可输入8个字',
    title: '链接名称',
    placeWords: '请输入标题，最多可输入8个字',
    isShowAddBtn: false, //添加按钮
    isShowEdit: false, //删除按钮
    isShowStatus: false, //开启状态
    isShowLinkUrl: false, //链接地址
    isShowLinkUrlChose: false, //选择地址选项
    isShowImageUrl: true, //图片地址
    maxLength: 8,
    list: [
      {
        name: '',
        imageUrl: '',
        id: 0,
        sort: 0,
      },
      {
        name: '',
        imageUrl: '',
        id: 0,
        sort: 0,
      },
    ],
  };
};

/**
 * 商城快捷入口
 */
export const shoppingQuickEntryDefault = () => {
  return {
    tips: '鼠标拖拽左侧圆点可调整板块顺序，最多可以添加6个板块，每个板块下最多可以添加7个链接',
    title: '链接名称',
    placeWords: '请输入链接名称，最多可输入6个字',
    isShowAddBtn: true, //添加按钮
    isShowEdit: true, //删除按钮
    isShowStatus: false, //开启状态
    isShowLinkUrl: false, //链接地址
    isShowLinkUrlChose: false, //选择地址选项
    isShowImageUrl: false, //图片地址
    isShowChildList: true,
    maxLength: 6,
    modelMaxLength: 6,
    linkNameMaxLength: 8,
    modelLinkMaxLength: 7,
    defaultList: {
      name: '',
      imageUrl: '',
      id: 0,
      sort: 0,
      linkList: [
        {
          name: '',
          linkUrl: '',
          id: 0,
          sort: 0,
        },
      ],
    },
    list: [
      {
        name: '',
        imageUrl: '',
        id: 0,
        sort: 0,
        linkList: [
          {
            name: '',
            linkUrl: '',
            id: 0,
            sort: 0,
          },
        ],
      },
    ],
  };
};

/**
 * 首页banner
 */
export const bannerDefault = () => {
  return {
    tips: '最多可添加10张图片，建议1920*550px；鼠标拖拽左侧圆点可调整图片 顺序',
    isShowAddBtn: true, //添加按钮
    isShowEdit: true, //删除按钮
    isShowStatus: true, //开启状态
    isShowLinkUrl: true, //链接地址
    isShowLinkUrlChose: false, //选择地址选项
    isShowImageUrl: true, //图片地址
    isShowMoreLinkUrl: false, //多条链接
    maxList: 10,
    title: '标题',
    defaultList: {
      name: '',
      imageUrl: '',
      status: false,
      linkUrl: '',
      id: 0,
      sort: 0,
    },
    modelMaxLength: 10,
    list: [
      {
        name: '',
        imageUrl: '',
        status: false,
        linkUrl: '',
        id: 0,
        sort: 0,
      },
    ],
  };
};

/**
 * 首页广告
 */
export const advertisementDefault = () => {
  return {
    tips: '图片宽度建议为1920px',
    isShowAddBtn: false, //添加按钮
    isShowEdit: false, //删除按钮
    isShowStatus: true, //开启状态
    isShowLinkUrl: true, //链接地址
    isShowLinkUrlChose: false, //选择地址选项
    isShowImageUrl: true, //图片地址
    isShowMoreLinkUrl: false, //多条链接
    maxList: 10,
    defaultList: {
      imageUrl: '',
      status: false,
      linkUrl: '',
      id: 0,
    },
    list: [
      {
        imageUrl: '',
        status: false,
        linkUrl: '',
        id: 0,
      },
    ],
  };
};

/**
 * 首页顶部菜单
 */
export const menuDefault = () => {
  return {
    tips: '最多可开启6个板块，链接支持输入内部链接/外部链接',
    isShowAddBtn: true, //添加按钮
    isShowEdit: true, //删除按钮
    isShowStatus: true, //开启状态
    isShowLinkUrl: true, //链接地址
    isShowLinkUrlChose: false, //选择地址选项
    isShowImageUrl: false, //图片地址
    isShowMoreLinkUrl: false, //多条链接
    // modelMaxLength: 10,
    maxLength: 6,
    placeWords: '请输入名称（最多6个字）',
    linkPlaceWords: '支持输入内部链接/外部链接',
    title: '名称',
    defaultList: {
      status: false,
      linkUrl: '',
      id: 0,
      sort: 0,
      name: '',
    },
    list: [
      {
        status: false,
        linkUrl: '',
        id: 0,
        sort: 0,
        name: '',
      },
    ],
  };
};
