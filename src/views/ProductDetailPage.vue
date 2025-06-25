<script setup>
  import { ref, onMounted, nextTick } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import axios from '@/utils/axiosInstance'
  import Image from 'primevue/image'

  import Button from 'primevue/button'
  import { useToast } from 'primevue/usetoast'
  import InputNumber from 'primevue/inputnumber'
  import { useCartStore } from '@/stores/cart'
  import Toast from 'primevue/toast'

  const route = useRoute()
  const product = ref({})
  const quantity = ref(1)
  const inputRef = ref(null)
  const selectedImageIndex = ref(0)
  const cart = useCartStore()
  const router = useRouter()

  onMounted(async () => {
    window.scrollTo(0, 0)

    const id = route.params.id
    try {
      const res = await axios.get(`/products/${id}`)

      product.value = res.data

      await nextTick()
      if (!document.activeElement || document.activeElement === document.body) {
        inputRef.value?.$el?.querySelector('input')?.focus()
      }
    } catch (error) {
      if (error.response?.status === 404 || !error.response) {
        router.replace({ name: 'NotFound' })
      }
    }
  })

  const toast = useToast()
  const toggleFavorite = async () => {
    const productId = product.value?.id
    if (!productId) return

    const originalState = product.value.isFavorited
    product.value.isFavorited = !originalState

    try {
      if (product.value.isFavorited) {
        await axios.post('/favorites', { productId })
        toast.add({
          severity: 'success',
          summary: '成功加入收藏',
          detail: '可至「我的收藏」頁面查看此商品',
          life: 3000,
        })
      } else {
        await axios.delete(`/favorites/${productId}`)
        toast.add({
          severity: 'success',
          summary: '已移除收藏',
          detail: '此商品已從收藏清單中移除',
          life: 3000,
        })
      }
    } catch (err) {
      product.value.isFavorited = originalState
      if (err?.response?.status === 401) {
        toast.add({
          severity: 'warn',
          summary: '尚未登入',
          detail: '請先登入才能收藏商品',
          life: 3000,
        })
      } else {
        toast.add({
          severity: 'error',
          summary: '收藏操作失敗',
          detail: err?.response?.data?.error || '請稍後再試',
          life: 3000,
        })
      }
    }
  }

  const selectImage = (index) => {
    selectedImageIndex.value = index
  }

  const getCurrentImage = () => {
    if (!product.value.images) return null
    const allImages = [
      product.value.images.cover,
      ...(product.value.images.previews || []),
    ]
    return allImages[selectedImageIndex.value] || product.value.images.cover
  }

  const getTotalImages = () => {
    if (!product.value.images) return 0
    return 1 + (product.value.images.previews?.length || 0)
  }

  const addToCart = async () => {
    if (!product.value.id) {
      toast.add({
        severity: 'error',
        summary: '哦喔！',
        detail: '此商品暫時無法加入購物車',
        life: 3000,
      })
      return
    }

    try {
      await cart.add({ ...product.value, qty: quantity.value })
      toast.add({
        severity: 'success',
        summary: '成功',
        detail: `已加入購物車 ${quantity.value} 個！`,
        life: 3000,
      })
    } catch {
      toast.add({
        severity: 'warn',
        summary: '請先登入',
        detail: '請先登入會員再將商品加入購物車！',
        life: 3000,
      })
    }
  }
</script>

<template>
  <Toast />
  <div class="max-w-screen-md mx-auto px-4 py-10 space-y-6">
    <div class="bg-white shadow-md rounded-lg p-6 md:p-8">
      <div class="flex flex-col md:flex-row gap-10 items-start">
        <div class="w-full md:max-w-[460px] text-center mx-auto">
          <div class="relative inline-block">
            <Image
              v-if="getCurrentImage()"
              :src="getCurrentImage().imgUrl"
              alt="Product Image"
              imageClass="w-64 h-64 object-cover rounded mx-auto"
              preview
            />
            <div
              class="absolute bottom-2 right-2 bg-gray-300 bg-opacity-60 text-white text-xs px-2 py-1 rounded-[100px]"
            >
              {{ selectedImageIndex + 1 }} / {{ getTotalImages() }}
            </div>
          </div>

          <div v-if="product.images" class="flex justify-center gap-2 mt-4">
            <div
              class="w-16 h-16 border-2 rounded cursor-pointer overflow-hidden"
              :class="{
                'border-blue-500': selectedImageIndex === 0,
                'border-gray-300': selectedImageIndex !== 0,
              }"
              @click="selectImage(0)"
            >
              <img
                :src="product.images.cover.imgUrl"
                alt="Cover thumbnail"
                class="w-full h-full object-cover"
              />
            </div>

            <div
              v-for="(image, index) in product.images.previews || []"
              :key="image.id"
              class="w-16 h-16 border-2 rounded cursor-pointer overflow-hidden"
              :class="{
                'border-blue-500': selectedImageIndex === index + 1,
                'border-gray-300': selectedImageIndex !== index + 1,
              }"
              @click="selectImage(index + 1)"
            >
              <img
                :src="image.imgUrl"
                :alt="`Preview thumbnail ${index + 1}`"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div class="w-full md:max-w-[360px] mx-auto flex flex-col space-y-4">
          <h1 class="text-xl sm:text-2xl font-bold leading-snug text-black">
            {{ product.name }}
          </h1>

          <div class="text-lg sm:text-xl text-black font-bold">
            <span
              :class="{ 'line-through text-gray-400': product.discountPrice }"
            >
              ${{ product.price }}
            </span>
          </div>

          <div class="flex items-center gap-3">
            <label for="quantity" class="text-black text-sm">數量</label>
            <InputNumber
              v-model="quantity"
              :ref="inputRef"
              inputId="quantity"
              :min="1"
              showButtons
              buttonLayout="horizontal"
              decrementButtonClass="p-button-text !h-8 !w-8"
              incrementButtonClass="p-button-text !h-8 !w-8"
              inputClass="text-center w-12 h-8 text-sm"
              class="text-sm"
            >
              <template #incrementicon>
                <i class="pi pi-plus text-xs" />
              </template>
              <template #decrementicon>
                <i class="pi pi-minus text-xs" />
              </template>
            </InputNumber>
          </div>

          <div class="flex gap-3 mt-1">
            <Button
              label="加入購物車"
              icon="pi pi-shopping-cart"
              class="flex-1"
              @click="addToCart"
            />
            <Button
              :label="product.isFavorited ? '已收藏' : '收藏'"
              class="flex-1 flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black border-none"
              @click="toggleFavorite"
            >
              <template #icon>
                <i
                  :class="[
                    product.isFavorited
                      ? 'pi pi-heart-fill text-red-500'
                      : 'pi pi-heart text-white',
                    'text-xl',
                  ]"
                />
              </template>
            </Button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="bg-white shadow-md rounded-lg p-6 text-black text-base sm:text-lg leading-relaxed"
    >
      <div v-html="product.description"></div>
    </div>
  </div>
</template>
