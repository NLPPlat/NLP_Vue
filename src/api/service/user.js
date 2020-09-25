import request from '@/utils/request'
import store from '@/store'

export function login(data) {
  return request({
    url: '/service/token',
    method: 'post',
    data
  })
}

export function register(data) {
  return request({
    url: '/service/user',
    method: 'post',
    data: data
  })
}

export function getInfo() {
  return request({
    url: '/service/user',
    method: 'get',
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}

export function logout() {
  console.log(store)
  return request({
    url: '/service/token',
    method: 'delete',
    headers: { 'Authorization': 'Bearer ' + store.state.user.token }
  })
}
