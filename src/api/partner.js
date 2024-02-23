import axios from '../utils/axios';
export function getPartnerList(params) {
  return axios.get('/list/kol', { params });
}
