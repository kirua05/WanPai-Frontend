<script setup>
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import InputText from 'primevue/inputtext'
  import Button from 'primevue/button'

  const props = defineProps(['modelValue'])
  const emit = defineEmits(['update:modelValue', 'submit', 'clear'])

  const route = useRoute()
  const router = useRouter()

  const modelValueProxy = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
  })

  function handleSearch() {
    router.push({
      path: '/',
      query: {
        ...route.query,
        keyword: modelValueProxy.value,
        page: 1,
      },
    })
    emit('submit')
  }

  function handleEnter(event) {
    if (event.isComposing) return
    handleSearch()
  }

  function clearKeyword() {
    router.push({
      path: '/',
      query: {},
    })
    emit('update:modelValue', '')
    emit('clear')
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
    />
    <div class="flex gap-2">
      <Button
        label="搜尋"
        icon="pi pi-search"
        class="px-5"
        @click="handleSearch"
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
