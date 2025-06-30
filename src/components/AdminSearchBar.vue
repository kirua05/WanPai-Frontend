<script setup>
  import { ref, computed } from 'vue'
  import AutoComplete from 'primevue/autocomplete'
  import { fetchAllProducts } from '@/api/product'
  import { fetchOrders } from '@/api/order'
  import { onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  const router = useRouter()
  const items = ref([])

  onMounted(async () => {
    const [productRes, orderRes] = await Promise.all([
      fetchAllProducts(),
      fetchOrders(),
    ])

    const productItems = productRes.map((product) => ({
      id: product.id,
      label: product.name,
      code: product.sku,
      type: 'product',
    }))

    const orderItems = orderRes.map((order) => ({
      id: order.id,
      label: order.orderNumber,
      code: order.recipientName,
      type: 'order',
    }))

    items.value = [...productItems, ...orderItems]
  })
  const keyword = ref('')
  const selectedItem = ref(null)
  const filteredItems = computed(() => {
    if (!keyword.value) return []

    const lowerKeyword = keyword.value.toLowerCase()

    return items.value.filter(
      (item) =>
        item.label.toLowerCase().includes(lowerKeyword) ||
        item.code.toLowerCase().includes(lowerKeyword)
    )
  })

  const search = (item) => {
    if (item.type === 'product') {
      router.push(`admin/products/${item.id}`)
    } else if (item.type === 'order') {
      router.push(`admin/orders/${item.id}`)
    }
  }
</script>

<template>
  <div class="card w-124">
    <AutoComplete
      v-model="selectedItem"
      :suggestions="filteredItems"
      @item-select="search"
      @input="keyword = $event"
      optionLabel="label"
      placeholder="輸入商品名稱、貨號或訂單編號"
      :pt="{ pcInputText: { root: '!w-124' } }"
    >
      <template #optiongroup="slotProps">
        <div class="flex items-center country-item">
          <img
            :alt="slotProps.option.label"
            src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
            :class="`flag flag-${slotProps.option.code.toLowerCase()} mr-2`"
            style="width: 18px"
          />
          <div>{{ slotProps.option.label }}</div>
        </div>
      </template>
    </AutoComplete>
  </div>
</template>
