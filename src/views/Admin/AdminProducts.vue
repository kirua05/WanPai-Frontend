<script setup>
  import { ref } from 'vue'
  import CommonTable from '@/components/CommonTable.vue'
  import { fetchAllProducts } from '@/api/admin/product'
  import { onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  const router = useRouter()
  const statusTextMap = {
    active: '上架中',
    draft: '草稿',
    archived: '典藏',
  }
  const productTabs = ref([
    { title: '全部', value: 'all' },
    { title: '上架中', value: 'active' },
    { title: '草稿', value: 'draft' },
    { title: '典藏', value: 'archived' },
  ])
  const productColumns = ref([
    { field: 'img', header: '', style: 'width: 25%', sortable: false },
    { field: 'name', header: '商品', style: 'width: 25%', sortable: true },
    { field: 'status', header: '狀態', style: 'width: 25%', sortable: true },
    {
      field: 'stockOnHand',
      header: '庫存數量',
      style: 'width: 25%',
      sortable: true,
    },
  ])

  const productValue = ref([])
  onMounted(async () => {
    const res = await fetchAllProducts()
    productValue.value = res
  })
</script>

<template>
  <div class="flex justify-between items-center mr-8 mb-4">
    <h2 class="text-2xl">商品</h2>
    <div class="card flex justify-center">
      <button
        class="text-md text-white px-3 py-2 border-surface-200 rounded-md bg-primary cursor-pointer"
        @click="
          router.push({
            path: '/admin/products/edit',
            query: { mode: 'create' },
          })
        "
      >
        新增商品
      </button>
    </div>
  </div>
  <div class="mr-8">
    <CommonTable
      :tabs="productTabs"
      :columns="productColumns"
      :value="productValue"
      scrollable
      selectable
      scroll-height="500px"
    >
      <template #body-status="{ data }">
        {{ statusTextMap[data.status] || '未知' }}
      </template>
      <template #body-name="{ data }">
        <a
          class="w-full underline text-primary cursor-pointer"
          @click="
            router.push({
              path: `/admin/products/edit/${data.id}`,
              query: { mode: 'edit' },
            })
          "
        >
          {{ data.name }}
        </a>
      </template>
    </CommonTable>
  </div>
</template>
