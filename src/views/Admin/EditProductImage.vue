<script setup>
  import { ref, onMounted, computed } from 'vue'
  import draggable from 'vuedraggable'
  import { useToast } from 'primevue/usetoast'
  import ProgressBar from 'primevue/progressbar'
  import Button from 'primevue/button'
  import Dialog from 'primevue/dialog'
  import Image from 'primevue/image'
  import {
    fetchProductImages,
    uploadProductImage,
    deleteProductImage,
  } from '@/api/productImage'

  const props = defineProps({
    productId: Number,
    pendingImages: Array,
    enabled: Boolean,
  })

  const toast = useToast()

  const coverImage = ref(null)
  const previewImages = ref([])
  const isUploading = ref(false)
  const overLimit = ref(false)
  const uploadProgress = ref(0)
  const showPreview = ref(false)
  const previewImageUrl = ref('')
  const maxRetries = 3

  const MAX_FILE_SIZE_MB = 5
  const MAX_PREVIEW_IMAGES = 3
  const SUPPORTED_FORMATS = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
  ]

  const totalImages = computed(() => {
    return (
      (coverImage.value ? 1 : 0) +
      previewImages.value.length +
      internalPendingImages.value.length
    )
  })

  const internalPendingImages = ref([])

  const loadImages = async (productId = null) => {
    const targetProductId = productId || props.productId
    if (!targetProductId) {
      return
    }

    try {
      const res = await fetchProductImages(targetProductId)
      if (!res || !res.data || !Array.isArray(res.data)) {
        throw new Error('無效的圖片資料')
      }

      const images = res.data
      coverImage.value = images.find((img) => img.isCover) || null
      previewImages.value = images.filter((img) => !img.isCover)
    } catch {
      coverImage.value = null
      previewImages.value = []
      toast.add({
        severity: 'error',
        summary: '載入失敗',
        detail: '無法載入圖片，請稍後再試！',
        life: 3000,
      })
    } finally {
      checkPreviewLimit()
    }
  }

  const validateImage = (file) => {
    const errors = []

    const isValidType =
      SUPPORTED_FORMATS.includes(file.type) ||
      file.type.startsWith('image/') ||
      /\.(jpe?g|png|gif|webp)$/i.test(file.name)

    if (!isValidType) {
      errors.push(`不支援的檔案格式: ${file.type} (檔名: ${file.name})`)
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      errors.push(`檔案大小超過 ${MAX_FILE_SIZE_MB}MB`)
    }

    if (file.name.length > 100) {
      errors.push('檔案名稱過長')
    }

    if (errors.length > 0) {
      toast.add({
        severity: 'error',
        summary: '檔案驗證失敗',
        detail: errors.join(', '),
        life: 4000,
      })
      return false
    }
    return true
  }

  const createImagePreview = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target.result) {
          resolve(e.target.result)
        } else {
          reject(new Error('Failed to read file'))
        }
      }
      reader.onerror = () => {
        reject(new Error('FileReader error'))
      }
      reader.readAsDataURL(file)
    })
  }

  const onSelectMainImage = async (e) => {
    const file = e.target.files[0]
    if (file && validateImage(file)) {
      if (!props.productId) {
        try {
          const preview = await createImagePreview(file)
          internalPendingImages.value = internalPendingImages.value.filter(
            (img) => !img.isCover
          )
          internalPendingImages.value.push({ file, isCover: true, preview })
        } catch {
          toast.add({
            severity: 'error',
            summary: '預覽失敗',
            detail: '無法產生圖片預覽',
            life: 3000,
          })
        }
      } else {
        try {
          await upload(file, true)
        } catch {
          toast.add({
            severity: 'error',
            summary: '上傳失敗',
            detail: '後端服務異常，但圖片預覽功能正常',
            life: 5000,
          })
        }
      }
    }
    e.target.value = ''
  }

  const onSelectPreviewImages = async (e) => {
    const files = Array.from(e.target.files)
    const slotsLeft =
      MAX_PREVIEW_IMAGES -
      previewImages.value.length -
      internalPendingImages.value.filter((img) => !img.isCover).length

    if (slotsLeft <= 0) {
      toast.add({
        severity: 'warn',
        summary: '上傳限制',
        detail: `最多只能上傳 ${MAX_PREVIEW_IMAGES} 張小圖`,
        life: 3000,
      })
      return
    }

    const validFiles = files.filter(validateImage).slice(0, slotsLeft)

    for (const file of validFiles) {
      if (!props.productId) {
        try {
          const preview = await createImagePreview(file)
          internalPendingImages.value.push({ file, isCover: false, preview })
        } catch {
          toast.add({
            severity: 'error',
            summary: '預覽失敗',
            detail: `無法產生圖片預覽: ${file.name}`,
            life: 3000,
          })
        }
      } else {
        await upload(file, false)
      }
    }
    e.target.value = ''
  }

  const onDropMain = async (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && validateImage(file)) {
      if (!props.productId) {
        try {
          const preview = await createImagePreview(file)
          internalPendingImages.value = internalPendingImages.value.filter(
            (img) => !img.isCover
          )
          internalPendingImages.value.push({ file, isCover: true, preview })
        } catch {
          toast.add({
            severity: 'error',
            summary: '預覽失敗',
            detail: '無法產生圖片預覽',
            life: 3000,
          })
        }
      } else {
        await upload(file, true)
      }
    }
  }

  const onDropPreviewImages = async (e) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    const slotsLeft =
      MAX_PREVIEW_IMAGES -
      previewImages.value.length -
      internalPendingImages.value.filter((img) => !img.isCover).length

    if (slotsLeft <= 0) {
      toast.add({
        severity: 'warn',
        summary: '上傳限制',
        detail: `最多只能上傳 ${MAX_PREVIEW_IMAGES} 張小圖`,
        life: 3000,
      })
      return
    }

    const validFiles = files.filter(validateImage).slice(0, slotsLeft)

    for (const file of validFiles) {
      if (!props.productId) {
        try {
          const preview = await createImagePreview(file)
          internalPendingImages.value.push({ file, isCover: false, preview })
        } catch {
          toast.add({
            severity: 'error',
            summary: '預覽失敗',
            detail: `無法產生圖片預覽: ${file.name}`,
            life: 3000,
          })
        }
      } else {
        await upload(file, false)
      }
    }
  }

  const uploadWithRetry = async (
    file,
    isCover,
    currentRetry = 0,
    productId = null
  ) => {
    try {
      const formData = new FormData()
      if (isCover) {
        formData.append('cover', file)
      } else {
        formData.append('previews', file)
      }

      const targetProductId = productId || props.productId
      if (!targetProductId) {
        throw new Error('Product ID is required for upload')
      }

      const response = await uploadProductImage(targetProductId, formData)
      return response
    } catch (err) {
      if (currentRetry < maxRetries) {
        // console.log(`上傳失敗，第 ${currentRetry + 1} 次重試...`)
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * (currentRetry + 1))
        )
        return uploadWithRetry(file, isCover, currentRetry + 1, productId)
      }
      throw err
    }
  }

  const upload = async (file, isCover) => {
    isUploading.value = true
    uploadProgress.value = 0

    try {
      const progressInterval = setInterval(() => {
        if (uploadProgress.value < 90) {
          uploadProgress.value += Math.random() * 10
        }
      }, 200)

      await uploadWithRetry(file, isCover, 0)
      uploadProgress.value = 100
      clearInterval(progressInterval)

      await loadImages()

      toast.add({
        severity: 'success',
        summary: '上傳成功',
        detail: isCover ? '主圖上傳成功' : '圖片上傳成功',
        life: 2000,
      })
    } catch (uploadError) {
      let errorMessage = '上傳失敗，請稍後再試'

      if (uploadError.response?.status === 400) {
        const backendMessage =
          uploadError.response?.data?.message ||
          uploadError.response?.data?.error
        if (backendMessage) {
          errorMessage = `上傳驗證錯誤：${backendMessage}`
        } else {
          errorMessage = '檔案格式或內容有誤'
        }
      } else if (uploadError.response?.status === 413) {
        errorMessage = '檔案大小超過上傳限制'
      } else if (uploadError.response?.status === 415) {
        errorMessage = '不支援的檔案格式'
      } else if (uploadError.response?.status >= 500) {
        errorMessage = '伺服器錯誤，請稍後再試'
      }

      toast.add({
        severity: 'error',
        summary: '上傳失敗',
        detail: errorMessage,
        life: 5000,
      })
    } finally {
      isUploading.value = false
      uploadProgress.value = 0
      checkPreviewLimit()
    }
  }

  const uploadPending = async (productId) => {
    if (!internalPendingImages.value.length) return
    if (!productId) {
      return
    }

    isUploading.value = true
    uploadProgress.value = 0

    try {
      const totalFiles = internalPendingImages.value.length

      for (let i = 0; i < totalFiles; i++) {
        const item = internalPendingImages.value[i]
        const { file, isCover } = item

        uploadProgress.value = (i / totalFiles) * 100

        await uploadWithRetry(file, isCover, 0, productId)
      }

      uploadProgress.value = 100
      internalPendingImages.value = []
      await loadImages(productId)

      toast.add({
        severity: 'success',
        summary: '批量上傳成功',
        detail: `成功上傳 ${totalFiles} 張圖片`,
        life: 3000,
      })
    } catch {
      toast.add({
        severity: 'error',
        summary: '批量上傳失敗',
        detail: '部分圖片未能成功上傳，請手動重新上傳',
        life: 5000,
      })
    } finally {
      isUploading.value = false
      uploadProgress.value = 0
    }
  }

  const deleteImage = async (imageId) => {
    if (!confirm('確定要刪除這張圖片嗎？')) {
      return
    }

    isUploading.value = true
    try {
      await deleteProductImage(props.productId, imageId)
      await loadImages()

      toast.add({
        severity: 'success',
        summary: '刪除成功',
        detail: '圖片已成功刪除',
        life: 2000,
      })
    } catch (deleteError) {
      let errorMessage = '無法刪除圖片，請稍後再試'

      if (deleteError.response?.status === 403) {
        errorMessage = '權限不足，無法刪除圖片'
      } else if (deleteError.response?.status === 404) {
        errorMessage = '圖片不存在或已被刪除'
      }

      toast.add({
        severity: 'error',
        summary: '刪除失敗',
        detail: errorMessage,
        life: 3000,
      })
    } finally {
      isUploading.value = false
      checkPreviewLimit()
    }
  }

  const removePendingImage = (index) => {
    internalPendingImages.value.splice(index, 1)
    checkPreviewLimit()
  }

  const previewImage = (imageUrl) => {
    previewImageUrl.value = imageUrl
    showPreview.value = true
  }

  const checkPreviewLimit = () => {
    overLimit.value = previewImages.value.length >= MAX_PREVIEW_IMAGES
  }

  const validateBeforeSubmit = () => {
    const hasCoverImage =
      coverImage.value || internalPendingImages.value.some((i) => i.isCover)

    if (!hasCoverImage) {
      toast.add({
        severity: 'warn',
        summary: '驗證失敗',
        detail: '請上傳封面圖片',
        life: 3000,
      })
      return false
    }

    const totalPendingImages = internalPendingImages.value.length
    const totalExistingImages =
      (coverImage.value ? 1 : 0) + previewImages.value.length

    if (totalPendingImages === 0 && totalExistingImages === 0) {
      toast.add({
        severity: 'warn',
        summary: '驗證失敗',
        detail: '請至少上傳一張圖片',
        life: 3000,
      })
      return false
    }

    return true
  }

  onMounted(() => {
    if (props.productId) {
      loadImages()
    }
  })

  defineExpose({
    validateBeforeSubmit,
    uploadPending,
  })
