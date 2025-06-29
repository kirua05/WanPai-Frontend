import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/auth'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'

import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'
import 'primeicons/primeicons.css'
import ToastService from 'primevue/toastservice'
import Toast from 'primevue/toast'
import './index.css'

const app = createApp(App)
const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{Yellow.50}',
      100: '{Yellow.100}',
      200: '{Yellow.200}',
      300: '{Yellow.300}',
      400: '{Yellow.400}',
      500: '{Yellow.500}',
      600: '{Yellow.600}',
      700: '{Yellow.700}',
      800: '{Yellow.800}',
      900: '{Yellow.900}',
      950: '{Yellow.950}',
    },
    surface: {
      0: '#000000',
      50: '#111111',
      100: '#1a1a1a',
      200: '#222222',
      300: '#2a2a2a',
      400: '#333333',
      500: '#3b3b3b',
      600: '#444444',
      700: '#4a4a4a',
      800: '#555555',
      900: '#666666',
      950: '#777777',
    },
  },
})

app.use(createPinia())
app.use(router)

app.use(PrimeVue, {
  theme: {
    preset: MyPreset,
    options: {
      darkModeSelector: '.my-app-dark',
    },
  },
})
app.use(ToastService)
app.component('Toast', Toast)

const authStore = useAuthStore()
authStore.initAuth()

router.afterEach(() => {
  document.body.style.overflow = 'auto'
  document.documentElement.style.overflow = 'auto'

  document.body.classList.remove('p-overflow-hidden')
  document.documentElement.classList.remove('p-overflow-hidden')

  const previewWrapper = document.querySelector('.p-image-preview-wrapper')
  if (previewWrapper) {
    previewWrapper.remove()
  }
})
app.mount('#app')

const toastStyle = document.createElement('style')
toastStyle.textContent = `
.p-toast {
  max-width: 90vw !important;
  word-break: break-word;
  box-sizing: border-box;
}
.p-toast-message {
  font-size: 0.95rem;
  padding: 0.75rem;
}
.p-toast-top-right,
.p-toast-bottom-right {
  right: 1rem !important;
}
`
document.head.appendChild(toastStyle)
