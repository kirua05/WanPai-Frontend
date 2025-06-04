<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import Drawer from 'primevue/drawer'
import Button from 'primevue/button'

const visible = ref(false)

const menuItems = [
  { label: '後台首頁', to: '/admin' },
  { label: '首頁', to: '/' },
  { label: '商品詳情', to: '/productdetailpage' },
]
</script>


<template>
  <header class="bg-white shadow-sm">
    <div class="max-w-screen-xl mx-auto flex items-center justify-between h-16 px-6">

      <RouterLink to="/" class="text-xl font-bold text-emerald-600">
        Wanpai
      </RouterLink>


      <nav class="hidden md:flex gap-8 text-sm text-gray-700 font-medium">
        <RouterLink
          v-for="item in menuItems"
          :key="item.label"
          :to="item.to"
          class="hover:text-emerald-600 transition"
        >
          {{ item.label }}
        </RouterLink>
      </nav>


      <div class="hidden md:block">
        <Button label="登入" severity="primary" size="small" />
      </div>


      <div class="md:hidden">
        <Button icon="pi pi-bars" text @click="visible = true" />
      </div>
    </div>


    <Drawer v-model:visible="visible" position="right">
      <template #header>
        <div class="text-lg font-semibold">選單</div>
      </template>
      <div class="flex flex-col gap-5 mt-4 px-4">
        <RouterLink
          v-for="item in menuItems"
          :key="item.label"
          :to="item.to"
          class="text-gray-800 hover:text-emerald-600 text-base font-medium"
          @click="visible = false"
        >
          {{ item.label }}
        </RouterLink>
        <Button label="登入" severity="primary" class="mt-4" @click="visible = false" />
      </div>
    </Drawer>
  </header>
</template>

