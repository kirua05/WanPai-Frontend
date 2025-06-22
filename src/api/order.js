import axios from '@/utils/axiosInstance'

// for users
export async function fetchOrders(filters = {}) {
  const res = await axios.get('/orders', {
    params: filters,
  })
  return res.data
}

// 查詢單一訂單（含明細）
export async function fetchOrderDetail(orderId) {
  const res = await axios.get(`/orders/${orderId}`)
  return res.data
}

export async function fetchAllOrders(status = 'all') {
  const res = await axios.get('/admin/orders', {
    params: { status },
  })
  return res.data
}

// 建立新訂單
export async function createOrder(orderData) {
  // orderData 結構範例：
  // {
  //   recipientName, recipientPhone, shippingAddress,
  //   items: [{ productId, productName, productImage, price, quantity, subtotal }, ...]
  // }
  const res = await axios.post('/admin/orders', orderData)
  return res.data
}

// 更新訂單狀態（如出貨、取消）
export async function updateOrder(orderId, updateData) {
  const res = await axios.put(`/admin/orders/${orderId}`, updateData)
  return res.data
}

// 軟刪除訂單
export async function deleteOrder(orderId) {
  const res = await axios.delete(`/admin/orders/${orderId}`)
  return res.data
}

export function calculateOrdersWithTotal(orders) {
  return orders.map((order) => {
    const items = order.items || [] // 如果沒有 items 就給空陣列
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    return { ...order, total }
  })
}
