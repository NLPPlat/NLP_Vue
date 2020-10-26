import request from '@/utils/request'
import store from '@/store'

export function operatorUpload(data) {
  return request({
    url: '/data-manage/operator/operators/ID',
    method: 'post',
    data: data,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

export function operatorFetch(query) {
  return request({
    url: '/data-manage/operator/operators/ID',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

export function operatorsFetch(query) {
  return request({
    url: '/data-manage/operator/operators',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

export function codeRun(query) {
  return request({
    url: '/data-manage/operator/operators/ID/code',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}
