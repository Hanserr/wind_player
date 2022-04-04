<template>
  <div class="songListDetailPage">
    <div class="songListDetailPage-top" v-show="listDetail !== undefined">

      <div class="songListDetailPage-top-img">
        <img :src="listDetail === undefined?'':listDetail.playlist.coverImgUrl">
      </div>

      <div class="songListDetailPage-top-right">
        <p id="songList">歌单</p>
        <p id="listName">{{listDetail === undefined?'':listDetail.playlist.name}}</p>
        <img id="avatar" :src="listDetail === undefined?'':listDetail.playlist.creator.avatarUrl">
        <div id="creatorWrap">
          <p id="creatorName">{{listDetail === undefined?'':listDetail.playlist.creator.nickname}}</p>
          <p id="creationTime">{{this.$dateFormat(listDetail === undefined?'':listDetail.playlist.createTime)}}创建</p>
        </div>
        <button id="play">播放全部</button>
        <button id="collect">收藏</button>
        <p id="playCount">歌曲:{{listDetail === undefined?'':listDetail.playlist.tracks.length}}</p>
        <p id="songCount">播放:{{listDetail === undefined?'':listDetail.playlist.playCount}}</p>
        <p id="description">简介:{{listDetail === undefined?'':listDetail.playlist.description}}</p>
      </div>

    </div>
  </div>
</template>

<script setup>

import {onMounted, ref, watch} from "vue";
import {useRoute} from "vue-router"
import axios from "axios"

const baseUrl = "https://netease-cloud-music-api-beta-lime.vercel.app"
const route = useRoute()
let listDetail = ref()

//获取歌单详情
const getSongListDetail = (id) => {
  axios.get(`${baseUrl}/playlist/detail?id=${id}`).then(res => {
    console.log(res.data)
    if (res.data.code === 200){
      listDetail.value = res.data
    }
  })
}

watch(() => route.params.id,(next) => {
  getSongListDetail(next)
})

onMounted(() => {
  getSongListDetail(route.params.id)
})
</script>

<style scoped>
@import "../../assets/css/rightComponentsCss/songListDetailPage.css";
</style>