import api from '@/utils/axiosInstance'

export const fetchProductImages = (productId) =>
  api.get(`/admin/products/${productId}/images`)

export const uploadProductImage = (productId, formData) =>
  api.post(`/admin/products/${productId}/images`, formData)

export const deleteProductImage = (productId, imageId) =>
  api.delete(`/admin/products/${productId}/images/${imageId}`)
