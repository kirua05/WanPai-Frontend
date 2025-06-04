<script setup>
  import { ref } from 'vue'
  import CommonTable from '@/components/CommonTable.vue'

  const orderTabs = ref([
    { title: '全部', value: 'all' },
    { title: '待付款', value: 'unpaid' },
    { title: '待出貨', value: 'unshipped' },
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
      field: 'shipping',
      header: '物流狀態',
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
  // 假資料
  const orderValue = ref([
    {
      orderNumber: 'f230fh0g3',
      date: '2024-06-25',
      customer: 'John Doe',
      payment: '已付款',
      shipping: '已出貨',
      status: '已完成',
      total: '$100',
      quantity: '1',
    },
  ])
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
    />
  </div>
</template>
