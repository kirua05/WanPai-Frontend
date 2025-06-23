import { defineStore } from 'pinia'
import axios from '@/utils/axiosInstance'

function isLogin() {
  return !!localStorage.getItem('token')
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
  }),
  getters: {
    totalQty: (state) =>
      state.items.reduce((sum, item) => sum + (item.quantity || 0), 0),
    totalPrice: (state) =>
      state.items.reduce(
        (sum, item) => sum + (item.quantity || 0) * (item.priceAtAdd || 0),
        0
      ),
  },
  actions: {
    async fetchCart() {
      if (!isLogin()) {
        throw new Error('請先登入會員')
      }
      const res = await axios.get('/cart')
      this.items = Array.isArray(res.data) ? res.data : []
    },
    async add(product) {
      if (!isLogin()) {
        throw new Error('請先登入會員再將商品加入購物車！')
      }
      await axios.post('/cart', {
        productId: product.id,
        quantity: product.qty || 1,
      })
      await this.fetchCart()
    },
    async updateQty(id, qty) {
      if (!isLogin()) {
        throw new Error('請先登入會員')
      }
      await axios.put(`/cart/${id}`, {
        quantity: qty 
      })
      await this.fetchCart()
    },
    async remove(id) {
      if (!isLogin()) {
        throw new Error('請先登入會員')
      }
      await axios.delete(`/cart/${id}`)
      await this.fetchCart()
    },
    async clear() {
      if (!isLogin()) {
        throw new Error('請先登入會員')
      }
      await axios.delete('/cart')
      await this.fetchCart()
    },
  },
})
