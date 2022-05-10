import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Vant from 'vant'
import 'amfe-flexible'
import '@/styles/base.css'
import 'vant/lib/index.css'
const app = createApp(App)
app.use(router)
app.use(Vant)
app.mount('#app')