</script>

<template>
  <Toast />
  <div class="space-y-8">
    <div
      class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6"
    >
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center">
          <div
            class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3"
          >
            <i class="pi pi-image text-white text-lg"></i>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900">
              主圖設定
              <span class="text-red-500 ml-1">*</span>
            </h4>
            <p class="text-sm text-gray-600">商品的主要展示圖片</p>
          </div>
        </div>
        <div class="text-right">
          <div
            class="text-xs text-gray-500 bg-white px-3 py-1 rounded-full border"
          >
            支援 JPEG, PNG, WebP, GIF
          </div>
          <div class="text-xs text-gray-500 mt-1">
            最大 {{ MAX_FILE_SIZE_MB }}MB
          </div>
        </div>
      </div>

      <div
        :class="[
          'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 transform hover:scale-102',
          coverImage || internalPendingImages.some((img) => img.isCover)
            ? 'border-green-400 bg-green-50 shadow-lg'
            : 'border-blue-300 bg-white hover:border-blue-400 hover:bg-blue-50 hover:shadow-md',
        ]"
        @dragover.prevent
        @dragenter.prevent
        @drop.prevent="onDropMain"
        @click="$refs.coverInput.click()"
      >
        <div
          v-if="
            !coverImage && !internalPendingImages.some((img) => img.isCover)
          "
        >
          <div
            class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <i class="pi pi-cloud-upload text-2xl text-blue-600"></i>
          </div>
          <p class="text-gray-700 font-semibold text-lg mb-2">
            拖曳或點擊上傳主圖
          </p>
          <p class="text-gray-500 text-sm">建議尺寸: 800x800px 或更高解析度</p>
        </div>
        <div v-else>
          <div
            class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <i class="pi pi-check-circle text-2xl text-green-600"></i>
          </div>
          <p class="text-green-700 font-semibold text-lg">主圖已設定</p>
          <p class="text-green-600 text-sm mt-1">可再次上傳以更換</p>
        </div>

        <input
          type="file"
          accept="image/*"
          class="hidden"
          ref="coverInput"
          @change="onSelectMainImage"
        />
      </div>

      <div class="mt-6">
        <h5 class="text-sm font-medium text-gray-700 mb-3">主圖預覽</h5>
        <div class="grid grid-cols-1 gap-4">
          <div v-if="coverImage" class="flex justify-center">
            <div class="relative group w-40 h-40">
              <img
                :src="coverImage.imgUrl"
                class="w-full h-full object-cover rounded-xl shadow-lg cursor-pointer transition-transform group-hover:scale-105"
                @click="previewImage(coverImage.imgUrl)"
              />
              <div
                class="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-xl flex items-center justify-center"
              >
                <div
                  class="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2"
                >
                  <Button
                    @click.stop="previewImage(coverImage.imgUrl)"
                    severity="info"
                    size="small"
                    class="shadow-lg"
                    icon="pi pi-eye"
                    rounded
                  />
                  <Button
                    @click.stop="deleteImage(coverImage.id)"
                    :disabled="isUploading"
                    severity="danger"
                    size="small"
                    class="shadow-lg"
                    icon="pi pi-trash"
                    rounded
                  />
                </div>
              </div>
            </div>
            <div class="mt-3 text-center">
              <span
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                <i class="pi pi-star-fill mr-1"></i>
                主圖
              </span>
            </div>
          </div>

          <div
            v-for="(item, index) in internalPendingImages.filter(
              (img) => img.isCover
            )"
            :key="'pending-cover-' + index"
            class="relative group"
          >
            <div class="relative w-40 h-40 mx-auto">
              <img
                :src="item.preview"
                :alt="item.file?.name || '預覽圖片'"
                class="w-full h-full object-cover rounded-xl shadow-lg border-2 border-orange-300 cursor-pointer transition-transform group-hover:scale-105"
                @click="previewImage(item.preview)"
                @error="handleImageError"
                @load="handleImageLoad"
              />
              <Button
                @click.stop="
                  removePendingImage(
                    internalPendingImages.findIndex(
                      (img) => img.isCover && img === item
                    )
                  )
                "
                severity="danger"
                size="small"
                class="absolute top-2 right-2 shadow-lg"
                icon="pi pi-trash"
                rounded
              />
            </div>
            <div class="mt-1 text-center">
              <span
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800"
              >
                <i class="pi pi-clock mr-1"></i>
                待上傳主圖
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6"
    >
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center">
          <div
            class="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-3"
          >
            <i class="pi pi-images text-white text-lg"></i>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900">
              小圖集 (最多{{ MAX_PREVIEW_IMAGES }}張)
            </h4>
            <p class="text-sm text-gray-600">商品的額外展示圖片</p>
          </div>
        </div>
        <div class="text-right">
          <div
            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
          >
            <i class="pi pi-chart-pie mr-1"></i>
            已上傳:
            {{
              previewImages.length +
              internalPendingImages.filter((img) => !img.isCover).length
            }}/{{ MAX_PREVIEW_IMAGES }}
          </div>
        </div>
      </div>

      <div
        :class="[
          'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300',
          overLimit
            ? 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-60'
            : 'border-purple-300 bg-white hover:border-purple-400 hover:bg-purple-50 hover:shadow-md transform hover:scale-102',
        ]"
        @dragover.prevent
        @dragenter.prevent
        @drop.prevent="onDropPreviewImages"
        @click="!overLimit && $refs.previewInput.click()"
      >
        <div v-if="!overLimit">
          <div
            class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <i class="pi pi-images text-2xl text-purple-600"></i>
          </div>
          <p class="text-gray-700 font-semibold text-lg mb-2">
            拖曳或點擊上傳小圖
          </p>
          <p class="text-gray-500 text-sm">可同時選擇多張圖片</p>
        </div>
        <div v-else>
          <div
            class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <i class="pi pi-ban text-2xl text-gray-400"></i>
          </div>
          <p class="text-gray-500 font-semibold text-lg">已達上傳上限</p>
          <p class="text-gray-400 text-sm mt-1">請刪除現有圖片後再上傳新的</p>
        </div>

        <input
          type="file"
          ref="previewInput"
          multiple
          accept="image/*"
          @change="onSelectPreviewImages"
          :disabled="overLimit"
          class="hidden"
        />
      </div>

      <div
        v-if="
          previewImages.length > 0 ||
          internalPendingImages.filter((img) => !img.isCover).length > 0
        "
        class="mt-6"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <h4 class="text-sm font-semibold text-gray-700">圖片管理</h4>
            <span
              class="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600"
            >
              <i class="pi pi-sort mr-1"></i>
              <!-- 可拖曳排序 -->
            </span>
          </div>
        </div>

        <draggable
          v-model="previewImages"
          item-key="id"
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          <template #item="{ element }">
            <div class="relative group">
              <div class="relative overflow-hidden rounded-xl">
                <img
                  :src="element.imgUrl"
                  class="w-full h-28 object-cover cursor-pointer transition-all duration-300 group-hover:scale-110"
                  @click="previewImage(element.imgUrl)"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  <div
                    class="absolute bottom-2 left-2 right-2 flex justify-between items-end"
                  >
                    <Button
                      @click.stop="previewImage(element.imgUrl)"
                      severity="info"
                      size="small"
                      class="shadow-lg"
                      icon="pi pi-eye"
                      rounded
                    />
                    <Button
                      @click.stop="deleteImage(element.id)"
                      :disabled="isUploading"
                      severity="danger"
                      size="small"
                      class="shadow-lg"
                      icon="pi pi-trash"
                      rounded
                    />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </draggable>

        <div
          v-if="internalPendingImages.filter((img) => !img.isCover).length > 0"
          class="mt-3"
        >
          <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            <div
              v-for="(item, index) in internalPendingImages.filter(
                (img) => !img.isCover
              )"
              :key="'pending-preview-' + index"
              class="relative group"
            >
              <div class="relative">
                <img
                  :src="item.preview"
                  :alt="item.file?.name || '預覽圖片'"
                  class="w-full h-24 object-cover rounded-lg shadow-sm border-2 border-orange-300 cursor-pointer transition-transform hover:scale-105"
                  @click="previewImage(item.preview)"
                  @error="handleImageError"
                  @load="handleImageLoad"
                />
                <Button
                  @click.stop="
                    removePendingImage(internalPendingImages.indexOf(item))
                  "
                  severity="danger"
                  size="small"
                  class="absolute top-1 right-1 shadow-lg"
                  icon="pi pi-trash"
                  rounded
                />
                <div class="absolute top-1 left-1">
                  <span
                    class="text-xs bg-orange-100 text-orange-800 px-1 py-0.5 rounded"
                  >
                    待上傳
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="isUploading"
      class="fixed bottom-4 right-4 bg-white border border-blue-200 rounded-xl shadow-2xl p-6 z-50 min-w-80"
    >
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center">
          <div
            class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3"
          >
            <i class="pi pi-cloud-upload text-blue-600"></i>
          </div>
          <span class="text-sm font-semibold text-gray-800">上傳中...</span>
        </div>
        <span class="text-sm font-bold text-blue-600">
          {{ Math.round(uploadProgress) }}%
        </span>
      </div>
      <ProgressBar :value="uploadProgress" class="mb-3 h-2" />
      <div class="flex items-center text-xs text-gray-600">
        <i class="pi pi-info-circle mr-1"></i>
        請勿關閉頁面，上傳完成後會自動更新
      </div>
    </div>

    <Dialog
      v-model:visible="showPreview"
      modal
      :style="{ width: '90vw', maxWidth: '800px' }"
      :maximizable="true"
      class="image-preview-dialog"
    >
      <template #header>
        <div class="flex items-center">
          <i class="pi pi-eye mr-2 text-blue-600"></i>
          <span class="font-bold text-lg">圖片預覽</span>
        </div>
      </template>
      <div class="flex justify-center items-center bg-gray-50 rounded-lg p-4">
        <Image
          :src="previewImageUrl"
          alt="圖片預覽"
          class="max-w-full max-h-96 rounded-lg shadow-lg"
          preview
        />
      </div>
      <template #footer>
        <div class="flex justify-end">
          <Button
            label="關閉"
            icon="pi pi-times"
            @click="showPreview = false"
            severity="secondary"
          />
        </div>
      </template>
    </Dialog>
    <div
      v-if="totalImages > 0"
      class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border p-4"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div
            class="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center mr-3"
          >
            <i class="pi pi-chart-bar text-white text-sm"></i>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-700">圖片統計</p>
            <p class="text-xs text-gray-500">
              總圖片數: {{ totalImages }}/{{ MAX_PREVIEW_IMAGES + 1 }}
            </p>
          </div>
        </div>
        <div v-if="internalPendingImages.length > 0" class="text-right">
          <span
            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
          >
            <i class="pi pi-clock mr-1"></i>
            待上傳: {{ internalPendingImages.length }} 張
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
