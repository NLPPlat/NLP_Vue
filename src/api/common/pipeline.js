import request from '@/utils/request'
import store from '@/store'

// 管道列表获取
export function pipelinesFetch(query) {
  return request({
    url: '/common/pipeline/pipelines',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

// 某个人的算子列表获取
export function pipelinesForUserFetch(query) {
  return request({
    url: '/common/pipeline/pipelines',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}
