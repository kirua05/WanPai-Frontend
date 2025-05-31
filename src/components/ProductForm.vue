<script setup>
import { ref } from 'vue'
import UploadFile from './UploadFile.vue'

import AutoComplete from 'primevue/autocomplete'
import Select from 'primevue/select'
const selectedType = ref()
const types = ref([
  { name: 'ip', code: 'ip' },
  { name: '系列', code: 'siries' },
  { name: '品牌', code: 'brand' },
])
const value = ref(null)
const items = ref([])
// 商品標籤選擇 WIP
const search = (event) => {
  items.value = [...Array(10).keys()].map((item) => event.query + '-' + item)
}
</script>

<template>
  <label class="block" for="title">商品名稱</label>
  <input
    type="text"
    id="title"
    class="bg-surface-0 rounded-md border-surface-300 border focus:outline-none focus:ring-0 enabled:focus:border-primary px-3 py-2 transition-colors duration-200"
  />
  <label class="block" for="description">商品描述</label>
  <textarea
    class="bg-surface-0 rounded-md border-surface-300 border focus:outline-none focus:ring-0 enabled:focus:border-primary px-3 py-2 transition-colors duration-200 resize-none"
    name="description"
    id="description"
  ></textarea>
  <label class="block" for="image">商品圖片</label>
  <UploadFile />

  <label class="block" for="price">商品價格</label>
  <input
    type="number"
    id="price"
    min="0"
    class="bg-surface-0 rounded-md border-surface-300 border focus:outline-none focus:ring-0 enabled:focus:border-primary px-3 py-2 transition-colors duration-200"
  />
  <!-- Tag type selector -->

  <label class="block" for="stock">目前庫存數</label>
  <input
    type="number"
    id="stock"
    min="0"
    class="block bg-surface-0 rounded-md border-surface-300 border focus:outline-none focus:ring-0 enabled:focus:border-primary px-3 py-2 transition-colors duration-200"
  />

  <Select
    v-model="selectedType"
    :options="types"
    optionLabel="name"
    placeholder="選擇標籤類型"
    class="w-full md:w-56"
  />
  <label for="multiple-ac-2" class="font-bold mt-8 mb-2 block">商品標籤</label>

  <AutoComplete
    v-model="value"
    inputId="multiple-ac-2"
    multiple
    fluid
    :typeahead="false"
    :suggestions="items"
    field="name"
    @complete="search"
    @customItem="handleCustomTag"
  />
</template>
