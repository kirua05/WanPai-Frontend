<script setup>
  import { ref } from 'vue'
  import { RouterLink } from 'vue-router'
  import Carousel from 'primevue/carousel'

  const banners = ref([
    {
      image: '/Banner1.png',
      link: '/products/5',
    },
    {
      image: '/Banner2.png',
      link: '/products/1',
    },
    {
      image: '/Banner3.png',
      link: '/products/74',
    },
  ])
</script>

<template>
  <div class="max-w-screen-xl mx-auto px-4">
    <Carousel
      :value="banners"
      :numVisible="1"
      :numScroll="1"
      :circular="true"
      :autoplayInterval="3000"
    >
      <template #item="slotProps">
        <RouterLink :to="slotProps.data.link" class="block w-full h-full">
          <div
            class="relative w-full aspect-[3/1] sm:aspect-auto sm:h-[400px] overflow-hidden"
          >
            <img
              :src="slotProps.data.image"
              class="w-full h-full object-cover"
              alt="banner"
            />
            <div
              class="absolute inset-0 flex items-center justify-center"
              :class="slotProps.data.title ? 'bg-black/40' : 'bg-transparent'"
            >
              <h2
                v-if="slotProps.data.title"
                class="text-white text-3xl font-bold text-center"
              >
                {{ slotProps.data.title }}
              </h2>
            </div>
          </div>
        </RouterLink>
      </template>
    </Carousel>
  </div>
</template>
