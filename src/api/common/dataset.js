import request from '@/utils/request'
import store from '@/store'

export function datasetListFetch(query) {
  return request({
    url: '/common/dataset/dataset',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

export function datasetCopy(data) {
  return request({
    url: '/common/dataset/dataset',
    method: 'post',
    data: data,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}
