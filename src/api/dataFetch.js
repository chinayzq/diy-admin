import axios from '../utils/axios';
export function getFetchList(params) {
  return axios.get('/list/fetchdata', { params });
}
export function update1Coupon(params) {
  return axios.post('/editcoupon', params);
}
export function getFellowList(params) {
  return axios.get('/list/follow', { params });
}
export function getFansList(params) {
  return axios.get('/list/fans', { params });
}
export function focusListExport(params) {
  return axios.get('/list/exportfollow', { params });
}
export function fansListExport(params) {
  return axios.get('/list/exportfans', { params });
}
