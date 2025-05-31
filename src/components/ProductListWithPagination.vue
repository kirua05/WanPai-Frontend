<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import ProductCard from '@/components/ProductCard.vue'


const products = ref([])
for (let i = 1; i <= 60; i++) {
  products.value.push({
    id: i,
    name: `商品 ${i}`,
    image: `/img/p${(i % 5) + 1}.jpg`,
    price: 100 + i * 5
  })
}

const currentPage = ref(1)
const itemsPerPage = 20

const totalPages = computed(() =>
  Math.ceil(products.value.length / itemsPerPage)
)

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return products.value.slice(start, start + itemsPerPage)
})

const productSection = ref(null)

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    if (productSection.value) {
      productSection.value.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }
}
</script>

<template>
  <div>
    <div ref="productSection" class="grid grid-cols-2 md:grid-cols-4 gap-6 p-6">
      <RouterLink
        v-for="item in paginatedProducts"
        :key="item.id"
        :to="`/products/${item.id}`"
        class="block"
      >
        <ProductCard :product="item" />
      </RouterLink>
    </div>

    <div class="flex justify-center items-center gap-4 py-6">
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-4 py-2 rounded-md border bg-white shadow hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        上一頁
      </button>
      <span>第 {{ currentPage }} / {{ totalPages }} 頁</span>
      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 rounded-md border bg-white shadow hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        下一頁
      </button>
    </div>
  </div>
</template>
