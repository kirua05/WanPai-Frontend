<script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { fetchOrderDetail, applyOrderReturn } from '@/api/order'
  import { useToast } from 'primevue/usetoast'
  import { useStatusMap } from '@/composables/useStatusMap'
  import Toast from 'primevue/toast'

  const { statusMap } = useStatusMap()
  const route = useRoute()
  const toast = useToast()
  const orderId = route.params.id

  const order = ref(null)
  const errorMsg = ref('')
  const isLoading = ref(true)

  onMounted(async () => {
    try {
      const data = await fetchOrderDetail(orderId)
      order.value = data
    } catch {
      errorMsg.value = '無法取得訂單資料'
    } finally {
      isLoading.value = false
    }
  })

  const formatDate = (dateString) => {
    if (!dateString) return '—'
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  const orderStatusText = computed(() =>
    order.value ? statusMap[order.value.status] || '未知狀態' : ''
  )

  const subtotal = computed(() => {
    if (!order.value || !order.value.items) return 0
    return order.value.items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    )
  })

  const steps = computed(() => {
    if (!order.value) return []

    return [
      {
        label: '下單完成',
        icon: new URL('@/assets/icons/one.svg', import.meta.url).href,
        date: formatDate(order.value.createdAt),
      },
      {
        label: '出貨中',
        icon: new URL('@/assets/icons/two.svg', import.meta.url).href,
        date: formatDate(order.value.shippedAt),
      },
      {
        label: '確認收貨',
        icon: new URL('@/assets/icons/three.svg', import.meta.url).href,
        date: formatDate(order.value.deliveredAt),
      },
    ]
  })

  async function applyReturn() {
    if (!order.value) return

    try {
      const returnData = {
        reason: '商品有瑕疵',
        description: '申請退貨',
      }

      await applyOrderReturn(orderId, returnData)

      order.value.returnStatus = '已申請'
      order.value.returnReason = returnData.reason

      toast.add({
        severity: 'success',
        summary: '申請成功',
        detail: '退貨申請已提交，請等待審核',
        life: 3000,
      })
    } catch {
      toast.add({
        severity: 'error',
        summary: '申請失敗',
        detail: '退貨申請提交失敗，請稍後再試',
        life: 3000,
      })
    }
  }
</script>

<template>
  <Toast />
  <div class="p-6 space-y-6 bg-white text-black min-h-screen">
    <div v-if="order">
      <div
        class="bg-gray-100 p-6 rounded shadow max-w-6xl mx-auto text-center mb-2"
      >
        <h2 class="text-lg font-bold mb-9">訂單進度</h2>
        <div class="flex justify-between items-center">
          <div
            v-for="(step, index) in steps"
            :key="step.label"
            class="flex flex-col items-center w-1/4 relative"
          >
            <div class="text-sm font-bold mb-2">{{ step.label }}</div>
            <img
              :src="step.icon"
              alt="step icon"
              class="w-8 h-8 min-w-[32px] min-h-[32px]"
            />
            <div class="text-xs text-gray-500 mt-1">{{ step.date }}</div>
            <template v-if="index < steps.length - 1">
              <div
                class="absolute right-[-12%] top-1/2 transform -translate-y-1/2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="w-5 h-5 text-gray-400"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </template>
          </div>
        </div>
      </div>

      <div class="bg-white rounded shadow p-4 max-w-6xl mx-auto space-y-2 mb-2">
        <h2 class="text-lg font-bold mb-2">訂單資訊</h2>
        <p>訂單編號：{{ order.orderNumber }}</p>
        <p>訂單狀態：{{ orderStatusText }}</p>
        <p>訂購日期：{{ formatDate(order.createdAt) }}</p>
      </div>

      <div class="bg-white rounded shadow p-4 max-w-6xl mx-auto space-y-2 mb-2">
        <h2 class="text-lg font-bold mb-2">取貨人資訊</h2>
        <p>取貨人姓名：{{ order.receiver.name }}</p>
        <p>聯絡方式：{{ order.receiver.phone }}</p>
        <p>地址：{{ order.receiver.address }}</p>
      </div>

      <div class="bg-white rounded shadow p-4 max-w-6xl mx-auto space-y-4 mb-2">
        <h2 class="text-lg font-bold mb-2">購買商品</h2>
        <ul>
          <li
            v-for="(item, index) in order.items"
            :key="index"
            class="flex items-center gap-4 pb-3"
          >
            <img
              :src="item.productImage"
              class="w-20 h-20 object-cover rounded border"
            />
            <div class="flex-1">
              <p class="font-medium">{{ item.name }}</p>
              <p class="text-sm text-gray-600">
                數量：{{ item.quantity }}，售價：{{ Number(item.price) }} 元
              </p>
            </div>
          </li>
        </ul>

        <div class="border-t pt-4 text-right space-y-2">
          <div class="p-3 flex justify-between items-center">
            <p class="text-sm text-gray-500 mt-2 text-left">
              * 如需更改訂單內容，請聯絡客服處理
            </p>
            <div class="text-right space-y-1">
              <p v-if="order.shippingFee" class="text-sm text-gray-600">
                運費：{{ order.shippingFee }} 元
              </p>
              <p class="text-lg font-bold">
                總金額：{{ subtotal + Number(order.shippingFee || 0) }} 元
              </p>
            </div>
          </div>

          <div
            v-if="(order.returnStatus ?? '未申請') !== '未申請'"
            class="mr-3"
          >
            <p class="font-semibold">退貨狀態：{{ order.returnStatus }}</p>
            <p v-if="order.returnReason">原因：{{ order.returnReason }}</p>
          </div>
          <div v-else>
            <button
              class="px-3 py-1 text-gray-500 rounded hover:bg-gray-100 transition"
              @click="applyReturn"
            >
              申請退貨
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="errorMsg" class="text-red-500 text-center">
      {{ errorMsg }}
    </div>
    <div v-if="isLoading" class="text-center text-gray-500">資料載入中...</div>
  </div>
</template>
