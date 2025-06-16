<script setup>
import Image from 'primevue/image'
import { useCartStore } from '@/stores/cart'
import { useToast } from 'primevue/usetoast'

const cart = useCartStore()
const toast = useToast()

  const props = defineProps({
    product: Object,
  })

async function addToCart(e) {
  e.preventDefault()
  e.stopPropagation()
  try {
    await cart.add(props.product)
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '已加入購物車！',
      life: 3000,
    })
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: '錯誤',
      detail: err.message || '加入購物車失敗',
      life: 3000,
    })
  }
}
</script>

<template>
  <div class="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-all relative">
    <!-- 商品圖片 -->
    <img :src="product.image" alt="商品圖片" class="w-full h-64 object-contain bg-white" />

    <div class="p-4">
      <p
        class="text-sm sm:text-base font-medium line-clamp-2 min-h-[3.5em] leading-tight"
      >
        {{ product.name }}
      </p>
      <p class="text-lg sm:text-xl font-bold mt-2 text-black">
        ${{ product.price }}
      </p>
    </div>

    <!-- 購物車 icon -->
    <button
      class="absolute bottom-2 right-2 w-10 h-10 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
      @click="addToCart"
    >
      <i class="pi pi-shopping-cart"></i>
    </button>
  </div>
</template>
