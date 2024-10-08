import { createApp } from 'vue'
import App from './App.vue'
import axios from "axios";
import VueAxios from 'vue-axios'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import {router} from './router/routes.js'
import SvgIcon from "@/components/SvgIcon";
import {createPinia} from "pinia";

const app = createApp(App)

//默认携带cookie
axios.defaults.withCredentials=true
axios.defaults.baseURL="http://localhost:3000"

app.component('SvgIcon',SvgIcon)

app.use(ElementPlus)
    .use(VueAxios,axios)
    .use(router)
    .use(createPinia())
    .mount('#app')
