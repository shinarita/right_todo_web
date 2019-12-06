import axios from 'axios'
const BaseUrl = '/api/'

axios.interceptors.request.use(config => {
  config.headers['authorization'] = localStorage.getItem('token')
  return config
}, err => {
  return Promise.reject(err)
})

axios.interceptors.response.use(res => {
  return res
}, err => {
  return Promise.reject(err)
})

export const postRequest = (url, data) => {
  return axios({
    method: 'post',
    url: `${BaseUrl}${url}`,
    data
  })
}

export const putRequest = (url, data) => {
  return axios({
    method: 'put',
    url: `${BaseUrl}${url}`,
    data
  })
}

export const deleteRequest = (url) => {
  return axios({
    method: 'delete',
    url: `${BaseUrl}${url}`,
  })
}

export const getRequest = (url, params) => {
  let configUrl = `${BaseUrl}${url}`
  if (params) {

  }
  return axios({
    method: 'get',
    url: configUrl,
  })
}