import {createRouter,createWebHistory} from "vue-router";
const searchResultPage = () => import("../components/rightComponents/searchResultPage")
const homePage = () => import("../components/rightComponents/homePage")
const songListDetailPage = () => import("../components/rightComponents/songListDetailPage")
const editUserInfo = () => import("../components/rightComponents/editUserInfo")
const editSongListInfo = () => import("../components/rightComponents/editSongListInfo")

const routes = [
    {
        path: '/',
        name: 'homePage',
        component: homePage,
        meta:{
            keepAlive: true
        }
    },
    {
        path: '/searchResultPage/:inp',
        name: 'searchResultPage',
        component: searchResultPage
    },
    {
        path: '/songListDetail/:id',
        name: 'songListDetailPage',
        component: songListDetailPage,
    },
    {
        path:'/editSongListInfo',
        name:'editSongListInfo',
        component: editSongListInfo,

    },
    {
        path: '/editUserInfo',
        name: 'editUserInfo',
        component: editUserInfo
    },

]

export const router = createRouter({
    history:createWebHistory(),
    routes:routes
})

