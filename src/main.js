import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VCalendar from 'v-calendar'
import 'v-calendar/style.css'
import './assets/tailwind.css'
import './assets/global.css'

createApp(App)
    .use(router)
    .use(VCalendar,{})
    .mount('#app')
