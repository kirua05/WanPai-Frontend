<script setup>
  import CommonTable from '@/components/CommonTable.vue'
  import Image from 'primevue/image'
  import { fetchAllProducts } from '@/api/product'
  import { onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import BaseLoader from '@/components/BaseLoader.vue'
  import { ref } from 'vue'
  const router = useRouter()
  const isloading = ref(true)
  const hasLoadedOnce = ref(false)
  const inventoryTabs = ref([
    { title: '全部', value: 'all' },
    { title: '上架中', value: 'active' },
    { title: '草稿', value: 'draft' },
    { title: '典藏', value: 'archived' },
  ])
  const inventoryColumns = ref([
    { field: 'coverImage', header: '', style: 'width: 20%', sortable: false },
    { field: 'name', header: '商品', style: 'width: 20%', sortable: true },
    {
      field: 'status',
      header: '狀態',
      style: 'width: 20%',
      sortable: true,
      format: (val) =>
        ({
          active: '上架中',
          draft: '草稿',
          archived: '典藏',
        })[val] || '未知',
    },
    {
      field: 'stockReserved',
      header: '預留數量',
      style: 'width: 20%',
      sortable: true,
    },
    {
      field: 'stockOnHand',
      header: '現有庫存',
      style: 'width: 20%',
      sortable: true,
    },
  ])
  const productValue = ref([])
  const goStockLog = (id) => {
    router.push({ name: 'stockLog', params: { id } })
  }

  onMounted(async () => {
    const res = await fetchAllProducts()
    productValue.value = res
    isloading.value = false
    hasLoadedOnce.value = true
  })
</script>

<template>
  <BaseLoader :isLoading="isloading" :hasLoadedOnce="hasLoadedOnce">
    <div v-if="!isloading">
      <div class="flex justify-between items-center mr-8 mb-4">
        <h2 class="text-2xl">庫存</h2>
      </div>
      <CommonTable
        :tabs="inventoryTabs"
        :columns="inventoryColumns"
        :value="productValue"
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
            @click="goStockLog(data.id)"
          >
            {{ data.name }}
          </a>
        </template>
      </CommonTable>
    </div>
  </BaseLoader>
</template>
