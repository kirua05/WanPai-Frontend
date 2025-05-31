<script setup>
import CommonTable from '../../components/CommonTable.vue'
import { ref } from 'vue'
const inventoryTabs = ref([
  { title: '全部', content: 'Tab 1 Content', value: 'all' },
  { title: '上架中', content: 'Tab 1 Content', value: 'active' },
  { title: '草稿', content: 'Tab 2 Content', value: 'draft' },
  { title: '典藏', content: 'Tab 3 Content', value: 'archived' },
])
const inventoryColumns = ref([
  { field: 'name', header: '商品', style: 'width: 25%' },
  { field: 'status', header: '狀態', style: 'width: 25%' },
  { field: 'stock', header: '庫存數量', style: 'width: 25%' },
])
const inventoryValue = ref([
  {
    img: 'f230fh0g3',
    name: 'Bamboo Watch',
    status: 'Accessories',
    stock: 24,
  },
])
</script>

<template>
  <h2 class="mb-4 text-2xl">庫存</h2>
  <CommonTable
    :tabs="inventoryTabs"
    :columns="inventoryColumns"
    :value="inventoryValue"
    :scrollable
    :selectable
    :scroll-height
  />
</template>
