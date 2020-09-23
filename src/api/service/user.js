import request from '@/utils/request'

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

export function getInfo(token) {
  return request({
    url: '/service/user',
    method: 'get',
    headers: { 'Authorization': 'Bearer ' + token }
  })
}

export function logout() {
  return request({
    url: '/service/token',
    method: 'delete'
  })
}
