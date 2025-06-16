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

  const inputKeyword = ref(route.query.keyword || '')
  const productSection = ref(null)

  watch(
    () => route.query.keyword,
    async (val) => {
      inputKeyword.value = val || ''
      await nextTick()
      productSection.value?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  )

  function submitSearch() {
    router.push({
      query: {
        ...route.query,
        keyword: inputKeyword.value,
        page: 1,
      },
    })
  }

  const products = ref([])

  onMounted(async () => {
    try {
      const res = await axios.get('/products')
      products.value = res.data
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('獲取產品列表失敗:', err)
      alert('產品載入失敗，請確認後端 API 是否正常，或稍後再試')
    }
  })

  const filteredProducts = computed(() => {
    let result = products.value

    if (activeCategory.value !== '全部')
      result = result.filter((p) => p.category === activeCategory.value)

    if (keyword.value.trim().length >= 1)
      result = result.filter((p) =>
        p.name.toLowerCase().includes(keyword.value.toLowerCase())
      )

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

  function handleCategoryClick(category) {
    activeCategory.value = category
  }

  const pageInput = ref('')
  function jumpToPage() {
    const page = parseInt(pageInput.value, 10)
    if (!isNaN(page)) {
      goToPage(page)
      pageInput.value = ''
    }
  }
  function resetSearch() {
    inputKeyword.value = ''
    router.push({ query: { ...route.query, keyword: '', page: 1 } })
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
    inputKeyword,
    keyword,
    resetSearch,
    submitSearch,
    activeCategory,
    allCategories,
    products,
    filteredProducts,
    paginatedProducts,
    currentPage,
    totalPages,
    goToPage,
    handleCategoryClick,
    pageInput,
    jumpToPage,
    pageButtons,
    productSection,
  }
}
