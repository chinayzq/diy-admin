import axios from '../utils/axios';
export function getModelList(params) {
  return axios.get('/listphone', { params });
}
export function getPhoneColor(params) {
  return axios.get('/listphonecolor', { params });
}
export function createPhoneColor(params) {
  return axios.post('/createphonecolor', params);
}
export function modelStatusChange(params) {
  return axios.post(`/updatephonestatus/${params.phoneCode}/${params.status}`);
}
