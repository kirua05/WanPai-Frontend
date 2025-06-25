<script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import BannerCarousel from '@/components/BannerCarousel.vue'
  import ProductListPage from '@/views/ProductListPage.vue'
  import Toast from 'primevue/toast'
  import SplashAnimation from '@/components/SplashAnimation.vue'
  import Button from 'primevue/button'

  const route = useRoute()
  const keyword = computed(() => route.query.keyword || '')
  const isSearching = computed(() => keyword.value.trim().length > 0)
  const showSplash = ref(false)

  onMounted(() => {
    const hasVisited = sessionStorage.getItem('wanpai-has-visited')
    if (!hasVisited) {
      showSplash.value = true
      sessionStorage.setItem('wanpai-has-visited', 'true')
    }
  })

  const hideSplash = () => {
    showSplash.value = false
  }

  const scrollToBanner = () => {
    window.scrollTo({
      top: 525,
      behavior: 'smooth',
    })
  }
</script>

<template>
  <Toast />
  <SplashAnimation :show="showSplash" @hide="hideSplash" />

  <div v-if="!showSplash">
    <section
      class="relative bg-gradient-to-r from-yellow-50 to-yellow-100 py-28 mb-8 mt-0"
    >
      <div class="max-w-screen-xl mx-auto px-4">
        <div class="text-center space-y-6">
          <h2 class="text-4xl md:text-6xl font-bold text-gray-800">
            歡迎來到
            <span class="text-yellow-600">玩派</span>
          </h2>
          <p class="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            探索精彩的模型玩具世界，找到屬於你的收藏寶藏
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              label="開始購物"
              size="large"
              class="px-8 py-3 text-lg bg-yellow-500 hover:bg-yellow-600 border-yellow-500 hover:border-yellow-600"
              @click="scrollToBanner"
            />
            <Button
              label="了解更多"
              size="large"
              outlined
              class="px-8 py-3 text-lg border-yellow-500 text-yellow-600 hover:bg-yellow-50"
            />
          </div>
        </div>
      </div>
    </section>

    <div id="banner-section">
      <BannerCarousel v-if="!isSearching" />
    </div>

    <ProductListPage />
  </div>
</template>

<!-- <section class="py-16 bg-white">
      <div class="max-w-screen-xl mx-auto px-4">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">熱門分類</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="group cursor-pointer">
            <div class="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg p-8 text-center transition-transform group-hover:scale-105">
              <div class="w-16 h-16 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
                <i class="pi pi-car text-2xl text-white"></i>
              </div>
              <h3 class="text-xl font-semibold text-gray-800 mb-2">車輛模型</h3>
              <p class="text-gray-600">精緻汽車模型</p>
            </div>
          </div>
          <div class="group cursor-pointer">
            <div class="bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg p-8 text-center transition-transform group-hover:scale-105">
              <div class="w-16 h-16 mx-auto mb-4 bg-purple-500 rounded-full flex items-center justify-center">
                <i class="pi pi-android text-2xl text-white"></i>
              </div>
              <h3 class="text-xl font-semibold text-gray-800 mb-2">機器人</h3>
              <p class="text-gray-600">高達、變形金剛、機甲模型</p>
            </div>
          </div>
          <div class="group cursor-pointer">
            <div class="bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg p-8 text-center transition-transform group-hover:scale-105">
              <div class="w-16 h-16 mx-auto mb-4 bg-pink-500 rounded-full flex items-center justify-center">
                <i class="pi pi-heart text-2xl text-white"></i>
              </div>
              <h3 class="text-xl font-semibold text-gray-800 mb-2">收藏品</h3>
              <p class="text-gray-600">限量版、特別款收藏模型</p>
            </div>
          </div>
        </div>
      </div>
    </section> -->
