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

export function datasetDelete(data) {
  return request({
    url: '/common/dataset/dataset',
    method: 'delete',
    data: data,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

export function datasetInfoVerify(data) {
  return request({
    url: '/common/dataset/dataset/ID/info',
    method: 'patch',
    data: data,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

export function tasktypeFetch(query) {
  return request({
    url: '/common/dataset/dataset/ID/tasktype',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

export function groupVectorsFetch(query) {
  return request({
    url: '/common/dataset/dataset/ID/group',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}
