import axios from '../utils/axios';

/**
 * 获取消防告警信息统计
 * @param
 */
export function countAlarmFire(params) {
  return axios.get('/cockpitData/alarm/countAlarmFire', params);
}

/**
 * 获取消防告警趋势统计
 * @param
 */
export function countAlarmTrend(params) {
  return axios.get('/cockpitData/alarm/countAlarmTrend', params);
}

/**
 * 获取消防告警趋势统计
 * @param
 */
export function findAlarmByParam(params) {
  return axios.get('/cockpitData/alarm/findAlarmByParam', params);
}
