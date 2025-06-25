<script setup>
  import Button from 'primevue/button'

  defineProps({
    categories: Array,
    activeCategory: String,
  })

  const emit = defineEmits(['update:activeCategory'])

  function setCategory(c) {
    emit('update:activeCategory', c)

    setTimeout(() => {
      const categoryFilter = document.querySelector(
        '.flex.flex-wrap.gap-2.justify-center.mb-6'
      )
      if (categoryFilter) {
        const rect = categoryFilter.getBoundingClientRect()
        const offsetTop = window.pageYOffset + rect.top - 20
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth',
        })
      }
    }, 100)
  }
</script>

<template>
  <div class="flex flex-wrap gap-2 justify-center mb-6">
    <Button
      v-for="c in categories"
      :key="c"
      :label="c"
      :outlined="activeCategory !== c"
      :severity="activeCategory === c ? 'primary' : undefined"
      @click="setCategory(c)"
      class="rounded-full text-sm px-4 py-2"
    />
  </div>
</template>
