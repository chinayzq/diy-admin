import axios from '../utils/axios';
export function getArticleList(params) {
  return axios.post('/list/article', params);
}
export function updateArticle(params) {
  return axios.post('/edit/article', params);
}
export function getArticleDetailById(id) {
  return axios.post('/detail/'+ id);
}

