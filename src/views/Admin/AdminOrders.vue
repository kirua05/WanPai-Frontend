<script setup>
  import { ref } from 'vue'
  import { fetchAllOrders } from '@/api/order'
  import { onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import CommonTable from '@/components/CommonTable.vue'
  import { showToast } from '@/utils/toast'
  const router = useRouter()

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
      format: (val) => {
        if (!val) return ''
        const date = new Date(val)
        if (isNaN(date.getTime())) return '無效日期'
        return date.toLocaleString('zh-TW', {
          timeZone: 'Asia/Taipei',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      },
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
        })[val] || val,
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
      showToast({
        severity: 'warn',
        summary: '訂單暫時無法載入',
        detail: '請稍後再試',
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
