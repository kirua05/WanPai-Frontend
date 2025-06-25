<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from '@/utils/axiosInstance'

const router = useRouter()
const route = useRoute()

defineProps({
    activeIpTag: String,
})



const currentActiveIpTag = computed(() => route.query.ipTag || '')

const brands = ref([])
const ips = ref([])
const expandedBrands = ref(new Set())
const isLoading = ref(false)
const brandIpMap = ref(new Map())

const initializeSmartMatching = () => {
    const newBrandIpMap = new Map()

    brands.value.forEach(brand => {
        const relatedIPs = new Set()
        const brandName = brand.tagname.toLowerCase()

        ips.value.forEach(ip => {
            const ipName = ip.tagname.toLowerCase()

            if (brandName.includes('bandai')) {
                if (ipName.includes('鋼彈') || ipName.includes('假面騎士') ||
                    ipName.includes('數碼寶貝') || ipName.includes('超人力霸王')) {
                    relatedIPs.add(ip)
                }
            } else if (brandName.includes('good smile')) {
                if (ipName.includes('初音未來') || ipName.includes('物語') ||
                    ipName.includes('葬送')) {
                    relatedIPs.add(ip)
                }
            } else if (brandName.includes('kotobukiya')) {
                if (ipName.includes('hololive') || ipName.includes('絕區零')) {
                    relatedIPs.add(ip)
                }
            } else if (brandName.includes('takaratomy')) {
                if (ipName.includes('變形金剛')) {
                    relatedIPs.add(ip)
                }
            }
        })

        newBrandIpMap.set(brand.id, Array.from(relatedIPs))
    })

    brandIpMap.value = newBrandIpMap
}

const brandGroups = computed(() => {
    return brands.value.map(brand => {
        const brandIPs = brandIpMap.value.get(brand.id) || []
        return {
            brand: brand,
            ips: brandIPs,
            productCount: 0
        }
    }).filter(group => group.ips.length > 0)
})

const loadInitialData = async () => {
    isLoading.value = true
    try {


        const tagsRes = await axios.get('/tags/filter')
        brands.value = tagsRes.data.brands || []
        ips.value = tagsRes.data.ip || []




        initializeSmartMatching()
        isLoading.value = false

        findBrandRelatedIPs()

    } catch (error) {
        error
        brands.value = []
        ips.value = []
        isLoading.value = false
    }
}

const findBrandRelatedIPs = async () => {


    const brandPromises = brands.value.map(async (brand) => {
        try {
            const productsRes = await axios.get('/tags/filterByTagnames', {
                params: { tagname: brand.tagname }
            })

            const brandProducts = productsRes.data.products || []
            const relatedIPs = new Set()

            brandProducts.forEach(product => {
                ips.value.forEach(ip => {
                    if (product.name && product.name.toLowerCase().includes(ip.tagname.toLowerCase())) {
                        relatedIPs.add(ip)
                    }
                })
            })

            if (relatedIPs.size > 0) {
                return { brandId: brand.id, ips: Array.from(relatedIPs) }
            }
            return null

        } catch (error) {
            error
            return null
        }
    })

    try {
        const results = await Promise.all(brandPromises)
        const currentMap = new Map(brandIpMap.value)

        results.forEach(result => {
            if (result) {
                const { brandId, ips: brandIPs } = result
                currentMap.set(brandId, brandIPs)

            }
        })

        brandIpMap.value = currentMap

    } catch (error) {
        error
    }
}

function toggleBrand(brandId) {
    const newExpanded = new Set(expandedBrands.value)
    if (newExpanded.has(brandId)) {
        newExpanded.delete(brandId)
    } else {
        newExpanded.add(brandId)
    }
    expandedBrands.value = newExpanded
}

function selectIP(ipTagname) {
    router.push({
        query: {
            ...route.query,
            category: '',
            ipTag: ipTagname,
            page: 1,
        },
    })

    setTimeout(() => {
        const categoryFilter = document.querySelector('.flex.flex-wrap.gap-2.justify-center.mb-6')
        if (categoryFilter) {
            const rect = categoryFilter.getBoundingClientRect()
            const offsetTop = window.pageYOffset + rect.top - 20
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            })
        }
    }, 100)
}

