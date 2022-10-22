<template>
<div class="creationSongListPageMain">
  <div class="playListDetail" v-for="i in createdSongList" :key="i">
    <img :src="i.coverImgUrl" alt="" @click="toSongListPage(i.id)">
    <div class="playListDetailTitle">
      <span style="font-size: 13px;color: #d5d5d5;">{{i.name}}</span>
      <br>
      <span style="font-size: 10px;color: #868686">{{i.trackCount}}首</span>
    </div>
  </div>
</div>
</template>

<script setup>
import {onMounted, ref, watch} from "vue";
import axios from "axios";
import Cookies from "js-cookie";
import {ElMessage} from "element-plus";
import {router} from "@/router/routes";
import {useRoute} from "vue-router";

const route = useRoute()
let createdSongList = ref()
let id = 0

//获取用户歌单列表
const getPlayList = () => {
  if (route.params.uid !== "0")
    id = route.params.uid
  else{
    axios.get(`/login/status`).then(res => {
      id = res.data.data.account.id
    })
  }
    axios.get(`/user/playlist?uid=${id}`).then(res => {
      if (res.data.code === 200){
        classifySongList(res.data.playlist)
      }else{
        ElMessage({
          message:"获取歌单信息失败",
          type:"error"
        })
      }
    })
}

//歌单分类
const classifySongList = (list) => {
  let temp = []
  createdSongList.value = {}
  for(let i of list){
    if (i.creator.userId.toString() === id){
      temp.push(i)
    }
    createdSongList.value = temp
  }
}

//跳转到歌单详情页
const toSongListPage = (id) => {
  router.push({
    name:'songListDetailPage',
    params:{
      songListId:id
    }
  })
}

onMounted(() => {
  getPlayList()
})
</script>

<style scoped>
@import "../../../assets/css/rightComponentsCss/userInfoPageComponentsCss/creationSongListPage.css";
</style>
