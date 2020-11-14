import request from '@/utils/request'
import store from '@/store'

// 某个人的资源列表获取
export function resourcesForUserFetch(query) {
  return request({
    url: '/common/resource/resources',
    method: 'get',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}
