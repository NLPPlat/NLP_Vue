import request from '@/utils/request'
import store from '@/store'

// 某个数据集某条向量更改
export function editDataVector(query) {
  return request({
    url: '/process-manage/dataset/datasets/ID/vectors/ID',
    method: 'put',
    params: query,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

// 数据集拆分
export function dataCut(data) {
  return request({
    url: '/process-manage/dataset/datasets/ID/vectors',
    method: 'patch',
    data: data,
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}
