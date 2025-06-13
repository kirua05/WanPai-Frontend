import axios from '@/utils/axiosInstance'

const fetchAllProducts = async (status = 'all') => {
  const res = await axios.get(`/products?status=${status}`)
  return res.data
}

const fetchProductById = async (id) => {
  const res = await axios.get(`/products/${id}`)
  return res.data
}

const createProduct = async (data) => {
  const res = await axios.post('/admin/products', data)
  return res.data
}

const updateProduct = async (id, data) => {
  const res = await axios.put(`/admin/products/${id}`, data)
  return res.data
}

export { fetchAllProducts, fetchProductById, createProduct, updateProduct }
