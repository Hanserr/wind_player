<template>
<div class="ARPageMain"
     v-loading="loading"
     element-loading-background="rgba(0, 0, 0, 0.8)"
     element-loading-text="加载中···">
  <el-scrollbar v-if="mark">
  <div class="ARPageMain-Top">
    <img :src="user.avatarUrl" alt="">
    <span id="ARPageMainArName">{{user.nickname}}</span>
    <button>收藏</button>
    <button>个人主页</button>
    <span>单曲数:{{artist.musicSize}}</span>
    <br>
    <span>专辑数:{{artist.albumSize}}</span>
  </div>
  <div class="ARPageMain-bottom">
    <span class="ARPageMain-bottom-title">专辑</span>
    <span class="ARPageMain-bottom-title">歌手详情</span>
    <span class="ARPageMain-bottom-title">相似歌手</span>
    <router-view></router-view>
  </div>
  </el-scrollbar>
</div>
</template>

<script setup>

import {onMounted, ref} from "vue";
import axios from "axios";
import {useRoute} from "vue-router";
import {router} from "@/router/routes";
import {ElMessage} from "element-plus";

const route = useRoute()
let user = ref() //用户信息
let artist = ref() //歌手信息
let loading = ref(false)
let mark = ref(false) //当前页面数据是否加载完成
//获取歌手信息
const getArInfo = (id) => {
  if (!id){
    router.push('/')
    return
  }
  loading.value = true
  axios.get(`/artist/detail?id=${id}`).then(res => {
    if (res.data.code === 200){
      user.value = res.data.data.user
      artist.value = res.data.data.artist
      mark.value = true
    }else {
      ElMessage({
        message:"获取歌手信息失败",
        type:"error"
      })
    }
    console.log(res.data)
  }).catch(() => {
    ElMessage({
      message:"获取歌手信息失败",
      type:"error"
    })
  }).finally(() => {
    loading.value = false
  })
}
onMounted(() => {
  getArInfo(route.params.arID)
})
</script>

<style scoped>
@import "../../assets/css/rightComponentsCss/artistPage.css";
</style>
