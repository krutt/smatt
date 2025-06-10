/* ~~/src/main.js */

import App from '@/App.vue'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import './assets/main.css'

/* routes */
let router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
    },
  ],
})

/* stores */
let pinia = createPinia()

createApp(App).use(pinia).use(router).mount('#app')
