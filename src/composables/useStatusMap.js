export function useStatusMap() {
  const statusMap = {
    pending: '待出貨',
    paid: '已付款',
    cancelled: '已取消',
    refunded: '已退款',
    shipped: '已出貨',
    delivered: '已完成',
    returned: '退貨',
  }

  return { statusMap }
}
