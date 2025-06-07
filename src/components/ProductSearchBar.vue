<script setup>
  import { ref, computed } from 'vue'
  import InputText from 'primevue/inputtext'
  import Button from 'primevue/button'

  const props = defineProps(['modelValue'])
  const emit = defineEmits(['update:modelValue', 'submit'])

  const modelValueProxy = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
  })

  const isComposing = ref(false)

  function handleEnter() {
    if (isComposing.value) return
    emit('submit')
  }

  function clearKeyword() {
    emit('update:modelValue', '')
  }
</script>

<template>
  <div
    class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 my-4"
  >
    <InputText
      v-model="modelValueProxy"
      placeholder="請輸入商品名稱..."
      class="w-full sm:w-auto flex-1"
      @keydown.enter="handleEnter"
      @compositionstart="isComposing = true"
      @compositionend="isComposing = false"
    />

    <div class="flex gap-2">
      <Button
        label="搜尋"
        icon="pi pi-search"
        class="px-5"
        @click="emit('submit')"
      />
      <Button
        label="清除搜尋"
        icon="pi pi-times"
        severity="secondary"
        class="px-5"
        @click="clearKeyword"
      />
    </div>
  </div>
</template>
