<script setup>
  import { ref } from 'vue'
  import { FilterMatchMode, FilterService } from '@primevue/core/api'
  import AutoComplete from 'primevue/autocomplete'

  const selectedItem = ref()
  const filteredItems = ref()
  const groupedItems = ref([
    {
      label: '商品',
      code: 'products',
      items: [{ label: '巨大侏儒河馬', value: '巨大侏儒河馬' }],
    },
    {
      label: '訂單',
      code: 'orders',
      items: [{ label: '王小明', value: '王小明' }],
    },
  ])

  const search = (event) => {
    let query = event.query
    let newFilteredItems = []

    for (let country of groupedItems.value) {
      let filteredItems = FilterService.filter(
        country.items,
        ['label'],
        query,
        FilterMatchMode.CONTAINS
      )
      if (filteredItems && filteredItems.length) {
        newFilteredItems.push({ ...country, ...{ items: filteredItems } })
      }
    }

    filteredItems.value = newFilteredItems
  }
</script>

<template>
  <div class="card w-124">
    <AutoComplete
      v-model="selectedItem"
      :suggestions="filteredItem"
      @complete="search"
      optionLabel="label"
      optionGroupLabel="label"
      optionGroupChildren="items"
      placeholder="輸入商品名稱、貨號或訂單編號"
      :pt="{ pcInputText: { root: '!w-124' } }"
    >
      <template #optiongroup="slotProps">
        <div class="flex items-center country-item">
          <img
            :alt="slotProps.option.label"
            src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
            :class="`flag flag-${slotProps.option.code.toLowerCase()} mr-2`"
            style="width: 18px"
          />
          <div>{{ slotProps.option.label }}</div>
        </div>
      </template>
    </AutoComplete>
  </div>
</template>
