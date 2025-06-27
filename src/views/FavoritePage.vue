<script setup>
  import UserSidebar from '@/components/UserSideBar.vue'
  import { ref, computed, onMounted, watch } from 'vue'
  import { RouterLink } from 'vue-router'
  import Button from 'primevue/button'
  import { showToast } from '@/utils/toast'
  import { fetchFavorites, removeFavorite } from '@/api/favorite'
  import { useCartStore } from '@/stores/cart'

  const favorites = ref([])
  const perPage = 10
  const currentPage = ref(1)
  const cartStore = useCartStore()

  const paginatedFavorites = computed(() => {
    const start = (currentPage.value - 1) * perPage
    return favorites.value.slice(start, start + perPage)
  })

  const totalPages = computed(() => Math.ceil(favorites.value.length / perPage))

  onMounted(async () => {
    const token = localStorage.getItem('token')
    try {
      const data = await fetchFavorites(token)
      favorites.value = data.map((item) => ({
        id: item.productId,
        refId: item.refId,
        name: item.productName,
        image: item.thumbnail,
        price: item.price,
        quantity: null,
        isAdding: false,
      }))
    } catch {
      showToast({
        severity: 'error',
        summary: '載入失敗',
        detail: '無法取得收藏資料',
      })
    }
  })

  watch(currentPage, () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })

  async function addToCartHandler(item) {
    if (!item.quantity) {
      showToast({
        severity: 'warn',
        summary: '請先選擇數量',
      })
      return
    }

    item.isAdding = true

    try {
      await cartStore.add({
        id: item.id,
        qty: item.quantity,
      })
      showToast({
        severity: 'success',
        summary: '加入成功',
        detail: `${item.name} 已加入購物車`,
      })
    } catch {
      showToast({
        severity: 'error',
        summary: '加入失敗',
        detail: '請稍後再試',
      })
    } finally {
      item.isAdding = false
    }
  }

  async function removeFavoriteHandler(productId) {
    const token = localStorage.getItem('token')
    try {
      await removeFavorite(productId, token)
      favorites.value = favorites.value.filter((f) => f.id !== productId)
      showToast({
        severity: 'success',
        summary: '已取消收藏',
      })
    } catch {
      showToast({
        severity: 'error',
        summary: '刪除失敗',
        detail: '無法取消收藏',
      })
    }
  }
</script>

<template>
  <div class="relative min-h-screen overflow-hidden py-2 px-4">
    <div
      class="absolute inset-0 z-0 bg-no-repeat bg-cover blur-md"
      style="background-image: url('/src/assets/circle-scatter-haikei.svg')"
    ></div>
    <Toast />
    <div class="relative z-10 flex max-w-7xl mx-auto px-4 py-8 gap-6">
      <aside class="w-64 ml-11">
        <UserSidebar />
      </aside>

      <div class="flex-1 bg-white rounded-xl shadow p-10 max-w-4xl -mt-3">
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
            v-for="(item, index) in paginatedFavorites"
            :key="item.id"
            :class="[
              'grid grid-cols-12 gap-4 px-4 py-4 items-center',
              index !== paginatedFavorites.length - 1
                ? 'border-b border-gray-200'
                : '',
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
                <router-link
                  :to="`/products/${item.id}`"
                  class="text-black font-medium text-sm sm:text-base leading-snug hover:underline"
                >
                  {{ item.name }}
                </router-link>
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
                :loading="item.isAdding"
                :disabled="!item.quantity || item.isAdding"
                @click="addToCartHandler(item)"
                :class="[
                  'transition-all duration-200',
                  item.isAdding ? 'w-[128px]' : 'w-[112px]',
                ]"
              />
              <Button
                icon="pi pi-trash"
                severity="secondary"
                text
                size="small"
                @click="removeFavoriteHandler(item.id)"
              />
            </div>
          </div>

          <div class="mt-6 flex justify-center items-center gap-2">
            <button
              @click="currentPage > 1 && currentPage--"
              :disabled="currentPage === 1"
              class="px-3 py-1 rounded border bg-white text-gray-700 border-gray-300 hover:bg-gray-100 disabled:opacity-50"
            >
              上一頁
            </button>

            <button
              v-for="page in totalPages"
              :key="page"
              @click="currentPage = page"
              class="px-3 py-1 rounded border"
              :class="
                currentPage === page
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              "
            >
              {{ page }}
            </button>

            <button
              @click="currentPage < totalPages && currentPage++"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 rounded border bg-white text-gray-700 border-gray-300 hover:bg-gray-100 disabled:opacity-50"
            >
              下一頁
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
