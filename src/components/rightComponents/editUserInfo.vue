<template>
<div class="editUserInfo"
     v-if="user"
     v-loading="loading"
     element-loading-background="rgba(0, 0, 0, 0.8)">

  <div class="editionPageLeft">
    <img :src="user.avatarUrl?user.avatarUrl:''" alt="" id="userAvatar">
    <button id="alterAvatar">修改头像</button>
  </div>

  <div class="editionPageRight">
    <p>编辑个人信息</p>
    <span id="nickName">昵称:</span>
    <input type="text" id="nickNameInput" v-model="user.nickname">
    <br>
    <span id="introduction">介绍:</span>
    <textarea id="introductionInput" rows="5" cols="56" v-model="user.intro"></textarea>
    <br>
    <span id="gender">性别:</span>
    <input type="radio" name="gender" value="0" class="genderOption" style="margin-left: 30px;margin-top: 20px" v-model="user.gender">保密
    <input type="radio" name="gender" value="1" v-model="user.gender">男
    <input type="radio" name="gender" value="2" v-model="user.gender">女
    <br>
    <span id="birthday">生日:</span>
    <el-date-picker v-model="user.birthday" type="date" style="margin-top: 20px;margin-left: 5px"/>
    <br>
    <span id="region">地区:</span>
    <select v-model="tempProvince" class="regionSelect" style="margin-left: 5px">
      <option v-for="r in region" :key="r">{{r[1]}}</option>
    </select>
    <select v-model="tempUserRegion" class="regionSelect" style="margin-left: 20px">
      <option v-for="r in tempRegion" :key="r">{{r}}</option>
    </select>
    <br>
    <button id="confirmAltering" @click="alterUserProfile">确认修改</button>
  </div>

</div>
</template>

<script setup>
import Cookies from "js-cookie";
import {region} from "@/region";
import {onMounted, reactive, ref, watch} from "vue";
import axios from "axios";
import {ElMessage} from "element-plus";

const baseUrl = "https://netease-cloud-music-api-beta-lime.vercel.app" //地址前缀
let user = reactive({
  avatarUrl:null,
  nickname:null,
  intro:null,
  gender:null,
  birthday:null,
  province:null,
  region:null
}) //用户信息
let tempProvince = ref() //临时存放省市数据
let tempRegion = ref() //市级城市临时数据
let tempUserRegion = ref() //临时存放用户地区数据
let loading = ref(false) //加载遮罩

//获取用户信息
const getUserInfo = () => {
  if (Cookies.get("UID")){
    axios.get(`${baseUrl}/user/detail?uid=${Cookies.get("UID")}`).then(res => {
      if (res.data.code === 200){
        user.nickname = res.data.profile.nickname
        user.avatarUrl = res.data.profile.avatarUrl
        user.birthday = res.data.profile.birthday
        user.gender = res.data.profile.gender
        user.intro = res.data.profile.signature
        user.region = res.data.profile.city
        user.province = res.data.profile.province
      }
    })
  }
}

//动态改变当前市级地区数据
watch(() => tempProvince.value, next => {
  for (let i in region){
    if (region[i][1] === next){
      tempProvince.value = region[i][1]
      tempRegion.value = region[i][2]
      break
    }
  }
})

//修改地区
const alterUserProfile = () => {
  loading.value = true
  if (user.nickname === null){
    ElMessage({
      message:"昵称不能为空",
      type:"warning"
    })
    return
  }
  for (let i in region){
    if (region[i][1] === tempProvince.value){
      user.province = region[i][0]
      for (let a in region[i][2]){
        if (tempUserRegion.value === region[i][2][a]){
          user.region = parseInt(a)
          break
        }
      }
      break
    }
  }
  axios.get(`${baseUrl}/user/update?gender=${user.gender}&signature=${user.intro}&city=${user.region}&nickname=${user.nickname}&birthday=${user.birthday}&province=${user.province}`).then(res => {
   if (res.data.code === 200){
     ElMessage({
       message:"修改成功!",
       type:"success"
     })
   }else{
     ElMessage({
       message:"修改失败!",
       type:"error"
     })
   }
  }).finally(() => {
    loading.value = false
  })
}

onMounted(() => {
  getUserInfo()
})
</script>

<style scoped>
@import "../../assets/css/rightComponentsCss/editUserInfo.css";
</style>