function isBrandExpanded(brandId) {
    return expandedBrands.value.has(brandId)
}

onMounted(() => {
    loadInitialData()
})
</script>

<template>
    <div class="hidden lg:block p-6 w-64 h-full overflow-y-auto">
        <div v-if="isLoading" class="flex justify-center py-4">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            <span class="ml-2 text-sm text-yellow-500">載入中...</span>
        </div>

        <div v-if="!isLoading" class="space-y-2">
            <div v-for="group in brandGroups" :key="group.brand.id">
                <button @click="toggleBrand(group.brand.id)"
                    class="w-full flex items-center justify-between py-3 px-2 text-left hover:bg-gray-100 transition-colors duration-200 rounded cursor-pointer">
                    <span class="font-medium text-yellow-500">{{ group.brand.tagname }}</span>
                    <div class="flex items-center space-x-2">
                        <svg :class="['w-4 h-4 transition-transform duration-200 stroke-yellow-500', isBrandExpanded(group.brand.id) ? 'rotate-180' : '']"
                            fill="none" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7">
                            </path>
                        </svg>
                    </div>
                </button>

                <div v-if="isBrandExpanded(group.brand.id)" class="pl-4 pb-2 space-y-1">
                    <button v-for="ip in group.ips" :key="ip.id" @click="selectIP(ip.tagname)" :class="[
                        'block w-full text-left py-2 px-3 transition-colors duration-200 cursor-pointer',
                        currentActiveIpTag !== ip.tagname ? 'hover:bg-gray-100' : ''
                    ]">
                        <span :class="[
                            'px-3 py-1 text-sm rounded transition-colors duration-200 inline-block',
                            currentActiveIpTag === ip.tagname
                                ? 'bg-yellow-500 text-white'
                                : 'text-yellow-500'
                        ]">
                            {{ ip.tagname }}
                        </span>
                    </button>
                </div>
            </div>
        </div>

        <div v-if="!isLoading && brandGroups.length === 0" class="text-center py-8">
            <p class="text-sm text-yellow-500">尚未找到品牌相關的IP</p>
        </div>
    </div>

    <div class="lg:hidden">
        <div class="px-4 py-3">
            <div v-if="isLoading" class="flex justify-center py-4">
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                <span class="ml-2 text-sm text-yellow-500">載入中...</span>
            </div>

            <div v-if="!isLoading" class="space-y-3">
                <div v-for="group in brandGroups" :key="group.brand.id" class="rounded-lg">
                    <button @click="toggleBrand(group.brand.id)"
                        class="w-full flex items-center justify-between py-3 px-4 text-left hover:bg-gray-100 transition-colors duration-200 rounded-lg cursor-pointer">
                        <span class="font-medium text-yellow-500">{{ group.brand.tagname }}</span>
                        <div class="flex items-center space-x-2">
                            <svg :class="['w-4 h-4 transition-transform duration-200 stroke-yellow-500', isBrandExpanded(group.brand.id) ? 'rotate-180' : '']"
                                fill="none" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7">
                                </path>
                            </svg>
                        </div>
                    </button>

                    <div v-if="isBrandExpanded(group.brand.id)" class="p-3 flex flex-wrap gap-2">
                        <button v-for="ip in group.ips" :key="ip.id" @click="selectIP(ip.tagname)" :class="[
                            'px-3 py-2 text-sm rounded-full border transition-colors duration-200 cursor-pointer',
                            currentActiveIpTag === ip.tagname
                                ? 'border-transparent bg-yellow-500 text-white'
                                : 'bg-white border-gray-300 hover:border-yellow-500 text-yellow-500'
                        ]">
                            {{ ip.tagname }}
                        </button>
                    </div>
                </div>
            </div>

            <div v-if="!isLoading && brandGroups.length === 0" class="text-center py-6">
                <p class="text-sm text-yellow-500">尚未找到品牌相關的IP</p>
            </div>
        </div>
    </div>
</template>