<script setup>
import { ref, onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

// 假資料
const product = ref({
    name: '經典白T恤',
    image: 'https://example.com/images/product1.jpg',
    stockOnHand: 100,
})

const stockLogs = ref([
    {
        before: 100,
        after: 90,
        change: -10,
        date: '2024-06-23 14:30',
        reason: '盤點調整',
        email: 'Ks7oV@example.com',
    },
    {
        before: 90,
        after: 120,
        change: 30,
        date: '2024-06-22 10:15',
        reason: '進貨入庫',
        email: 'Ks7oV@example.com',
    },
    {
        before: 120,
        after: 110,
        change: -10,
        date: '2024-06-21 09:00',
        reason: '訂單出貨',
        email: 'Ks7oV@example.com',
    },
])

onMounted(() => {
    // fetchStockLogs()
})
</script>

<template>
    <div class="flex justify-center items-start min-h-screen bg-gray-100 py-10">
        <div class="w-full max-w-3xl bg-white rounded-2xl shadow-xl px-10 py-8">
            <!-- 商品縮圖與名稱 -->

            <h2 class="text-3xl font-bold mb-6 pb-2 border-b border-gray-200 text-primary">
                庫存異動紀錄
            </h2>
            <div class="flex items-center gap-5 mb-8">
                <img :src="product.image" alt="商品縮圖" class="w-20 h-20 object-cover rounded-lg border" />
                <span class="text-2xl font-bold text-gray-800">{{ product.name }}</span>
            </div>
            <DataTable :value="stockLogs" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]"
                class="rounded-lg border border-gray-200 overflow-hidden">
                <Column field="before" header="修改前" />
                <Column field="after" header="修改後" class="text-center" />
                <Column field="change" header="變化" class="text-center">
                    <template #body="{ data }">
                        <span
                            :class="data.change > 0 ? 'text-green-600 font-bold' : data.change < 0 ? 'text-red-600 font-bold' : ''">
                            {{ data.change > 0 ? '+' : '' }}{{ data.change }}
                        </span>
                    </template>
                </Column>
                <Column field="date" header="修改日期" class="text-center" sortable />
                <Column field="reason" header="修改原因" class="text-center" />
                <Column field="email" header="修改人" class="text-center" />
            </DataTable>
        </div>
    </div>
</template>
