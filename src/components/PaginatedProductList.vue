<script setup>
  import ProductCategoryFilter from '@/components/ProductCategoryFilter.vue'
  import ProductSearchBar from '@/components/ProductSearchBar.vue'
  import ProductCard from '@/components/ProductCard.vue'
  import { useProductList } from '@/composables/useProductList.js'
  import Button from 'primevue/button'
  import { RouterLink } from 'vue-router'

  const {
    inputKeyword,
    submitSearch,
    activeCategory,
    allCategories,
    paginatedProducts,
    currentPage,
    totalPages,
    goToPage,
    handleCategoryClick,
    pageInput,
    jumpToPage,
    pageButtons,
    productSection,
  } = useProductList()
</script>

<template>
  <div class="p-6 max-w-screen-xl mx-auto">
    <ProductCategoryFilter
      :categories="allCategories"
      :activeCategory="activeCategory"
      @update:category="handleCategoryClick"
    />

    <ProductSearchBar
      v-model="inputKeyword"
      @submit="submitSearch"
      @clear="resetSearch"
    />

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

    <div
      v-if="paginatedProducts.length === 0"
      class="text-center text-gray-400 py-10"
    >
      <i class="pi pi-info-circle text-xl mb-2"></i>
      <p>查無符合的商品</p>
    </div>

    <div
      class="flex flex-col md:flex-row justify-center items-center gap-4 py-6 text-sm"
    >
      <div class="flex items-center gap-1">
        <Button
          icon="pi pi-angle-double-left"
          @click="goToPage(1)"
          :disabled="currentPage === 1"
          text
        />
        <Button
          icon="pi pi-angle-left"
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          text
        />

        <template v-for="page in pageButtons" :key="page">
          <span v-if="page === '...'" class="px-2">...</span>
          <Button
            v-else
            :label="page.toString()"
            :severity="page === currentPage ? 'primary' : undefined"
            :outlined="page !== currentPage"
            :class="page === currentPage ? 'font-bold' : ''"
            @click="goToPage(page)"
          />
        </template>

        <Button
          icon="pi pi-angle-right"
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          text
        />
        <Button
          icon="pi pi-angle-double-right"
          @click="goToPage(totalPages)"
          :disabled="currentPage === totalPages"
          text
        />
      </div>

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
