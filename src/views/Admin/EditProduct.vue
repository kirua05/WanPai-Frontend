<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, computed, reactive, watch } from 'vue'
import EditProductImage from '@/views/Admin/EditProductImage.vue'
import AutoComplete from 'primevue/autocomplete'
import Select from 'primevue/select'
import { createProduct, fetchProductById, updateProduct } from '@/api/product'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'

const imageUploaderRef = ref(null)
const showStockEdit = ref(false)
const toast = useToast()
const tagValue = ref([])
const pendingImages = ref([])
const isLoading = ref(false)
const isSaving = ref(false)
const isSearchingTags = ref(false)

const toolbarOptions = [
  ['bold', 'italic', 'underline'],
  [{ color: [] }, { background: [] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  ['link', 'image'],
  [{ list: 'ordered' }, { list: 'bullet' }],
]

const route = useRoute()
const router = useRouter()

const isCreateMode = computed(() => route.name === 'createProduct')
const productId = ref(Number(route.params.id) || null)

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

const formErrors = reactive({
  name: '',
  sku: '',
  description: '',
  price: '',
  stockOnHand: '',
  stockEditReason: '',
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
const search = async (event) => {
  if (!event.query || event.query.length < 2) {
    items.value = []
    return
  }

  isSearchingTags.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 300))
    items.value = [...Array(10).keys()]
      .map((i) => ({
        name: `${event.query}-${i}`,
        code: `TAG-${event.query}-${i}`,
        type: selectedType.value?.code || 'general',
      }))
      .filter((item) => !tagValue.value.some((tag) => tag.code === item.code))
  } catch {
    items.value = []
    toast.add({
      severity: 'warn',
      summary: '搜尋失敗',
      detail: '無法搜尋標籤，請稍後再試',
      life: 3000,
    })
  } finally {
    isSearchingTags.value = false
  }
}

const removeTag = (tagToRemove) => {
  tagValue.value = tagValue.value.filter(
    (tag) => tag.code !== tagToRemove.code
  )
}

const clearAllTags = () => {
  tagValue.value = []
}

const validateForm = () => {
  let isValid = true

  Object.keys(formErrors).forEach((key) => {
    formErrors[key] = ''
  })

  if (!form.value.name.trim()) {
    formErrors.name = '請填寫商品名稱'
    isValid = false
  } else if (form.value.name.length < 2) {
    formErrors.name = '商品名稱至少需要2個字元'
    isValid = false
  } else if (form.value.name.length > 100) {
    formErrors.name = '商品名稱不可超過100個字元'
    isValid = false
  }

  if (!form.value.sku.trim()) {
    formErrors.sku = '請填寫商品貨號'
    isValid = false
  } else if (!/^[A-Z0-9\-_]+$/i.test(form.value.sku)) {
    formErrors.sku = '貨號只能包含英文字母、數字、連字號和底線'
    isValid = false
  } else if (form.value.sku.length > 50) {
    formErrors.sku = '貨號不可超過50個字元'
    isValid = false
  }

  if (
    !form.value.description ||
    form.value.description.trim() === '' ||
    form.value.description === '<p></p>'
  ) {
    formErrors.description = '請填寫商品描述'
    isValid = false
  }

  if (form.value.price < 0) {
    formErrors.price = '價格不能為負數'
    isValid = false
  } else if (form.value.price > 999999) {
    formErrors.price = '價格不可超過999,999'
    isValid = false
  }

  if (form.value.stockOnHand < 0) {
    formErrors.stockOnHand = '庫存數量不能為負數'
    isValid = false
  }

  if (showStockEdit.value && !form.value.stockEditReason) {
    formErrors.stockEditReason = '修改庫存時請選擇修改原因'
    isValid = false
  }

  return isValid
}

const submit = async () => {
  if (!validateForm()) {
    toast.add({
      severity: 'warn',
      summary: '表單驗證失敗',
      detail: '請檢查並修正表單中的錯誤',
      life: 3000,
    })
    return
  }

  isSaving.value = true
  try {
    if (isCreateMode.value) {
      const createData = {
        name: form.value.name,
        sku: form.value.sku,
        description: form.value.description,
        price: Number(form.value.price),
        stockOnHand: Number(form.value.stockOnHand),
        status: form.value.status,
      }

      if (showStockEdit.value && form.value.stockEditReason) {
        createData.stockEditReason = form.value.stockEditReason
      }

      const tempCreateData = { ...createData, status: 'draft' }
      const created = await createProduct(tempCreateData)
      productId.value = created.id

      if (imageUploaderRef.value) {
        await imageUploaderRef.value.uploadPending(created.id)
      }

      await updateProduct(created.id, createData)

      toast.add({
        severity: 'success',
        summary: '建立成功',
        detail: '商品已成功建立',
        life: 3000,
      })


      router.push({ name: 'editProduct', params: { id: created.id } })
    } else {
      const updateData = {
        name: form.value.name,
        sku: form.value.sku,
        description: form.value.description,
        price: Number(form.value.price),
        stockOnHand: Number(form.value.stockOnHand),
        status: form.value.status,
      }

      if (showStockEdit.value && form.value.stockEditReason) {
        updateData.stockEditReason = form.value.stockEditReason
      }

      await updateProduct(productId.value, updateData)
      toast.add({
        severity: 'success',
        summary: '更新成功',
        detail: '商品資訊已更新',
        life: 3000,
      })
    }
  } catch (err) {
    let errorMessage = '操作失敗，請稍後再試'

    if (err.response?.status === 400) {
      const backendMessage =
        err.response?.data?.message || err.response?.data?.error
      if (backendMessage) {
        errorMessage = `資料驗證錯誤：${backendMessage}`
      } else {
        errorMessage = '資料格式錯誤，請檢查表單內容'
      }
    } else if (err.response?.status === 409) {
      errorMessage = '貨號已存在，請使用其他貨號'
    } else if (err.response?.status === 403) {
      errorMessage = '權限不足，無法執行此操作'
    } else if (err.response?.status >= 500) {
      errorMessage = '伺服器錯誤，請稍後再試'
    }

    toast.add({
      severity: 'error',
      summary: '操作失敗',
      detail: errorMessage,
      life: 5000,
    })
  } finally {
    isSaving.value = false
  }
}

onMounted(async () => {
  if (!isCreateMode.value && productId.value) {
    isLoading.value = true
    try {
      const res = await fetchProductById(productId.value)
      form.value = {
        name: res.name || '',
        sku: res.sku || '',
        description: res.description || '',
        price: Number(res.price) || 0,
        stockOnHand: Number(res.stockOnHand) || 0,
        status: res.status || 'draft',
        stockEditReason: '',
      }
    } catch {
      toast.add({
        severity: 'error',
        summary: '載入失敗',
        detail: '無法載入商品資料，請重新整理頁面',
        life: 5000,
      })
      router.push({ name: 'productList' })
    } finally {
      isLoading.value = false
    }
  }
})

watch(
  () => route.params.id,
  (newId) => {
    productId.value = Number(newId) || null
  }
)

watch(showStockEdit, (newVal) => {
  if (!newVal) {
    form.value.stockEditReason = ''
    formErrors.stockEditReason = ''
  }
})
</script>

<template>
  <Toast />
  <div class="max-w-6xl mx-auto p-6 bg-white min-h-screen">
    <div v-if="isLoading" class="flex flex-col justify-center items-center h-96">
      <ProgressSpinner style="width: 60px; height: 60px" strokeWidth="6" />
      <span class="mt-4 text-lg text-gray-600 font-medium">
        載入商品資料中...
      </span>
    </div>

    <div v-else class="space-y-8">
      <div class="border-b border-gray-200 pb-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">
              {{ isCreateMode ? '新增商品' : '編輯商品' }}
            </h1>
            <p class="mt-2 text-gray-600">
              {{ isCreateMode ? '建立新的商品記錄' : '更新商品資訊與設定' }}
            </p>
          </div>
          <div class="flex items-center space-x-3">
            <Button @click="router.go(-1)" :disabled="isSaving" severity="secondary" outlined
              class="px-5 py-2.5 font-medium hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-400"
              icon="pi pi-arrow-left">
              返回
            </Button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <i class="pi pi-info-circle mr-2 text-blue-600"></i>
              基本資訊
            </h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2" for="title">
                  商品名稱
                  <span class="text-red-500 ml-1">*</span>
                </label>
                <input v-model="form.name" type="text" id="title" maxlength="100" placeholder="請輸入商品名稱" :class="[
                  'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200',
                  formErrors.name
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 hover:border-gray-400',
                ]" />
                <div class="flex justify-between items-center mt-1">
                  <small v-if="formErrors.name" class="text-red-500">
                    {{ formErrors.name }}
                  </small>
                  <small class="text-gray-500 ml-auto">
                    {{ form.name.length }}/100
                  </small>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2" for="sku">
                  商品貨號
                  <span class="text-red-500 ml-1">*</span>
                </label>
                <input v-model="form.sku" type="text" id="sku" maxlength="50" placeholder="例如: PROD-001" :class="[
                  'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200',
                  formErrors.sku
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 hover:border-gray-400',
                ]" />
                <div class="mt-1">
                  <small v-if="formErrors.sku" class="text-red-500 block">
                    {{ formErrors.sku }}
                  </small>
                  <small class="text-gray-500 text-xs block mt-1">
                    只能包含英文字母、數字、連字號和底線
                  </small>
                </div>
              </div>
              <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <i class="pi pi-file-edit mr-2 text-green-600"></i>
                  商品描述
                  <span class="text-red-500 ml-1">*</span>
                </h3>
                <div :class="[
                  'rounded-lg overflow-hidden',
                  formErrors.description
                    ? 'border-2 border-red-500'
                    : 'border border-gray-200',
                ]">
                  <QuillEditor v-model:content="form.description" content-type="html" :toolbar="toolbarOptions"
                    theme="snow" style="height: 300px" placeholder="請輸入商品描述..." />
                </div>
                <small v-if="formErrors.description" class="text-red-500 mt-2 block">
                  {{ formErrors.description }}
                </small>
              </div>

              <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <i class="pi pi-images mr-2 text-purple-600"></i>
                  商品圖片
                </h3>
                <EditProductImage :productId="productId" :pending-images="pendingImages" :enabled="!!productId"
                  ref="imageUploaderRef" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2" for="price">
                  商品價格
                </label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    NT$
                  </span>
                  <input v-model.number="form.price" type="number" id="price" min="0" max="999999" step="0.01"
                    placeholder="0" :class="[
                      'w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200',
                      formErrors.price
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 hover:border-gray-400',
                    ]" />
                </div>
                <small v-if="formErrors.price" class="text-red-500 mt-1 block">
                  {{ formErrors.price }}
                </small>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <i class="pi pi-box mr-2 text-blue-600"></i>
              庫存管理
            </h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2" for="stock">
                  目前庫存數
                </label>
                <div class="relative">
                  <input v-model.number="form.stockOnHand" type="number" id="stock" min="0" :disabled="!showStockEdit"
                    :class="[
                      'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200',
                      formErrors.stockOnHand
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 hover:border-gray-400',
                      !showStockEdit ? 'bg-gray-100 cursor-not-allowed' : '',
                    ]" />
                </div>
                <small v-if="formErrors.stockOnHand" class="text-red-500 mt-1 block">
                  {{ formErrors.stockOnHand }}
                </small>
              </div>

              <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Checkbox v-model="showStockEdit" id="stockEdit" binary />
                <label class="text-sm font-medium text-gray-700" for="stockEdit">
                  允許修改庫存
                </label>
              </div>
            </div>
          </div>

          <div v-if="showStockEdit" class="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-4">
            <h4 class="font-semibold text-orange-800 mb-3 flex items-center">
              <i class="pi pi-exclamation-triangle mr-2"></i>
              庫存修改記錄
            </h4>
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-orange-800 mb-2">
                  修改原因
                  <span class="text-red-500 ml-1">*</span>
                </label>
                <Select v-model="form.stockEditReason" :options="stockEditReasonTypes" optionLabel="title"
                  optionValue="code" placeholder="選擇修改原因" :class="[
                    'w-full',
                    formErrors.stockEditReason ? 'border-red-500' : '',
                  ]" />
                <small v-if="formErrors.stockEditReason" class="text-red-500 mt-1 block">
                  {{ formErrors.stockEditReason }}
                </small>
              </div>
              <div class="text-sm text-orange-700 bg-orange-100 p-3 rounded-lg">
                <i class="pi pi-info-circle mr-1"></i>
                修改庫存將會記錄在庫存變更歷史中，並可供後續查詢與稽核
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <i class="pi pi-tags mr-2 text-orange-600"></i>
              商品標籤
            </h3>
            <div class="space-y-3">
              <div class="flex gap-4">
                <div class="flex-1">
                  <label class="text-sm text-gray-600 mb-1 block">
                    標籤類型
                  </label>
                  <Select v-model="selectedType" :options="types" optionLabel="name" placeholder="選擇標籤類型"
                    class="w-full" />
                </div>
                <div class="flex-2">
                  <label class="text-sm text-gray-600 mb-1 block">
                    搜尋標籤
                  </label>
                  <AutoComplete v-model="tagValue" multiple fluid :loading="isSearchingTags" :typeahead="false"
                    :suggestions="items" field="name" placeholder="輸入標籤名稱搜尋..." @complete="search"
                    :disabled="!selectedType" />
                </div>
              </div>

              <div v-if="tagValue.length > 0" class="mt-3">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-gray-700">
                    已選擇標籤 ({{ tagValue.length }})
                  </span>
                  <button @click="clearAllTags" type="button" class="text-sm text-red-600 hover:text-red-800 underline">
                    清除全部
                  </button>
                </div>
                <div class="flex flex-wrap gap-2">
                  <div v-for="tag in tagValue" :key="tag.code"
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200">
                    <span class="mr-2">{{ tag.name }}</span>
                    <button @click="removeTag(tag)" type="button"
                      class="flex-shrink-0 ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-600 focus:outline-none focus:bg-blue-500 focus:text-white">
                      <svg class="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                        <path stroke-linecap="round" stroke-width="1.5" d="m1 1 6 6m0-6-6 6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="!selectedType" class="text-sm text-gray-500 italic bg-gray-50 p-3 rounded-lg">
                <i class="pi pi-info-circle mr-2"></i>
                請先選擇標籤類型才能搜尋標籤
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <i class="pi pi-flag mr-2 text-red-600"></i>
              商品狀態
            </h3>
            <Select v-model="form.status" :options="statusOptions" optionLabel="name" optionValue="value"
              placeholder="選擇商品狀態" class="w-full" />
            <div class="mt-3 text-sm text-gray-600">
              <div class="space-y-1">
                <div class="flex items-center">
                  <span class="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  <span>上架中:商品可被搜尋與購買</span>
                </div>
                <div class="flex items-center">
                  <span class="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                  <span>草稿:不公開顯示，可繼續編輯</span>
                </div>
                <div class="flex items-center">
                  <span class="w-3 h-3 bg-gray-500 rounded-full mr-2"></span>
                  <span>典藏:已下架，不可購買</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="sticky bottom-0 bg-white border-t border-gray-200 p-6 mt-8">
        <div class="flex justify-between items-center max-w-6xl mx-auto">
          <div class="text-sm text-gray-500">
            <i class="pi pi-info-circle mr-1"></i>
            {{
              isCreateMode
                ? '請確認所有資訊填寫完整後再建立商品'
                : '修改後請記得儲存更新'
            }}
          </div>
          <div class="flex gap-3">
            <Button @click="router.go(-1)" :disabled="isSaving" severity="secondary" outlined
              class="px-6 py-3 min-w-24 h-12 font-medium hover:shadow-lg transition-all duration-200 border-2"
              icon="pi pi-arrow-left">
              返回
            </Button>
            <Button @click="submit" :loading="isSaving" :disabled="isSaving"
              class="px-8 py-3 min-w-32 h-12 font-semibold text-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              severity="primary" :icon="isCreateMode ? 'pi pi-plus' : 'pi pi-save'">
              <template v-if="!isSaving">
                {{ isCreateMode ? '建立商品' : '儲存更新' }}
              </template>
              <template v-else>
                {{ isCreateMode ? '建立中...' : '儲存中...' }}
              </template>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
