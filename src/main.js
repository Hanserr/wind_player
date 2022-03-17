import { createApp } from 'vue'
import App from './App.vue'
import axios from "axios";
import VueAxios from 'vue-axios'
// import Vuex from 'vuex'
import Cookies from 'js-cookie'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import {router} from './router/routes.js'
import './assets/css/HarmonyFont.css'
const app = createApp(App)

//默认携带cookie
axios.defaults.withCredentials=true

app.use(ElementPlus)
    // .use(Vuex)
    .use(VueAxios,axios)
    .use(Cookies)
    .use(router)
    .mount('#app')