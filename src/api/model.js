import axios from '../utils/axios';
export function getModelList(params) {
  return axios.get('/listphone', { params });
}
export function uploadRequestHandler(params) {
  return axios.post('/upload', { data: params });
}
