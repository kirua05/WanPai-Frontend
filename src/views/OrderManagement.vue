<script setup>
  import { ref, computed, onMounted, watch } from 'vue'
  import InputText from 'primevue/inputtext'
  import Select from 'primevue/select'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import Button from 'primevue/button'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  import 'primeicons/primeicons.css'
  import axios from 'axios'

  const authStore = useAuthStore()
  const router = useRouter()
  const searchOrderId = ref('')
  const selectedDateRange = ref('')
  const expandedRows = ref([])

  const dateOptions = [
    { label: '全部時間', value: '' },
    { label: '一週內', value: '7' },
    { label: '一個月內', value: '30' },
    { label: '三個月內', value: '90' },
    { label: '半年內', value: '180' },
    { label: '一年內', value: '365' },
  ]

  const orders = ref([])

  async function fetchOrders() {
    if (!authStore.isLoggedIn) return

    // 組成 filters
    const params = {}
    if (searchOrderId.value) params.id = searchOrderId.value
    if (selectedDateRange.value) params.dateRange = selectedDateRange.value

    // 根據 API 路徑調整
    try {
      const res = await axios.get('/api/orders', { params })
      orders.value = res.data
    } catch (err) {
      orders.value = []

      console.error('取得訂單失敗', err)
    }
  }

  // 監聽登入狀態
  onMounted(() => {
    if (authStore.isLoggedIn) fetchOrders()
  })

  watch(
    () => authStore.isLoggedIn,
    (newVal) => {
      if (newVal) fetchOrders()
      else orders.value = []
    }
  )

  // 監聽搜尋條件自動查詢
  watch([searchOrderId, selectedDateRange], fetchOrders)

  // 自動計算總金額
  const ordersWithTotal = computed(() => {
    return orders.value.map((order) => {
      const total = order.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
      return { ...order, total }
    })
  })

  function goToDetail(id) {
    router.push(`/orderdetail/${id}`)
  }
</script>

<template>
  <div v-if="authStore.isLoggedIn" class="p-8 max-w-screen-xl mx-auto">
    <div class="mb-6 flex md:flex-row md:items-end gap-4 justify-end ml-auto">
      <div class="flex flex-col w-full md:w-[230px]">
        <label for="orderId" class="text-sm mb-1">訂單搜尋</label>
        <InputText
          id="orderId"
          v-model="searchOrderId"
          placeholder="輸入訂單編號"
          class="w-full"
        />
      </div>

      <div class="flex flex-col w-full md:w-[230px]">
        <label for="dateRange" class="text-sm mb-1">日期</label>
        <Select
          id="dateRange"
          v-model="selectedDateRange"
          :options="dateOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="全部時間"
          class="w-full"
        />
      </div>
    </div>

    <h2 class="text-2xl mb-6">我的訂單</h2>
    <DataTable
      v-model:expandedRows="expandedRows"
      :value="filteredOrders"
      dataKey="id"
      expandableRows
      tableStyle="min-width: 60rem"
      :pt="{ bodyRow: { class: 'h-16' } }"
    >
      <Column expander style="width: 3rem" />
      <Column field="id" header="訂單編號" />
      <Column field="date" header="訂購日期" />
      <Column field="status" header="狀態" />
      <Column field="total" header="總金額" />
      <Column header="">
        <template #body="slotProps">
          <Button
            label="查看詳情"
            icon="pi pi-search"
            @click="goToDetail(slotProps.data.id)"
          />
        </template>
      </Column>

      <template #expansion="slotProps">
        <div class="p-4 bg-gray-50 rounded">
          <h3 class="font-semibold mb-2">商品明細</h3>
          <ul>
            <li
              v-for="item in slotProps.data.items"
              :key="item.name"
              class="flex items-center mb-2 gap-4"
            >
              <img
                :src="item.image"
                alt="product"
                class="w-16 h-16 rounded border"
              />
              <div class="flex-1">
                <div class="font-medium">{{ item.name }}</div>
                <div class="text-sm text-gray-600">
                  數量：{{ item.quantity }} ｜ 售價：{{ item.price }} 元
                </div>
              </div>
            </li>
          </ul>
        </div>
      </template>
    </DataTable>
  </div>
  <div v-else class="flex flex-col items-center justify-center py-24">
    <i
      class="pi pi-info-circle mb-4"
      style="font-size: 1.5rem; color: #4a5568"
    ></i>
    <p class="mb-6 text-xl font-semibold text-gray-700">
      請先登入會員才能查看訂單
    </p>
  </div>
</template>
