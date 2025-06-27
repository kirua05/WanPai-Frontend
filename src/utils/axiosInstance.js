import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
})

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      handleLogout()
    }

    return Promise.reject(error)
  }
)

const handleLogout = () => {
  try {
    const authStore = useAuthStore()
    authStore.logout()

    if (authStore.showToast) {
      authStore.showToast.add({
        severity: 'warn',
        summary: '登入已過期',
        detail: '請重新登入以繼續使用',
        life: 3000,
      })
    }

    setTimeout(() => {
      window.location.href = '/authform'
    }, 1500)
  } catch (error) {
    window.location.href = '/authform'
  }
}

export default instance
export { handleLogout }
