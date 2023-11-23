import axios from '../utils/axios';
/**
 * 登录接口
 * @param
 */
export function loginRequest(params) {
  return axios.post('/login', params);
}
export function loginOutRequest(params) {
  return axios.post('/loginout', params);
}
export function getUserList(params) {
  return axios.get('/list/user', { params });
}
export function getUserDetail(userId) {
  return axios.get(`/user/${userId}`);
}
export function deleteUser(userId) {
  return axios.delete(`/user/${userId}`);
}
