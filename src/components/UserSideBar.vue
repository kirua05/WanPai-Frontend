<script setup>
  import { useRoute } from 'vue-router'
  const route = useRoute()
</script>

<template>
  <aside class="w-64 bg-white rounded-xl shadow p-6">
    <div class="mb-6 flex items-center gap-3">
      <div
        class="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center"
      >
        <i class="pi pi-user text-white"></i>
      </div>
      <span class="font-bold text-xl text-gray-800">我的帳戶</span>
    </div>
    <nav class="space-y-2">
      <RouterLink
        to="/profile"
        :class="[
          'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md border-l-4 transition-colors',
          route.path === '/profile'
            ? 'text-primary-600 bg-primary-50 border-primary-600'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border-transparent',
        ]"
      >
        <i class="pi pi-user"></i>
        個人資料
      </RouterLink>

      <RouterLink
        to="/orders"
        :class="[
          'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md border-l-4 transition-colors',
          route.path === '/orders'
            ? 'text-primary-600 bg-primary-50 border-primary-600'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border-transparent',
        ]"
      >
        <i class="pi pi-shopping-cart"></i>
        訂單中心
      </RouterLink>

      <RouterLink
        to="/favorites"
        :class="[
          'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md border-l-4 transition-colors',
          route.path === '/favorites'
            ? 'text-primary-600 bg-primary-50 border-primary-600'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border-transparent',
        ]"
      >
        <i class="pi pi-heart"></i>
        收藏清單
      </RouterLink>
    </nav>
  </aside>
</template>
