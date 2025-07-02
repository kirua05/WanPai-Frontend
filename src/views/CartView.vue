<script setup>
  import {
    ref,
    reactive,
    toRefs,
    computed,
    watch,
    nextTick,
    onMounted,
  } from 'vue'
  import { useRouter } from 'vue-router'
  import { useCartStore } from '@/stores/cart'
  import { createEcpayOrder } from '@/api/createEcpayOrder'
  import { createOrder } from '@/api/order'
  import { useAuthStore } from '@/stores/auth'
  import Button from '@/volt/Button.vue'
  import InputText from 'primevue/inputtext'
  import { showToast } from '@/utils/toast'
  import axios from '@/utils/axiosInstance'

  const cart = useCartStore()
  const router = useRouter()
  const authStore = useAuthStore()

  const selectedItems = ref([])
  const showShippingDetails = ref(false)
  const profileLoading = ref(false)
  const shippingForm = reactive({
    recipientName: '',
    recipientPhone: '',
    shippingAddress: '',
  })

  const shippingDetailsMove = ref(null)

  const isRecipientNameValid = computed(() => {
    if (shippingForm.recipientName.trim() === '') {
      return false
    }
    const chineseRegex = /^[\u4e00-\u9fa5]{2,}$/
    return chineseRegex.test(shippingForm.recipientName.trim())
  })

  const isRecipientPhoneValid = computed(() => {
    if (shippingForm.recipientPhone.trim() === '') {
      return false
    }
    const cellphoneRegex = /^09\d{8}$/
    return cellphoneRegex.test(shippingForm.recipientPhone)
  })

  const isShippingAddressValid = computed(() => {
    const address = shippingForm.shippingAddress.trim()

    if (address === '') {
      return false
    }

    const chineseCharacterRegex = /[\u4e00-\u9fa5]/
    return chineseCharacterRegex.test(address)
  })

  const selectedCount = computed(() => selectedItems.value.length)

  const selectedTotal = computed(() => {
    if (!selectedItems.value || selectedItems.value.length === 0) return 0
    return selectedItems.value.reduce((sum, item) => {
      const price = Number(item.priceAtAdd) || 0
      const qty = Number(item.quantity) || 0
      return sum + price * qty
    }, 0)
  })

  const state = reactive({
    shipping: 0,
  })

  function calculateShipping() {
    state.shipping =
      selectedItems.value && selectedItems.value.length > 0 ? 100 : 0
  }

  watch(
    [selectedItems, () => cart.items],
    () => {
      calculateShipping()
    },
    { deep: true }
  )

  async function updateQty(id, qty) {
    await cart.updateQty(id, qty)
    selectedItems.value = [...cart.items]
  }

  function remove(id) {
    cart.remove(id)
    selectedItems.value = selectedItems.value.filter((item) => item.id !== id)
  }

  const formatCurrency = (value) =>
    new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)

  const { shipping } = toRefs(state)

  function toggleSelectAll(event) {
    const isChecked = event.target.checked
    if (isChecked) {
      selectedItems.value = [...cart.items]
    } else {
      selectedItems.value = []
    }
  }

  async function loadUserProfile() {
    try {
      profileLoading.value = true
      const response = await axios.get('users/profile')
      const profile = response.data
      if (profile) {
        shippingForm.recipientPhone = profile.phone || ''
        shippingForm.shippingAddress = profile.address || ''
      }
    } catch {
      showToast({
        severity: 'error',
        summary: '載入失敗',
        detail: '無法載入個人資料，請稍後再試！',
      })
    } finally {
      profileLoading.value = false
    }
  }

  async function ecpayCheckout() {
    if (!isRecipientNameValid.value) {
      showToast({
        severity: 'error',
        summary: '輸入錯誤',
        detail: '收件人姓名不能為空，並至少輸入兩個中文字！',
      })
      return
    }

    if (!isRecipientPhoneValid.value) {
      showToast({
        severity: 'error',
        summary: '輸入錯誤',
        detail: '請輸入手機號並以09開頭的10位數字！',
      })
      return
    }

    if (!isShippingAddressValid.value) {
      showToast({
        severity: 'error',
        summary: '輸入錯誤',
        detail: '收件地址不能為空,並輸入中文地址',
      })
      return
    }

    if (!authStore.isLoggedIn) {
      showToast({
        severity: 'warn',
        summary: '請先登入',
        detail: '請先登入會員再進行結帳！',
      })
      router.push('/authform')
      return
    }

    const itemNames = selectedItems.value
      .map((item) => item.product.name)
      .join('#')
    const tradeDesc = `購物車商品結帳: ${itemNames}`

    try {
      const totalAmount = selectedTotal.value + shipping.value
      const orderNumber = `ORDER-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`

      const orderItems = selectedItems.value.map((item) => ({
        productId: item.productId,
        productName: item.product.name,
        productImage: item.product.coverImage || 'no-image.png',
        quantity: item.quantity,
        price: Number(item.priceAtAdd),
        subtotal: Number(item.priceAtAdd) * item.quantity,
      }))

      const token = authStore.token
      const payload = JSON.parse(atob(token.split('.')[1]))

      const orderData = {
        orderNumber,
        userId: payload.id,
        recipientName: shippingForm.recipientName,
        recipientPhone: shippingForm.recipientPhone,
        shippingAddress: shippingForm.shippingAddress,
        totalPrice: totalAmount,
        quantity: selectedItems.value.reduce(
          (sum, item) => sum + item.quantity,
          0
        ),
        status: 'paid',
        items: orderItems,
      }

      await createOrder(orderData)

      const ecpayPayload = {
        TotalAmount: totalAmount.toString(),
        TradeDesc: tradeDesc,
        ItemName: itemNames,
        MerchantTradeNo: orderNumber,
      }
      for (const item of selectedItems.value) {
        await cart.remove(item.id)
      }
      selectedItems.value = []

      await createEcpayOrder(ecpayPayload)
    } catch {
      showToast({
        severity: 'error',
        summary: '結帳失敗',
        detail: '請稍後再試或聯絡客服',
      })
    }
  }

  function contactDetails() {
    if (selectedItems.value.length === 0) {
      showToast({
        severity: 'warn',
        summary: '輸入錯誤',
        detail: '請選擇至少一項商品才能結帳！',
      })
    } else {
      showShippingDetails.value = true
      loadUserProfile()
      nextTick(() => {
        if (shippingDetailsMove.value) {
          shippingDetailsMove.value.scrollIntoView({ behavior: 'smooth' })
        }
      })
    }
  }

  function toggleSelectItem(item, event) {
    const isChecked = event.target.checked
    if (isChecked) {
      if (!selectedItems.value.find((i) => i.id === item.id)) {
        selectedItems.value = [...selectedItems.value, item]
      }
    } else {
      selectedItems.value = selectedItems.value.filter((i) => i.id !== item.id)
    }
    calculateShipping()
  }

  function goToProductDetail(productId) {
    router.push(`/products/${productId}`)
  }

  onMounted(async () => {
    await cart.fetchCart()
    selectedItems.value = [...cart.items]
  })
