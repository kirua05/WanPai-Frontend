import { ref, computed, watch, nextTick, onMounted } from 'vue'
import axios from '@/utils/axiosInstance'
import { useRoute, useRouter } from 'vue-router'
import { fetchFilterData } from '@/api/product'

export function useProductList() {
  const route = useRoute()
  const router = useRouter()

  const categories = ref([])
  const allCategories = computed(() => ['全部', ...categories.value])
  const itemsPerPage = 20

  const loadFilterData = async () => {
    try {
      const filterData = await fetchFilterData()
      if (filterData.series && Array.isArray(filterData.series)) {
        categories.value = filterData.series.map((item) => item.tagname)
      } else {
        console.warn('API returned no series array:', filterData)
        categories.value = []
      }
    } catch (error) {
      console.error('Failed to load filter data:', error)
      categories.value = []
    }
  }

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

  const loadProductsByCategory = async (category) => {
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
    }
  }

  onMounted(async () => {
    await loadFilterData()
    // Now that filter data is loaded, start loading products based on the active category.
    loadProductsByCategory(activeCategory.value)
  })

  // Watch for category changes from user interaction, but not on initial load.
  watch(
    () => activeCategory.value,
    async (newCategory, oldCategory) => {
      // Avoid re-fetching on the initial "undefined" to "全部" transition that onMounted handles.
      if (newCategory !== oldCategory && oldCategory !== undefined) {
        await loadProductsByCategory(newCategory)
      }
    }
  )

  const filteredProducts = computed(() => {
    let result = products.value

    // Category filtering is handled by `loadProductsByCategory` via API call.
    // This computed property now only handles keyword filtering.
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
