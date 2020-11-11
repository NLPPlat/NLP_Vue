import request from '@/utils/request'
import store from '@/store'

// 管道列表获取
export function pipelinesFetch(query) {
  return request({
    url: '/data-manage/pipeline/pipelines',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

// 管道生成
export function pipelineUpload(data) {
  return request({
    url: '/data-manage/pipeline/pipelines',
    method: 'post',
    data: data,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}
