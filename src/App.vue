<script setup>
  import { ref, onMounted, onUnmounted, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import Navbar from '@/components/layout/NavBar.vue'
  import Footer from '@/components/layout/Footer.vue'
  import { useToast } from 'primevue/usetoast'
  import Toast from 'primevue/toast'
  import FloatingBubble from '@/components/FloatingBubble.vue'
  import BubbleBackground from '@/components/BubbleBackground.vue'
  import { setGlobalToast } from '@/utils/toast'

  const toast = useToast()
  setGlobalToast(toast)
  const route = useRoute()
  const isAdmin = computed(() => route.path.startsWith('/admin'))

  const bubbleRef = ref(null)

  const handleScroll = () => {
    const isHome = route.path === '/'
    const isSearching = !!route.query.keyword

    if (
      isHome &&
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

<<<<<<< HEAD
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
=======
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

>>>>>>> 893bff8 (fixdarkmode)
</script>

<template>
  <Toast />
  <BubbleBackground />
  <FloatingBubble ref="bubbleRef" />
  <Navbar v-if="!isAdmin" />

  <main :class="!isAdmin ? 'mt-6 min-h-screen' : ''">
    <RouterView />
  </main>

  <Footer v-if="!isAdmin" />
</template>
