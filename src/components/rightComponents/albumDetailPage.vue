<template>
  <div class="albumDetailPage" v-if="albumInfo">
    <el-scrollbar @scroll="getScrollTop">
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
        <span class="albumArAndTi">时间:{{this.$dateFormat(albumInfo.publishTime)}}</span>
      </div>
    </div>
    <div class="albumDetailPage-bottom">
      <span class="albumDetailPage-bottom-title" style="margin-left: 0" @click="$router.push(`/albumDetail/songlistPage/${route.params.id}`)">歌曲列表</span>
      <span class="albumDetailPage-bottom-title" @click="$router.push(`/albumDetail/commentPage/${route.params.id}`)" v-if="albumInfo">评论({{albumInfo.info.commentCount}})</span>
      <span class="albumDetailPage-bottom-title" @click="$router.push(`/albumDetail/infoPage/${route.params.id}`)">专辑详情</span>
      <router-view @playMusic="playMusic" :tempScrollTop="tempScrollTop"></router-view>
    </div>
    </el-scrollbar>
  </div>
</template>
<script setup>
import {onMounted, ref,} from "vue";
import axios from "axios";
import {useRoute} from "vue-router"
import {ElMessage} from "element-plus";

const route = useRoute()
let albumInfo = ref() //专辑信息
// eslint-disable-next-line no-undef
let emits = defineEmits(['songID','tracks'])
let preparedSongList = ref()
let tempScrollTop = ref()

//获取专辑详细信息
const getAlbumInfo = (id) => {
  axios.get(`/album?id=${id}`).then(res => {
    if (res.data.code === 200){
      albumInfo.value = res.data.album
      preparedSongList.value = res.data.songs
    }else {
      ElMessage({
        message:'获取信息失败！',
        type:'error'
      })
    }
  })
}

//播放音乐
const playMusic = (id) => {
  emits('songID',id)
}

//播放当前歌单全部歌曲
const playAll = () => {
  emits('songID',preparedSongList.value[0].id)
  emits('tracks',[preparedSongList.value,0])
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