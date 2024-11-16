import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'
import Cookies from 'js-cookie'

export default defineNuxtPlugin((nuxtApp) => {
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      'Content-Type': 'application/json'
    } as AxiosRequestConfig['headers']
  })

  // Intercept requests and add Authorization header if token exists
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = Cookies.get('token')
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  nuxtApp.provide('axios', axiosInstance)
})
