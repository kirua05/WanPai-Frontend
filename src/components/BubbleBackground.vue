<script setup>
import { onMounted, ref } from 'vue'

const bubbles = ref([])

onMounted(() => {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 4f9c44c (fixbubble)
  const rows = 5
  const cols = 6
  const total = rows * cols
  const gapY = 100 / rows
  const gapX = 100 / cols

  bubbles.value = Array.from({ length: total }, (_, i) => {
    const row = Math.floor(i / cols)
    const col = i % cols

    // 偏移範圍加大：±40%
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
<<<<<<< HEAD
=======
  bubbles.value = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: Math.random() * 50 + 50,
    opacity: Math.random() * 0.3 + 0.4,
    blur: Math.random() > 0.5 ? 'blur-xs' : ''
  }))
>>>>>>> 037577c (feat: add static bubble background and homepage-only dynamic bubbles)
=======
>>>>>>> 4f9c44c (fixbubble)
})
</script>

<template>
  <div class="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
    <div v-for="b in bubbles" :key="b.id" class="absolute rounded-full bg-yellow-300" :class="b.blur" :style="{
      top: `${b.top}%`,
      left: `${b.left}%`,
      width: `${b.size}px`,
      height: `${b.size}px`,
<<<<<<< HEAD
<<<<<<< HEAD
      opacity: b.opacity,
      transform: 'translate(-50%, -50%)'
    }"></div>
  </div>
</template>
=======
      opacity: b.opacity
    }"></div>
  </div>
</template>

<style scoped></style>
>>>>>>> 037577c (feat: add static bubble background and homepage-only dynamic bubbles)
=======
      opacity: b.opacity,
      transform: 'translate(-50%, -50%)'
    }"></div>
  </div>
</template>
>>>>>>> 4f9c44c (fixbubble)
