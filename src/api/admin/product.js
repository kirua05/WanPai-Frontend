import axios from '@/utils/axiosInstance'

const fetchAllProducts = async () => {
  try {
    const res = await axios.get('/products')
    return res.data
  } catch (err) {
    // 之後會再加入錯誤訊息框
    return err
  }
}

const createProduct = async (data) => {
  try {
    const res = await axios.post('/admin/products', data)
    return res
  } catch (err) {
    return err
  }
}

export { fetchAllProducts, createProduct }
