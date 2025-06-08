import axios from 'axios'

export async function createEcpayOrder(payload, toast) {
  try {
    const response = await axios.post(
      'http://localhost:3000/api/create-order',
      payload
    )

    if (response.data && response.data.includes('<form id="_form_aiochk"')) {
      const div = document.createElement('div')
      div.innerHTML = response.data
      document.body.appendChild(div)

      const form = document.getElementById('_form_aiochk')
      if (form) {
        form.submit()
        return { success: true }
      } else {
        if (toast) {
          toast.add({
            severity: 'error',
            summary: '警告',
            detail: '結帳失敗：無法找到綠界表單。',
            life: 3000,
          })
        }
        return { success: false, message: '結帳失敗：無法找到綠界表單。' }
      }
    } else {
      if (toast) {
        toast.add({
          severity: 'error',
          summary: '警告',
          detail: '結帳失敗：後端回應格式不正確。',
          life: 3000,
        })
      }
      return { success: false, message: '結帳失敗：後端回應格式不正確。' }
    }
  } catch {
    if (toast) {
      toast.add({
        severity: 'error',
        summary: '警告',
        detail: '結帳失敗，請稍後再試。',
        life: 3000,
      })
    }
    return { success: false, message: '結帳失敗，請稍後再試。' }
  }
}
