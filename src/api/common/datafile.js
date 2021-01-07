import request from '@/utils/request'
import store from '@/store'

// 某个数据文件信息更新
export function datafileInfoUpdate(data) {
  return request({
    url: '/common/datafile/datafiles/ID',
    method: 'put',
    data: data,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}
