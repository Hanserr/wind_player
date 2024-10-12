<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";
import apiCollection from "@/tools/apiCollection";
import pushingTools from "@/tools/pushingTools";
import notification from "@/tools/notification";
let artist = ref()
let album = ref()

onMounted(() => {
  Promise.all([
    axios.get(apiCollection.SUBSCRIBED_ARTIST),
    axios.get(apiCollection.SUBSCRIBED_ALBUM)
  ]).then(([res1, res2]) => {
    if(res1.data.code === 200 && res2.data.code === 200) {
      artist.value = res1.data.data
      album.value = res2.data.data
    } else {
      notification.GET_SUBSCRIBED_FAILED()
    }
  }).catch(() => {
    notification.GET_SUBSCRIBED_FAILED()
  })
})
</script>

<template>
  <div class="subscribed-wrapper" v-if="artist">
    <el-scrollbar height="440px">
      <div class="subscribed-el-artist-wrapper">
        <p class="my-sub-artist-title">收藏的歌手</p>
        <div v-for="i in artist" :key="i" class="sub-artist-box" @click="pushingTools.toArPage(i.id)">
          <img :src="i.picUrl" alt=""/>
          <br>
          <span>{{i.name}}</span>
        </div>
      </div>
      <div class="subscribed-el-album-wrapper">
        <p class="my-sub-artist-title">收藏的专辑</p>
        <div v-for="i in album" :key="i" class="sub-album-box" @click="pushingTools.toAlbumDetail(i.id)">
          <div class="disc-wrapper">
            <img :src="i.picUrl" alt=""/>
            <div class="album-disc"></div>
          </div>
          <span class="sub-artist-ar">{{i.artists[0].name}}</span>
          <br>
          <span class="sub-album-title">{{i.name}}</span>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<style scoped>
@import "/src/assets/css/rightComponentsCss/subscribed.css";
</style>