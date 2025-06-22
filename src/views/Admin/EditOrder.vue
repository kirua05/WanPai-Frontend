<script setup>
  import { ref, onMounted } from 'vue'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import Select from 'primevue/select'
  import Toast from 'primevue/toast'
  import { useRouter, useRoute } from 'vue-router'
  import { useToast } from 'primevue/usetoast'
  import { fetchOrderDetail, updateOrder } from '@/api/order'

  const router = useRouter()
  const route = useRoute()
  const toast = useToast()
  const orderId = route.params.id || null
  const order = ref(null)
  const form = ref({
    recipientName: '',
    recipientPhone: '',
    shippingAddress: '',
    status: 'paid',
  })

  const statusOptions = ref([
    { title: '已付款', value: 'paid' },
    { title: '已出貨', value: 'shipped' },
    { title: '已完成', value: 'completed' },
    { title: '已取消', value: 'cancelled' },
  ])

  const orderItems = ref([])

  function onCancel() {
    router.push('/admin/orders')
  }
  const onSave = async () => {
    if (!form.value.recipientName) {
      toast.add({
        severity: 'warn',
        summary: '請輸入收件者姓名',
        life: 3000,
      })
      return
    }
    if (!form.value.recipientPhone) {
      toast.add({
        severity: 'warn',
        summary: '請輸入收件者電話',
        life: 3000,
      })
      return
    }
    if (!form.value.shippingAddress) {
      toast.add({
        severity: 'warn',
        summary: '請輸入收件地址',
        life: 3000,
      })
      return
    }
    if (!form.value.status) {
      toast.add({
        severity: 'warn',
        summary: '請選擇訂單狀態',
        life: 3000,
      })
      return
    }

    try {
      await updateOrder(orderId, { ...form.value })
      toast.add({
        severity: 'success',
        summary: '儲存成功',
        detail: '訂單已更新',
        life: 3000,
      })
    } catch {
      toast.add({
        severity: 'error',
        summary: '儲存失敗',
        detail: '請檢查輸入資料是否正確',
        life: 3000,
      })
      return
    }

    router.push('/admin/orders')
  }

  onMounted(async () => {
    const data = await fetchOrderDetail(orderId)
    order.value = data
    form.value.recipientName = data.recipientName
    form.value.recipientPhone = data.recipientPhone
    form.value.shippingAddress = data.shippingAddress
    form.value.status = data.status
  })
</script>
<template>
  <Toast />
  <div class="flex justify-center items-start min-h-screen bg-gray-100 py-10">
    <div class="w-full max-w-3xl bg-white rounded-2xl shadow-xl px-10 py-8">
      <h2
        class="text-3xl font-bold mb-6 pb-2 border-b border-gray-200 text-primary"
      >
        訂單編輯
      </h2>
      <div v-if="order" class="flex flex-col gap-6 mt-2">
        <div>
          <label class="font-semibold mb-2 block text-gray-700">訂單編號</label>
          <div class="text-lg text-gray-800 mb-1">{{ order.orderNumber }}</div>
          <span class="text-sm text-gray-500">
            訂單成立日期：{{ order.createdAt.slice(0, 10) }}
          </span>
        </div>
        <div>
          <label
            class="font-semibold mb-2 block text-gray-700"
            for="orderItems"
          >
            訂購商品
          </label>
          <div class="rounded-lg border border-gray-200 overflow-hidden">
            <DataTable :value="orderItems" tableStyle="min-width: 100%">
              <Column field="img" header="">
                <template #body="slotProps">
                  <img
                    :src="slotProps.data.img"
                    alt=""
                    class="w-14 h-14 object-cover rounded-md"
                  />
                </template>
              </Column>
              <Column field="name" header="商品"></Column>
              <Column field="quantity" header="數量"></Column>
              <Column field="unitPrice" header="單價"></Column>
            </DataTable>
          </div>
        </div>
        <div>
          <label class="font-semibold mb-2 block text-gray-700" for="recipient">
            訂購人資訊
          </label>
          <div class="flex flex-col gap-4">
            <input
              v-model="form.recipientName"
              type="text"
              id="recipientName"
              class="bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary w-full px-4 py-2 text-lg transition"
              placeholder="收件人姓名"
            />
            <input
              v-model="form.recipientPhone"
              type="text"
              id="recipientPhone"
              class="bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary w-full px-4 py-2 text-lg transition"
              placeholder="收件人電話"
            />
            <input
              v-model="form.shippingAddress"
              type="text"
              id="recipientAddress"
              class="bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary w-full px-4 py-2 text-lg transition"
              placeholder="收件人地址"
            />
          </div>
        </div>
        <div>
          <label class="font-semibold mb-2 block text-gray-700" for="status">
            更改訂單狀態
          </label>
          <Select
            v-model="form.status"
            :options="statusOptions"
            optionLabel="title"
            optionValue="value"
            placeholder="訂單狀態"
            class="w-full md:w-56"
          />
        </div>
        <div class="flex justify-end gap-3 mt-2">
          <button
            class="text-md font-bold text-white px-4 py-2 rounded-lg bg-red-500 shadow-md hover:bg-red-600 hover:cursor-pointer transition"
            @click="onCancel"
          >
            取消
          </button>
          <button
            class="text-md font-bold text-white px-4 py-2 rounded-lg bg-primary shadow-md hover:bg-primary-700 hover:cursor-pointer transition"
            @click="onSave"
          >
            儲存變更
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
