<script setup>
  import { ref, reactive, toRefs, computed, watch, nextTick } from 'vue'
  import { useCartStore } from '@/stores/cart'
  import Button from '@/volt/Button.vue'
  import { createEcpayOrder } from '@/api/createEcpayOrder'
  import { useToast } from 'primevue/usetoast'
  import Toast from 'primevue/toast'
  import InputText from 'primevue/inputtext'
  const toast = useToast()
  // Pinia 購物車狀態
  const cart = useCartStore()

  // 選中的商品列表
  const selectedItems = ref([])
  // 選中的商品數量
  const showShippingDetails = ref(false)

  //根據orders資料庫要的屬性做命名
  const shippingForm = reactive({
    recipientName: '',
    recipientPhone: '',
    shippingAddress: '',
  })

const profileLoading = ref(false)

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
      const price = Number(item.price) || 0
      const qty = Number(item.qty) || 0
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
    selectedItems,
    () => {
      calculateShipping()
    },
    { deep: true }
  )

  function updateQty(id, qty) {
    cart.updateQty(id, qty)
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
    watch(
      selectedItems,
      (newVal) => {
        if (newVal.length === 0) {
          showShippingDetails.value = false
          //關閉(收貨詳細資訊)清除底下input框輸入過的內容
          shippingForm.recipientName = ''
          shippingForm.recipientPhone = ''
          shippingForm.shippingAddress = ''
        }
      },
      { deep: true }
    )
  }

  async function ecpayCheckout() {
    if (!isRecipientNameValid.value) {
      toast.add({
        severity: 'error',
        summary: '輸入錯誤',
        detail: '收件人姓名不能為空，並至少輸入兩個中文字！',
        life: 3000,
      })
      return
    }

    if (!isRecipientPhoneValid.value) {
      toast.add({
        severity: 'error',
        summary: '輸入錯誤',
        detail: '請輸入手機號並以09開頭的10位數字！',
        life: 3000,
      })
      return
    }

    if (!isShippingAddressValid.value) {
      toast.add({
        severity: 'error',
        summary: '輸入錯誤',
        detail: '收件地址不能為空,並輸入中文地址',
        life: 3000,
      })
      return
    }
    const itemNames = selectedItems.value.map((item) => item.title).join('#')
    const tradeDesc = `購物車商品結帳: ${itemNames}`

    const payload = {
      TotalAmount: (selectedTotal.value + shipping.value).toString(),
      TradeDesc: tradeDesc,
      ItemName: itemNames,
    }

    await createEcpayOrder(payload, toast)
  }

  function contactDetails() {
    if (selectedItems.value.length === 0) {
      toast.add({
        severity: 'error',
        summary: '警告',
        detail: '請選擇至少一項商品才能結帳！',
        life: 3000,
      })
    } else {
      showShippingDetails.value = true
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
                <th class="px-4 py-2 w-12 text-center">
                  <input
                    type="checkbox"
                    class="custom-checkbox w-6 h-6 bg-white border-gray-400 focus:ring-2 focus:ring-primary-500"
                    :checked="
                      selectedItems.length === cart.items.length &&
                      cart.items.length > 0
                    "
                    @change="toggleSelectAll"
                  />
                </th>
                <th class="px-4 py-2 text-left">品名</th>
                <th class="px-4 py-2 text-center">數量</th>
                <th class="px-4 py-2 text-center">單價</th>
                <th class="px-4 py-2 text-center">刪除</th>
              </tr>
            </thead>
            <tbody class="bg-white">
              <tr
                v-for="item in cart.items"
                :key="item.id"
                class="border-b border-gray-200 hover:bg-gray-50"
              >
                <td class="px-4 py-4 text-center">
                  <input
                    type="checkbox"
                    class="custom-checkbox w-6 h-6 bg-white border-gray-400 focus:ring-2 focus:ring-primary-500"
                    :checked="selectedItems.some((i) => i.id === item.id)"
                    @change="toggleSelectItem(item, $event)"
                  />
                </td>
                <td class="px-4 py-4">
                  <div class="flex items-center space-x-4">
                    <img
                      v-if="item.image"
                      :src="item.image"
                      alt=""
                      class="w-20 h-20 object-cover rounded"
                    />
                    <div class="flex-1 flex flex-col justify-center">
                      <div v-if="item.eta" class="text-sm text-gray-500 mb-1">
                        預計 {{ item.eta }} 出貨
                      </div>
                      <div class="font-medium text-gray-800">
                        {{ item.name }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-4 text-center">
                  <select
                    v-model.number="item.qty"
                    @change="updateQty(item.id, item.qty)"
                    class="border rounded px-2 py-1"
                  >
                    <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
                  </select>
                </td>
                <td class="px-4 py-4 text-center">
                  {{ formatCurrency(item.price) }}
                </td>
                <td class="px-4 py-4 text-center">
                  <button
                    @click="remove(item.id)"
                    class="text-red-600 hover:text-red-800 focus:outline-none cursor-pointer"
                  >
                    <i class="pi pi-trash" style="font-size: 1.5rem"></i>
                  </button>
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
        <!-- input框 -->
        <div class="flex flex-col gap-2">
          <label for="username" class="font-bold">姓名</label>
          <InputText
            id="username"
            v-model="shippingForm.recipientName"
            aria-describedby="username-help"
            class="w-lg p-2 outline rounded-lg"
            required=""
          />
          <label for="cellphone" class="font-bold">手機號碼</label>
          <InputText
            id="cellphone"
            v-model="shippingForm.recipientPhone"
            aria-describedby="cellphone-help"
            class="w-lg p-2 outline rounded-lg mg-1"
            required=""
          />
          <label for="address" class="font-bold">地址</label>
          <InputText
            id="address"
            v-model="shippingForm.shippingAddress"
            aria-describedby="address-help"
            class="w-lg p-2 outline rounded-lg"
            required=""
          />
        </div>

        <div class="flex justify-between items-center pt-2 border-t mt-4">
          <span class="font-semibold">總金額 (TWD)</span>
          <span class="text-xl font-bold">
            {{ formatCurrency(selectedTotal + shipping) }}
          </span>
        </div>
        <!-- 按鈕 -->
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
