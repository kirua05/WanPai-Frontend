<template>
  <div class="bg-gray-50 min-h-screen py-10 px-4">
    <Toast />
    <div class="max-w-6xl mx-auto flex gap-6">
      <!-- 側邊欄 -->
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
              'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
              route.path === '/profile'
                ? 'text-primary-600 bg-primary-50 border-l-4 border-primary-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
            ]"
          >
            <i class="pi pi-user"></i>
            個人資料
          </RouterLink>

          <RouterLink
            to="/orders"
            :class="[
              'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
              route.path === '/orders'
                ? 'text-primary-600 bg-primary-50 border-l-4 border-primary-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
            ]"
          >
            <i class="pi pi-shopping-cart"></i>
            訂單中心
          </RouterLink>

          <RouterLink
            to="/favorites"
            :class="[
              'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
              route.path === '/Favorites'
                ? 'text-primary-600 bg-primary-50 border-l-4 border-primary-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
            ]"
          >
            <i class="pi pi-heart"></i>
            收藏清單
          </RouterLink>
        </nav>
      </aside>

      <!-- 收藏清單主內容 -->
      <div class="flex-1 bg-white rounded-xl shadow p-6">
        <h2
          class="text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2"
        >
          <i class="pi pi-heart text-gray-400 text-lg"></i>
          我的收藏
        </h2>

        <div v-if="favorites.length === 0" class="text-gray-500 text-center">
          目前沒有收藏商品
        </div>

        <div v-else>
          <div
            class="grid grid-cols-12 px-4 py-2 bg-gray-100 text-sm text-gray-600 font-medium rounded-t-xl"
          >
            <div class="col-span-6 text-center">商品資料</div>
            <div class="col-span-2 text-center">單價</div>
            <div class="col-span-4 text-left pl-12">數量</div>
          </div>

          <div
            v-for="(item, index) in favorites"
            :key="item.id"
            :class="[
              'grid grid-cols-12 gap-4 px-4 py-4 items-center',
              index !== favorites.length - 1 ? 'border-b border-gray-200' : '',
            ]"
          >
            <div class="col-span-6 flex gap-4 items-start">
              <img
                :src="item.image || '/no-image.jpg'"
                alt="商品圖片"
                class="w-24 h-24 object-cover rounded-md"
              />
              <div>
                <div class="text-sm text-gray-500">{{ item.refId }}</div>
                <div class="text-base font-semibold">{{ item.name }}</div>
              </div>
            </div>

            <div class="col-span-2 text-gray-800 font-medium text-center">
              NT${{ item.price }}
            </div>

            <div class="col-span-4 flex gap-2 items-center justify-center">
              <Dropdown
                v-model="item.quantity"
                :options="[1, 2, 3, 4, 5]"
                placeholder="數量"
                class="w-24"
                :pt="{
                  root: { class: 'h-[36px] text-sm' },
                  input: { class: 'text-sm' },
                }"
              />
              <Button
                label="加入購物車"
                size="small"
                :disabled="!item.quantity"
                :class="!item.quantity ? 'opacity-50 cursor-not-allowed' : ''"
                @click="addToCart(item)"
              />
              <Button
                icon="pi pi-trash"
                severity="secondary"
                text
                size="small"
                @click="removeFavorite(item.id)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { RouterLink, useRoute } from 'vue-router'
  import Dropdown from 'primevue/dropdown'
  import Button from 'primevue/button'
  import axios from 'axios'
  import { useToast } from 'primevue/usetoast'

  const toast = useToast()
  const route = useRoute()
  const favorites = ref([])

  onMounted(async () => {
    const token = localStorage.getItem('token')
    try {
      const { data } = await axios.get('/api/favorites', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      favorites.value = data.map((item) => ({
        id: item.productId,
        refId: item.refId,
        name: item.productName,
        image: item.thumbnail,
        price: item.price,
        quantity: null,
      }))
    } catch (err) {
      toast.add({
        severity: 'error',
        summary: '載入失敗',
        detail: err?.response?.data?.error || '無法取得收藏資料',
        life: 3000,
      })
    }
  })

  async function addToCart(item) {
    const token = localStorage.getItem('token')
    try {
      await axios.post(
        '/api/cart',
        {
          productId: item.id,
          quantity: item.quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: '加入失敗',
        detail: `無法加入購物車：${error.message || '請稍後再試'}`,
        life: 3000,
      })
    }
  }

  async function removeFavorite(productId) {
    const token = localStorage.getItem('token')

    try {
      await axios.delete(`/api/favorites/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      favorites.value = favorites.value.filter((f) => f.id !== productId)

      toast.add({
        severity: 'success',
        summary: '已取消收藏',
        life: 2000,
      })
    } catch (err) {
      toast.add({
        severity: 'error',
        summary: '刪除失敗',
        detail: err?.response?.data?.error || '無法取消收藏',
        life: 3000,
      })
    }
  }
</script>
