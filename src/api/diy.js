import request from '@/utils/request';
/**
 * 门票推荐
 * @param pram
 */
export function recommendListApi(data) {
  return request({
    url: '/front/product/recommend/post-list',
    method: 'post',
    data,
  });
}
/**
 * 餐饮推荐
 * @param pram
 */
export function merchantListApi(data) {
  return request({
    url: '/front/merchant/location/list',
    method: 'post',
    data,
  });
}
/**
 * 好礼推荐
 * @param pram
 */
export function giftListApi(data) {
  return request({
    url: '/front/product/recommend/post-list',
    method: 'post',
    data,
  });
}


/**
 * 热门攻略
 * @param pram
 */
export function hotListApi(data) {
  return request({
    url: '/front/article/post-list',
    method: 'post',
    data,
  });
}



/**
 * 周边景区
 * @param pram
 */

export function scenicListApi(data) {
  return request({
    url: '/front/ticket/scenic/post-spot',
    method: 'post',
    data,
  });
}

/**
 * 资讯推荐
 * @param pram
 */
export function newrecommendListApi(data) {
  return request({
    url: '/front/article/hot/post-list',
    method: 'post',
    data,
  });
}

/**
 * 门票推荐
 * @param pram
 */
// export function recommendListApi(params) {
//   return request({
//     url: '/front/product/recommend/list',
//     method: 'get',
//     params,
//   });
// }

