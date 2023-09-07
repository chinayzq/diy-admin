import axios from '../utils/axios';
/**
 * 获取本年度园区累计耗电量
 * @param
 */
export function getDictionaryList(params) {
  return axios.get('/dict/listclass', params);
}
