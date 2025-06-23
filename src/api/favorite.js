import axios from '@/utils/axiosInstance'

export async function fetchFavorites(token) {
  const { data } = await axios.get('/favorites', {
    headers: { Authorization: `Bearer ${token}` },
  })
  return data
}

export async function addToCart(item, token) {
  return axios.post(
    '/cart',
    { productId: item.id, quantity: item.quantity },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )
}

export async function removeFavorite(productId, token) {
  return axios.delete(`/favorites/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}
