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
    phone: '',
    address: '',
  })
  const emailError = ref('')
  const phoneError = ref('')
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

  const isValidPhone = (phone) => {
    if (!phone || phone.trim() === '') return true
    const phoneRegex = /^(09\d{8})$/
    return phoneRegex.test(phone.replace(/[-\s]/g, ''))
  }

  async function onSave() {
    emailError.value = ''
    phoneError.value = ''
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

    if (!isValidPhone(editProfile.value.phone)) {
      phoneError.value = '手機號碼格式錯誤'
      toast.add({
        severity: 'error',
        summary: '格式錯誤',
        detail: '手機號碼格式錯誤，請輸入有效的手機號碼。',
        life: 4000,
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
      phoneError.value = ''
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
      } else if (error.response?.status === 409) {
        errorMessage = '此 Email 已被其他會員使用。'
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
    phoneError.value = ''
    toast.add({
      severity: 'info',
      summary: '已取消',
      detail: '編輯已取消，資料未儲存。',
      life: 2000,
    })
  }
</script>

<template>
  <div class="min-h-screen bg-surface-50">
    <div class="flex max-w-7xl mx-auto px-4 py-8 gap-12">
      <aside class="w-64">
        <div
          class="bg-surface-0 rounded-lg shadow-sm border border-surface-200 p-6"
        >
          <div class="mb-6 flex items-center gap-3">
            <div
              class="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center"
            >
              <i class="pi pi-user text-white"></i>
            </div>
            <span class="font-bold text-xl text-surface-900">我的帳戶</span>
          </div>
          <nav class="space-y-1">
            <RouterLink
              to="/profile"
              class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-md border-l-4 border-primary-600"
            >
              <i class="pi pi-user"></i>
              個人資料
            </RouterLink>
            <RouterLink
              to="/orders"
              class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-surface-600 hover:text-surface-900 hover:bg-surface-100 rounded-md transition-colors"
            >
              <i class="pi pi-shopping-cart"></i>
              訂單中心
            </RouterLink>
            <RouterLink
              to="/"
              class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-surface-600 hover:text-surface-900 hover:bg-surface-100 rounded-md transition-colors"
            >
              <i class="pi pi-heart"></i>
              收藏清單
            </RouterLink>
          </nav>
        </div>
      </aside>

      <section class="flex-1 max-w-2xl">
        <div
          class="bg-surface-0 rounded-lg shadow-sm border border-surface-200"
        >
          <div
            class="px-6 py-4 border-b border-surface-200 bg-gradient-to-r from-surface-50 to-surface-0"
          >
            <h2 class="text-2xl font-bold text-surface-900">個人資料</h2>
            <p class="text-sm text-surface-600 mt-1">
              管理您的帳戶資訊和偏好設定
            </p>
          </div>

          <div class="p-6">
            <div v-if="!isEdit" class="space-y-6">
              <div class="space-y-4">
                <div class="space-y-4 max-w-md">
                  <div>
                    <label
                      class="block text-sm font-medium text-surface-700 mb-2"
                    >
                      用戶名
                    </label>
                    <div
                      class="px-3 py-2 bg-surface-50 border border-surface-200 rounded-md"
                    >
                      {{ profile.username }}
                    </div>
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-surface-700 mb-2"
                    >
                      Email
                    </label>
                    <div
                      class="px-3 py-2 bg-surface-50 border border-surface-200 rounded-md"
                    >
                      {{ profile.email }}
                    </div>
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-surface-700 mb-2"
                    >
                      手機號碼
                    </label>
                    <div
                      class="px-3 py-2 bg-surface-50 border border-surface-200 rounded-md"
                    >
                      {{ profile.phone || '未設定' }}
                    </div>
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-surface-700 mb-2"
                    >
                      地址
                    </label>
                    <div
                      class="px-3 py-2 bg-surface-50 border border-surface-200 rounded-md"
                    >
                      {{ profile.address || '未設定' }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex justify-end pt-4 border-t border-surface-200">
                <button
                  class="inline-flex items-center px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                  @click="isEdit = true"
                >
                  <i class="pi pi-pencil mr-2"></i>
                  編輯資料
                </button>
              </div>
            </div>

            <form v-else @submit.prevent="onSave" class="space-y-6">
              <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div class="flex items-center">
                  <i
                    class="pi pi-exclamation-triangle text-yellow-600 mr-2"
                  ></i>
                  <span class="text-sm font-medium text-yellow-800">
                    編輯模式
                  </span>
                </div>
                <p class="text-sm text-yellow-700 mt-1">
                  請修改下方資訊，完成後點擊儲存。
                </p>
              </div>

              <div class="space-y-4">
                <div class="space-y-4 max-w-md">
                  <div>
                    <label
                      class="block text-sm font-medium text-surface-700 mb-2"
                    >
                      用戶名
                      <span class="text-red-500">*</span>
                    </label>
                    <InputText
                      v-model="editProfile.username"
                      class="w-full"
                      placeholder="請輸入用戶名"
                    />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-surface-700 mb-2"
                    >
                      Email
                      <span class="text-red-500">*</span>
                    </label>
                    <InputText
                      v-model="editProfile.email"
                      class="w-full"
                      :class="{ 'p-invalid': emailError }"
                      placeholder="請輸入電子郵件"
                    />
                    <p v-if="emailError" class="text-red-500 text-sm mt-1">
                      {{ emailError }}
                    </p>
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-surface-700 mb-2"
                    >
                      手機號碼
                    </label>
                    <InputText
                      v-model="editProfile.phone"
                      class="w-full"
                      :class="{ 'p-invalid': phoneError }"
                      placeholder="請輸入手機號碼（選填）"
                    />
                    <p v-if="phoneError" class="text-red-500 text-sm mt-1">
                      {{ phoneError }}
                    </p>
                    <p class="text-surface-500 text-xs mt-1">
                      格式：09xxxxxxxx
                    </p>
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-surface-700 mb-2"
                    >
                      地址
                    </label>
                    <InputText
                      v-model="editProfile.address"
                      class="w-full"
                      placeholder="請輸入地址（選填）"
                    />
                  </div>
                </div>
              </div>

              <div
                class="flex justify-end gap-4 pt-4 border-t border-surface-200"
              >
                <button
                  type="button"
                  class="inline-flex items-center px-6 py-3 bg-surface-100 hover:bg-surface-200 text-surface-700 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-surface-500 transition-colors"
                  @click="onCancel"
                >
                  <i class="pi pi-times mr-2"></i>
                  取消
                </button>
                <button
                  type="submit"
                  class="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                >
                  <i class="pi pi-check mr-2"></i>
                  儲存變更
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>

    <Toast />
  </div>
</template>
