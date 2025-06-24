<script setup>
  import { ref, onMounted, watch } from 'vue'
  import { RouterLink, useRoute, useRouter } from 'vue-router'
  import Drawer from 'primevue/drawer'
  import Button from 'primevue/button'
  import Menu from 'primevue/menu'
  import { useCartStore } from '@/stores/cart'
  import { useAuthStore } from '@/stores/auth'
  import { useNotificationStore } from '@/stores/notifications'
  import ProductSearchBar from '@/components/ProductSearchBar.vue'
  import { useToast } from 'primevue/usetoast'

  const visible = ref(false)
  const cart = useCartStore()
  const route = useRoute()
  const router = useRouter()
  const authStore = useAuthStore()
  const notificationStore = useNotificationStore()
  const toast = useToast()

  watch(
    () => authStore.isLoggedIn,
    async (isLoggedIn) => {
      if (isLoggedIn) {
        try {
          await notificationStore.fetch()
        } catch {
          notificationStore.totalUnread = 0
        }
      }
    },
    { immediate: true }
  )

  const searchInput = ref(route.query.keyword || '')

  const memberMenu = ref()

  const memberMenuItems = ref([
    {
      label: '個人資料',
      icon: 'pi pi-user',
      command: () => {
        router.push('/userprofile')
      },
    },
    {
      label: '訂單中心',
      icon: 'pi pi-list',
      command: () => {
        router.push('/orders')
      },
    },
    {
      label: '收藏清單',
      icon: 'pi pi-heart',
      command: () => {
        router.push('/favorites')
      },
    },
  ])

  function handleHomeClick(e) {
    if (route.path === '/') {
      e.preventDefault()
      router.push({ path: '/', query: {} })
    }
  }

  authStore.initAuth()

  function search() {
    if (!searchInput.value.trim()) return

    router.push({
      path: '/',
      query: {
        ...route.query,
        keyword: searchInput.value.trim(),
        page: 1,
      },
    })
  }

  watch(
    () => authStore.isLoggedIn,
    (isLoggedIn) => {
      if (isLoggedIn) {
        cart.fetchCart().catch(() => {
          toast.add({
            severity: 'warn',
            summary: '載入失敗',
            detail: '購物車資料載入失敗，請重新整理頁面',
            life: 3000,
          })
        })
      } else {
        cart.items = []
      }
    },
    { immediate: true }
  )

  onMounted(() => {
    if (authStore.isLoggedIn) {
      cart.fetchCart().catch(() => {
        toast.add({
          severity: 'warn',
          summary: '載入失敗',
          detail: '購物車資料載入失敗，請重新整理頁面',
          life: 3000,
        })
      })
    }
  })

  const logout = () => {
    authStore.logout()
    router.push('/authform')
  }

  const toggleMemberMenu = (event) => {
    memberMenu.value.toggle(event)
  }

  function handleCartClick() {
    if (!authStore.isLoggedIn) {
      toast.add({
        severity: 'warn',
        summary: '請先登入',
        detail: '請先登入會員再查看購物車！',
        life: 3000,
        position: 'top-right',
      })
      return
    }
    router.push('/cart')
  }
</script>

