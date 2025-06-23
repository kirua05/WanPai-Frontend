<script setup>
  import { ref, computed, onMounted, watch } from 'vue'
  import InputText from 'primevue/inputtext'
  import Select from 'primevue/select'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import Button from 'primevue/button'
  import { useRouter } from 'vue-router'
  import { fetchOrders } from '@/api/order'
  import { calculateOrdersWithTotal } from '@/api/order'
  import { useAuthStore } from '@/stores/auth'

  const authStore = useAuthStore()
  const router = useRouter()
  const searchOrderId = ref('')
  const selectedDateRange = ref('')
  const expandedRows = ref([])
  const errorMsg = ref('')

  const dateOptions = [
    { label: '全部時間', value: '' },
    { label: '一週內', value: '7' },
    { label: '一個月內', value: '30' },
    { label: '三個月內', value: '90' },
    { label: '半年內', value: '180' },
    { label: '一年內', value: '365' },
  ]

  const orders = ref([])

  async function fetchOrdersAndSet() {
    try {
      const filters = {}
      if (searchOrderId.value) filters.orderNumber = searchOrderId.value
      if (selectedDateRange.value) filters.dateRange = selectedDateRange.value
      orders.value = await fetchOrders(filters)
      errorMsg.value = ''
    } catch {
      errorMsg.value = '無法取得訂單資料，請稍後再試。'
      orders.value = []
    }
  }

  onMounted(fetchOrdersAndSet)
  watch([searchOrderId, selectedDateRange], fetchOrdersAndSet)

  const ordersWithTotal = computed(() => calculateOrdersWithTotal(orders.value))

  const filteredOrders = computed(() => {
    if (!selectedDateRange.value) return ordersWithTotal.value

    const today = new Date()
    return ordersWithTotal.value.filter((order) => {
      const orderDate = new Date(order.date)
      if (isNaN(orderDate)) return false

      const diffTime = today - orderDate
      const diffDays = diffTime / (1000 * 60 * 60 * 24)
      return diffDays <= parseInt(selectedDateRange.value)
    })
  })

  function goToDetail(id) {
    if (!id || isNaN(Number(id))) {
      return
    }
    router.push(`/orderdetail/${id}`)
  }
</script>

<template>
  <div v-if="authStore.isLoggedIn" class="p-8 max-w-6xl mx-auto items-center">
    <div class="mb-6 flex md:flex-row md:items-end gap-4 justify-end">
      <div class="flex flex-col w-full md:w-[260px]">
        <label for="orderId" class="text-sm mb-1">訂單搜尋</label>
        <InputText
          id="orderId"
          v-model="searchOrderId"
          placeholder="輸入訂單編號"
          class="w-full"
        />
      </div>

      <div class="flex flex-col w-full md:w-[260px]">
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

    <div v-if="errorMsg" class="mb-4 px-4 py-2 text-red-700 rounded border">
      {{ errorMsg }}
    </div>

    <h2 class="text-2xl mb-6">我的訂單</h2>

    <div
      class="rounded-xl shadow border border-gray-200 overflow-hidden w-full max-w-6xl mx-auto"
    >
      <DataTable
        v-model:expandedRows="expandedRows"
        :value="filteredOrders"
        dataKey="id"
        expandableRows
        tableStyle="width: 100%"
        :pt="{ bodyRow: { class: 'h-8' } }"
      >
        <Column expander />
        <Column field="orderNumber" header="訂單編號" style="width: 300px" />
        <Column field="date" header="訂購日期" style="width: 300px" />
        <Column field="status" header="狀態" style="width: 240px" />
        <Column
          field="total"
          header="總金額"
          style="width: 260px"
          :pt="{
            bodyCell: { class: 'text-center ' },
            headerCell: { class: 'text-center ' },
          }"
        />
        <Column header="" style="width: 200px">
          <template #body="slotProps">
            <div class="flex justify-start py-1">
              <Button
                label="查看訂單"
                icon="pi pi-search"
                class="text-xs py-1 rounded shadow"
                @click="goToDetail(slotProps.data.id)"
              />
            </div>
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
