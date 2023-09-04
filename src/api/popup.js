import axios from '../utils/axios';
/**
 * 获取园区运维数据
 * @param
 */
export function findInspectionList(params) {
  return axios.get('/cockpit/rwork/findInspectionList', params);
}

/**
 * 获取园区工单数据
 * @param
 */
export function findOrderList(params) {
  return axios.get('/cockpit/rwork/findOrderList', params);
}
