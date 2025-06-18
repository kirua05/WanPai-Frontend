<script setup>
  // import { useRoute } from 'vue-router'
  import { ref } from 'vue'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import Select from 'primevue/select'
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

  const orderItems = ref([
    {
      img: 'https://via.placeholder.com/150',
      name: '商品名稱 1',
      quantity: 2,
      unitPrice: 100,
    },
    {
      img: 'https://via.placeholder.com/150',
      name: '商品名稱 2',
      quantity: 1,
      unitPrice: 200,
    },
    {
      img: 'https://via.placeholder.com/150',
      name: '商品名稱 3',
      quantity: 3,
      unitPrice: 150,
    },
  ])
</script>

<template>
  <Toast />
  <div class="mr-6">
    <h2 class="text-2xl">訂單編號: 1233443</h2>
    <p>
      訂單成立日期
      <span>2023-01-01</span>
    </p>
    <div class="flex flex-col gap-4 mt-4">
      <div>
        <label class="font-bold mb-2 block" for="orderItems">訂購商品</label>
        <div class="card" id="orderItems">
          <DataTable :value="orderItems" tableStyle="min-width: 50rem">
            <Column field="img" header=""></Column>
            <Column field="name" header="商品"></Column>
            <Column field="quantity" header="數量"></Column>
            <Column field="unitPrice" header="單價"></Column>
          </DataTable>
        </div>
      </div>

      <div>
        <label class="font-bold mb-2 block" for="recipient">訂購人資訊</label>
        <div class="card flex flex-col gap-4" id="recipient">
          <input
            type="text"
            id="recipientName"
            class="bg-surface-0 rounded-md border-surface-300 border focus:outline-none focus:ring-0 enabled:focus:border-primary w-full md:w-56 px-3 py-2 transition-colors duration-200"
            placeholder="收件人姓名"
          />
          <input
            type="text"
            id="recipientPhone"
            class="bg-surface-0 rounded-md border-surface-300 border focus:outline-none focus:ring-0 enabled:focus:border-primary w-full md:w-56 px-3 py-2 transition-colors duration-200"
            placeholder="收件人電話"
          />
          <input
            type="text"
            id="recipientAddress"
            class="bg-surface-0 rounded-md border-surface-300 border focus:outline-none focus:ring-0 enabled:focus:border-primary w-full md:w-56 px-3 py-2 transition-colors duration-200"
            placeholder="收件人地址"
          />
        </div>
      </div>
      <div>
        <label class="font-bold mb-2 block" for="description">
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

      <div class="flex gap-2">
        <button
          class="text-md text-white px-3 py-2 border-surface-200 rounded-md bg-yellow-500 cursor-pointer"
          @click="submit"
        >
          取消
        </button>
        <button
          class="text-md text-white px-3 py-2 border-surface-200 rounded-md bg-primary cursor-pointer"
          @click="submit"
        >
          儲存變更
        </button>
      </div>
    </div>
  </div>
</template>
