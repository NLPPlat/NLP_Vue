import request from '@/utils/request'
import store from '@/store'

export function preprocessStatusFetch(query) {
  return request({
    url: '/process-manage/pre-process/preprocess',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

export function preprocessAdd(data) {
  return request({
    url: '/process-manage/pre-process/preprocess/id',
    method: 'post',
    data: data,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}
