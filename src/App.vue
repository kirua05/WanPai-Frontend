<script setup>
import Navbar from '@/components/layout/NavBar.vue'
import Footer from '@/components/layout/Footer.vue'
</script>

<template>
  <Navbar />

  <main class="mt-6 bg-gray-50 min-h-screen">
  <RouterView />
  </main>

  <Footer />
</template>
