<script setup>
  import { ref, onMounted, nextTick } from 'vue'
  import { useRoute } from 'vue-router'
  import axios from 'axios'

  import Button from 'primevue/button'
  import InputNumber from 'primevue/inputnumber'
  import Image from 'primevue/image'

  const route = useRoute()
  const product = ref({})
  const quantity = ref(1)
  const inputRef = ref(null)

  onMounted(async () => {
    const id = route.params.id
    const res = await axios.get(`/api/products/${id}`)
    product.value = res.data

    await nextTick()
    if (!document.activeElement || document.activeElement === document.body) {
      inputRef.value?.$el?.querySelector('input')?.focus()
    }
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
    } catch {
      product.value.isFavorited = originalState
    }
  }
</script>

<template>
  <div class="max-w-5xl mx-auto p-6">
    <div class="flex flex-col md:flex-row gap-8">
      <div class="flex-shrink-0 w-full md:w-1/2 text-center">
        <Image
          v-if="product.images?.cover"
          :src="product.images.cover.imgUrl"
          alt="Product Cover Image"
          imageClass="w-64 h-64 object-cover rounded mx-auto"
          preview
        />
        <div class="text-sm text-gray-500 mt-2">1 / 3</div>
      </div>

      <div class="flex flex-col justify-start w-full md:w-1/2 space-y-4">
        <h1 class="text-2xl font-bold leading-snug">{{ product.name }}</h1>

        <div class="text-xl">
          <span
            :class="{ 'line-through text-gray-400': product.discountPrice }"
          >
            ${{ product.price }}
          </span>
        </div>

        <div class="flex items-center gap-3">
          <label for="quantity" class="text-gray-700">數量</label>
          <InputNumber
            v-model="quantity"
            :ref="inputRef"
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

        <div class="flex gap-4 mt-2">
          <Button
            label="加入購物車"
            icon="pi pi-shopping-cart"
            class="flex-1"
          />
          <Button
            :label="product.isFavorited ? '取消收藏' : '收藏'"
            icon="pi pi-heart"
            class="flex-1"
            @click="toggleFavorite"
          />
        </div>
      </div>
    </div>

    <div class="mt-6">
      <p class="text-gray-600" v-html="product.description" />
    </div>
  </div>
</template>
