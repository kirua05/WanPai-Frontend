import { defineStore } from 'pinia'
import axios from 'axios'

function isLogin() {
  return !!localStorage.getItem('token')
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
  }),
  getters: {
    totalQty: (state) => state.items.reduce((sum, item) => sum + (item.quantity || 0), 0),
    totalPrice: (state) => state.items.reduce((sum, item) => sum + (item.quantity || 0) * (item.priceAtAdd || 0), 0),
  },
  actions: {
    async fetchCart() {
      if (!isLogin()) {
        throw new Error('請先登入會員')
      }
      const token = localStorage.getItem('token')
      const res = await axios.get('/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      })
      this.items = Array.isArray(res.data) ? res.data : []
    },
    async add(product) {
      if (!isLogin()) {
        throw new Error('請先登入會員再將商品加入購物車！')
      }
      const token = localStorage.getItem('token')
      await axios.post(
        '/api/cart',
        { productId: product.id, quantity: product.qty || 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      await this.fetchCart()
    },
    async updateQty(id, qty) {
      if (!isLogin()) {
        throw new Error('請先登入會員')
      }
      const token = localStorage.getItem('token')
      await axios.put(
        `/api/cart/${id}`,
        { quantity: qty },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      await this.fetchCart()
    },
    async remove(id) {
      if (!isLogin()) {
        throw new Error('請先登入會員')
      }
      const token = localStorage.getItem('token')
      await axios.delete(`/api/cart/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      await this.fetchCart()
    },
    async clear() {
      if (!isLogin()) {
        throw new Error('請先登入會員')
      }
      const token = localStorage.getItem('token')
      await axios.delete('/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      })
      await this.fetchCart()
    },
  },
})
