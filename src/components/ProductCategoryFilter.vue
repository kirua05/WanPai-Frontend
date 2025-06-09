<script setup>
  import Button from 'primevue/button'

  defineProps({
    categories: Array,
    activeCategory: String,
  })

  const emit = defineEmits(['update:category'])

  function setCategory(c) {
    emit('update:category', c)
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
