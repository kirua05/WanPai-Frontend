<script setup>
  import { computed } from 'vue'

  const props = defineProps(['modelValue'])
  const emit = defineEmits(['update:modelValue', 'submit', 'clear'])

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

  function clearKeyword() {
    emit('update:modelValue', '')
    emit('clear')
  }
</script>

<template>
  <div class="flex items-center gap-2">
    <input
      v-model="modelValueProxy"
      @keyup.enter="handleEnter"
      placeholder="請輸入商品名稱..."
      class="px-3 py-[6px] border border-gray-300 rounded-md text-sm w-[200px]"
    />

    <button
      @click="handleSearch"
      class="flex items-center gap-1 bg-yellow-400 text-white text-sm px-3 py-[6px] rounded-md hover:bg-yellow-500"
    >
      <i class="pi pi-search text-sm" />
      搜尋
    </button>
    <button
      @click="clearKeyword"
      class="flex items-center gap-1 bg-gray-100 text-sm px-3 py-[6px] rounded-md hover:bg-gray-200"
    >
      <i class="pi pi-times text-sm" />
      清除搜尋
    </button>
  </div>
</template>
