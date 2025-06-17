<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  import { useToast } from 'primevue/usetoast'
  import axios from 'axios'
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

  const togglePasswordVisibility = () => {
    isPasswordVisible.value = !isPasswordVisible.value
  }

  const toggleForm = () => {
    isLogin.value = !isLogin.value
    username.value = ''
    email.value = ''
    password.value = ''
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
      const resp = await axios.post('http://localhost:3000/api/users/login', {
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

    // 簡單的密碼強度檢查
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
      const resp = await axios.post(
        'http://localhost:3000/api/users/register',
        {
          username: username.value,
          email: email.value,
          password: password.value,
        }
      )

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

        <div class="mb-6">
          <Button
            :label="isLogin ? '登入' : '建立帳戶'"
            class="w-full"
            type="submit"
          />
        </div>
      </form>

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
