<script setup>
  import { ref, onMounted } from 'vue'
  import draggable from 'vuedraggable'
  import { useToast } from 'primevue/usetoast'
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

  const MAX_FILE_SIZE_MB = 5
  const MAX_PREVIEW_IMAGES = 3
  const maxPreviewImages = ref(MAX_PREVIEW_IMAGES)

  const internalPendingImages = ref([])

  const loadImages = async () => {
    try {
      const res = await fetchProductImages(props.productId)
      if (!res || !res.data || !Array.isArray(res.data)) {
        throw new Error('無效的圖片資料')
      }

      const images = res.data
      coverImage.value = images.find((img) => img.isCover) || null
      previewImages.value = images.filter((img) => !img.isCover)
    } catch (err) {
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
    const isImage = file.type.startsWith('image/')
    const isSizeOK = file.size <= MAX_FILE_SIZE_MB * 1024 * 1024

    if (!isImage) {
      toast.add({
        severity: 'error',
        summary: '上傳失敗',
        detail: '檔案類型錯誤，僅接受圖片格式',
        life: 3000,
      })
      return false
    }
    if (!isSizeOK) {
      toast.add({
        severity: 'warn',
        summary: '上傳失敗',
        detail: `圖片大小不可超過 ${MAX_FILE_SIZE_MB}MB`,
        life: 3000,
      })
      return false
    }
    return true
  }

  const onSelectMainImage = async (e) => {
    const file = e.target.files[0]
    if (file && validateImage(file)) {
      if (!props.productId) {
        internalPendingImages.value.push({ file, isCover: true })
      } else {
        await upload(file, true)
      }
    }
  }

  const onSelectPreviewImages = async (e) => {
    const files = Array.from(e.target.files)
    const slotsLeft = MAX_PREVIEW_IMAGES - previewImages.value.length
    const validFiles = files.filter(validateImage).slice(0, slotsLeft)
    for (const file of validFiles) {
      if (!props.productId) {
        internalPendingImages.value.push({ file, isCover: false })
      } else {
        await upload(file, false)
      }
    }
  }

  const onDropMain = async (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && validateImage(file)) {
      if (!props.productId) {
        internalPendingImages.value.push({ file, isCover: true })
      } else {
        await upload(file, true)
      }
    }
  }

  const onDropPreviewImages = async (e) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    const slotsLeft = MAX_PREVIEW_IMAGES - previewImages.value.length
    const validFiles = files.filter(validateImage).slice(0, slotsLeft)
    for (const file of validFiles) {
      if (!props.productId) {
        internalPendingImages.value.push({ file, isCover: false })
      } else {
        await upload(file, false)
      }
    }
  }

  const upload = async (file, isCover) => {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('isCover', isCover ? 'true' : 'false')

    isUploading.value = true
    try {
      await uploadProductImage(props.productId, formData)
      await loadImages()
    } catch (err) {
      toast.add({
        severity: 'error',
        summary: '上傳失敗',
        detail: '請稍後再試或聯絡管理員',
        life: 3000,
      })
    } finally {
      isUploading.value = false
      checkPreviewLimit()
    }
  }

  const uploadPending = async (productId) => {
    if (!internalPendingImages.value.length) return
    isUploading.value = true
    try {
      for (const item of internalPendingImages.value) {
        const { file, isCover } = item
        const formData = new FormData()
        formData.append('image', file)
        formData.append('isCover', isCover ? 'true' : 'false')
        await uploadProductImage(productId, formData)
      }
      internalPendingImages.value = []
      await loadImages()
    } catch (err) {
      toast.add({
        severity: 'error',
        summary: '圖片上傳失敗',
        detail: '建立商品成功但圖片未成功上傳',
        life: 4000,
      })
    } finally {
      isUploading.value = false
    }
  }

  const deleteImage = async (imageId) => {
    isUploading.value = true
    try {
      await deleteProductImage(props.productId, imageId)
      await loadImages()
    } catch (err) {
      toast.add({
        severity: 'error',
        summary: '刪除失敗',
        detail: '無法刪除圖片，請稍後再試！',
        life: 3000,
      })
    } finally {
      isUploading.value = false
      checkPreviewLimit()
    }
  }

  const checkPreviewLimit = () => {
    overLimit.value = previewImages.value.length >= MAX_PREVIEW_IMAGES
  }

  const validateBeforeSubmit = () => {
    if (
      !coverImage.value &&
      !internalPendingImages.value.some((i) => i.isCover)
    ) {
      toast.add({
        severity: 'warn',
        summary: '驗證失敗',
        detail: '請上傳封面圖',
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
  <div>
    <div class="mb-6">
      <label class="block mb-2 text-sm font-medium">主圖</label>
      <div
        class="border p-4 border-dashed rounded bg-gray-50 text-center cursor-pointer"
        @dragover.prevent
        @drop.prevent="onDropMain"
        @click="$refs.coverInput.click()"
      >
        <p class="text-gray-500">拖曳或點擊選擇主圖</p>
        <input
          type="file"
          accept="image/*"
          class="hidden"
          ref="coverInput"
          @change="onSelectMainImage"
          name="cover"
        />
      </div>
      <div v-if="coverImage" class="mt-4 relative w-40">
        <img :src="coverImage.imgUrl" class="rounded shadow" />
        <button
          @click="deleteImage(coverImage.id)"
          class="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
        >
          ✕
        </button>
      </div>
    </div>

    <div class="mb-6">
      <label class="block mb-2 text-sm font-medium">小圖（最多3張）</label>
      <input
        type="file"
        ref="previewInput"
        multiple
        accept="image/*"
        @change="onSelectPreviewImages"
        :disabled="overLimit"
        class="block w-full border p-2 rounded cursor-pointer"
        name="previews"
      />

      <div
        class="border p-4 border-dashed rounded bg-gray-50 text-center mt-2"
        @dragover.prevent
        @drop.prevent="onDropPreviewImages"
        @click="$refs.previewInput.click()"
      >
        <p class="text-gray-500">拖曳小圖至此處</p>
      </div>

      <p v-if="overLimit" class="text-red-500 text-sm mt-2">
        已達上傳上限（最多 {{ maxPreviewImages }} 張）
      </p>

      <draggable
        v-model="previewImages"
        item-key="id"
        class="grid grid-cols-3 gap-2 mt-4"
      >
        <template #item="{ element }">
          <div class="relative">
            <img :src="element.imgUrl" class="rounded h-32 object-cover" />
            <button
              @click="deleteImage(element.id)"
              class="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
            >
              ✕
            </button>
          </div>
        </template>
      </draggable>
    </div>

    <div
      v-if="isUploading"
      class="fixed top-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center py-2 z-50"
    >
      上傳中，請稍候...
    </div>
  </div>
</template>
