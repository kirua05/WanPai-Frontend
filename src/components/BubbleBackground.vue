<script setup>
import { onMounted, ref } from 'vue'

const bubbles = ref([])

onMounted(() => {
  bubbles.value = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: Math.random() * 50 + 50,
    opacity: Math.random() * 0.3 + 0.4,
    blur: Math.random() > 0.5 ? 'blur-xs' : ''
  }))
})
</script>

<template>
  <div class="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
    <div v-for="b in bubbles" :key="b.id" class="absolute rounded-full bg-yellow-300" :class="b.blur" :style="{
      top: `${b.top}%`,
      left: `${b.left}%`,
      width: `${b.size}px`,
      height: `${b.size}px`,
      opacity: b.opacity
    }"></div>
  </div>
</template>

<style scoped></style>
