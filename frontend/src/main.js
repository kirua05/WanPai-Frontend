import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Carousel from 'primevue/carousel'
import 'primeicons/primeicons.css'
import Button from 'primevue/button'
import Aura from '@primeuix/themes/aura'

import 'primeicons/primeicons.css'




const app = createApp(App);
app.use(PrimeVue,{
  theme:{
    preset:Aura,
  },
});

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});
app.mount('#app')

app.component('Carousel', Carousel)
app.component('Button', Button)
