import request from '@/utils/request'
import store from '@/store'

export function fetchList(query) {
  return request({
    url: '/process-manage/dataset/list',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

export function fetchDetail(query) {
  return request({
    url: '/process-manage/dataset/detail',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

export function editDataVector(query) {
  return request({
    url: '/process-manage/dataset/detail/vector',
    method: 'put',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

export function deletetDataVector(query) {
  return request({
    url: '/process-manage/dataset/detail/vector',
    method: 'delete',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

export function fetchRubbish(query) {
  return request({
    url: '/process-manage/dataset/rubbish',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

export function recycleDataVector(query) {
  return request({
    url: '/process-manage/dataset/rubbish/vector',
    method: 'delete',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}
