import axios from 'src/utils/axiosInstance'

export const fetchAllProducts = async () => {
  try {
    const res = await axios.get('/admin/products')
    return res.data
  } catch (err) {
    // 之後會再加入錯誤訊息框
    return err
  }
}
