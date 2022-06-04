<template>
  <div class="collectedSongListPageMain">
    <div class="collectedPlayListDetail" v-for="i in createdSongList" :key="i">
      <img :src="i.coverImgUrl" alt="" @click="toSongListPage(i.id)">
      <div class="collectedPlayListDetailDesc">
        <span style="font-size: 13px;color: #d5d5d5;">{{i.name}}</span>
        <br>
        <span style="font-size: 10px;color: #868686">{{i.trackCount}}首</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";
import Cookies from "js-cookie";
import {ElMessage} from "element-plus";
import {router} from "@/router/routes";

let createdSongList = ref()

//获取用户歌单列表
const getPlayList = () => {
  let id = Cookies.get('UID')
  if (id && Cookies.get('MUSIC_U')){
    axios.get(`/user/playlist?uid=${JSON.parse(id)}`).then(res => {
      if (res.data.code === 200){
        classifySongList(res.data.playlist)
        console.log(res.data)
      }else{
        ElMessage({
          message:"获取歌单信息失败",
          type:"error"
        })
      }
    })
  }
}

//歌单分类
const classifySongList = (list) => {
  let temp = []
  createdSongList.value = {}
  for(let i of list){
    if (i.subscribed){
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
@import "../../../assets/css/rightComponentsCss/userInfoPageComponentsCss/collectedSongListPage.css";
</style>
