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
import {onMounted, ref, watch} from "vue";
import axios from "axios";
import {ElMessage} from "element-plus";
import {router} from "@/router/routes";
import {useRoute} from "vue-router";
import {useUserStore} from "@/store/userStore";
import api from "@/tools/apiCollection";

const route = useRoute()
const userStore = useUserStore();
let createdSongList = ref()
let id = 0

//获取用户歌单列表
const getPlayList = () => {
  id = route.params.uid === "0"?userStore.getUserInfo().value.userId:route.params.uid
  axios.get(`${api.GET_USER_PLAYLIST}?uid=${id}`).then(res => {
    if (res.data.code === 200) {
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
    if (i.creator.userId.toString() != id){
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

watch(() => route.params.uid,(n) => {
  if(n !== undefined) {
    getPlayList()
  }
})

onMounted(() => {
  getPlayList()
})
</script>

<style scoped>
@import "../../../assets/css/rightComponentsCss/userInfoPageComponentsCss/collectedSongListPage.css";
</style>
