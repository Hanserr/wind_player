import {createRouter,createWebHistory} from "vue-router";
const searchResultPage = () => import("../components/rightModules/searchResultPage")
const homePage = () => import("../components/rightModules/homePage")

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
    }
]

export const router = createRouter({
    history:createWebHistory(),
    routes:routes
})

