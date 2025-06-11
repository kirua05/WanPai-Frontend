import { ref, computed } from 'vue'
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

  const productSection = ref(null)
  const pageInput = ref('')
  const inputKeyword = ref('')
  const searchKeyword = computed(() => route.query.keyword || '')

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

  inputKeyword.value = searchKeyword.value

  function submitSearch() {
    const keyword = inputKeyword.value.trim()

    const query = {
      ...route.query,
      keyword: keyword || undefined,
    }

    if (route.query.page && route.query.page !== '1') {
      query.page = 1
    } else {
      delete query.page
    }

    router.push({
      path: '/',
      query,
    })
  }

<<<<<<< HEAD
  function resetSearch() {
    inputKeyword.value = ''
    router.push({ path: '/', query: {} })
  }
=======
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
  const items = [
    '模型',
    '公仔',
    '立牌',
    '雕像',
    '抱枕',
    '徽章',
    '吊飾',
    'T-shirt',
  ]
>>>>>>> 4fd57d7 (chore: format files with Prettier)

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
<<<<<<< HEAD

    const keyword = searchKeyword.value.toLowerCase()

    if (activeCategory.value !== '全部') {
      result = result.filter((p) => p.category === activeCategory.value)
    }

    if (keyword.length > 0) {
      result = result.filter((p) => p.name.toLowerCase().includes(keyword))
    }

=======
    if (activeCategory.value !== '全部')
      result = result.filter((p) => p.category === activeCategory.value)
    if (keyword.value.trim().length >= 1)
      result = result.filter((p) =>
        p.name.toLowerCase().includes(keyword.value.toLowerCase())
      )
>>>>>>> 4fd57d7 (chore: format files with Prettier)
    return result
  })

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredProducts.value.length / itemsPerPage))
  )
<<<<<<< HEAD

=======
>>>>>>> 4fd57d7 (chore: format files with Prettier)
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
  }
}
