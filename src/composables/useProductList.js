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
  const randomProducts = ref([])

  const loadRandomProducts = async () => {
    try {
      const res = await axios.get('/products/random?limit=8')
      randomProducts.value = res.data
    } catch (err) {
      err
      randomProducts.value = []
    }
  }

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

  const activeCategory = computed({
    get: () => {
      if (route.query.keyword || route.query.ipTag) {
        return ''
      }
      return route.query.category === undefined ? '全部' : route.query.category
    },
    set: (val) => {
      router.push({
        query: {
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
        query: {
          ipTag: val,
          page: 1,
        },
      })
    },
  })

  const currentPage = computed({
    get: () => parseInt(route.query.page, 10) || 1,
    set: (val) => {
      router.push({ query: { ...route.query, page: val } })
    },
  })

  const productSection = ref(null)

  watch(
    () => route.query.keyword,
    async (val, oldVal) => {
      if (!val && oldVal) {
        if (activeIpTag.value) {
          await loadProductsByIpTag(activeIpTag.value)
        } else {
          await loadProductsByCategory(activeCategory.value)
        }
        return
      }

      if (!val) return
      if (val.trim().length > 0) {
        products.value = []
        isLoading.value = true
        try {
          const res = await axios.get('/products')
          products.value = res.data
        } catch {
          products.value = []
        } finally {
          isLoading.value = false
        }
      }

      if (route.query.category && route.query.category !== '全部') {
        router.push({
          query: {
            ...route.query,
            category: '全部',
            page: 1,
          },
        })
      }

      await loadRandomProducts()
    }
  )

  const products = ref([])

  const loadProductsByCategory = async (category) => {
    products.value = []
    isLoading.value = true

    try {
      if (category === '全部') {
        const res = await axios.get('/products')
        products.value = res.data
      } else {
        const res = await axios.get('/tags/filterByTagnames', {
          params: { tagname: category },
        })
        products.value = res.data.products || []
      }
    } catch {
      products.value = []
    } finally {
      isLoading.value = false
      hasLoadedOnce.value = true
    }
  }

  const loadProductsByIpTag = async (ipTag) => {
    products.value = []
    isLoading.value = true

    try {
      if (ipTag) {
        const res = await axios.get('/tags/filterByTagnames', {
          params: { tagname: ipTag },
        })
        products.value = res.data.products || []
      } else {
        const res = await axios.get('/products')
        products.value = res.data
      }
    } catch {
      products.value = []
    } finally {
      isLoading.value = false
      hasLoadedOnce.value = true
    }
  }

  onMounted(async () => {
    await loadFilterData()
    if (activeIpTag.value) {
      await loadProductsByIpTag(activeIpTag.value)
    } else {
      await loadProductsByCategory(activeCategory.value)
    }

    if (isSearching.value) {
      await loadRandomProducts()
    }
  })

  watch(
    () => activeCategory.value,
    async (newCategory, oldCategory) => {
      if (
        newCategory !== oldCategory &&
        oldCategory !== undefined &&
        newCategory
      ) {
        await loadProductsByCategory(newCategory)
      }
    }
  )

  watch(
    () => activeIpTag.value,
    async (newIpTag, oldIpTag) => {
      if (newIpTag !== oldIpTag && oldIpTag !== undefined) {
        if (newIpTag) {
          await loadProductsByIpTag(newIpTag)
        } else {
          const categoryToLoad =
            activeCategory.value === '' ? '全部' : activeCategory.value
          await loadProductsByCategory(categoryToLoad)
        }
      }
    }
  )

  const filteredProducts = computed(() => {
    let result = products.value
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

  const pageInput = ref('')

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
    loadRandomProducts,
  }
}
