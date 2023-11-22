import axios from '../utils/axios';

export function getOrderList(params) {
  return axios.get(`/list/order`, { params });
}
export function getOrderDetail(orderId) {
  return axios.get(`/order/${orderId}`);
}
