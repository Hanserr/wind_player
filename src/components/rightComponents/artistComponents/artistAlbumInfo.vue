<template>
<div class="artistAlbumInfoMain">
  <div id="top50Songs">
    <div id="top50SongsBanner">
      <p>热门50首单曲</p>
    </div>
    <ul>
      <li v-for="(i,index) in topList" :key="i">
        <span>{{index+1 < 10?"0"+(index+1):index+1}}</span>
        <span>{{i.name}}</span>
        <span>{{this.$durationFormat(i.dt)}}</span>
      </li>
      <li>显示全部{{topListLength}}首→&emsp;</li>
    </ul>
  </div>
</div>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import axios from "axios";

const route = useRoute()
let uid = 0
let topList = ref([])
let topListRemainList = ref([])

let topListLength = computed(() => {
  return topList.value.length + topListRemainList.value.length
})

//获取专辑
const getAlbum = (id) => {
  axios.get(`/artist/album?id=${id}`).then(res => {
    console.log(res.data)
  })
}

//获取热门50首歌曲
const getTopSongs = (id) => {
  axios.get(`/artist/top/song?id=${id}`).then(res => {
    if (res.data.code === 200){
      for (let s = 0;s<res.data.songs.length;s++){
        s<20?topList.value.push(res.data.songs[s]):topListRemainList.value.push(res.data.songs[s])
      }
    }
    console.log(res.data)
  })
}

onMounted(() => {
  uid = route.params.arID
  getAlbum(uid)
  getTopSongs(uid)
})
</script>

<style scoped>
@import "../../../assets/css/rightComponentsCss/artistComponents/artistAlbumInfo.css";
</style>
