import axios from '../utils/axios';

export function getOrderList(params) {
  return axios.get(`/list/order`, { params });
}
export function getOrderDetail(orderId) {
  return axios.get(`/order/${orderId}`);
}
export function refundRequest(orderId) {
  return axios.post(`/refundorder/${orderId}`);
}
// orderId、trackingNumber
export function updateTrackingNumber(param) {
  return axios.post(`/update/trackingnumber`, param);
}
