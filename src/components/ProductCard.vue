<script setup>
import { useCartStore } from '@/stores/cart'
import { showToast } from '@/utils/toast'

const cart = useCartStore()


const props = defineProps({
  product: Object,
})

async function addToCart(e) {
  e.preventDefault()
  e.stopPropagation()
  try {
    await cart.add(props.product)
    showToast({
      severity: 'success',
      summary: '成功',
      detail: '已加入購物車！',
    })
  } catch (err) {
    if (import.meta.env.DEV) {
      showToast({
        severity: 'error',
        summary: '操作失敗',
        detail: err.message,
      })

    } else {
      showToast({
        severity: 'warn',
        summary: '操作失敗',
        detail: '暫時無法加入購物車，請稍後再試',
      })

    }
  }
}
</script>

<template>
  <div class="bg-white  rounded-lg overflow-hidden shadow hover:shadow-lg transition-all relative">
    <img :src="product.coverImage" alt="商品圖片" class="w-full h-64 object-contain bg-white " />
    <div class="p-4">
      <p class="text-sm sm:text-base font-medium line-clamp-2 min-h-[3.5em] leading-tight text-black ">
        {{ product.name }}
      </p>
      <p class="text-lg sm:text-xl font-bold mt-2 text-black">
        ${{ product.price }}
      </p>
    </div>

    <button class="absolute bottom-2 right-2 w-10 h-10 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
      @click="addToCart">
      <i class="pi pi-shopping-cart"></i>
    </button>
  </div>
</template>
