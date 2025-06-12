import { defineStore } from 'pinia'
import axios from 'axios'

function isLogin() {
  return !!sessionStorage.getItem('token')
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(sessionStorage.getItem('cart') || '[]'),
  }),
  getters: {
    totalQty: (state) => state.items.reduce((sum, item) => sum + item.qty, 0),
    totalPrice: (state) =>
      state.items.reduce((sum, item) => sum + item.qty * item.price, 0),
  },
  actions: {
    async fetchCart() {
      if (isLogin()) {
        const token = sessionStorage.getItem('token')
        const res = await axios.get('/api/cart', {
          headers: { Authorization: `Bearer ${token}` },
        })
        this.items = res.data
      } else {
        this.items = JSON.parse(sessionStorage.getItem('cart') || '[]')
      }
    },
    async add(product) {
      if (isLogin()) {
        const token = sessionStorage.getItem('token')
        await axios.post(
          '/api/cart',
          { productId: product.id, quantity: product.qty || 1 },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        await this.fetchCart()
      } else {
        const existingItem = this.items.find((item) => item.id === product.id)
        if (existingItem) existingItem.qty++
        else this.items.push({ ...product, qty: 1 })
        this.saveToSessionStorage()
      }
    },
    async updateQty(id, qty) {
      if (isLogin()) {
        const token = sessionStorage.getItem('token')
        await axios.put(
          `/api/cart/${id}`,
          { quantity: qty },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        await this.fetchCart()
      } else {
        const item = this.items.find((item) => item.id === id)
        if (item) item.qty = qty < 1 ? 1 : qty
        this.saveToSessionStorage()
      }
    },
    async remove(id) {
      if (isLogin()) {
        const token = sessionStorage.getItem('token')
        await axios.delete(`/api/cart/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        await this.fetchCart()
      } else {
        this.items = this.items.filter((item) => item.id !== id)
        this.saveToSessionStorage()
      }
    },
    async clear() {
      if (isLogin()) {
        const token = sessionStorage.getItem('token')
        await axios.delete('/api/cart', {
          headers: { Authorization: `Bearer ${token}` },
        })
        await this.fetchCart()
      } else {
        this.items = []
        this.saveToSessionStorage()
      }
    },
    saveToSessionStorage() {
      sessionStorage.setItem('cart', JSON.stringify(this.items))
    },
  },
})
