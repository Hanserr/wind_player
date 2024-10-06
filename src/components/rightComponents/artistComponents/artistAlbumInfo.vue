<template>
<div class="artistAlbumInfoMain"
     v-loading="artistAlbumLoading"
     element-loading-background="rgba(0, 0, 0, 0.8)"
     element-loading-text="加载中···">

  <div id="top50Songs" v-show="!artistAlbumLoading">
    <div id="top50SongsBanner">
      <p>Top50</p>
    </div>
    <p id="top50SongsTitle">热门50首</p>
    <ul>
      <li v-for="(i,index) in topList" :key="i" @dblclick="playSong(i.id)">
        <span>{{index+1 < 10?"0"+(index+1):index+1}}</span>
        <span>{{i.name}}</span>
        <span>{{format.durationFormat(i.dt)}}</span>
      </li>
      <li v-show="topListRemainList.length !== 0" @click="showEntireData()">
        <span style="cursor: pointer">显示全部{{topListLength}}首→</span>
      </li>
    </ul>
  </div>

  <div class="hotAlbums" v-show="!artistAlbumLoading" v-for="al in albums" :key="al">
      <div class="hotAlbumsBanner">
        <img :src="al.picUrl" alt="">
      </div>
      <p class="hotAlbumsTitle">{{ al.name }}</p>
      <ul>
        <li v-for="(alSong,index) in al.songs" :key="alSong" @dblclick="playSong(alSong.id)">
          <span>{{index+1 < 10?"0"+(index+1):index+1}}</span>
          <span>{{alSong.name}}</span>
          <span>{{format.durationFormat(alSong.dt)}}</span>
        </li>
      </ul>
  </div>

</div>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import axios from "axios";
import {ElMessage} from "element-plus";
import api from "@/tools/apiCollection";
import {useSongStore} from "@/store/songStore";
import format from "@/tools/format";

const songStore = useSongStore();
const route = useRoute()
let uid = 0
let albums = ref([])
let topList = ref([])
let topListRemainList = ref([])
let artistAlbumLoading = ref(false)

let topListLength = computed(() => {
  return topList.value.length + topListRemainList.value.length
})

//获取专辑
const getAlbum = (id) => {
  artistAlbumLoading.value = true
  axios.get(`${api.GET_ARTIST_ALBUM}?id=${id}`).then(res => {
    if (res.data.code === 200){
      albums.value = res.data.hotAlbums
      getSongsByAlbum()
    }else {
      ElMessage({
        message:"获取数据失败",
        type:"error"
      })
    }
  })
}

//获取热门50首歌曲
const getTopSongs = (id) => {
  axios.get(`${api.GET_ARTIST_TOP50_SONGS}?id=${id}`).then(res => {
    if (res.data.code === 200){
      for (let s = 0;s<res.data.songs.length;s++){
        s<20?topList.value.push(res.data.songs[s]):topListRemainList.value.push(res.data.songs[s])
      }
    }
  })
}

//获取专辑捏歌曲
const getSongsByAlbum = () => {
  for (let s of albums.value){
    axios.get(`${api.GET_ALBUM}?id=${s.id}`).then(res => {
      if (res.data.code === 200){
        s.songs = res.data.songs
      }
    }).catch(() => {
      s.songs = null
    }).finally(() => {
      artistAlbumLoading.value = false
    })
  }
}

//播放歌曲
const playSong = (id) => {
  songStore.updateCurSong(id)
}

//显示全部歌曲数据
const showEntireData = () => {
  topList.value.push.apply(topList.value,topListRemainList.value)
  topListRemainList.value = []
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
