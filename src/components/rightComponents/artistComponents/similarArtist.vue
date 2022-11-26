<template>
<div id="similarArtist"
     v-loading="similarArtistLoading"
     element-loading-background="rgba(0, 0, 0, 0.8)"
     element-loading-text="加载中···">
  <div class="similarArtistDetail" v-for="ar in similarSingers" :key="ar">
    <img :src="ar.img1v1Url" alt="" @click="this.$pushingTools.toArPage(ar.id)">
    <span>{{ar.name}}</span>
  </div>
</div>
</template>

<script setup>
import axios from "axios";
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import api from "@/tools/apiCollection";

const route = useRoute()
let similarSingers = ref()
let similarArtistLoading = ref(false)

//获取相似歌手
const getSimilarSinger = (id) => {
  similarArtistLoading.value = true
  axios.get(`${api.GET_SIMILAR_ARTIST}?id=${id}`).then(res => {
    if (res.data.code === 200){
      similarSingers.value = res.data.artists
    }
  }).finally(() => {
    similarArtistLoading.value = false
  })
}

onMounted(() => {
  getSimilarSinger(route.params.arID)
})
</script>

<style scoped>
@import "../../../assets/css/rightComponentsCss/artistComponents/similarArtist.css";
</style>
