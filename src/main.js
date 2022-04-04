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
const app = createApp(App)

//默认携带cookie
axios.defaults.withCredentials=true

app.config.globalProperties.$dateFormat = (val) => {
    if (val === null){
        return ''
    }else {
        let date = new Date(val)
        let y = date.getFullYear()
        let m = date.getMonth()+1
        m = m < 10?'0'+m:m
        let d = date.getDate()
        d = d < 10?'0'+d:d
        return `${y}-${m}-${d}`
    }
}

app.component('SvgIcon',SvgIcon)
app.use(ElementPlus)
    .use(VueAxios,axios)
    .use(Cookies)
    .use(router)
    .mount('#app')