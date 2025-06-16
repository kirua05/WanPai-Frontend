<script setup>
  import BannerCarousel from '@/components/BannerCarousel.vue'
  import ProductListPage from '@/views/ProductListPage.vue'
  import Toast from 'primevue/toast'
</script>

<template>
  <Toast />
  <div>
    <BannerCarousel />
    <ProductListPage />
  </div>
</template>
