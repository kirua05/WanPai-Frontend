<script setup>
  import axios from '@/utils/axiosInstance'
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const orderId = route.params.id

  const order = ref(null)
  const errorMsg = ref('')
  const isLoading = ref(true)

  onMounted(async () => {
    try {
      const res = await axios.get(`/orders/${orderId}`)
      order.value = res.data
    } catch {
      errorMsg.value = '無法取得訂單資料'
    } finally {
      isLoading.value = false
    }
  })

  const steps = [
    {
      label: '下單完成',
      icon: new URL('@/assets/icons/one.svg', import.meta.url).href,
      date: '2025-05-26',
    },
    {
      label: '出貨中',
      icon: new URL('@/assets/icons/two.svg', import.meta.url).href,
      date: '2025-05-27',
    },
    {
      label: '確認收貨',
      icon: new URL('@/assets/icons/three.svg', import.meta.url).href,
      date: '2025-05-29',
    },
    {
      label: '評價完成',
      icon: new URL('@/assets/icons/four.svg', import.meta.url).href,
      date: '—',
    },
  ]

  function applyReturn() {
    if (!order.value) return
    order.value.returnStatus = '已申請'
    order.value.returnReason = '商品有瑕疵'
  }
</script>

<template>
  <div class="p-6 space-y-6 bg-white text-black min-h-screen">
    <div v-if="order">
      <div class="bg-gray-100 p-6 rounded shadow max-w-6xl mx-auto text-center">
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

      <div class="bg-white rounded shadow p-4 max-w-6xl mx-auto space-y-2">
        <h2 class="text-lg font-bold mb-2">訂單資訊</h2>
        <p>訂單編號：{{ order.id }}</p>
        <p>訂單狀態：{{ order.status }}</p>
        <p>下單日期：{{ order.date }}</p>
      </div>

      <div class="bg-white rounded shadow p-4 max-w-6xl mx-auto space-y-2">
        <h2 class="text-lg font-bold mb-2">取貨人資訊</h2>
        <p>取貨人姓名：{{ order.receiver.name }}</p>
        <p>聯絡方式：{{ order.receiver.phone }}</p>
        <p>地址：{{ order.receiver.address }}</p>
      </div>

      <div class="bg-white rounded shadow p-4 max-w-6xl mx-auto space-y-4">
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
                數量：{{ item.quantity }}，售價：{{ item.price }} 元
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
                總金額：{{ (order.total || 0) + (order.shippingFee || 0) }} 元
              </p>
            </div>
          </div>

          <div v-if="order.returnStatus !== '未申請'" class="mr-3">
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
    <div v-if="isloading" class="text-center text-gray-500">資料載入中...</div>
  </div>
</template>
