import axios from '@/utils/axiosInstance'

const fetchAllProducts = async (status = 'all') => {
  const res = await axios.get('/admin/products', {
    params: { status },
  })
  return res.data
}

const fetchProductById = async (id) => {
  const res = await axios.get(`/products/${id}`)
  return res.data
}

const createProduct = async (productData) => {
  const res = await axios.post('/admin/products', productData, {
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return res.data
}

const updateProduct = async (id, productData) => {
  const res = await axios.put(`/admin/products/${id}`, productData, {
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return res.data
}

const fetchFilterData = async () => {
  const res = await axios.get('/tags/filter')
  return res.data
}

export {
  fetchAllProducts,
  fetchProductById,
  createProduct,
  updateProduct,
  fetchFilterData,
}
