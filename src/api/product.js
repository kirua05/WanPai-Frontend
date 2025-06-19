import axios from '@/utils/axiosInstance'

const fetchAllProducts = async (status = 'all') => {
  const res = await axios.get('/admin/products', {
    params: { status },
  })
  return res.data
}

const fetchProductById = async (id) => {
  const res = await axios.get(`/products/${id}`)
  return res.data
}

const createProduct = async ({
  name,
  price,
  coverImageFile,
  previewImageFiles,
}) => {
  const formData = new FormData()
  formData.append('name', name)
  formData.append('price', price)

  if (coverImageFile) {
    formData.append('cover', coverImageFile)
  }

  if (Array.isArray(previewImageFiles)) {
    previewImageFiles.forEach((file) => {
      formData.append('previews', file)
    })
  }

  const res = await axios.post('/admin/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return res.data
}

const updateProduct = async (
  id,
  { name, price, coverImageFile, previewImageFiles }
) => {
  const formData = new FormData()
  formData.append('name', name)
  formData.append('price', price)

  if (coverImageFile) {
    formData.append('cover', coverImageFile)
  }

  if (Array.isArray(previewImageFiles)) {
    previewImageFiles.forEach((file) => {
      formData.append('previews', file)
    })
  }

  const res = await axios.put(`/admin/products/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return res.data
}


const fetchFilterData = async () => {
  const res = await axios.get('/tags/filter')
  return res.data
}

export {
  fetchAllProducts,
  fetchProductById,
  createProduct,
  updateProduct,
  fetchFilterData,
}
