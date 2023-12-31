import axios from '../utils/axios';
export function getCouponList(params) {
  return axios.get('/listcoupon', { params });
}
export function deleteCoupon(params) {
  return axios.delete('/deletecoupon', { params });
}
export function updateCoupon(params) {
  return axios.post('/editcoupon', params);
}
