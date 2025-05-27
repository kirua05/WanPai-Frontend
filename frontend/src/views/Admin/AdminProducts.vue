<script setup>
import { ref } from 'vue'
import CommonTable from '../../components/CommonTable.vue'
import { fetchAllProducts } from '@/api/admin/product'
import { onMounted } from 'vue'
const productTabs = ref([
  { title: '全部', value: 'all' },
  { title: '上架中', value: 'active' },
  { title: '草稿', value: 'draft' },
  { title: '典藏', value: 'archived' },
])
const productColumns = ref([
  { field: 'name', header: '商品', style: 'width: 25%' },
  { field: 'status', header: '狀態', style: 'width: 25%' },
  { field: 'currentStock', header: '庫存數量', style: 'width: 25%' },
])

const productValue = ref([])
onMounted(async () => {
  const res = await fetchAllProducts()
  productValue.value = res
})
</script>

<template>
  <h2 class="mb-4 text-2xl">商品</h2>
  <CommonTable
    :tabs="productTabs"
    :columns="productColumns"
    :value="productValue"
    :scrollable
    :selectable
    :scroll-height
  />
</template>
