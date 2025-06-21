<script setup>
  import Navbar from '@/components/layout/NavBar.vue'
  import Footer from '@/components/layout/Footer.vue'
  import { onMounted } from 'vue'
  import { useToast } from 'primevue/usetoast'
  import { useAuthStore } from '@/stores/auth'
  import Toast from 'primevue/toast'

  const toast = useToast()
  const authStore = useAuthStore()

  onMounted(() => {
    authStore.setToastHandler(toast)
  })
</script>

<template>
  <Navbar />
  <Toast />

  <main class="mt-6 min-h-screen">
    <RouterView />
  </main>

  <Footer />
</template>
