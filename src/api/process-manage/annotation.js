import request from '@/utils/request'
import store from '@/store'

// 某个数据集标注任务配置获取
export function fetchTags(query) {
  return request({
    url: '/process-manage/annotation/datasets/ID/annotation/config',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

// 某个数据集标注任务配置
export function annotationConfig(data) {
  return request({
    url: '/process-manage/annotation/datasets/ID/annotation/config',
    method: 'post',
    data: data,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

export function fetchVector(query) {
  return request({
    url: '/process-manage/annotation/detail/vector',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

export function uploadAnnotationTags(data) {
  return request({
    url: '/process-manage/annotation/detail/tags',
    method: 'post',
    data: data,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

export function fetchAnnotationStatus(query) {
  return request({
    url: '/process-manage/annotation/status/ID',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

export function completeAnnotationStatus(data) {
  return request({
    url: '/process-manage/annotation/status/ID',
    method: 'post',
    data: data,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

export function fetchAnnotationProgress(query) {
  return request({
    url: '/process-manage/annotation/datasets/ID/progress',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}
