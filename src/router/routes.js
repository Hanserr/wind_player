import {createRouter,createWebHistory} from "vue-router";
const searchResultPage = () => import("../components/rightModules/searchResultPage")
const routes = [
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

