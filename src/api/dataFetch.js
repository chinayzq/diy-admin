import axios from '../utils/axios';
export function getFetchList(params) {
  return axios.get('/list/fetchdata', { params });
}
export function update1Coupon(params) {
  return axios.post('/editcoupon', params);
}
