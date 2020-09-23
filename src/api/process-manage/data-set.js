import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/process-manage/dataset/list',
    method: 'get'
    // params: query
  })
}

export function fetchDetail(query) {
  return request({
    url: '/process-manage/dataset/detail',
    method: 'get',
    params: query
  })
}
