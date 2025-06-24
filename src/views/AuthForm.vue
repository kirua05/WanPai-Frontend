<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'primevue/usetoast'
import axios from '@/utils/axiosInstance'
import Button from 'primevue/button'
import Toast from 'primevue/toast'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const isLogin = ref(true)
const username = ref('')
const email = ref('')
const password = ref('')
const isPasswordVisible = ref(false)

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  const token = urlParams.get('token')
  const error = urlParams.get('error')

  if (error) {
    let errorMessage = '登入失敗，請重試'
    if (error === 'email_required') {
      errorMessage = 'Google 帳號需要提供 email 權限'
    } else if (error === 'auth_failed') {
      errorMessage = 'Google 認證失敗'
    }

    toast.add({
      severity: 'error',
      summary: 'Google 登入失敗',
      detail: errorMessage,
      life: 4000,
    })

    window.history.replaceState({}, document.title, window.location.pathname)
    return
  }

  if (token) {
    try {
      const parts = token.split('.')
      if (parts.length !== 3) {
        throw new Error('Token 格式錯誤：不是有效的 JWT')
      }
      const payload = JSON.parse(atob(parts[1]))
      toast.add({
        severity: 'success',
        summary: 'Google 登入成功',
        detail: `歡迎回來，${payload.username}！`,
        life: 3000,
      })

      authStore.login(token, payload.role || 'user')
      localStorage.setItem('token', token)
      localStorage.setItem('role', payload.role || 'user')
      window.history.replaceState({}, document.title, window.location.pathname)

      setTimeout(() => {
        if (payload.role === 'admin') {
          router.push('/admin')
        } else {
          router.push('/')
        }
      }, 1000)

    } catch (error) {
      toast.add({
        severity: 'error',
        summary: '登入失敗',
        detail: `Token 解析錯誤: ${error.message}`,
        life: 3000,
      })
    }
  }
})

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}

const toggleForm = () => {
  isLogin.value = !isLogin.value
  username.value = ''
  email.value = ''
  password.value = ''
}

const handleGoogleLogin = () => {
    const backendUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'https://no5.zeabur.app'
    const googleAuthUrl = `${backendUrl}/api/users/google`
    window.location.href = googleAuthUrl
  } 

const login = async () => {
  if (!email.value || !password.value) {
    toast.add({
      severity: 'warn',
      summary: '輸入錯誤',
      detail: '請填寫所有欄位',
      life: 3000,
    })
    return
  }

  try {
    const resp = await axios.post('/users/login', {
      email: email.value,
      password: password.value,
    })

    if (resp.status === 200) {
      toast.add({
        severity: 'success',
        summary: '登入成功',
        detail: '正在跳轉到主頁面...',
        life: 3000,
      })

      authStore.login(resp.data.token, resp.data.role)
      localStorage.setItem('token', resp.data.token)
      localStorage.setItem('role', resp.data.role)

      setTimeout(() => {
        if (resp.data.role === 'admin') {
          router.push('/admin')
        } else {
          router.push('/')
        }
      }, 1000)
    }
  } catch (error) {
    if (error.response?.status === 401) {
      toast.add({
        severity: 'error',
        summary: '登入失敗',
        detail: 'Email 或密碼錯誤，請重新輸入',
        life: 4000,
      })
    } else if (error.response?.status === 400) {
      toast.add({
        severity: 'warn',
        summary: '輸入錯誤',
        detail: '請輸入正確的 Email 和密碼格式',
        life: 3000,
      })
    } else {
      toast.add({
        severity: 'error',
        summary: '系統錯誤',
        detail: '伺服器錯誤，請稍後再試',
        life: 5000,
      })
    }
  }
}

const register = async () => {
  if (!username.value || !email.value || !password.value) {
    toast.add({
      severity: 'warn',
      summary: '輸入錯誤',
      detail: '請填寫所有欄位',
      life: 3000,
    })
    return
  }

  if (password.value.length < 6) {
    toast.add({
      severity: 'warn',
      summary: '密碼太短',
      detail: '密碼至少需要 6 個字元',
      life: 3000,
    })
    return
  }

  try {
    const resp = await axios.post('/users/register', {
      username: username.value,
      email: email.value,
      password: password.value,
    })

    if (resp.status === 201) {
      toast.add({
        severity: 'success',
        summary: '註冊成功',
        detail: '帳戶建立成功，正在跳轉到登入頁面...',
        life: 3000,
      })

      setTimeout(() => {
        username.value = ''
        email.value = ''
        password.value = ''
        isLogin.value = true
      }, 2000)
    }
  } catch (error) {
    if (error.response?.status === 409) {
      toast.add({
        severity: 'error',
        summary: '註冊失敗',
        detail: '此 Email 已被註冊，請使用其他 Email',
        life: 4000,
      })
    } else if (error.response?.status === 400) {
      toast.add({
        severity: 'warn',
        summary: '輸入錯誤',
        detail: '請檢查輸入的資料格式是否正確',
        life: 3000,
      })
    } else {
      toast.add({
        severity: 'error',
        summary: '註冊失敗',
        detail: '系統錯誤，請稍後再試',
        life: 5000,
      })
    }
  }
}

const onSubmit = () => {
  if (isLogin.value) {
    login()
  } else {
    register()
  }
}
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <Toast />
    <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-lg mt-[-100px]">
      <h2 class="text-center text-2xl font-semibold mb-6">
        {{ isLogin ? '登入' : '註冊' }}
      </h2>

      <form @submit.prevent="onSubmit">
        <div v-if="!isLogin" class="mb-4">
          <label for="username" class="block text-sm font-medium text-gray-700">
            用戶名
          </label>
          <input
            type="text"
            id="username"
            v-model="username"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="請輸入用戶名"
            required
          />
        </div>

        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">
            電子郵件
          </label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="請輸入電子郵件"
            required
          />
        </div>

        <div class="mb-4 relative">
          <label for="password" class="block text-sm font-medium text-gray-700">
            密碼
          </label>
          <input
            :type="isPasswordVisible ? 'text' : 'password'"
            v-model="password"
            id="password"
            class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="請輸入密碼"
            required
          />
          <button
            type="button"
            @click="togglePasswordVisibility"
            class="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
          >
            <i v-if="isPasswordVisible" class="pi pi-eye-slash"></i>
            <i v-else class="pi pi-eye"></i>
          </button>
        </div>

        <div class="mb-4">
          <Button
            :label="isLogin ? '登入' : '建立帳戶'"
            class="w-full"
            type="submit"
          />
        </div>
      </form>

      <div v-if="isLogin" class="mb-6">
        <div class="relative mb-4">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">或</span>
          </div>
        </div>

        <Button
        class="w-full flex items-center justify-center gap-3 google-classic !bg-white !text-gray-700 !border-gray-300 hover:!bg-gray-50 hover:!shadow-md !transition-all !duration-200 !rounded-lg !py-3 !px-4 !font-medium"
        @click="handleGoogleLogin">
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        使用 Google 帳號登入
</Button>
      </div>

      <div class="text-center">
        <p class="text-sm text-gray-600">
          {{ isLogin ? '還沒有帳戶？' : '已經有帳戶？' }}
          <button
            @click="toggleForm"
            class="text-blue-600 hover:underline ml-1"
          >
            {{ isLogin ? '註冊' : '登入' }}
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
