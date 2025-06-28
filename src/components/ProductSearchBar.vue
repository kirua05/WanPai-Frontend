<script setup>
import { computed } from 'vue'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue', 'submit'])

const modelValueProxy = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

function handleSearch() {
  emit('submit')
}

function handleEnter(event) {
  if (!event.isComposing) {
    handleSearch()
  }
}
</script>

<template>
  <div class="flex items-center gap-2">
    <input v-model="modelValueProxy" @keyup.enter="handleEnter" placeholder="請輸入商品名稱..."
      class="px-3 py-[6px] border border-gray-300 rounded-md text-sm w-[200px] h-9" />

    <button @click="handleSearch"
      class="flex items-center justify-center gap-1 bg-yellow-400 text-white text-sm px-3 py-[6px] rounded-md hover:bg-yellow-500 h-9">
      <i class="pi pi-search text-sm" />
      <span class="hidden sm:inline">搜尋</span>
    </button>
  </div>
</template>
