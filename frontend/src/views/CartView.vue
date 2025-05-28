<template>
  <div class="bg-black text-white min-h-screen flex flex-col">
    <!-- Top Bar -->
    <header class="flex justify-between items-center px-4 py-2">
      <div class="flex items-center space-x-3">
        <img
          v-for="icon in topIcons"
          :key="icon.alt"
          :src="icon.src"
          :alt="icon.alt"
          class="w-6 h-6 filter invert cursor-pointer"
        />
        <span class="user-level font-medium">{{ userLevel }}</span>
        <img
          :src="iconLogoutSrc"
          alt="登出"
          class="w-6 h-6 filter invert cursor-pointer"
          @click="logout"
        />
      </div>
      <div class="flex items-center space-x-4">
        <button class="p-2 hover:bg-gray-800 rounded">
          <img
            src="@/assets/img_shopping_cart/search.svg?url"
            alt="搜尋"
            class="w-6 h-6 filter invert"
          />
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 px-4 py-6 bg-gray-100 text-black">
      <div class="container mx-auto p-4 bg-white rounded shadow">
        <h1 class="text-2xl font-bold mb-6 text-gray-800">我的購物車</h1>

        <!-- 購物車列表 -->
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gray-800 text-white">
              <tr>
                <th class="px-4 py-2 text-center">選擇</th>
                <th class="px-4 py-2 text-left">品名</th>
                <th class="px-4 py-2 text-center">數量</th>
                <th class="px-4 py-2 text-center">單價</th>
                <th class="px-4 py-2 text-center">刪除</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in cart.items" :key="item.id" class="border-b hover:bg-gray-50">
                <!-- 選擇 -->
                <td class="px-4 py-4 text-center">
                  <input
                    type="checkbox"
                    v-model="selectedIds"
                    :value="item.id"
                    class="form-checkbox h-4 w-4 text-blue-600"
                  />
                </td>

                <!-- 品名 + 圖片 -->
                <td class="px-4 py-4 flex items-start space-x-4">
                  <img
                    v-if="item.image"
                    :src="item.image"
                    alt=""
                    class="w-20 h-20 object-cover rounded"
                  />
                  <div class="flex-1">
                    <div v-if="item.eta" class="text-sm text-gray-500 mb-1">
                      預計 {{ item.eta }} 出貨
                    </div>
                    <div class="font-medium text-gray-800">{{ item.title }}</div>
                  </div>
                </td>

                <!-- 數量 -->
                <td class="px-4 py-4 text-center">
                  <select
                    v-model.number="item.qty"
                    @change="updateQty(item.id, item.qty)"
                    class="border rounded px-2 py-1"
                  >
                    <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
                  </select>
                </td>

                <!-- 單價 -->
                <td class="px-4 py-4 text-center text-gray-700">
                  {{ formatCurrency(item.price) }}
                </td>

                <!-- 刪除 -->
                <td class="px-4 py-4 text-center">
                  <button
                    @click="remove(item.id)"
                    class="text-red-600 hover:text-red-800 text-2xl focus:outline-none"
                  >
                    <i class="pi pi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 已選項目與合計 -->
        <div class="mt-4 text-gray-700">
          已選 {{ selectedCount }} 項，合計 {{ formatCurrency(selectedTotal) }}
        </div>

        <!-- 優惠區塊 
        <div class="bg-gray-100 p-4 mt-6 rounded">
          <div class="text-gray-700 mb-4">
            <span class="text-red-600 font-semibold">• 現金積點</span>
            會員 滿 $100 元，現金積點回饋 2%
          </div>
          <div class="flex items-center space-x-6">
            <label class="flex items-center space-x-2">
              <input
                type="radio"
                name="discount"
                value="none"
                v-model="selectedDiscount"
                class="form-radio h-4 w-4 text-blue-600"
              />
              <span class="text-gray-800">不使用優惠</span>
            </label>
            <label class="flex items-center space-x-2">
              <input
                type="radio"
                name="discount"
                value="code"
                v-model="selectedDiscount"
                class="form-radio h-4 w-4 text-blue-600"
              />
              <span :class="selectedDiscount === 'code' ? 'text-gray-800' : 'text-gray-400'"
                >優惠代碼</span
              >
            </label>
          </div>
          <div v-if="selectedDiscount === 'code'" class="mt-4">
            <input
              v-model="discountCode"
              type="text"
              placeholder="輸入優惠代碼"
              class="border rounded px-3 py-1 w-1/2"
            />
          </div>
          <div class="mt-4 text-gray-600">
            <span class="mr-2">全館活動</span>
            <span class="text-red-600">
              {{ getPromotionText(cart.totalPrice) }}
            </span>
          </div>
        </div> -->

        <!-- 小計 & 運費 & 總金額 -->
        <div class="mt-6 bg-white shadow rounded p-4">
          <div class="flex justify-between items-center border-b pb-2">
            <span>小計</span>
            <span class="font-medium">{{ formatCurrency(selectedTotal) }}</span>
          </div>
          <div class="flex justify-between items-center border-b py-2">
            <span>運費</span>
            <span class="font-medium">{{ formatCurrency(shipping) }}</span>
          </div>
          <div class="flex justify-between items-center pt-2">
            <span class="font-semibold">總金額 (TWD)</span>
            <span class="text-xl font-bold">
              {{ formatCurrency(selectedTotal + shipping) }}
            </span>
          </div>
          <!-- 前往結帳 按鈕 -->
          <div class="flex justify-end">
            <Button
              label="前往結帳"
              icon="pi pi-shopping-cart"
              @click="calculateShipping"
              pt:root:class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
              pt:icon:class="mr-2"
            />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, toRefs, onMounted, computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import Button from '@/volt/Button.vue'

