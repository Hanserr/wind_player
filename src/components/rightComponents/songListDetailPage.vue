<template>
  <div class="songListDetailPage"
       v-loading="loading"
       element-loading-background="rgba(0, 0, 0, 0.8)"
       element-loading-text="加载中···">
    <div class="songListDetailPage-top" v-if="listDetail">
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
        <button id="collect" @click="collectSongList" :disabled="!canCollect" :style="{backgroundColor:canCollect?'transparent':'#383838'}">{{hadCollected?'已收藏':'收藏'}}</button>
        <svg-icon name="alterSongList" style="position: absolute;top: 105px;left: 240px;cursor:pointer;" @click="toAlterSongList" v-show="!canCollect"></svg-icon>
        <p id="playCount">歌曲:{{listDetail.playlist.tracks.length}}</p>
        <p id="songCount">播放:{{listDetail.playlist.playCount.toString().length>=9?
            `${Math.floor(listDetail.playlist.playCount/100000000)}亿`: listDetail.playlist.playCount.toString().length>=5?
            `${Math.floor(listDetail.playlist.playCount/10000)}万`: listDetail.playlist.playCount}}
        </p>
        <p id="description">简介:{{listDetail.playlist.description}}</p>
      </div>
    </div>
    <div class="songListDetailPage-bottom" v-if="listDetail">
      <div class="songListDetailPage-bottom-title">
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

            <div class="detailName">
              <p>{{song.name}}</p>
            </div>

            <div class="detailAr">
              <p v-for="(n,index) in song.ar" :key="index">{{n.name}}</p>
            </div>

            <div class="detailAl">
              <p @click="toAlbumDetail(song.al.id)">{{song.al.name}}</p>
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
import {router} from "@/router/routes";
import Cookies from "js-cookie";

const route = useRoute()
// eslint-disable-next-line no-undef
const emits = defineEmits(['songID','tracks'])
let listDetail = ref()
let preparedSongList = ref() //待播放歌曲列表
let canCollect = ref(true) //是否可以收藏
let hadCollected = ref(true) //是否已收藏
let loading = ref(false) //遮罩

//获取歌单详情
const getSongListDetail = (id) => {
  listDetail.value = null
  loading.value = true
  axios.get(`/playlist/detail?id=${id}`).then(res => {
    if (res.data.code === 200) {
      listDetail.value = res.data
      canCollect.value = res.data.playlist.userId !== parseInt(Cookies.get('UID'))
      hadCollected.value = res.data.playlist.subscribed
  }
}).finally(() => {
  loading.value = false
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

//跳转至修改歌单页面
const toAlterSongList = () => {
  router.push({
    name:'editSongListInfo',
    params:{
      editSongListInfoId:route.params.songListId
    }
  })
}

//收藏歌单
const collectSongList = () => {
  hadCollected.value = !hadCollected.value
  axios.get(`/playlist/subscribe?t=${hadCollected.value?1:2}&id=${route.params.songListId}`)
}


//跳转至专辑详情页
const toAlbumDetail = (id) => {
  router.push(`/albumDetail/songlistPage/${id}`)
}

watch(() => route.params.songListId,(next) => {
  getSongListDetail(next)
})

onMounted(() => {
  getSongListDetail(route.params.songListId)
})
</script>

<style scoped>
@import "../../assets/css/rightComponentsCss/songListDetailPage.css";
</style>