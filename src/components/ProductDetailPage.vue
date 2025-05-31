<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'

import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import Image from 'primevue/image'

const route = useRoute()
const product = ref({})
const quantity = ref(1)

onMounted(async () => {
  const id = route.params.id
  const res = await axios.get(`/api/products/${id}`)
  product.value = res.data
})

const toggleFavorite = async () => {
  const productId = product.value?.id
  if (!productId) return

  const originalState = product.value.isFavorited
  product.value.isFavorited = !originalState

  try {
    await axios.post(`/api/products/${productId}/favorite`, {
      favorited: product.value.isFavorited,
    })
  // eslint-disable-next-line no-unused-vars
  } catch (err) {
    product.value.isFavorited = originalState
  }
}
</script>

<template>
  <div class="max-w-xl p-6 mx-auto">
    <Image :src="product.image" alt="Product Image" imageClass="mt-4 w-64 h-64 object-cover rounded" preview />

    <h1 class="mt-4 text-2xl font-bold">{{ product.name }}</h1>

    <p class="mb-2 text-gray-500">{{ product.description }}</p>

    <div class="mb-4 text-xl">
      <span v-if="product.discountPrice" class="mr-2 font-semibold text-red-500">
        ${{ product.discountPrice }}
      </span>
      <span :class="{ 'line-through text-gray-400': product.discountPrice }">
        ${{ product.price }}
      </span>
    </div>

    <div class="flex items-center gap-2 mb-4 w-30">
      <label for="quantity" class="text-lg text-gray-700">數量</label>
      <InputNumber
        v-model="quantity"
        inputId="quantity"
        :min="1"
        showButtons
        buttonLayout="horizontal"
        decrementButtonClass="p-button-text"
        incrementButtonClass="p-button-text"
        inputClass="text-center"
      >
        <template #incrementicon>
          <i class="pi pi-plus" />
        </template>
        <template #decrementicon>
          <i class="pi pi-minus" />
        </template>
      </InputNumber>
    </div>

    <div class="flex flex-wrap gap-3">
      <Button
        label="加入購物車"
        icon="pi pi-shopping-cart"
      />
      <Button
        :label="product.isFavorited ? '取消收藏' : '收藏'"
        icon="pi pi-heart"
        @click="toggleFavorite"
      />
    </div>
  </div>
</template>
