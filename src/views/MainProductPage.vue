<script setup>
  import BannerCarousel from '@/components/BannerCarousel.vue'
  import ProductListPage from '@/views/ProductListPage.vue'
  import AiChatWidget from '@/components/AiChatWidget.vue'
  import { useRoute } from 'vue-router'
  import { computed } from 'vue'

  const route = useRoute()
  const keyword = computed(() => route.query.keyword || '')
  const isSearching = computed(() => keyword.value.trim().length > 0)
</script>

<template>
  <BannerCarousel v-if="!isSearching" />
  <ProductListPage />
  <AiChatWidget />
</template>
