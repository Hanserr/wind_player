<template>
  <div class="albumDetailPage" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.8)" element-loading-text="加载中···">
    <el-scrollbar @scroll="getScrollTop" v-if="albumInfo" >
    <div class="albumDetailPage-top">
      <img :src="albumInfo.blurPicUrl" id="albumCover">
      <div class="albumDetailPage-top-rightInfo">
        <span id="albumTitle">专辑</span>
        <span id="albumName">{{albumInfo.name}}</span>
        <br>
        <button id="playAll" @click="playAll">播放全部</button>

        <button id="collectAlbum">收藏</button>
        <br>
        <span class="albumArAndTi">歌手:</span>
        <span class="albumCreator" v-for="i in albumInfo.artists" :key="i">{{i.name}}&nbsp;</span>
        <br>
        <span class="albumArAndTi">时间:{{format.dateFormat(albumInfo.publishTime)}}</span>
      </div>
    </div>
    <div class="albumDetailPage-bottom">
      <span class="albumDetailPage-bottom-title" style="margin-left: 0" @click="$router.push(`/albumDetail/songlistPage/${route.params.id}`)">歌曲列表</span>
      <span class="albumDetailPage-bottom-title" @click="$router.push(`/albumDetail/commentPage/${route.params.id}`)" v-if="albumInfo">评论({{albumInfo.info.commentCount}})</span>
      <span class="albumDetailPage-bottom-title" @click="$router.push(`/albumDetail/infoPage/${route.params.id}`)">专辑详情</span>
      <router-view :tempScrollTop="tempScrollTop"></router-view>
    </div>
    </el-scrollbar>
  </div>
</template>
<script setup>
import {onMounted, ref,} from "vue";
import axios from "axios";
import {useRoute} from "vue-router"
import {ElMessage} from "element-plus";
import api from "@/tools/apiCollection";
import {useSongStore} from "@/store/songStore";
import format from "@/tools/format";

const songStore = useSongStore();
const route = useRoute()
let albumInfo = ref() //专辑信息
let emits = defineEmits(['tracks'])
let preparedSongList = ref()
let tempScrollTop = ref()
let loading = ref(false)

//获取专辑详细信息
const getAlbumInfo = (id) => {
  loading.value = true
  axios.get(`${api.GET_ALBUM}?id=${id}`).then(res => {
    if (res.data.code === 200){
      albumInfo.value = res.data.album
      preparedSongList.value = res.data.songs
    }else {
      ElMessage({
        message:'获取信息失败！',
        type:'error'
      })
    }
  }).finally(() => {
    loading.value = false
  })
}

//播放当前歌单全部歌曲
const playAll = () => {
  songStore.updateCurSong(preparedSongList.value[0].id)
  songStore.updateSongList(preparedSongList.value)
}

//当前滚动距离
const getScrollTop = (e) => {
  tempScrollTop.value = e.scrollTop
}

onMounted(() => {
  getAlbumInfo(route.params.id)
})

</script>
<style scoped>
@import "../../assets/css/rightComponentsCss/albumDetailPage.css";
</style>
