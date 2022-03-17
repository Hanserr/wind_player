<template>
<div class="navigationMain">
  <div class="navigation1">
    <div class="navigationMain-profile">
      <el-avatar class="navigationMain-profile-avatar" :size="50" :src="user.avatarUrl"></el-avatar>
    </div>
    <a @click = "popVisible = true"  v-if="user.nickname === ''" id="navigation-login">登录</a>
    <p v-if="user !== ''" id="navigation-nickname">{{user.nickname}}</p>
<!--    登录模块-->
    <login-module :visible="popVisible" @changeVisible="closePop"></login-module>
    <el-divider></el-divider>
  </div>
</div>
</template>

<script setup>
import axios from "axios";
import Cookies from "js-cookie";
import LoginModule from "./navigationComponents/loginModule";
import {onMounted, reactive, ref, watch} from "vue";

let popVisible = ref(false)
let user = reactive({
  nickname: '',
  avatarUrl: '',
  birthday: '',
  city: '',
  followed: '',
  follows: '',
  gender: '',
  province: '',
  signature: '',
  userId: '',
  vipType: ''
})
const baseUrl = "https://netease-cloud-music-api-beta-lime.vercel.app"
//关闭弹窗
const closePop = (e) => {
  popVisible.value = e
}
//监听到子组件传来的值
watch(
    () => popVisible.value,(next) => {
      popVisible.value = next
    }
)
//从sessionstorage中获取用户信息
const getUserProfile = () => {
  if (sessionStorage.getItem("neProfile")){
    let u = JSON.parse(sessionStorage.getItem("neProfile"))
    user.nickname = u.nickname
    user.avatarUrl = u.avatarUrl
    user.birthday = u.birthday
    user.city = u.city
    user.followed = u.followed
    user.follows = u.follows
    user.gender = u.gender
    user.province = u.province
    user.signature = u.signature
    user.userId = u.userId
    user.vipType = u.vipType
  } else {
    if(Cookies.get('neCookie')){
      axios.post(baseUrl+"/login/status").then(res => {
        if(res.data.data.code === 200){
          sessionStorage.setItem('neProfile',JSON.stringify(res.data.data.profile))
          getUserProfile()
        }
      })
    }
  }
}
onMounted(() => {
  getUserProfile()
})
</script>

<style scoped>
@import "../assets/css/navigation.css";
</style>