<template>
  <header class="bg-white text-black shadow py-2">
    <div
      class="max-w-screen-xl mx-auto flex items-center justify-between h-12 px-4"
    >
      <RouterLink
        to="/"
        class="text-xl font-bold text-emerald-600"
        @click="handleHomeClick"
      >
        <img
          src="@/assets/logo.png"
          alt="Wanpai Logo"
          class="h-30 w-auto object-contain"
        />
      </RouterLink>

      <nav
        v-if="authStore.isAdmin"
        class="hidden md:flex gap-8 text-sm text-gray-700 font-medium"
      >
        <RouterLink
          v-for="item in menuItems"
          :key="item.label"
          :to="item.to"
          @click="item.to === '/' ? handleHomeClick($event) : null"
          class="hover:text-yellow-600 transition"
        >
          {{ item.label }}
        </RouterLink>
      </nav>

      <ProductSearchBar
        v-model="searchInput"
        @submit="search"
      />
      <div class="hidden md:flex items-center gap-4">
        <div v-if="authStore.isLoggedIn" class="hidden md:block relative">
          <Button
            icon="pi pi-user"
            text
            rounded
            @click="toggleMemberMenu"
            class="hover:bg-gray-100"
            aria-label="會員選單"
          />
          <Menu
            ref="memberMenu"
            :model="memberMenuItems"
            popup
            class="text-base"
          />
        </div>
        <div class="relative cursor-pointer" @click="handleCartClick">
          <Button icon="pi pi-shopping-cart" text rounded />
          <span
            v-if="cart.items.length"
            class="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
          >
            {{ cart.items.length }}
          </span>
        </div>

        <RouterLink
          v-if="authStore.isLoggedIn"
          to="/notifications"
          class="relative flex items-center justify-center mr-2"
          title="我的通知"
        >
          <Button
            icon="pi pi-comment"
            text
            rounded
            class="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-emerald-600 hover:bg-gray-100 transition"
            aria-label="通知"
          />

          <span
            v-if="notificationStore.totalUnread > 0"
            class="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white z-10"
          ></span>
        </RouterLink>

        <div class="hidden md:block">
          <RouterLink v-if="!authStore.isLoggedIn" to="/authform">
            <Button label="登入" severity="primary" size="small" />
          </RouterLink>
          <Button
            v-else
            label="登出"
            severity="danger"
            size="small"
            @click="logout"
          />
        </div>
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
          @click="
            () => {
              visible = false
              if (item.to === '/' && route.path === '/') {
                router.push({ path: '/', query: {} })
              }
            }
          "
          class="text-gray-800 hover:text-emerald-600 text-base font-medium"
        >
          {{ item.label }}
        </RouterLink>

        <div
          class="text-gray-800 hover:text-emerald-600 text-base font-medium flex items-center cursor-pointer"
          @click="
            () => {
              visible = false
              handleCartClick()
            }
          "
        >
          <i class="pi pi-shopping-cart mr-2"></i>
          購物車
          <span
            v-if="cart.items.length"
            class="ml-auto bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
          >
            {{ cart.items.length }}
          </span>
        </div>

        <RouterLink
          v-if="authStore.isLoggedIn"
          to="/notifications"
          class="relative flex items-center justify-center mr-2"
          title="我的通知"
        >
          <Button
            icon="pi pi-comment"
            text
            rounded
            class="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-emerald-600 hover:bg-gray-100 transition"
            aria-label="通知"
          />

          <span
            v-if="notificationStore.totalUnread > 0"
            class="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white z-10"
          ></span>
        </RouterLink>

        <div v-if="!authStore.isLoggedIn">
          <RouterLink to="/authform" @click="visible = false">
            <Button label="登入" severity="primary" class="mt-4 w-full" />
          </RouterLink>
        </div>
        <div v-else class="mt-4 space-y-3">
          <div>
            <div class="text-sm text-gray-500 mb-3">會員功能</div>
            <RouterLink
              to="/userprofile"
              @click="visible = false"
              class="flex items-center text-gray-800 hover:text-emerald-600 text-base font-medium mb-3"
            >
              <i class="pi pi-user mr-2"></i>
              個人資料
            </RouterLink>
            <RouterLink
              to="/orders"
              @click="visible = false"
              class="flex items-center text-gray-800 hover:text-emerald-600 text-base font-medium mb-3"
            >
              <i class="pi pi-list mr-2"></i>
              訂單中心
            </RouterLink>
            <RouterLink
              to="/favorites"
              @click="visible = false"
              class="flex items-center text-gray-800 hover:text-emerald-600 text-base font-medium mb-3"
            >
              <i class="pi pi-heart mr-2"></i>
              收藏清單
            </RouterLink>
          </div>
          <Button
            label="登出"
            severity="danger"
            class="w-full"
            @click="logout"
          />
        </div>
      </div>
    </Drawer>
  </header>
</template>
