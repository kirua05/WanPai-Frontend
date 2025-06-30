<script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import BannerCarousel from '@/components/BannerCarousel.vue'
  import ProductListPage from '@/views/ProductListPage.vue'
  import Toast from 'primevue/toast'
  import SplashAnimation from '@/components/SplashAnimation.vue'
  import AiChatWidget from '@/components/AiChatWidget.vue'
  const route = useRoute()
  const keyword = computed(() => route.query.keyword || '')
  const isSearching = computed(() => keyword.value.trim().length > 0)
  const showSplash = ref(false)

  onMounted(() => {
    const hasVisited = sessionStorage.getItem('wanpai-has-visited')
    const navType = performance.getEntriesByType('navigation')[0]?.type
    const isFirstVisit = !hasVisited && navType === 'navigate'

    if (isFirstVisit) {
      showSplash.value = true
      sessionStorage.setItem('wanpai-has-visited', 'true')
    } else {
      showSplash.value = false
    }
  })

  const hideSplash = () => {
    showSplash.value = false
  }
</script>

<template>
  <Toast />
  <SplashAnimation :show="showSplash" @hide="hideSplash" />
  <div id="banner-section">
    <BannerCarousel v-if="!isSearching" />
  </div>
  <ProductListPage />
  <AiChatWidget />
</template>
