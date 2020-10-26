import request from '@/utils/request'
import store from '@/store'

// 某个数据集预处理列表获取
export function preprocessStatusFetch(query) {
  return request({
    url: '/process-manage/pre-process/datasets/ID/preprocesses',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

// 某个数据集新增预处理步骤
export function preprocessAdd(data) {
  return request({
    url: '/process-manage/pre-process/datasets/ID/preprocesses',
    method: 'post',
    data: data,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

// 某个数据集预处理结果获取
export function preprocessDataFetch(query) {
  return request({
    url: '/process-manage/pre-process/datasets/ID/preprocesses/ID/data',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

// 某个数据集执行某个预处理步骤
export function preprocessDeal(data) {
  return request({
    url: '/process-manage/pre-process/datasets/ID/preprocesses/ID/status',
    method: 'put',
    data: data,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

