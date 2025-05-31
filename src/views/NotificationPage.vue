<script setup>
import { ref, computed, watch } from 'vue'
import Divider from 'primevue/divider'

const categories = ref([
  { label: '訂單訊息', type: 'order' },
  { label: '帳戶訊息', type: 'account' },
  { label: '優惠相關', type: 'promo' },
])

const selectedCategory = ref(null)

const notifications = ref([
  {
    type: 'order',
    time: '2024-09-16 10:04',
    username: '會員名稱',
    message: '您好，感謝您購買本站商品，商品訂單已成立',
    orderId: '2024090801004604613',
    read: false,
    expanded: false,
  },
  {
    type: 'promo',
    time: '2024-09-01 08:20',
    username: '系統訊息',
    message: '限時優惠 88 折，立即搶購！',
    orderId: '',
    read: true,
    expanded: false,
  },
])

watch(selectedCategory, (newType) => {
  notifications.value.forEach((n) => {
    if (n.type === newType) {
      n.expanded = true
      n.read = true
    }
  })
})

const filteredNotifications = computed(() =>
  notifications.value.filter((n) => n.type === selectedCategory.value),
)

const currentLabel = computed(
  () => categories.value.find((c) => c.type === selectedCategory.value)?.label || '',
)

function toggleExpanded(item) {
  item.expanded = !item.expanded
  if (!item.read) {
    item.read = true
  }
}

function hasUnread(type) {
  return notifications.value.some((n) => n.type === type && !n.read)
}
</script>

<template>
  <div class="p-6 font-sans">
    <h2 class="text-2xl font-bold mb-6 ml-8">我的通知</h2>

    <div class="flex gap-6">
      <!-- 左側分類 -->
      <aside class="w-40">
        <ul class="list-none p-0 m-0">
          <li
            v-for="(item, index) in categories"
            :key="index"
            @click="selectedCategory = item.type"
            :class="[
              'bg-gray-200 p-3 mb-2 cursor-pointer text-center rounded relative',
              selectedCategory === item.type ? 'bg-gray-800 text-white' : '',
            ]"
          >
            {{ item.label }}
            <span
              v-if="hasUnread(item.type)"
              class="inline-block w-2 h-2 bg-red-600 rounded-full ml-1.5 transition-opacity"
            ></span>
          </li>
        </ul>
      </aside>

      <section class="flex-1 flex items-center justify-center">
        <div v-if="!selectedCategory" class="text-center">
          <span
            class="pi pi-inbox text-9xl text-gray-400 mb-6 block mx-auto"
            aria-hidden="true"
          ></span>

          <h3 class="text-xl font-semibold mb-2">歡迎來到通知中心</h3>
          <p class="text-gray-500">請從左邊的列表選擇想查看的通知類型</p>
        </div>

        <div v-else class="w-full">
          <div class="flex justify-between items-center text-gray-500 text-sm px-6">
            <span>{{ currentLabel }}</span>
            <span>共 {{ filteredNotifications.length }} 條</span>
          </div>

          <Divider class="my-2" />

          <div v-if="filteredNotifications.length === 0" class="text-center py-10 text-gray-500">
            沒有新通知
          </div>

          <div
            v-else
            v-for="(item, index) in filteredNotifications"
            :key="index"
            @click="toggleExpanded(item)"
            class="px-6 py-2 cursor-pointer"
          >
            <p class="text-sm text-gray-600 flex items-center gap-1.5 mb-1.5">
              {{ item.time }}
              <span v-if="!item.read" class="pi pi-circle-fill text-xs text-red-600"></span>
            </p>

            <div v-if="item.expanded">
              <p class="text-base mb-1">
                <strong class="text-red-600 font-bold">{{ item.username }}</strong>
                {{ item.message }}
              </p>
              <p class="text-sm text-gray-700">訂單編號：{{ item.orderId }}</p>
            </div>

            <Divider v-if="index < filteredNotifications.length - 1" class="my-3" />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
