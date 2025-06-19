<script setup>
  import { RouterLink, useRoute, useRouter } from 'vue-router'
  import Menu from '@/volt/Menu.vue'
  import { ref } from 'vue'
  import Button from 'primevue/button'
  import AdminSearchBar from '@/components/AdminSearchBar.vue'
  import { useAuthStore } from '@/stores/auth'

  const authStore = useAuthStore()
  const route = useRoute()
  const router = useRouter()

  authStore.initAuth()

  function logout() {
    authStore.logout()
    router.push('/authform')
  }

  const items = ref([
    {
      label: '商品列表',
      icon: 'pi pi-shop',
      route: '/admin/products',
    },
    {
      label: '訂單管理',
      icon: 'pi pi-clipboard',
      route: '/admin/orders',
    },
    {
      label: '庫存管理',
      icon: 'pi pi-box',
      route: '/admin/inventory',
    },
  ])
  function handleHomeClick(e) {
    if (route.path === '/') {
      e.preventDefault()
      router.push({ path: '/', query: {} })
    }
  }
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <header class="w-full fixed top-0 left-0 right-0 p-2 z-20 bg-primary">
      <div
        class="max-w-screen-xl mx-auto flex justify-between items-center h-16"
      >
        <RouterLink
          to="/"
          class="text-xl font-bold text-emerald-600"
          @click="handleHomeClick"
        >
          <img src="@/assets/logo.png" alt="logo" class="h-30 object-contain" />
        </RouterLink>
        <AdminSearchBar
          class="w-72 text-gray-700 p-2 outline-none focus:ring-2 focus:ring-blue-300 transition"
        />
        <div v-if="authStore.isLoggedIn" class="mr-2">
          <Button label="登出" severity="danger" size="small" @click="logout" />
        </div>
      </div>
    </header>

    <aside class="fixed top-24 left-4 w-60 z-10">
      <div class="bg-white rounded-2xl shadow-xl py-6 px-3 h-full">
        <Menu :model="items" class="space-y-2">
          <template #item="{ item, props }">
            <router-link
              v-if="item.route"
              v-slot="{ href, navigate }"
              :to="item.route"
              custom
            >
              <a
                :href="href"
                v-bind="props.action"
                @click="navigate"
                class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-yellow-100 transition group"
              >
                <span
                  :class="
                    item.icon +
                    ' text-xl text-yellow-500 group-hover:text-yellow-700 transition'
                  "
                />
                <span
                  class="text-gray-800 font-medium group-hover:text-yellow-700 transition"
                >
                  {{ item.label }}
                </span>
              </a>
            </router-link>
          </template>
        </Menu>
      </div>
    </aside>

    <main class="ml-64 pt-24 px-8 min-h-screen transition">
      <div class="bg-white rounded-2xl shadow-xl p-8 min-h-[60vh]">
        <router-view />
      </div>
    </main>
  </div>
</template>
