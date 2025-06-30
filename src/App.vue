<script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { useToast } from 'primevue/usetoast'
  import Toast from 'primevue/toast'

  // 🧩 自訂元件
  import Navbar from '@/components/layout/NavBar.vue'
  import Footer from '@/components/layout/Footer.vue'
  import FloatingBubble from '@/components/FloatingBubble.vue'
  import BubbleBackground from '@/components/BubbleBackground.vue'
  import { setGlobalToast } from '@/utils/toast'

  const toast = useToast()
  setGlobalToast(toast)

  const route = useRoute()

  const isAdmin = computed(() => route.path.startsWith('/admin'))
  const isHome = computed(() => route.path === '/')

  const bubbleRef = ref(null)
  const handleScroll = () => {
    const isSearching = !!route.query.keyword
    if (
      isHome.value &&
      !isSearching &&
      window.scrollY > 100 &&
      Math.random() > 0.85
    ) {
      bubbleRef.value?.spawnBubble()
    }
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
  })
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
</script>

<template>
  <div class="min-h-screen flex flex-col relative overflow-x-hidden">
    <Toast />
    <BubbleBackground class="absolute inset-0 -z-10" />
    <FloatingBubble ref="bubbleRef" />
    <Navbar v-if="!isAdmin" />

    <main :class="!isAdmin ? 'flex-1' : ''">
      <RouterView />
    </main>

    <Footer v-if="!isAdmin" />
  </div>
</template>
