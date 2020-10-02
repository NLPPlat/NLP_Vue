import request from '@/utils/request'
import store from '@/store'

export function fetchList(query) {
  return request({
    url: '/process-manage/annotation/list',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

export function annotationConfig(data) {
  return request({
    url: '/process-manage/annotation/config',
    method: 'post',
    data: data,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

