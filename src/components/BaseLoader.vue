<script setup>

defineProps({
  isLoading: Boolean,
  hasLoadedOnce: Boolean,
})

</script>

<template>
  <div v-if="!hasLoadedOnce || isLoading" class="text-center text-gray-500 py-10">
    <i class="pi pi-spin pi-spinner text-2xl mb-2"></i>
    <slot>
      <p>載入中...</p>
    </slot>
  </div>
</template>
