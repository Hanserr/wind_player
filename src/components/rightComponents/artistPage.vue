<template>
<div class="ARPageMain"
     v-loading="loading"
     element-loading-background="rgba(0, 0, 0, 0.8)"
     element-loading-text="加载中···">
  <el-scrollbar v-if="mark" max-height="450px">
    <div class="ARPageMain-Top">
      <div class="ARPageMain-Top-imgWrap">
        <img :src="artist.picUrl" alt="">
      </div>
      <span id="ARPageMainArName">{{artist.name}}</span>
      <button>收藏</button>
      <span>单曲数:{{artist.musicSize}}</span>
      <br>
      <span>专辑数:{{artist.albumSize}}</span>
    </div>
    <div class="ARPageMain-bottom">
      <span class="ARPageMain-bottom-title" @click="pushingTools.toArPage(route.params.arID)">专辑</span>
      <span class="ARPageMain-bottom-title" @click="pushingTools.toArDescPage(artist.briefDesc,route.params.arID)">歌手详情</span>
      <span class="ARPageMain-bottom-title" @click="pushingTools.toSimilarArPage(route.params.arID)">相似歌手</span>
      <router-view @playMusic="playMusic"></router-view>
    </div>
  </el-scrollbar>
</div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";
import {useRoute} from "vue-router";
import {router} from "@/router/routes";
import api from "@/tools/apiCollection";
import {useSongStore} from "@/store/songStore";
import pushingTools from "@/tools/pushingTools";
import notification from "@/tools/notification";

const songStore = useSongStore();
const route = useRoute()
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
  mark.value = false
  axios.get(`${api.GET_ARTIST_DETAIL}?id=${id}`).then(res => {
    if (res.data.code === 200){
      artist.value = res.data.artist
      mark.value = true
    }else {
      notification.GET_ARTIST_FAILED()
    }
  }).catch((err) => {
    notification.GET_ARTIST_FAILED()
  }).finally(() => {
    loading.value = false
  })
}

//播放歌曲
const playMusic = (id) => {
  songStore.updateCurSong(id)
}

onMounted(() => {
  getArInfo(route.params.arID)
})
</script>

<style scoped>
@import "../../assets/css/rightComponentsCss/artistPage.css";
</style>
