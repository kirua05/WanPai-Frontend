<script setup>
  import { ref } from 'vue'
  import { fetchAllOrders } from '@/api/order'
  import { onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import CommonTable from '@/components/CommonTable.vue'
  import { useToast } from 'primevue/usetoast'
  import Toast from 'primevue/toast'
  const router = useRouter()
  const toast = useToast()

  const orderTabs = ref([
    { title: '全部', value: 'all' },
    { title: '已付款', value: 'paid' },
    { title: '已出貨', value: 'shipped' },
    { title: '已完成', value: 'delivered' },
    { title: '已取消', value: 'cancelled' },
  ])
  const orderColumns = ref([
    {
      field: 'orderNumber',
      header: '訂單編號',
      style: 'width: 20%',
      sortable: true,
    },
    {
      field: 'createdAt',
      header: '日期',
      style: 'width: 12.5%',
      sortable: true,
      format: (val) => (val ? val.slice(0, 10) : ''),
    },
    {
      field: 'recipientName',
      header: '顧客',
      style: 'width: 20%',
      sortable: false,
    },
    {
      field: 'status',
      header: '訂單狀態',
      style: 'width: 20%',
      sortable: true,
      format: (val) =>
        ({
          paid: '已付款',
          shipped: '已出貨',
          delivered: '已完成',
          cancelled: '已取消',
        })[val] || '未知',
    },
    {
      field: 'totalPrice',
      header: '總金額',
      style: 'width: 20%',
      sortable: true,
    },
  ])
  const currentStatus = ref('all')
  const handleTabChange = async (newStatus) => {
    currentStatus.value = newStatus
    try {
      const res = await fetchAllOrders(newStatus)
      orderValue.value = res
    } catch {
      toast.add({
        severity: 'warn',
        summary: '訂單暫時無法載入',
        detail: '請稍後再試',
        life: 3000,
      })
    }
  }

  const orderValue = ref([])
  onMounted(async () => {
    const res = await fetchAllOrders()
    orderValue.value = res
  })
</script>

<template>
  <Toast />
  <div class="flex justify-between items-center mr-8 mb-4">
    <h2 class="text-2xl">訂單</h2>
    <!-- <div class="card flex justify-center">
      <button
        class="text-md text-white px-3 py-2 border-surface-200 rounded-md bg-primary cursor-pointer"
      >
        新增訂單
      </button>
    </div> -->
  </div>
  <div class="mr-8">
    <CommonTable
      :tabs="orderTabs"
      :columns="orderColumns"
      :value="orderValue"
      @tab-change="handleTabChange"
      scrollable
      selectable
      scroll-height="500px"
    >
      <template #body-orderNumber="{ data }">
        <a
          class="w-full underline text-primary cursor-pointer"
          @click="
            router.push({
              path: `/admin/orders/edit/${data.id}`,
            })
          "
        >
          {{ data.orderNumber }}
        </a>
      </template>
    </CommonTable>
  </div>
</template>
