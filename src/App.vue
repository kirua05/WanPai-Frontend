<script setup>
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import Navbar from '@/components/layout/NavBar.vue'
  import Footer from '@/components/layout/Footer.vue'
  import { onMounted } from 'vue'
  import { useToast } from 'primevue/usetoast'
  import { useAuthStore } from '@/stores/auth'
  import Toast from 'primevue/toast'

  const toast = useToast()
  const authStore = useAuthStore()
  const route = useRoute()
  const isAdmin = computed(() => route.path.startsWith('/admin'))

  onMounted(() => {
    authStore.setToastHandler(toast)
  })
</script>

<template>
  <Toast />

  <Navbar v-if="!isAdmin" />

  <main :class="!isAdmin ? 'mt-6 min-h-screen' : ''">
    <RouterView />
  </main>

  <Footer v-if="!isAdmin" />
</template>
