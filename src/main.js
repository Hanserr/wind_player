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
axios.defaults.baseURL="https://netease-cloud-music-api-beta-lime.vercel.app"

//时间格式化
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
//歌曲时长格式化
app.config.globalProperties.$durationFormat = (val) => {
    let time = Math.floor(val/1000)
    let min = Math.floor(time/60)
    min = min < 10?'0'+min:min
    let sec = time%60
    sec = sec < 10?'0'+sec:sec
    return `${min}:${sec}`
}
//评论时间转换
app.config.globalProperties.$commentTimeFormat = (val) => {
    if (val === null){
        return ''
    }else {
        let date = new Date(val)
        let temp = new Date().getTime() - date.getTime()
        if (temp < 60*60*1000){
            return `${temp/1000}分钟前`
        }
        let y = date.getFullYear()
        let m = date.getMonth()+1 < 10?'0'+(date.getMonth()+1):date.getMonth()+1
        let d = date.getDate() < 10?'0'+date.getDate():date.getDate()
        let H = date.getHours() < 10?'0'+date.getHours():date.getHours()
        let mm = date.getMinutes() < 10?'0'+date.getMinutes():date.getMinutes()
        return `${y}年${m}月${d}日 ${H}:${mm}`
    }
}


app.component('SvgIcon',SvgIcon)
app.use(ElementPlus)
    .use(VueAxios,axios)
    .use(Cookies)
    .use(router)
    .mount('#app')