import axios from '@/utils/axiosInstance'

const fetchStockLogsByProduct = async (productId) => {
  const res = await axios.get(`/admin/products/${productId}/stocklogs`)
  return res.data
}
const createStockLog = async (productId, stockLogData) => {
  const res = await axios.post(
    `/admin/products/${productId}/stocklogs`,
    stockLogData
  )
  return res.data
}

export { fetchStockLogsByProduct, createStockLog }
