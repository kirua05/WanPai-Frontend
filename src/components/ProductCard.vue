<script setup>
  defineProps({
    product: Object,
  })
</script>

<template>
  <div
    class="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-all relative"
  >
    <img
      :src="product.image"
      alt="商品圖片"
      class="w-full h-64 object-contain bg-white"
    />

    <div class="p-3">
      <p class="text-sm font-medium line-clamp-2 h-[3em] leading-tight">
        {{ product.name }}
      </p>
      <p class="text-lg font-bold mt-2 text-black">${{ product.price }}</p>
    </div>

    <button
      class="absolute bottom-2 right-2 w-10 h-10 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
    >
      <i class="pi pi-shopping-cart"></i>
    </button>
  </div>
</template>
