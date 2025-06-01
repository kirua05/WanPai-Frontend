<script setup>
import { ref, computed, watch } from 'vue'
import { RouterLink } from 'vue-router'
import Button from 'primevue/button'
import ProductCard from '@/components/ProductCard.vue'
import ProductCategoryFilter from '@/components/ProductCategoryFilter.vue'
import ProductSearchBar from '@/components/ProductSearchBar.vue'

function debounce(fn, delay = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

// 商品資料、分類、狀態
const products = ref([])
const categories = ['模型', '週邊', '限量']
const activeCategory = ref('全部')
const currentPage = ref(1)
const itemsPerPage = 20

const rawKeyword = ref('')
const keyword = ref('')

// 處理搜尋字串
const updateKeyword = debounce((val) => {
  keyword.value = val
  currentPage.value = 1
}, 300)

watch(rawKeyword, (val) => {
  updateKeyword(val)
})

// 假資料
for (let i = 1; i <= 60; i++) {
  const category = categories[(i - 1) % categories.length]
  products.value.push({
    id: i,
    name: `商品 ${i}`,
    image: `/img/p${(i % 5) + 1}.jpg`,
    price: 100 + i * 5,
    category
  })
}
products.value[10].name = '海賊王 公仔'

const filteredProducts = computed(() => {
  let result = products.value
  if (activeCategory.value !== '全部') {
    result = result.filter(products => products.category === activeCategory.value)
  }
  if (keyword.value.trim().length >= 2) {
    result = result.filter(products =>
      products.name.toLowerCase().includes(keyword.value.toLowerCase())
    )
  }
  return result
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredProducts.value.length / itemsPerPage))
)

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredProducts.value.slice(start, start + itemsPerPage)
})

const allCategories = ['全部', ...categories]
const productSection = ref(null)

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    productSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

function handleCategoryClick(category) {
  activeCategory.value = category
  currentPage.value = 1
}

// 進階分頁功能
const pageInput = ref('')
function jumpToPage() {
  const page = parseInt(pageInput.value, 10)
  if (!isNaN(page)) {
    goToPage(page)
    pageInput.value = ''
  }
}
const pageButtons = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})
</script>

<template>
  <div class="p-6 max-w-screen-xl mx-auto">
    <!-- 分類 -->
    <ProductCategoryFilter
      :categories="allCategories"
      :activeCategory="activeCategory"
      @update:category="handleCategoryClick"
    />

    <!-- 搜尋 -->
    <ProductSearchBar
      :keyword="rawKeyword"
      @update:keyword="val => rawKeyword = val"
    />

    <!-- 商品列表 -->
    <div ref="productSection" class="grid grid-cols-2 md:grid-cols-4 gap-6">
      <RouterLink
        v-for="item in paginatedProducts"
        :key="item.id"
        :to="`/products/${item.id}`"
        class="block"
      >
        <ProductCard :product="item" />
      </RouterLink>
    </div>

    <!-- 查無商品 -->
    <div v-if="paginatedProducts.length === 0" class="text-center text-gray-400 py-10">
      <i class="pi pi-info-circle text-xl mb-2"></i>
      <p>查無符合的商品</p>
    </div>

    <!-- 進階分頁區 -->
    <div class="flex flex-col md:flex-row justify-center items-center gap-4 py-6 text-sm">
      <!-- 分頁按鈕 -->
      <div class="flex items-center gap-1">
        <Button icon="pi pi-angle-double-left" @click="goToPage(1)" :disabled="currentPage === 1" />
        <Button icon="pi pi-angle-left" @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" />

        <template v-for="page in pageButtons" :key="page">
          <Button
            :label="page.toString()"
            :class="{
              'bg-green-500 text-white': page === currentPage,
              'bg-white text-black': page !== currentPage
            }"
            @click="goToPage(page)"
          />
        </template>

        <Button icon="pi pi-angle-right" @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" />
        <Button icon="pi pi-angle-double-right" @click="goToPage(totalPages)" :disabled="currentPage === totalPages" />
      </div>

      <!-- 前往頁碼 -->
      <div class="flex items-center gap-2">
        <span>前往</span>
        <input
          v-model="pageInput"
          type="number"
          min="1"
          :max="totalPages"
          class="w-16 px-2 py-1 border rounded text-center"
        />
        <span>頁</span>
        <Button label="確定" @click="jumpToPage" class="!px-3 !py-1.5" />
      </div>
    </div>
  </div>
</template>

