import { ref, computed, watch, onMounted } from 'vue'
import axios from '@/utils/axiosInstance'
import { useRoute, useRouter } from 'vue-router'
import { fetchFilterData } from '@/api/product'

export function useProductList() {
  const route = useRoute()
  const router = useRouter()

  const keyword = computed(() => route.query.keyword || '')
  const isSearching = computed(() => keyword.value.trim().length > 0)

  const categories = ref([])
  const allCategories = computed(() => ['全部', ...categories.value])

  const itemsPerPage = 20
  const isLoading = ref(false)
  const hasLoadedOnce = ref(false)

  const products = ref([])
  const randomProducts = ref([])
  const productSection = ref(null)

  const currentPage = computed({
    get: () => parseInt(route.query.page, 10) || 1,
    set: (val) => {
      router.push({ query: { ...route.query, page: val } })
    },
  })

  const activeCategory = computed({
    get: () =>
      route.query.category === undefined ? '全部' : route.query.category,
    set: (val) => {
      router.push({
        path: '/products',
        query: {
          ...route.query,
          keyword: '',
          ipTag: '',
          category: val,
          page: 1,
        },
      })
    },
  })

  const activeIpTag = computed({
    get: () => route.query.ipTag || '',
    set: (val) => {
      router.push({
        path: '/products',
        query: {
          ...route.query,
          keyword: '',
          category: '',
          ipTag: val,
          page: 1,
        },
      })
    },
  })

  const loadFilterData = async () => {
    try {
      const { series } = await fetchFilterData()
      categories.value = Array.isArray(series)
        ? series.map((item) => item.tagname)
        : []
    } catch {
      categories.value = []
    }
  }

  const fetchAllProducts = async () => {
    const res = await axios.get('/products')
    return res.data || []
  }

  const fetchProductsByTag = async (tag) => {
    const res = await axios.get('/tags/filterByTagnames', {
      params: { tagname: tag },
    })
    return res.data.products || []
  }

  const loadProducts = async () => {
    isLoading.value = true
    products.value = []

    try {
      if (isSearching.value) {
        products.value = await fetchAllProducts()
      } else if (activeIpTag.value) {
        products.value = await fetchProductsByTag(activeIpTag.value)
      } else if (activeCategory.value && activeCategory.value !== '全部') {
        products.value = await fetchProductsByTag(activeCategory.value)
      } else {
        products.value = await fetchAllProducts()
      }
    } catch {
      products.value = []
    } finally {
      isLoading.value = false
      hasLoadedOnce.value = true
    }
  }

  const loadRandomProducts = async () => {
    try {
      const res = await axios.get('/products/random?limit=8')
      randomProducts.value = res.data || []
    } catch {
      randomProducts.value = []
    }
  }

  watch(
    () => [route.query.keyword, route.query.category, route.query.ipTag],
    async () => {
      await loadProducts()
      if (isSearching.value) await loadRandomProducts()
    },
    { immediate: true }
  )

  onMounted(() => {
    loadFilterData()
  })

  const filteredProducts = computed(() => {
    let result = products.value
    if (isSearching.value) {
      const kw = keyword.value.trim().toLowerCase()
      result = result.filter((p) => p.name.toLowerCase().includes(kw))
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

  const pageInput = ref('')
  const pageButtons = computed(() => {
    const total = totalPages.value
    const current = currentPage.value
    const buttons = []

    if (total <= 5) {
      for (let i = 1; i <= total; i++) buttons.push(i)
    } else {
      if (current <= 3) buttons.push(1, 2, 3, 4, '...', total)
      else if (current >= total - 2)
        buttons.push(1, '...', total - 3, total - 2, total - 1, total)
      else
        buttons.push(1, '...', current - 1, current, current + 1, '...', total)
    }

    return buttons
  })

  return {
    keyword,
    isSearching,
    activeCategory,
    activeIpTag,
    allCategories,
    products,
    filteredProducts,
    paginatedProducts,
    currentPage,
    totalPages,
    goToPage,
    pageInput,
    pageButtons,
    productSection,
    isLoading,
    hasLoadedOnce,
    randomProducts,
  }
}
