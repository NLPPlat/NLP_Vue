import request from '@/utils/request'
import store from '@/store'

// 资源列表获取
export function resourcesFetch(query) {
  return request({
    url: '/data-manage/resource/resources',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}
