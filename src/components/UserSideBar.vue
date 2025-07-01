<script setup>
  import { useRoute } from 'vue-router'
  const route = useRoute()
</script>

<template>
  <aside class="w-65 bg-white rounded-xl shadow p-7 -mt-1">
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
        to="/userprofile"
        :class="[
          'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md border-l-4 transition-all duration-200 transform',
          route.path === '/userprofile'
            ? 'text-primary-600 bg-primary-50 border-primary-600 pl-4 translate-x-1'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border-transparent pl-3 translate-x-0',
        ]"
      >
        <i class="pi pi-user"></i>
        個人資料
      </RouterLink>

      <RouterLink
        to="/orders"
        :class="[
          'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md border-l-4 transition-all duration-200 transform',
          route.path === '/orders'
            ? 'text-primary-600 bg-primary-50 border-primary-600 pl-4 translate-x-1'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border-transparent pl-3 translate-x-0',
        ]"
      >
        <i class="pi pi-list"></i>
        訂單中心
      </RouterLink>

      <RouterLink
        to="/favorites"
        :class="[
          'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md border-l-4 transition-all duration-200 transform',
          route.path === '/favorites'
            ? 'text-primary-600 bg-primary-50 border-primary-600 pl-4 translate-x-1'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border-transparent pl-3 translate-x-0',
        ]"
      >
        <i class="pi pi-heart"></i>
        收藏清單
      </RouterLink>
    </nav>
  </aside>
</template>
