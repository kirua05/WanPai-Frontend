<script setup>
  import { useRoute } from 'vue-router'
  import { ref, onMounted } from 'vue'
  import UploadFile from '@/components/UploadFile.vue'
  import AutoComplete from 'primevue/autocomplete'
  import Select from 'primevue/select'
  import { createProduct, fetchProductById, updateProduct } from '@/api/product'
  import { QuillEditor } from '@vueup/vue-quill'
  import '@vueup/vue-quill/dist/vue-quill.snow.css'
  import { useToast } from 'primevue/usetoast'
  import Toast from 'primevue/toast'
  import Checkbox from 'primevue/checkbox'
  const showStockEdit = ref(false)
  const toast = useToast()

  const toolbarOptions = [
    ['bold', 'italic', 'underline'],
    [{ color: [] }, { background: [] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['link', 'image'],
    [{ list: 'ordered' }, { list: 'bullet' }],
  ]

  const route = useRoute()
  const mode = route.query.mode || 'edit'
  const productId = route.params.id || null

  const isCreateMode = mode === 'create'

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
    stockEditReason: '',
    status: 'draft',
  })

  const stockEditReasonTypes = ref([
    { title: '初始建檔', code: 'initial' },
    { title: '進貨', code: 'stock_in' },
    { title: '出貨', code: 'stock_out' },
    { title: '盤點調整', code: 'adjustment' },
    { title: '退貨', code: 'return' },
  ])
  const selectedType = ref()
  const types = ref([
    { name: 'ip', code: 'ip' },
    { name: '系列', code: 'siries' },
    { name: '品牌', code: 'brand' },
  ])
  const items = ref([])
  // 商品標籤選擇 WIP
  const search = (event) => {
    items.value = [...Array(10).keys()].map((item) => event.query + '-' + item)
  }

  const submit = async () => {
    if (!form.value.name) {
      toast.add({
        severity: 'warn',
        summary: '請輸入商品名稱',
        life: 3000,
      })
      return
    }
    if (!form.value.sku) {
      toast.add({
        severity: 'warn',
        summary: '請輸入商品貨號',
        life: 3000,
      })
      return
    }
    if (!form.value.description) {
      toast.add({
        severity: 'warn',
        summary: '請輸入商品描述',
        life: 3000,
      })
      return
    }
    const productId = route.params.id
    if (isCreateMode) {
      try {
        await createProduct({ ...form.value })
        toast.add({
          severity: 'success',
          summary: '成功！',
          detail: '已成功新增商品',
          life: 3000,
        })
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
        toast.add({
          severity: 'warn',
          summary: '哦喔！',
          detail: '暫時無法新增商品，請稍後再試',
          life: 3000,
        })
      }
    } else {
      try {
        await updateProduct(productId, { ...form.value })
        toast.add({
          severity: 'success',
          summary: '成功！',
          detail: '已成功更新商品',
          life: 3000,
        })
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
        toast.add({
          severity: 'warn',
          summary: '哦喔！',
          detail: '暫時無法更新商品，請稍後再試',
          life: 3000,
        })
      }
    }
  }

  onMounted(async () => {
    if (!isCreateMode && productId) {
      const res = await fetchProductById(productId)
      form.value = {
        name: res.name,
        sku: res.sku,
        description: res.description,
        price: res.price,
        stockOnHand: res.stockOnHand,
        status: res.status,
      }
    }
  })
</script>

<template>
  <Toast />
  <div class="mr-6">
    <h2 class="text-2xl">
      {{ isCreateMode ? '新增商品' : '編輯商品' }}
    </h2>
    <div class="flex flex-col gap-4 mt-4">
      <div>
        <label class="font-bold mb-2 block" for="title">商品名稱</label>
        <input
          v-model="form.name"
          type="text"
          id="title"
          class="bg-surface-0 rounded-md border-surface-300 border focus:outline-none focus:ring-0 enabled:focus:border-primary w-full px-3 py-2 transition-colors duration-200"
        />
      </div>

      <div>
        <label class="font-bold mb-2 block" for="sku">商品貨號</label>
        <input
          v-model="form.sku"
          type="text"
          id="sku"
          class="bg-surface-0 rounded-md border-surface-300 border focus:outline-none focus:ring-0 enabled:focus:border-primary w-full px-3 py-2 transition-colors duration-200"
        />
      </div>
      <div>
        <label class="font-bold mb-2 block" for="description">商品描述</label>
        <QuillEditor
          v-model:content="form.description"
          content-type="html"
          :toolbar="toolbarOptions"
          theme="snow"
          style="height: 300px"
        />
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
          class="bg-surface-0 rounded-md border-surface-300 border focus:outline-none focus:ring-0 enabled:focus:border-primary w-full md:w-56 px-3 py-2 transition-colors duration-200"
        />
      </div>

      <div>
        <label class="font-bold mb-2 block" for="stock">目前庫存數</label>
        <div class="flex gap-4 items-end">
          <input
            v-model="form.stockOnHand"
            type="number"
            id="stock"
            min="0"
            disabled
            class="block bg-surface-0 rounded-md border-surface-300 border focus:outline-none focus:ring-0 enabled:focus:border-primary w-full md:w-56 px-3 py-2 transition-colors duration-200"
          />
          <div>
            <Checkbox v-model="showStockEdit" id="stockEdit" binary />
            <label class="ml-2" for="stockEdit">修改庫存</label>
          </div>
        </div>
      </div>

      <div class="mt-2" v-if="showStockEdit">
        <label class="font-bold mb-2 block">修改後庫存</label>
        <input
          type="number"
          v-model="form.stockOnHand"
          min="0"
          class="block bg-surface-0 rounded-md border-surface-300 border focus:outline-none focus:ring-0 enabled:focus:border-primary w-full md:w-56 px-3 py-2 transition-colors duration-200"
        />
        <label class="font-bold mb-2 mt-2 block">修改原因</label>
        <Select
          v-model="form.stockEditReason"
          :options="stockEditReasonTypes"
          optionLabel="title"
          placeholder="選擇修改原因"
          class="w-full md:w-56"
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
  </div>
</template>
