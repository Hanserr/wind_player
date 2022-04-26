import {createRouter,createWebHistory} from "vue-router";

const routes = [
    {
        path: '/',
        name: 'homePage',
        component: () => import("../components/rightComponents/homePage"),
        meta:{
            keepAlive:true
        }
    },
    {
        path: '/searchResultPage',
        name: 'searchResultPage',
        component: () => import("../components/rightComponents/searchResultPage"),
        meta: {
            keepAlive: false
        },
    },
    {
        path: '/songListDetail',
        name: 'songListDetailPage',
        component: () => import("../components/rightComponents/songListDetailPage"),
        meta:{
            keepAlive:true
        }
    },
    {
        path:'/editSongListInfo',
        name:'editSongListInfo',
        component: () => import("../components/rightComponents/editSongListInfo"),
        meta: {
            keepAlive: false
        },
    },
    {
        path: '/editUserInfo',
        name: 'editUserInfo',
        component: () => import("../components/rightComponents/editUserInfo"),
        meta: {
            keepAlive: false
        },
    },
    {
        path: '/albumDetail',
        name: 'albumDetailPage',
        component: () => import("../components/rightComponents/albumDetailPage"),
        redirect:'/albumDetail/songlistPage/:id',
        children:[
            {
                path:'songlistPage/:id',
                name:'songlistPage',
                component: () => import("../components/rightComponents/albumDetailPageComponents/songlistPage")
            },
            {
                path:'commentPage/:id',
                name:'commentPage',
                component: () => import("../components/rightComponents/albumDetailPageComponents/commentPage")
            },
            {
                path:'infoPage/:id',
                name:'infoPage',
                component: () => import("../components/rightComponents/albumDetailPageComponents/infoPage")
            },
        ],
    },
    {
        path: '/dailyRecommendation',
        name: 'dailyRecommendationPage',
        component: () => import("../components/rightComponents/dailyRecommendationPage")
    }
]

export const router = createRouter({
    history:createWebHistory(),
    routes:routes
})

