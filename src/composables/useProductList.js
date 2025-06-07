import { ref, computed, nextTick } from 'vue'
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

  const inputKeyword = ref('')
  const isComposing = ref(false)
  const productSection = ref(null)

  const activeCategory = computed({
    get: () => route.query.category || '全部',
    set: (val) => {
      router.push({ query: { ...route.query, category: val, page: 1 } })
    },
  })

  const currentPage = computed({
    get: () => parseInt(route.query.page, 10) || 1,
    set: (val) => {
      router.push({ query: { ...route.query, page: val } })
    },
  })

  if (route.query.keyword) {
    inputKeyword.value = route.query.keyword
  }

  function submitSearch() {
    if (isComposing.value) return

    router.push({
      query: {
        ...route.query,
        keyword: inputKeyword.value,
        page: 1,
      },
    })

    nextTick(() => {
      productSection.value?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })
  }

  function resetSearch() {
    inputKeyword.value = ''
    router.push({ path: '/', query: {} })
  }

  const products = ref([])
  const brands = [
    '鋼彈',
    '海賊王',
    '鬼滅之刃',
    'Fate',
    'EVA',
    '初音未來',
    '咒術迴戰',
    '七龍珠',
    'Re:Zero',
    '火影忍者',
    '東京復仇者',
    '刀劍神域',
  ]
  const items = categories

  for (let i = 1; i <= 60; i++) {
    const brand = brands[i % brands.length]
    const item = items[i % items.length]
    const name = `${brand} ${item} #${i}`
    const price = 299 + Math.floor(Math.random() * 500)
    let category = item
    if (i % 10 === 0) category = '限量'
    products.value.push({ id: i, name, image: '', price, category })
  }

  const filteredProducts = computed(() => {
    let result = products.value
    if (activeCategory.value !== '全部') {
      result = result.filter((p) => p.category === activeCategory.value)
    }
    if (inputKeyword.value.trim().length >= 1) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(inputKeyword.value.toLowerCase())
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

  const pageButtons = computed(() => {
    const pages = []
    const start = Math.max(1, currentPage.value - 2)
    const end = Math.min(totalPages.value, currentPage.value + 2)
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  })

  return {
    inputKeyword,
    submitSearch,
    resetSearch,
    activeCategory,
    allCategories,
    paginatedProducts,
    currentPage,
    totalPages,
    goToPage,
    handleCategoryClick,
    pageInput,
    jumpToPage,
    pageButtons,
    productSection,
    isComposing,
  }
}
