import axios from '../utils/axios';
/**
 * 获取园区运维数据
 * @param
 */
export function getInspectionCount(params) {
  return axios.get('/cockpit/rwork/findInspectionCount', params);
}

/**
 * 获取园区运维数据
 * @param
 */
export function findInspectionProp(params) {
  return axios.get('/cockpit/rwork/findInspectionProp', params);
}

/**
 * 获取今日报单数
 * @param
 */
export function findOrderCount(params) {
  return axios.get('/cockpit/rwork/findOrderCount', params);
}

/**
 * 获取工单趋势
 * @param
 */
export function findOrderTrend(params) {
  return axios.get('/cockpit/rwork/findOrderTrend', params);
}
