<script setup>
import { ref } from 'vue'

const bubbles = ref([])

function spawnBubble() {
  const id = Date.now() + Math.random()
  const size = Math.random() * 20 + 20
  const left = Math.random() * window.innerWidth
  const speed = Math.random() * 1 + 2 // 2 ~ 3 秒
  const delay = Math.random() * 0.2
  const blur = Math.random() > 0.5 ? '1px' : '0px'

  bubbles.value.push({ id, size, left, speed, delay, blur })

  setTimeout(() => {
    bubbles.value = bubbles.value.filter((b) => b.id !== id)
  }, (speed + delay) * 1000)
}

defineExpose({ spawnBubble })
</script>

<template>
  <teleport to="body">
    <div class="fixed inset-0 pointer-events-none overflow-hidden z-[9999]">
      <div v-for="bubble in bubbles" :key="bubble.id" class="absolute bg-yellow-300 rounded-full opacity-50" :style="{
        left: `${bubble.left}px`,
        bottom: '-40px',
        width: `${bubble.size}px`,
        height: `${bubble.size}px`,
        filter: `blur(${bubble.blur})`,
        animation: `bubble-float ${bubble.speed}s ease-out ${bubble.delay}s forwards`,
      }" />
    </div>
  </teleport>
</template>

<style>
@keyframes bubble-float {
  0% {
    transform: translateY(0);
    opacity: 0.7;
  }

  100% {
    transform: translateY(-1200px);
    opacity: 0;
  }
}
</style>
