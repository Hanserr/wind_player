import {createRouter,createWebHistory} from "vue-router";
const searchResultPage = () => import("../components/rightComponents/searchResultPage")
const homePage = () => import("../components/rightComponents/homePage")
const songListDetailPage = () => import("../components/rightComponents/songListDetailPage")
const editUserInfo = () => import("../components/rightComponents/editUserInfo")
const editSongListInfo = () => import("../components/rightComponents/editSongListInfo")
const albumDetailPage = () => import("../components/rightComponents/albumDetailPage")
const commentPage = () => import("../components/rightComponents/albumDetailPageComponents/commentPage")
const songlistPage = () => import("../components/rightComponents/albumDetailPageComponents/songlistPage")
const infoPage = () => import("../components/rightComponents/albumDetailPageComponents/infoPage")

const routes = [
    {
        path: '/',
        name: 'homePage',
        component: homePage,
        meta:{
            keepAlive:true
        }
    },
    {
        path: '/searchResultPage',
        name: 'searchResultPage',
        component: searchResultPage,
        meta: {
            keepAlive: false
        },
    },
    {
        path: '/songListDetail',
        name: 'songListDetailPage',
        component: songListDetailPage,
        meta:{
            keepAlive:true
        }
    },
    {
        path:'/editSongListInfo',
        name:'editSongListInfo',
        component: editSongListInfo,
        meta: {
            keepAlive: false
        },
    },
    {
        path: '/editUserInfo',
        name: 'editUserInfo',
        component: editUserInfo,
        meta: {
            keepAlive: false
        },
    },
    {
        path: '/albumDetail',
        name: 'albumDetailPage',
        component: albumDetailPage,
        redirect:'/albumDetail/songlistPage/:id',
        children:[
            {
                path:'songlistPage/:id',
                name:songlistPage,
                component: songlistPage
            },
            {
                path:'commentPage/:id',
                name:commentPage,
                component: commentPage
            },
            {
                path:'infoPage/:id',
                name:infoPage,
                component: infoPage
            },
        ],
    },
]

export const router = createRouter({
    history:createWebHistory(),
    routes:routes
})

