<template>
  <div class="songListDetailPage" v-if="listDetail !== undefined">
    <div class="songListDetailPage-top">
      <div class="songListDetailPage-top-img">
        <img :src="listDetail.playlist.coverImgUrl">
      </div>
      <div class="songListDetailPage-top-right">
        <p id="songList">歌单</p>
        <p id="listName">{{listDetail.playlist.name}}</p>
        <img id="avatar" :src="listDetail.playlist.creator.avatarUrl">
        <div id="creatorWrap">
          <p id="creatorName">{{listDetail.playlist.creator.nickname}}</p>
          <p id="creationTime">{{this.$dateFormat(listDetail.playlist.createTime)}}创建</p>
        </div>
        <button id="play" @click="playAll">播放全部</button>
        <button id="collect">收藏</button>
        <p id="playCount">歌曲:{{listDetail.playlist.tracks.length}}</p>
        <p id="songCount">播放:{{listDetail.playlist.playCount.toString().length>=100000000?
            `${Math.floor(listDetail.playlist.playCount/1000000000)}亿`: listDetail.playlist.playCount.toString().length>=5?
            `${Math.floor(listDetail.playlist.playCount/10000)}万`: listDetail.playlist.playCount}}
        </p>
        <p id="description">简介:{{listDetail.playlist.description}}</p>
      </div>
    </div>
    <div class="songListDetailPage-bottom">
      <div class="songListDetailPage-bottom-title">
        <p id="panel">操作</p>
        <p id="title">标题</p>
        <p id="artist">歌手</p>
        <p id="album">专辑</p>
        <p id="duration">时间</p>
      </div>
      <div class="songListDetailPage-bottom-content">
        <el-scrollbar height="240px">

          <div class="songDetail" v-for="(song,index) in listDetail.playlist.tracks" :key="song" @dblclick="playSong(song.id,index)">

            <div class="detailIndex">
              <p>{{(index+1).toString().length === 1?'0'+(index+1):(index+1)}}</p>
            </div>

<!--            <div class="songOption">-->
<!--              <svg-icon name="likeSong" v-if="song.liked"></svg-icon>-->
<!--              <svg-icon name="unlikeSong" v-if="song.liked"></svg-icon>-->
<!--            </div>-->

            <div class="detailName">
              <p>{{song.name}}</p>
            </div>

            <div class="detailAr">
              <p v-for="(n,index) in song.ar" :key="index">{{n.name}}</p>
            </div>

            <div class="detailAl">
              <p>{{song.al.name}}</p>
            </div>

            <div class="detailDuration">
              <p>{{this.$durationFormat(song.dt)}}</p>
            </div>

          </div>

        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref, watch} from "vue";
import {useRoute} from "vue-router"
import axios from "axios"
import SvgIcon from "@/components/SvgIcon";
import Cookies from "js-cookie";

const baseUrl = "https://netease-cloud-music-api-beta-lime.vercel.app"
const route = useRoute()
// eslint-disable-next-line no-undef
const emits = defineEmits(['songID','tracks'])
let listDetail = ref()
let preparedSongList = ref() //待播放歌曲列表
let userLikedSongList = ref() //用户喜欢的歌曲列表

//获取歌单详情
const getSongListDetail = (id) => {
  axios.get(`${baseUrl}/playlist/detail?id=${id}`).then(async res => {
    if (res.data.code === 200) {
      listDetail.value = res.data
      preparedSongList.value = listDetail.value.playlist.tracks
    }
  })
}

//获取用户喜欢的歌曲列表
const getUserLikedSongList = () => {
  if (!Cookies.get('UID')){
    return
  }
  axios.get(`${baseUrl}/likelist?uid=${Cookies.get('UID')}`).then(res => {
    if (res.data.code === 200){
      userLikedSongList.value = res.data.ids
    }
  })
}

//播放歌曲
const playSong = (id,index) => {
  emits('songID',id)
  emits('tracks',[preparedSongList,index])
}

//播放当前歌单全部歌曲
const playAll = () => {
  emits('songID',listDetail.value.playlist.tracks[0].id)
  emits('tracks',[preparedSongList,0])
}

watch(() => route.params.id,(next) => {
  getSongListDetail(next)
})

// watch(() => preparedSongList.value,() => {
//   for (let s in preparedSongList.value) {
//     preparedSongList.value[s].liked = userLikedSongList.value.indexOf(preparedSongList.value[s].id)>0
//   }
// })

onMounted(async () => {
  await getUserLikedSongList()
  await getSongListDetail(route.params.id)
})
</script>

<style scoped>
@import "../../assets/css/rightComponentsCss/songListDetailPage.css";
</style>