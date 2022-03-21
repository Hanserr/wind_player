import { createApp } from 'vue'
import App from './App.vue'
import axios from "axios";
import VueAxios from 'vue-axios'
import Cookies from 'js-cookie'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import {router} from './router/routes.js'
import './assets/css/HarmonyFont.css'
import SvgIcon from "@/components/SvgIcon";
import store from '/src/store'
const app = createApp(App)

//默认携带cookie
axios.defaults.withCredentials=true

app.component('SvgIcon',SvgIcon)
app.use(ElementPlus)
    .use(VueAxios,axios)
    .use(Cookies)
    .use(router)
    .use(store)
    .mount('#app')