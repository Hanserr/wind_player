<template>
<div class="navigationMain">
  <div class="navigation1">
    <div class="navigationMain-profile">
      <el-avatar class="navigationMain-profile-avatar" :size="50" :src="user.avatarUrl"></el-avatar>
    </div>
    <a @click = "login()" v-if="user === ''" id="navigation-login">登录</a>
    <p v-if="user !== ''" id="navigation-nickname">{{user.nickname}}</p>
    <el-divider></el-divider>
<!--    登录弹窗-->
    <login-page-pop-window :show="showFlag" @func="getUser"></login-page-pop-window>
  </div>
  <button @click="get">test</button>
</div>
</template>

<script>
import loginPagePopWindow from "./navigationComponents/loginPagePopWindow";
import axios from "axios";
export default {
  name: "navigationPage",
  components:{
    loginPagePopWindow
  },
  data(){
    return{
      showFlag:false,
      user:'',
    }
  },
  methods:{
    login(){
      this.showFlag = true
    },
    getUser(data){
      this.user = data
    },
    get(){
      let i = this.$cookies.get("neCookie")
      axios.get("https://netease-cloud-music-api-beta-lime.vercel.app/login/status?cookie="+i).then(res=>{
        console.log(res.data)
      })
    }
  },
}
</script>

<style scoped>
@import "../assets/css/navigation.css";
</style>