</script>

<template>
  <Toast />
  <div class="bg-black text-white flex flex-col">
    <main class="flex-1 px-4 py-6 bg-gray-100 text-black">
      <div class="container mx-auto p-4 bg-white rounded shadow">
        <h1 class="text-2xl font-bold mb-6 text-gray-800">我的購物車</h1>

        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gray-800 text-white">
              <tr class="border-b border-gray-700">
                <th class="px-4 py-2 w-12">
                  <div class="flex items-center justify-center">
                    <input
                      type="checkbox"
                      class="custom-checkbox w-6 h-6 bg-white border-gray-400 focus:ring-2 focus:ring-primary-500"
                      :checked="
                        selectedItems.length === cart.items.length &&
                        cart.items.length > 0
                      "
                      @change="toggleSelectAll"
                    />
                  </div>
                </th>
                <th class="px-4 py-2 text-left">品名</th>
                <th class="px-4 py-2 text-center whitespace-nowrap">數量</th>
                <th class="px-4 py-2 text-center whitespace-nowrap">單價</th>
                <th class="px-4 py-2 text-center whitespace-nowrap">刪除</th>
              </tr>
            </thead>
            <tbody class="bg-white">
              <tr
                v-for="item in cart.items"
                :key="item.id"
                class="border-b border-gray-200 hover:bg-gray-50"
              >
                <td class="px-4 py-4">
                  <div class="flex items-center justify-center">
                    <input
                      type="checkbox"
                      class="custom-checkbox w-6 h-6 bg-white border-gray-400 focus:ring-2 focus:ring-primary-500"
                      :checked="selectedItems.some((i) => i.id === item.id)"
                      @change="toggleSelectItem(item, $event)"
                    />
                  </div>
                </td>
                <td class="px-4 py-4">
                  <div class="flex items-center space-x-4">
                    <div class="min-w-20 min-h-20">
                      <img
                        v-if="item.product.coverImage"
                        :src="item.product.coverImage"
                        :alt="item.product.name"
                        class="w-20 h-20 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity duration-200"
                        @click="goToProductDetail(item.productId)"
                      />
                    </div>
                    <div class="flex-1 flex flex-col justify-center">
                      <div v-if="item.eta" class="text-sm text-gray-500 mb-1">
                        預計 {{ item.eta }} 出貨
                      </div>
                      <div class="font-medium text-gray-800">
                        <span
                          class="cursor-pointer text-gray-700 hover:text-slate-800 hover:bg-slate-100 transition-all duration-200 font-semibold px-2 py-1 rounded"
                          @click="goToProductDetail(item.productId)"
                        >
                          {{ item.product.name }}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-4 text-center">
                  <select
                    v-model.number="item.quantity"
                    @change="updateQty(item.id, item.quantity)"
                    class="border rounded px-2 py-1"
                  >
                    <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
                  </select>
                </td>
                <td class="px-4 py-4 text-center">
                  {{ formatCurrency(item.priceAtAdd) }}
                </td>
                <td class="px-4 py-4">
                  <div class="flex items-center justify-center">
                    <button
                      @click="remove(item.id)"
                      class="text-red-600 hover:text-red-800 focus:outline-none cursor-pointer inline-flex items-center"
                    >
                      <i class="pi pi-trash" style="font-size: 1.5rem"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-4 text-gray-700">
          已選 {{ selectedCount }} 項，合計 {{ formatCurrency(selectedTotal) }}
        </div>

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
          <div class="flex justify-end mt-4">
            <Button
              label="輸入詳細資訊"
              icon="pi pi-shopping-cart"
              severity="primary"
              size="large"
              @click="contactDetails"
              :pt="{
                root: 'bg-primary hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center cursor-pointer',
                icon: 'mr-2 order-first',
                label: 'text-base order-last',
              }"
            />
          </div>
        </div>
      </div>
    </main>
  </div>

  <div
    class="bg-black text-white flex flex-col"
    v-if="showShippingDetails"
    ref="shippingDetailsMove"
  >
    <main class="flex-1 px-4 py-6 bg-gray-100 text-black">
      <div class="container mx-auto p-4 bg-white rounded shadow">
        <h1 class="text-2xl font-bold mb-6 text-gray-800">收貨詳細資訊</h1>
        <div class="flex flex-col gap-2">
          <label for="username" class="font-bold">姓名</label>
          <InputText
            id="username"
            v-model="shippingForm.recipientName"
            aria-describedby="username-help"
            class="w-lg p-2 outline rounded-lg max-w-full"
            required=""
          />
          <label for="cellphone" class="font-bold">手機號碼</label>
          <InputText
            id="cellphone"
            v-model="shippingForm.recipientPhone"
            aria-describedby="cellphone-help"
            class="w-lg p-2 outline rounded-lg mg-1 max-w-full"
            required=""
          />
          <label for="address" class="font-bold">地址</label>
          <InputText
            id="address"
            v-model="shippingForm.shippingAddress"
            aria-describedby="address-help"
            class="w-lg p-2 outline rounded-lg max-w-full"
            required=""
          />
        </div>

        <div class="flex justify-between items-center pt-2 border-t mt-4">
          <span class="font-semibold">總金額 (TWD)</span>
          <span class="text-xl font-bold">
            {{ formatCurrency(selectedTotal + shipping) }}
          </span>
        </div>
        <div class="flex justify-end mt-4">
          <Button
            label="跳轉頁面結帳"
            icon="pi pi-shopping-cart"
            severity="primary"
            size="large"
            @click="ecpayCheckout"
            :pt="{
              root: 'bg-primary hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center cursor-pointer',
              icon: 'mr-2 order-first',
              label: 'text-base order-last',
            }"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
  .bg-gray-100 {
    background-color: #f7fafc;
  }

  input[type='checkbox'].custom-checkbox {
    appearance: none;
    -webkit-appearance: none;
    width: 1.5rem;
    height: 1.5rem;
    border: 2px solid #cbd5e1;
    border-radius: 0.25rem;
    background: #fff;
    cursor: pointer;
    position: relative;
    transition:
      border-color 0.2s,
      background 0.2s;
  }

  input[type='checkbox'].custom-checkbox:checked {
    background: #38bdf8;
    border-color: #38bdf8;
  }

  input[type='checkbox'].custom-checkbox:checked::after {
    content: '';
    position: absolute;
    left: 0.35rem;
    top: 0.1rem;
    width: 0.4rem;
    height: 0.8rem;
    border: solid #fff;
    border-width: 0 0.2rem 0.2rem 0;
    transform: rotate(45deg);
  }
</style>
