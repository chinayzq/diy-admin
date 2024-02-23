import axios from '../utils/axios';
export function getPartnerList(params) {
  return axios.get('/list/kol', { params });
}
export function editPartner(params) {
  return axios.post('/edit/kol', params);
}
export function deletePartner(id) {
  return axios.delete('/deletekol/' + id);
}
