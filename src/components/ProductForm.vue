<script setup>
  import { ref } from 'vue'
  import UploadFile from './UploadFile.vue'
  import AutoComplete from 'primevue/autocomplete'
  import Select from 'primevue/select'
  import { createProduct } from '@/api/admin/product'
  const selectedType = ref()
  const types = ref([
    { name: 'ip', code: 'ip' },
    { name: '系列', code: 'siries' },
    { name: '品牌', code: 'brand' },
  ])
  const tagValue = ref(null)
  const items = ref([])
  // 商品標籤選擇 WIP
  const search = (event) => {
    items.value = [...Array(10).keys()].map((item) => event.query + '-' + item)
  }
  const statusOptions = ref([
    { name: '草稿', value: 'draft' },
    { name: '上架中', value: 'active' },
    { name: '典藏', value: 'archived' },
  ])
  const form = ref({
    name: '',
    sku: '',
    description: '',
    price: 0,
    stockOnHand: 0,
    status: 'draft',
  })

  const submit = async () => {
    if (!form.value.name) {
      alert('請輸入商品名稱')
      return
    }
    if (!form.value.sku) {
      alert('請輸入商品貨號')
      return
    }
    if (!form.value.description) {
      alert('請輸入商品描述')
      return
    }
    try {
      await createProduct({ ...form.value })
      // 新增成功 dialog
    } catch (err) {
      return err
      // 新增失敗 dialog
    }
  }
</script>

<template>
  <div class="flex flex-col gap-4 mt-4">
    <div>
      <label class="font-bold mb-2 block" for="title">商品名稱</label>
      <input
        v-model="form.name"
        type="text"
        id="title"
        class="bg-surface-0 rounded-md border-surface-300 border focus:outline-none focus:ring-0 enabled:focus:border-primary px-3 py-2 transition-colors duration-200"
      />
    </div>

    <div>
      <label class="font-bold mb-2 block" for="sku">商品貨號</label>
      <input
        v-model="form.sku"
        type="text"
        id="sku"
        class="bg-surface-0 rounded-md border-surface-300 border focus:outline-none focus:ring-0 enabled:focus:border-primary px-3 py-2 transition-colors duration-200"
      />
    </div>

    <div>
      <label class="font-bold mb-2 block" for="description">商品描述</label>
      <textarea
        v-model="form.description"
        class="w-240 h-80 bg-surface-0 rounded-md border-surface-300 border focus:outline-none focus:ring-0 enabled:focus:border-primary px-3 py-2 transition-colors duration-200 resize-none"
        name="description"
        id="description"
      ></textarea>
    </div>

    <div>
      <label class="font-bold mb-2 block" for="image">商品圖片</label>
      <UploadFile />
    </div>

    <div>
      <label class="font-bold mb-2 block" for="price">商品價格</label>
      <input
        v-model="form.price"
        type="number"
        id="price"
        min="0"
        class="bg-surface-0 rounded-md border-surface-300 border focus:outline-none focus:ring-0 enabled:focus:border-primary px-3 py-2 transition-colors duration-200"
      />
    </div>

    <div>
      <label class="font-bold mb-2 block" for="stock">目前庫存數</label>
      <input
        v-model="form.stockOnHand"
        type="number"
        id="stock"
        min="0"
        class="block bg-surface-0 rounded-md border-surface-300 border focus:outline-none focus:ring-0 enabled:focus:border-primary px-3 py-2 transition-colors duration-200"
      />
    </div>

    <div>
      <label for="multiple-ac-2" class="font-bold mb-2 block">商品標籤</label>
      <div class="flex gap-4">
        <Select
          v-model="selectedType"
          :options="types"
          optionLabel="name"
          placeholder="選擇標籤類型"
          class="w-full md:w-56"
        />
        <AutoComplete
          v-model="tagValue"
          inputId="multiple-ac-2"
          multiple
          fluid
          :typeahead="false"
          :suggestions="items"
          field="name"
          @complete="search"
        />
      </div>
    </div>
    <div>
      <label class="font-bold mb-2 block" for="status">商品狀態</label>
      <Select
        v-model="form.status"
        :options="statusOptions"
        optionLabel="name"
        optionValue="value"
        placeholder="選擇商品狀態"
        class="w-full md:w-56"
      />
    </div>

    <div>
      <button
        class="text-md text-white px-3 py-2 border-surface-200 rounded-md bg-primary cursor-pointer"
        @click="submit"
      >
        <slot>儲存商品</slot>
      </button>
    </div>
  </div>
</template>
