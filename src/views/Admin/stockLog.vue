<script setup>
import { ref, onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { fetchStockLogsByProduct } from '@/api/stockLog'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()

const productId = ref(Number(route.params.id) || null)
const product = ref({
})

const stockLogs = ref([])

const goEditProduct = (id) => {
    router.push({ name: 'editProduct', params: { id } })
}

onMounted(async () => {
    const res = await fetchStockLogsByProduct(productId.value)
    stockLogs.value = res
})
</script>

<template>
    <div class="flex justify-center items-start min-h-screen bg-gray-100 py-10">
        <div class="w-full max-w-3xl bg-white rounded-2xl shadow-xl px-10 py-8">

            <h2 class="text-3xl font-bold mb-6 pb-2 border-b border-gray-200 text-primary">
                庫存異動紀錄
            </h2>
            <div class="text-gray-600 mb-4">
                <a @click="goEditProduct(productId)" class="font-semibold">前往商品編輯頁</a>
            </div>
            <div class="flex items-center gap-5 mb-8">
                <img :src="product.image" alt="商品縮圖" class="w-20 h-20 object-cover rounded-lg border" />
                <span class="text-2xl font-bold text-gray-800">{{ product.name }}</span>
            </div>
            <DataTable :value="stockLogs" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]"
                class="rounded-lg border border-gray-200 overflow-hidden">
                <Column header="修改前">
                    <template #body="{ data }">
                        {{ data.amountAfter - data.amountChange }}
                    </template>
                </Column>
                <Column field="amountAfter" header="修改後" class="text-center" />
                <Column field="amounChange" header="變化" class="text-center">
                    <template #body="{ data }">
                        <span
                            :class="data.amountChange > 0 ? 'text-green-600 font-bold' : data.amountchange < 0 ? 'text-red-600 font-bold' : ''">
                            {{ data.amountChange > 0 ? '+' : '' }}{{ data.amountChange }}
                        </span>
                    </template>
                </Column>
                <Column field="createdAt" header="修改日期" class="text-center" sortable />
                <Column field="reason" header="修改原因" class="text-center" />
                <Column field="email" header="修改人" class="text-center" />
            </DataTable>
        </div>
    </div>
</template>
