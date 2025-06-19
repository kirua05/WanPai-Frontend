import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    token: null,
    role: null,
    showToast: null,
  }),

  getters: {
    isAdmin: (state) => state.role === 'admin',
    isUser: (state) => state.role === 'user',
    userRole: (state) => state.role,
  },

  actions: {
    setToastHandler(toastFn) {
      this.showToast = toastFn
    },

    initAuth() {
      const token = localStorage.getItem('token')
      const role = localStorage.getItem('role')
      this.token = token
      this.role = role
      this.isLoggedIn = token !== null
    },

    login(token, role = null) {
      localStorage.setItem('token', token)
      if (role) {
        localStorage.setItem('role', role)
      }
      this.token = token
      this.role = role
      this.isLoggedIn = true
    },

    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      this.token = null
      this.role = null
      this.isLoggedIn = false
    },
  },
})
