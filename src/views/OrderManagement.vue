<script setup>
  import { ref, computed } from 'vue'
  import InputText from 'primevue/inputtext'
  import Select from 'primevue/select'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import Button from 'primevue/button'

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

  const orders = ref([
    {
      id: 'A123',
      date: '2025-05-26',
      status: '待出貨',
      items: [
        {
          name: '皮卡丘',
          quantity: 2,
          price: 300,
          image: 'product-bamboo-watch.jpg',
        },
        {
          name: '吉伊卡哇',
          quantity: 3,
          price: 120,
          image: 'product-black-watch.jpg',
        },
      ],
    },
    {
      id: 'B456',
      date: '2025-05-20',
      status: '已完成',
      items: [
        {
          name: '模型人偶',
          quantity: 1,
          price: 1560,
          image: 'product-bolt-shirt.jpg',
        },
        {
          name: '扭蛋組合',
          quantity: 2,
          price: 500,
          image: 'product-fitness-watch.jpg',
        },
      ],
    },
    {
      id: 'C568',
      date: '2025-02-20',
      status: '已完成',
      total: 2560,
      items: [
        { name: '哥吉拉', quantity: 1, price: 5660, image: '' },
        { name: '盲盒', quantity: 2, price: 500, image: '' },
      ],
    },
  ])

  const ordersWithTotal = computed(() => {
    return orders.value.map((order) => {
      const total = order.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
      return { ...order, total }
    })
  })

  const filteredOrders = computed(() => {
    const today = new Date()
    return ordersWithTotal.value.filter((order) => {
      const matchId = order.id.includes(searchOrderId.value)
      let matchDate = true

      if (selectedDateRange.value) {
        const orderDate = new Date(order.date)
        const diffTime = today - orderDate
        const diffDays = diffTime / (1000 * 60 * 60 * 24)
        matchDate = diffDays <= parseInt(selectedDateRange.value)
      }

      return matchId && matchDate
    })
  })

  function goToDetail() {
    // TODO: implement detail page navigation when order detail view is ready
    // router.push(`/order/${id}`);
  }
</script>

<template>
  <div class="p-8 max-w-screen-xl mx-auto">
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
</template>
