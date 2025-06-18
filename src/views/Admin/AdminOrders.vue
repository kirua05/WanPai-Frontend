<script setup>
  import { ref } from 'vue'
  import { fetchAllOrders } from '@/api/order'
  import { onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import CommonTable from '@/components/CommonTable.vue'
  const router = useRouter()
  const orderTabs = ref([
    { title: '全部', value: 'all' },
    { title: '已付款', value: 'paid' },
    { title: '已出貨', value: 'shipped' },
    { title: '已完成', value: 'completed' },
    { title: '已取消', value: 'cancelled' },
  ])
  const orderColumns = ref([
    {
      field: 'orderNumber',
      header: '訂單編號',
      style: 'width: 12.5%',
      sortable: true,
    },
    { field: 'date', header: '日期', style: 'width: 12.5%', sortable: true },
    {
      field: 'customer',
      header: '顧客',
      style: 'width: 12.5%',
      sortable: false,
    },
    {
      field: 'payment',
      header: '付款狀態',
      style: 'width: 12.5%',
      sortable: true,
    },
    {
      field: 'status',
      header: '訂單狀態',
      style: 'width: 12.5%',
      sortable: true,
    },
    { field: 'total', header: '總金額', style: 'width: 12.5%', sortable: true },
    {
      field: 'quantity',
      header: '數量',
      style: 'width: 12.5%',
      sortable: true,
    },
  ])

  const orderValue = ref([])
  onMounted(async () => {
    const res = await fetchAllOrders()
    orderValue.value = res
  })
</script>

<template>
  <div class="flex justify-between items-center mr-8 mb-4">
    <h2 class="text-2xl">訂單</h2>
    <div class="card flex justify-center">
      <button
        class="text-md text-white px-3 py-2 border-surface-200 rounded-md bg-primary cursor-pointer"
      >
        新增訂單
      </button>
    </div>
  </div>
  <div class="mr-8">
    <CommonTable
      :tabs="orderTabs"
      :columns="orderColumns"
      :value="orderValue"
      scrollable
      selectable
      scroll-height="500px"
    >
      <template #body-orderNumber="{ data }">
        <a
          class="w-full underline text-primary cursor-pointer"
          @click="
            router.push({
              path: `/admin/orders/edit`,
            })
          "
        >
          {{ data.orderNumber }}
        </a>
      </template>
    </CommonTable>
  </div>
</template>
