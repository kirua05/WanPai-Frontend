import { ref, computed, watch, nextTick, onMounted } from 'vue'
import axios from '@/utils/axiosInstance'
import { useRoute, useRouter } from 'vue-router'

export function useProductList() {
  const route = useRoute()
  const router = useRouter()

  const categories = [
    '模型',
    '公仔',
    '立牌',
    '雕像',
    '抱枕',
    '徽章',
    '吊飾',
    'T-shirt',
  ]
  const allCategories = ['全部', ...categories]
  const itemsPerPage = 20

  const activeCategory = computed({
    get: () => route.query.category || '全部',
    set: (val) => {
      router.push({ query: { ...route.query, category: val, page: 1 } })
    },
  })

  const keyword = computed(() => route.query.keyword || '')
  const currentPage = computed({
    get: () => parseInt(route.query.page, 10) || 1,
    set: (val) => {
      router.push({ query: { ...route.query, page: val } })
    },
  })

  const productSection = ref(null)

  watch(
    () => route.query.keyword,
    async (val) => {
      if (!val) return
      await nextTick()
      productSection.value?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  )

  const products = ref([])

  onMounted(async () => {
    try {
      const res = await axios.get('/products')
      products.value = res.data
    } catch {
      alert('產品載入失敗，請確認後端 API 是否正常，或稍後再試')
    }

    if (route.query.keyword && route.query.keyword.trim()) {
      await nextTick()
      productSection.value?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  })

  const filteredProducts = computed(() => {
    let result = products.value

    if (activeCategory.value !== '全部') {
      result = result.filter((p) => p.category === activeCategory.value)
    }

    if (keyword.value.trim().length >= 1) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(keyword.value.toLowerCase())
      )
    }

    return result
  })

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredProducts.value.length / itemsPerPage))
  )

  const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    return filteredProducts.value.slice(start, start + itemsPerPage)
  })

  function goToPage(page) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
      productSection.value?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  const pageButtons = computed(() => {
    const total = totalPages.value
    const current = currentPage.value
    const buttons = []

    if (total <= 5) {
      for (let i = 1; i <= total; i++) {
        buttons.push(i)
      }
    } else {
      if (current <= 3) {
        buttons.push(1, 2, 3, 4, '...', total)
      } else if (current >= total - 2) {
        buttons.push(1, '...', total - 3, total - 2, total - 1, total)
      } else {
        buttons.push(1, '...', current - 1, current, current + 1, '...', total)
      }
    }

    return buttons
  })

  return {
    keyword,
    activeCategory,
    allCategories,
    products,
    filteredProducts,
    paginatedProducts,
    currentPage,
    totalPages,
    goToPage,
    pageButtons,
    productSection,
  }
}
