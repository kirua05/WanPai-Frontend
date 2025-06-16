<script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import InputText from 'primevue/inputtext'
  import { useToast } from 'primevue/usetoast'
  import Toast from 'primevue/toast'

  const isEdit = ref(false)
  const profile = ref({
    username: '',
    email: '',
  })
  const emailError = ref('')
  const toast = useToast()
  const editProfile = ref({ ...profile.value })

  onMounted(async () => {
    try {
      const response = await axios.get(
        'http://localhost:3000/api/users/profile',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      profile.value = response.data
      editProfile.value = { ...profile.value }
    } catch {
      toast.add({
        severity: 'error',
        summary: '載入失敗',
        detail: '無法取得用戶資料，請重新整理頁面。',
        life: 5000,
      })
    }
  })

  const isValidEmail = (email) => {
    if (!email || email.trim() === '') return false
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return regex.test(email.trim())
  }

  async function onSave() {
    if (!isValidEmail(editProfile.value.email)) {
      emailError.value = 'Email 格式錯誤'
      toast.add({
        severity: 'error',
        summary: '格式錯誤',
        detail: 'Email 格式錯誤，請輸入有效的電子郵件地址。',
        life: 4000,
      })
      return
    }

    if (
      !editProfile.value.username ||
      editProfile.value.username.trim() === ''
    ) {
      toast.add({
        severity: 'warn',
        summary: '欄位必填',
        detail: '用戶名不能為空。',
        life: 3000,
      })
      return
    }

    try {
      await axios.put(
        'http://localhost:3000/api/users/profile',
        editProfile.value,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      )

      profile.value = { ...editProfile.value }
      isEdit.value = false
      emailError.value = ''
      toast.add({
        severity: 'success',
        summary: '更新成功',
        detail: '個人資料已成功更新！',
        life: 3000,
      })
    } catch (error) {
      let errorMessage = '更新資料失敗，請稍後再試。'
      if (error.response?.status === 401) {
        errorMessage = '登入已過期，請重新登入。'
      } else if (error.response?.status === 400) {
        errorMessage = '資料格式錯誤，請檢查輸入內容。'
      }

      toast.add({
        severity: 'error',
        summary: '更新失敗',
        detail: errorMessage,
        life: 5000,
      })
    }
  }

  function onCancel() {
    editProfile.value = { ...profile.value }
    isEdit.value = false
    emailError.value = ''
    toast.add({
      severity: 'info',
      summary: '已取消',
      detail: '編輯已取消，資料未儲存。',
      life: 2000,
    })
  }
</script>

<template>
  <div class="flex max-w-7xl ml-30 mr-16 mt-10 gap-5">
    <aside class="w-50">
      <div class="mb-10 flex items-center gap-2">
        <span class="font-bold text-xl">我的帳戶</span>
      </div>
      <ul class="space-y-2 text-gray-600">
        <li class="font-bold text-red-600">
          <RouterLink
            to="/profile"
            class="block py-2 px-3 hover:bg-gray-100 rounded"
          >
            個人資料
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/orders"
            class="block py-2 px-3 hover:bg-gray-100 rounded"
          >
            訂單中心
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/" class="block py-2 px-3 hover:bg-gray-100 rounded">
            收藏清單
          </RouterLink>
        </li>
      </ul>
    </aside>

    <section class="flex-1 pl-4">
      <h2 class="text-2xl font-bold mt-2 mb-4">個人資料</h2>
      <hr class="mb-8 border-gray-300 opacity-300" />
      <div v-if="!isEdit" class="space-y-8">
        <div class="grid grid-cols-[180px_1fr] gap-y-4 text-gray-700 max-w-xl">
          <div class="py-2">用戶名</div>
          <div class="py-2">{{ profile.username }}</div>
          <div class="py-2">Email</div>
          <div class="py-2">{{ profile.email }}</div>
        </div>
        <button
          class="mt-6 px-10 py-2 bg-black text-white font-bold rounded hover:bg-gray-800 transition"
          @click="isEdit = true"
        >
          編輯
        </button>
      </div>

      <form v-else @submit.prevent="onSave" class="space-y-4">
        <div class="grid grid-cols-2 gap-x-10 gap-y-4">
          <div>
            <label class="block mb-1">用戶名</label>
            <InputText
              v-model="editProfile.username"
              class="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label class="block mb-1">Email</label>
            <InputText
              v-model="editProfile.email"
              class="w-full border rounded px-3 py-2"
            />
          </div>
        </div>
        <div class="flex gap-4 mt-6">
          <button
            type="button"
            class="px-10 py-2 border border-black font-bold rounded hover:bg-gray-100 transition"
            @click="onCancel"
          >
            取消
          </button>
          <button
            type="submit"
            class="px-10 py-2 bg-black text-white font-bold rounded hover:bg-gray-800 transition"
          >
            儲存
          </button>
        </div>
      </form>
    </section>

    <Toast />
  </div>
</template>
