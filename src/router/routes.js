import {createRouter,createWebHistory} from "vue-router";
const searchResultPage = () => import("../components/rightComponents/searchResultPage")
const homePage = () => import("../components/rightComponents/homePage")
const songListDetailPage = () => import("../components/rightComponents/songListDetailPage")

const routes = [
    {
        path: '/',
        name: 'homePage',
        component: homePage
    },
    {
        path: '/searchResultPage/:inp',
        name: 'searchResultPage',
        component: searchResultPage
    },
    {
        path: '/songListDetail/:id',
        name: 'songListDetailPage',
        component: songListDetailPage
    }
]

export const router = createRouter({
    history:createWebHistory(),
    routes:routes
})

