<template>
<div class="navigationMain">
  <div class="navigation1">
    <div class="navigationMain-profile">
      <el-avatar class="navigationMain-profile-avatar" :size="50" :src="user.avatarUrl"></el-avatar>
    </div>
    <a @click = "popVisible = true" v-if="user.nickname === ''" id="navigation-login">登录</a>
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
import {reactive, ref, watch} from "vue";

let popVisible = ref(false)

const user = reactive({
  avatarUrl:'',
  nickname:''
})
//关闭弹窗
const closePop = (e) => {
  popVisible.value = e
}
//监听到子组件传来的值
watch(
    () => popVisible.value,(next) => {
      popVisible.value = next
        // user.avatarUrl = JSON.parse(sessionStorage.getItem("neProfile")).avatarUrl
        // user.nickname = JSON.parse(sessionStorage.getItem("neProfile")).nickname
    }
)

//传cookie获取用户登陆状态
const getUserStatus = () => {
      let i = Cookies.get("neCookie")
      axios.get("https://netease-cloud-music-api-beta-lime.vercel.app/login/status?cookie="+i).then(res=>{
        console.log(res)
      })
    }

</script>

<style scoped>
@import "../assets/css/navigation.css";
</style>