import {createRouter,createWebHistory} from "vue-router";
const main = () => import("../components/main")
const routes = [
    {
      path: '/',
      name: 'main',
      component: main
    }
]

export const router = createRouter({
    history:createWebHistory(),
    routes:routes
})

