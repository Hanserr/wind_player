<template>
<div class="userInfoPageMain"
     v-loading="loading"
     element-loading-background="rgba(0, 0, 0, 0.8)"
     element-loading-text="获取数据中···">
  <el-scrollbar height="450" v-if="profile">
    <div class="userInfoPageMain-top">
      <div class="userInfoLeft">
        <img :src="profile.avatarUrl" alt="">
      </div>
      <div class="userInfoRight">
        <div class="userInfoRight-top">
          <span id="userInfoRight-top-nickname">{{profile.nickname}}</span>
          <div>
            <span>Lv{{level}}</span>
          </div>
          <div :style="{backgroundColor:profile.gender===1?'#3b5a79':profile.gender===2?'#a16b91':'#ef7d4b'}">
            <svg-icon name="male" v-if="profile.gender === 1" class="userGenderIcon"></svg-icon>
            <svg-icon name="female" v-if="profile.gender === 2" class="userGenderIcon"></svg-icon>
            <svg-icon name="secret" v-if="profile.gender === 3" class="userGenderIcon"></svg-icon>
          </div>
          <button @click="$router.push('/editUserInfo')" v-if="showButton">修改个人信息</button>
        </div>
        <div class="userInfoRight-bottom">
          <div class="userSubInfo" style="border-right: 1px solid #808080">
            <span>{{profile.eventCount}}</span>
            <br>
            <span class="userSubInfo-bottomTitle">动态</span>
          </div>
          <div class="userSubInfo" style="border-right: 1px solid #808080">
            <span>{{profile.follows}}</span>
            <br>
            <span class="userSubInfo-bottomTitle">关注</span>
          </div>
          <div class="userSubInfo">
            <span>{{profile.followeds}}</span>
            <br>
            <span class="userSubInfo-bottomTitle">粉丝</span>
          </div>
          <br>
          <br>
          <span>所在地区:{{formatRegion(profile.province,profile.city)}}</span>
          <br>
          <span>个人介绍:{{profile.signature}}</span>
        </div>
      </div>
    </div>
    <div class="userInfoPageMain-bottom">
      <span style="margin-left: 30px" class="userInfoPageMain-bottom-title" @click="pushingTools.toCreation(id)">创建的歌单</span>
      <span style="margin-left: 40px" class="userInfoPageMain-bottom-title" @click="pushingTools.toCollected(id)">收藏的歌单</span>
      <router-view></router-view>
    </div>
  </el-scrollbar>
</div>
</template>

<script setup>
import axios from "axios";
import {ElMessage} from "element-plus";
import {onMounted, ref, watch} from "vue";
import SvgIcon from "@/components/SvgIcon";
import {region} from "@/tools/region";
import {useRoute} from "vue-router";
import api from "@/tools/apiCollection";
import pushingTools from "@/tools/pushingTools";

const route = useRoute()
let profile = ref() //用户信息
let id = ref()
let level = ref() //用户等级
let loading = ref(false)
let showButton = ref(true)

//获取账号信息
const getId = async () => {
  loading.value = true
  await axios.get(api.GET_ACCOUNT_INFO).then(res => {
    if (res.data.code === 200){
      id.value = res.data.account.id
    }
  }).catch(() => {
    loading.value = false
    ElMessage({
      message:"获取用户信息失败",
      type:'error'
    })
  })
}

//获取用户详细信息
const getUserEvent = (id) => {
  loading.value = true
  axios.get(`${api.GET_USER_DETAIL}?uid=${id}`).then(res => {
    if (res.data.code === 200){
      level.value = res.data.level
      profile.value = res.data.profile
    }
  }).catch(() => {
    loading.value = false
    ElMessage({
      message:"获取用户信息失败",
      type:'error'
    })
  }).finally(() => {
    loading.value = false
  })
}

//地区转换
const formatRegion = (province = null,r) => {
  if (province){
    for (let i of region){
      if (province === i[0]){
        return `${i[1]} ${i[2][r]}`
      }
    }
  }
}

//获取用户信息
const getInfo = () => {
  if (id.value !== "0"){
    showButton.value = false
    getUserEvent(id.value)
  }else {
    showButton.value = true
    getId().then(() => {
      getUserEvent(id.value)
    })
  }
}

watch(() => route.params.uid,(n) => {
  id.value = n
  getInfo()
})

onMounted(() => {
  id.value= route.params.uid
  getInfo()
})
</script>

<style scoped>
@import "../../assets/css/rightComponentsCss/userInfoPage.css";
</style>
