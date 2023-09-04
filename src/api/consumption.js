import axios from '../utils/axios';
/**
 * 获取本年度园区累计耗电量
 * @param
 */
export function getTotalPower(params) {
  return axios.get('/cockpit/energy/getElectricYearCount', params);
}

/**
 * 获取园区楼栋内本月耗电量概况
 * @param
 */
export function getFloorMonthCount() {
  return axios.get('/cockpit/energy/getFloorElectricMonthCount');
}

/**
 * 当月每日耗电量趋势
 * @param
 */
export function getChangeTrend() {
  return axios.get('/cockpit/energy/getElectricMonthTrend');
}

/**
 * 当月峰平谷耗电占比
 * @param
 */
export function getAveragePeak() {
  return axios.get('/cockpit/energy/getElectricMonthPeakToValley');
}

/**
 * 园区用水总览
 * @param
 */
export function getAllWater() {
  return axios.get('/cockpit/energy/getWaterMonthCount');
}

/**
 * 园区中水用水概况
 * @param
 */
export function getReclaimed() {
  return axios.get('/cockpit/energy/getWaterZSMonthCount');
}

/**
 * 园区市政用水概况
 * @param
 */
export function getMunicipal() {
  return axios.get('/cockpit/energy/getWaterSZMonthCount');
}

/**
 * 中水系统经济效益
 * @param
 */
export function getEconomic() {
  return axios.get('/cockpit/energy/getEconomicBenefits');
}

/**
 * 楼栋用电量排名
 * @param
 */
export function getMonthRank() {
  return axios.get('/cockpit/energy/getElectricMonthBuildTop');
}

/**
 *各楼栋用水量比较分析
 * @param
 */
export function getComparisonAnalysis() {
  return axios.get('/cockpit/energy/getWaterMonthTrendCount');
}

/**
 *租户公区各楼栋耗电占比
 * @param
 */
export function getProportionPower() {
  return axios.get('/cockpit/energy/getElectricMonthTenantPubRatio');
}

/**
 *本月用水量/进水量趋势
 * @param
 */
export function getMonthLyWater() {
  return axios.get('/cockpit/energy/getWaterMonthInflowOrOutflowCount');
}

/**
 *用水量占比分析
 * @param
 */
export function getAnalysisProportion() {
  return axios.get('/cockpit/energy/getWaterMonthCount');
}
