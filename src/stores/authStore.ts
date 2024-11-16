import { defineStore } from 'pinia'
import { ref } from 'vue'
import Cookies from 'js-cookie'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const axios: any = useNuxtApp().$axios
  const user = ref(null)
  const isAuthenticated = ref(false)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const router = useRouter()

  // Actions

  // Login function
  const login = async (email: string, password: string) => {
    try {
      loading.value = true

      const response = await axios.post('/auth/login', { email, password })

      user.value = response.data.user
      isAuthenticated.value = true
      loading.value = false

      // Save token in cookies
      Cookies.set('token', response.data.token) // token expires in 7 days

      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed'
      loading.value = false
      return err.response
    }
  }

  // Register function
  const register = async (name: string, email: string, password: string) => {
    loading.value = true
    try {
      const response = await axios.post('/auth/register', {
        name,
        email,
        password
      })

      user.value = response.data.user
      isAuthenticated.value = true
      loading.value = false

      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Registration failed'
      loading.value = false

      return err.response
    }
  }

  // Logout function
  const logout = async () => {
    loading.value = true
    try {
      await axios.post('/auth/logout')

      // Clear user state and remove token
      user.value = null
      isAuthenticated.value = false
      Cookies.remove('token')
      loading.value = false

      // Redirect to login page
      router.push('/login')
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Logout failed'
      loading.value = false
    }
  }

  // GetMe function to fetch user information using the token from cookies
  const getMe = async () => {
    loading.value = true

    try {
      const token = Cookies.get('token')
      if (!token) {
        throw new Error('No token found')
      }

      const response = await axios.get('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      user.value = response.data
      isAuthenticated.value = true
      loading.value = false
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch user data'
      loading.value = false
      isAuthenticated.value = false
    }
  }

  // Getters
  const getUser = () => user.value
  const getIsAuthenticated = () => isAuthenticated.value
  const getLoading = () => loading.value
  const getError = () => error.value

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    getMe,
    getUser,
    getIsAuthenticated,
    getLoading,
    getError
  }
})
