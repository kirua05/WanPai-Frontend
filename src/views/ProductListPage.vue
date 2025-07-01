<script setup>
  import ProductCategoryFilter from '@/components/ProductCategoryFilter.vue'
  import BrandIPSidebar from '@/components/BrandIPSidebar.vue'
  import ProductCard from '@/components/ProductCard.vue'
  import ProductPagination from '@/components/ProductPagination.vue'
  import { useProductList } from '@/composables/useProductList.js'
  import { RouterLink } from 'vue-router'
  import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
  import BubbleBackground from '@/components/BubbleBackground.vue'

  const {
    activeCategory,
    activeIpTag,
    isSearching,
    keyword,
    allCategories,
    paginatedProducts,
    currentPage,
    totalPages,
    goToPage,
    pageInput,
    pageButtons,
    productSection,
    isLoading,
    hasLoadedOnce,
    randomProducts,
  } = useProductList()

  const bubbleRef = ref(null)

  const handleScroll = () => {
    if (window.scrollY > 100 && Math.random() > 0.85) {
      bubbleRef.value?.spawnBubble()
    }
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  watch(paginatedProducts, () => {
    nextTick(() => {
      window.dispatchEvent(new Event('resize'))
    })
  })
</script>

<template>
  <div class="relative overflow-hidden overflow-x-hidden min-h-screen">
    <BubbleBackground />

    <div
      class="relative z-10 px-2 sm:px-4 md:px-6 lg:px-8 py-6 max-w-[1200px] mx-auto"
    >
      <ProductCategoryFilter
        v-if="!isSearching"
        :categories="allCategories"
        v-model:activeCategory="activeCategory"
      />

      <p v-if="isSearching" class="text-lg font-semibold text-gray-700 mb-4">
        🔍 搜尋「{{ keyword }}」的結果：
      </p>

      <div class="flex gap-6 mt-6">
        <div class="hidden lg:block flex-shrink-0">
          <BrandIPSidebar v-model:activeIpTag="activeIpTag" />
        </div>

        <div class="flex-1 min-w-0">
          <div
            v-if="!hasLoadedOnce || isLoading"
            class="text-center text-gray-500 py-10"
          >
            <i class="pi pi-spin pi-spinner text-2xl mb-2"></i>
            <p>載入中...</p>
          </div>

          <div
            v-else-if="paginatedProducts.length === 0"
            class="text-center text-gray-400 py-10"
          >
            <i class="pi pi-info-circle text-xl mb-2"></i>
            <p>查無符合的商品</p>
          </div>

          <div
            v-else
            ref="productSection"
            class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 min-w-0"
          >
            <RouterLink
              v-for="item in paginatedProducts"
              :key="item.id"
              :to="`/products/${item.id}`"
              class="block"
            >
              <ProductCard :product="item" />
            </RouterLink>
          </div>

          <ProductPagination
            v-if="hasLoadedOnce"
            :currentPage="currentPage"
            :totalPages="totalPages"
            :pageButtons="pageButtons"
            v-model:pageInput="pageInput"
            @goToPage="goToPage"
          />

          <section
            v-if="isSearching && randomProducts.length > 0"
            class="mt-12"
          >
            <h2 class="text-xl font-bold mb-4">大家也在看 👀</h2>
            <div
              class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
            >
              <RouterLink
                v-for="item in randomProducts"
                :key="item.id"
                :to="`/products/${item.id}`"
                class="block"
              >
                <ProductCard :product="item" />
              </RouterLink>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>
