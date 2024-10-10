import {createRouter,createWebHistory} from 'vue-router';

const routes = [
        {
            path: '',
            name: 'homePage',
            component: () => import('../components/rightComponents/homePage'),
            meta:{
                keepAlive:true
            }
        },
        {
            path: '/searchResultPage',
            name: 'searchResultPage',
            component: () => import('../components/rightComponents/searchResultPage'),
            meta: {
                keepAlive: false
            },
        },
        {
            path: '/songListDetail',
            name: 'songListDetailPage',
            component: () => import('../components/rightComponents/songListDetailPage'),
            meta:{
                keepAlive:false
            }
        },
        {
            path:'/editSongListInfo',
            name:'editSongListInfo',
            component: () => import('../components/rightComponents/editSongListInfo'),
            meta: {
                keepAlive: false
            },
        },
        {
            path: '/editUserInfo',
            name: 'editUserInfo',
            component: () => import('../components/rightComponents/editUserInfo'),
            meta: {
                keepAlive: false
            },
        },
        {
            path: '/userInfoPage',
            name: 'userInfo',
            component: () => import('../components/rightComponents/userInfoPage'),
            children: [
                {
                    path: 'creation',
                    name: 'creation',
                    component: () => import('../components/rightComponents/userInfoComponents/creationSongListPage'),
                    meta: {
                        keepAlive: true
                    },
                },
                {
                    path: 'collected',
                    name: 'collected',
                    component: () => import('../components/rightComponents/userInfoComponents/collectedSongListPage'),
                    meta: {
                        keepAlive: true
                    },
                }
            ],
            meta: {
                keepAlive: false
            },
        },
        {
            path: '/albumDetail',
            name: 'albumDetailPage',
            component: () => import('../components/rightComponents/albumDetailPage'),
            redirect:'/albumDetail/songlistPage/:id',
            children:[
                {
                    path:'songlistPage/:id',
                    name:'songlistPage',
                    component: () => import('../components/rightComponents/albumDetailPageComponents/songlistPage'),
                    meta: {
                        keepAlive: false
                    },
                },
                {
                    path:'commentPage/:id',
                    name:'commentPage',
                    component: () => import('../components/rightComponents/albumDetailPageComponents/commentPage'),
                    meta: {
                        keepAlive: false
                    },
                },
                {
                    path:'infoPage/:id',
                    name:'infoPage',
                    component: () => import('../components/rightComponents/albumDetailPageComponents/infoPage'),
                    meta: {
                        keepAlive: false
                    },
                },
            ],
            meta: {
                keepAlive: false
            },
        },
        {
            path: '/artistPage',
            name: 'artist',
            component: () => import('../components/rightComponents/artistPage'),
            children: [
                {
                    path: 'artistAlbumInfo',
                    name:'artistAlbumInfo',
                    component:() => import('../components/rightComponents/artistComponents/artistAlbumInfo'),
                    meta: {
                        keepAlive: false
                    },
                },
                {
                    path: 'artistDesc',
                    name:'artistDesc',
                    component:() => import('../components/rightComponents/artistComponents/artistDesc'),
                    meta: {
                        keepAlive: false
                    },
                },
                {
                    path: 'similarArtist',
                    name:'similarArtist',
                    component:() => import('../components/rightComponents/artistComponents/similarArtist'),
                    meta: {
                        keepAlive: false
                    },
                }
            ],
            meta: {
                keepAlive: true
            },
        },
        {
                path: '/dailyRecommendation',
                name: 'dailyRecommendationPage',
                component: () => import('../components/rightComponents/dailyRecommendationPage'),
                meta: {
                    keepAlive: false
                },
            },
        {
            path: '/personalFm',
            name: 'personalFmPage',
            component: () => import('../components/rightComponents/personalFm'),
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/event',
            name: 'eventPage',
            component: () => import('../components/rightComponents/eventPage'),
            meta: {
                keepAlive: false
            }
        },
        {
            path: '/subscribed',
            name: 'subscribedPage',
            component: () => import('../components/rightComponents/subscribed'),
            meta: {
                keepAlive: false
            }
        },
        {
            path: '/artist',
            name: 'artistPage',
            component: () => import('../components/rightComponents/artistPage'),
            meta: {
                keepAlive: false
            },
        },
        {
            path: '/settings',
            name: 'settingsPage',
            component: () => import('../components/rightComponents/settings'),
            meta: {
            keepAlive: false
        }
    },
    {
      path: '/register',
      name: 'registerPage',
      component: () => import('../views/register'),
      meta: {
          keepAlive: false
      }
    },
    {
        path: '/404',
        name: '404',
        component: () => import('../views/NotFound'),
        meta: {
            keepAlive: false
        },
    },
    {
        path: '/:pathMath(.*)',
        redirect: '/404'
    }
]

export const router = createRouter({
    history:createWebHistory(),
    routes:routes
})