import iconMail from '@/assets/img_shopping_cart/icon-mail.svg?url'
import iconInfo from '@/assets/img_shopping_cart/icon-info.svg?url'
import iconCrown from '@/assets/img_shopping_cart/icon-crown.svg?url'
import iconLogoutSrc from '@/assets/img_shopping_cart/icon-logout.svg?url'
import testProductImg from '@/assets/img_shopping_cart/test-product.png?url'

// Pinia 購物車狀態
const cart = useCartStore()

// 選中的商品 id 列表
const selectedIds = ref([])

// 計算選中項目
const selectedItems = computed(() =>
  cart.items.filter((item) => selectedIds.value.includes(item.id)),
)
const selectedCount = computed(() => selectedItems.value.length)
const selectedTotal = computed(() =>
  selectedItems.value.reduce((sum, i) => sum + i.price * i.qty, 0),
)

// 優惠設定
const threshold = 5000
const discount = 222

// 產生促案文字
function getPromotionText(total) {
  const gap = threshold - total
  return gap > 0 ? `再 $${gap} 元，抵 $${discount} 元` : `已達標，折抵 $${discount} 元`
}

// 開發階段種子資料
onMounted(() => {
  if (!cart.items.length) {
    cart.add({
      id: 'demo1',
      title: '範例商品 A',
      price: 880,
      image: testProductImg,
      variant: '單一規格',
      eta: '2025/11',
    })
    cart.add({
      id: 'demo2',
      title: '範例商品 B',
      price: 650,
      image: testProductImg,
      variant: '單一規格',
    })
  }
})

// Top Bar
const userLevel = ref('玩具初心者')
const topIcons = [
  { src: iconMail, alt: '信箱' },
  { src: iconInfo, alt: '資訊' },
  { src: iconCrown, alt: '等級' },
]

// 運費狀態
const state = reactive({ shipping: 0 })
function calculateShipping() {
  state.shipping = selectedItems.value.length ? 100 : 0
}

// 操作方法
function updateQty(id, qty) {
  cart.updateQty(id, qty)
}
function remove(id) {
  cart.remove(id)
}

// 幣別格式化（整數顯示）
const formatCurrency = (value) =>
  new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)

const { shipping } = toRefs(state)
</script>

<style scoped>
.bg-gray-100 {
  background-color: #f7fafc;
}
.text-black {
  color: #2d3748;
}
</style>
