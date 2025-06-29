<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import Divider from 'primevue/divider'
import axios from '@/utils/axiosInstance'
import { useNotificationStore } from '@/stores/notifications'

const notificationStore = useNotificationStore()
const notifications = computed(() => notificationStore.list)
const categories = ref([
  { label: '訂單訊息', type: 'order' },
  { label: '帳戶訊息', type: 'account' },
])

const selectedCategory = ref(null)
const loading = ref(false)
const error = ref('')
const token = localStorage.getItem('token')

onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    await notificationStore.fetch()
  } catch {
    error.value = '通知載入失敗，請稍後再試'
  } finally {
    loading.value = false
  }
})

watch(selectedCategory, (newType) => {
  notifications.value.forEach((n) => {
    if (n.type === newType) {
      n.expanded = true
    }
  })
})

const filteredNotifications = computed(() =>
  notifications.value.filter((n) => n.type === selectedCategory.value)
)

const currentLabel = computed(
  () =>
    categories.value.find((c) => c.type === selectedCategory.value)?.label ||
    ''
)

async function toggleExpanded(item) {
  item.expanded = !item.expanded
  if (!item.read) {
    try {
      await axios.patch(
        `/notifications/${item.id}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      item.read = true
    } catch {
      // 忽略錯誤
    }
  }
}

function hasUnread(type) {
  return notifications.value.some((n) => n.type === type && !n.read)
}
</script>

<template>
  <div class="p-6 font-sans bg-white dark:bg-white text-black dark:text-black min-h-screen">
    <h2 class="text-2xl font-bold mb-6 ml-4 sm:ml-8">我的通知</h2>
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Sidebar -->
      <aside class="w-full md:w-40 mb-4 md:mb-0">
        <ul class="list-none p-0 m-0">
          <li v-for="(item, index) in categories" :key="index" @click="selectedCategory = item.type" :class="[
            'p-3 mb-2 cursor-pointer text-center rounded relative transition',
            selectedCategory === item.type
              ? 'bg-gray-800 text-white dark:bg-gray-100 dark:text-gray-900'
              : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-100'
          ]">
            {{ item.label }}
            <span v-if="hasUnread(item.type)"
              class="inline-block w-2 h-2 bg-red-600 rounded-full ml-1.5 transition-opacity"></span>
          </li>
        </ul>
      </aside>

      <!-- Content -->
      <section class="flex-1 flex items-center justify-center">
        <div v-if="loading" class="text-center text-gray-500 dark:text-gray-300 py-10">
          載入中...
        </div>

        <div v-else-if="error" class="text-center text-red-500 py-10">
          {{ error }}
        </div>

        <div v-else-if="!selectedCategory" class="text-center">
          <span class="pi pi-inbox text-9xl text-gray-400 dark:text-gray-500 mb-6 block mx-auto"
            aria-hidden="true"></span>
          <h3 class="text-xl font-semibold mb-2">歡迎來到通知中心</h3>
          <p class="text-gray-500 dark:text-gray-300">
            請從左邊的列表選擇想查看的通知類型
          </p>
        </div>

        <div v-else class="w-full">
          <div class="flex justify-between items-center text-gray-500 dark:text-gray-300 text-sm px-6">
            <span>{{ currentLabel }}</span>
            <span>共 {{ filteredNotifications.length }} 條</span>
          </div>
          <Divider class="my-2" />

          <div v-if="filteredNotifications.length === 0" class="text-center py-10 text-gray-500 dark:text-gray-300">
            沒有新通知
          </div>

          <div v-else v-for="(item, index) in filteredNotifications" :key="index" @click="toggleExpanded(item)"
            class="px-6 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition">
            <p class="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1.5 mb-1.5">
              {{ item.time }}
              <span v-if="!item.read" class="inline-block w-2 h-2 align-middle bg-red-500 rounded-full ml-2"></span>
            </p>

            <div v-if="item.expanded">
              <p class="text-base mb-1">
                <strong class="text-red-600 dark:text-red-400 font-bold">
                  {{ item.username }}
                </strong>
                {{ item.message }}
              </p>
              <p v-if="item.orderId" class="text-sm text-gray-700 dark:text-gray-300">
                訂單編號：{{ item.orderId }}
              </p>
            </div>

            <Divider v-if="index < filteredNotifications.length - 1" class="my-3" />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
