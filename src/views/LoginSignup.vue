<script setup>
  import { ref } from 'vue'
  import Button from 'primevue/button'

  const isLogin = ref(true)
  const username = ref('')
  const email = ref('')
  const password = ref('')
  const errorMessage = ref('')
  const isPasswordVisible = ref(false)

  const togglePasswordVisibility = () => {
    isPasswordVisible.value = !isPasswordVisible.value
  }

  const toggleForm = () => {
    isLogin.value = !isLogin.value
  }

  const onSubmit = () => {
    errorMessage.value = ''

    if (isLogin.value) {
      if (!email.value || !password.value) {
        errorMessage.value = '請填寫所有欄位'
        return
      }
    } else {
      if (!username.value || !email.value || !password.value) {
        errorMessage.value = '請填寫所有欄位'
        return
      }
    }
  }
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-lg mt-[-100px]">
      <h2 class="text-center text-2xl font-semibold mb-6">
        {{ isLogin ? '登入' : '註冊' }}
      </h2>

      <div v-if="errorMessage" class="text-red-600 text-center mb-4">
        <p>{{ errorMessage }}</p>
      </div>

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
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="請輸入密碼"
            required
          />
          <button
            type="button"
            @click="togglePasswordVisibility"
            class="absolute right-2 top-1/2 transform -translate-y"
          >
            <i
              v-if="isPasswordVisible"
              class="pi pi-eye-slash text-gray-500"
            ></i>
            <i v-else class="pi pi-eye text-gray-500"></i>
          </button>
        </div>

        <div class="mb-6">
          <Button v-if="isLogin" label="登入" class="w-full" type="submit" />
        </div>
        <div class="mb-6">
          <Button
            v-if="!isLogin"
            label="建立帳戶"
            class="w-full"
            type="submit"
          />
        </div>
      </form>
      <div class="text-center">
        <p class="text-sm text-gray-600">
          {{ isLogin ? '還沒有帳戶？' : '已經有帳戶？' }}
          <button @click="toggleForm" class="text-blue-600 hover:underline">
            {{ isLogin ? '註冊' : '登入' }}
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .password-input {
    position: relative;
  }
</style>
