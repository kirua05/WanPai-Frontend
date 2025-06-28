<script setup>
import { onMounted, ref } from 'vue'

const bubbles = ref([])

onMounted(() => {
  const rows = 5
  const cols = 6
  const total = rows * cols
  const gapY = 100 / rows
  const gapX = 100 / cols

  bubbles.value = Array.from({ length: total }, (_, i) => {
    const row = Math.floor(i / cols)
    const col = i % cols
    const offsetY = (Math.random() - 0.5) * gapY * 0.8
    const offsetX = (Math.random() - 0.5) * gapX * 0.8

    return {
      id: i,
      top: row * gapY + gapY / 2 + offsetY,
      left: col * gapX + gapX / 2 + offsetX,
      size: 50 + Math.random() * 30,
      opacity: 0.4 + Math.random() * 0.3,
      blur: Math.random() < 0.5 ? 'blur-sm' : ''
    }
  })
})
</script>

<template>
  <div class="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
    <div v-for="b in bubbles" :key="b.id" class="absolute rounded-full bg-yellow-300" :class="b.blur" :style="{
      top: `${b.top}%`,
      left: `${b.left}%`,
      width: `${b.size}px`,
      height: `${b.size}px`,
      opacity: b.opacity,
      transform: 'translate(-50%, -50%)'
    }"></div>
  </div>
</template>

<style scoped></style>
