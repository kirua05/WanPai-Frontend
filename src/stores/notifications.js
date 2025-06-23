import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from '@/utils/axiosInstance'

export const useNotificationStore = defineStore('notifications', () => {
  const list = ref([])

  const totalUnread = computed(() => list.value.filter((n) => !n.read).length)

  function mapType(type) {
    if (
      type === 'order_created' ||
      type === 'order_shipped' ||
      type === 'order_delivered'
    )
      return 'order'
    if (type === 'account') return 'account'
    return 'other'
  }

  async function fetch() {
    const { data } = await axios.get('/notifications')

    list.value = data.map((item) => ({
      ...item,
      type: mapType(item.type),
      time: item.createdAt ? new Date(item.createdAt).toLocaleString() : '',
      username: item.username || '系統訊息',
      message: item.message,
      orderId: item.orderId ? String(item.orderId) : '',
      read: item.read ?? false,
      expanded: false,
    }))
  }

  return { list, totalUnread, fetch }
})
