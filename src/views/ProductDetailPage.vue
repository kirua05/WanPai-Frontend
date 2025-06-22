<script setup>
  import { ref, onMounted, nextTick } from 'vue'
  import { useRoute } from 'vue-router'
  import axios from '@/utils/axiosInstance'
  import Image from 'primevue/image'
  import Button from 'primevue/button'
  import { useToast } from 'primevue/usetoast'
  import InputNumber from 'primevue/inputnumber'

  const route = useRoute()
  const product = ref({})
  const quantity = ref(1)
  const inputRef = ref(null)

  onMounted(async () => {
    window.scrollTo(0, 0)

    const id = route.params.id

    const token = localStorage.getItem('token')
    const res = await axios.get(`/products/${id}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    })

    product.value = res.data

    await nextTick()
    if (!document.activeElement || document.activeElement === document.body) {
      inputRef.value?.$el?.querySelector('input')?.focus()
    }
  })

  const toast = useToast()
  const toggleFavorite = async () => {
    const productId = product.value?.id
    if (!productId) return

    const token = localStorage.getItem('token')

    if (!token) {
      toast.add({
        severity: 'warn',
        summary: '尚未登入',
        detail: '請先登入才能收藏商品',
        life: 3000,
      })
      return
    }

    const originalState = product.value.isFavorited
    product.value.isFavorited = !originalState

    try {
      if (product.value.isFavorited) {
        await axios.post(
          '/favorites',
          { productId },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } else {
        await axios.delete(`favorites/${productId}`)
, {
          headers: { Authorization: `Bearer ${token}` }
        }
      }
    } catch (err) {
      product.value.isFavorited = originalState
      toast.add({
        severity: 'error',
        summary: '收藏操作失敗',
        detail: err?.response?.data?.error || '請稍後再試',
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
          <Image
            v-if="product.images?.cover"
            :src="product.images.cover.imgUrl"
            alt="Product Cover Image"
            imageClass="w-64 h-64 object-cover rounded mx-auto"
            preview
          />
          <div class="text-sm text-black mt-2">1 / 3</div>
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
            />
            <Button
              :label="product.isFavorited ? '已收藏' : '收藏'"
              icon="pi pi-heart"
              class="flex-1"
              @click="toggleFavorite"
            />
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
