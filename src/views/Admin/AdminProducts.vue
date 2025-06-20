<script setup>
  import { ref } from 'vue'
  import CommonTable from '@/components/CommonTable.vue'
  import { fetchAllProducts } from '@/api/product'
  import { onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useToast } from 'primevue/usetoast'
  import Toast from 'primevue/toast'
  import Image from 'primevue/image'
  const router = useRouter()
  const toast = useToast()

  const productTabs = ref([
    { title: '全部', value: 'all' },
    { title: '上架中', value: 'active' },
    { title: '草稿', value: 'draft' },
    { title: '典藏', value: 'archived' },
  ])
  const productColumns = ref([
    { field: 'coverImage', header: '', style: 'width: 25%', sortable: false },
    { field: 'name', header: '商品', style: 'width: 25%', sortable: true },
    {
      field: 'status',
      header: '狀態',
      style: 'width: 25%',
      sortable: true,
      format: (val) =>
        ({
          active: '上架中',
          draft: '草稿',
          archived: '典藏',
        })[val] || '未知',
    },
    {
      field: 'stockOnHand',
      header: '庫存數量',
      style: 'width: 25%',
      sortable: true,
    },
  ])

const goCreateProduct = () => {
  router.push({ name: 'createProduct' })
}

const goEditProduct = (id) => {
  router.push({ name: 'editProduct', params: { id } })
}

  const productValue = ref([])
  onMounted(async () => {
    const res = await fetchAllProducts()
    productValue.value = res
  })
</script>

<template>
  <Toast />
  <div class="flex justify-between items-center mr-8 mb-4">
    <h2 class="text-2xl">商品</h2>
    <div class="card flex justify-center">
      <button
        class="text-md text-white px-3 py-2 border-surface-200 rounded-md bg-primary cursor-pointer"
        @click="router.push({ name: 'createProduct' })"
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
      @tab-change="handleTabChange"
      scrollable
      selectable
      scroll-height="500px"
    >
      <template #body-coverImage="{ data }">
        <Image
          v-if="data.coverImage"
          :src="data.coverImage"
          alt="Product Cover Image"
          imageClass="w-32 h-32 object-cover rounded mx-auto"
          loading="lazy"
        />
      </template>
      <template #body-name="{ data }">
        <a
          class="w-full underline text-primary cursor-pointer"
          @click="router.push({ name: 'editProduct', params: { id: data.id } })"
        >
          {{ data.name }}
        </a>
      </template>
    </CommonTable>
  </div>
</template>
