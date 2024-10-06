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
        <img id="avatar" :src="listDetail.playlist.creator.avatarUrl" @click="pushingTools.toCreator(listDetail.playlist.creator.userId)">
        <div id="creatorWrap">
          <p id="creatorName" @click="pushingTools.toCreator(listDetail.playlist.creator.userId)">{{listDetail.playlist.creator.nickname}}</p>
          <p id="creationTime">{{format.dateFormat(listDetail.playlist.createTime)}}创建</p>
        </div>
        <button id="play" @click="playAll">播放全部</button>
        <button id="collect" @click="collectSongList" :disabled="!canCollect" :style="{backgroundColor:canCollect?'transparent':'#383838'}">{{hadCollected?'已收藏':'收藏'}}</button>
        <svg-icon name="alterSongList" style="position: absolute;top: 105px;left: 240px;cursor:pointer;" @click="pushingTools.toAlterSongList(route.params.songListId)" v-show="!canCollect"></svg-icon>
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
        <span>标题</span>
        <span>歌手</span>
        <span>专辑</span>
        <span>时间</span>
      </div>
      <div class="songListDetailPage-bottom-content">
        <el-scrollbar height="240px">
          <div class="songDetail" v-for="(song,index) in listDetail.playlist.tracks" :key="song" @dblclick="playSong(song.id,index)">
              <span class="songDetailIndex">{{index+1 < 10?'0'+(index+1):(index+1)}}</span>
              <span class="songDetailName">{{song.name}}</span>
              <div class="detailAr">
                <span v-for="(n,index) in song.ar"
                      :key="index"
                      @click="pushingTools.toArPage(n.id)"
                      :style="{cursor:n.id!==0?'pointer':'default',color:n.id!==0?'#d5d5d5':'#757575'}">
                  {{n.name}}{{index !== song.ar.length - 1?'&nbsp;/&nbsp;':''}}
                </span>
              </div>
              <span @click="pushingTools.toAlbumDetail(song.al.id)" class="songDetailAl">{{song.al.name}}</span>
              <span class="songDetailDt">{{format.durationFormat(song.dt)}}</span>
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
import api from "@/tools/apiCollection";
import {useSongStore} from "@/store/songStore";
import format from "@/tools/format";
import pushingTools from "@/tools/pushingTools";

const route = useRoute()
const songStore = useSongStore()
let listDetail = ref()
let preparedSongList = ref() //待播放歌曲列表
let canCollect = ref(true) //是否可以收藏
let hadCollected = ref(true) //是否已收藏
let loading = ref(false) //遮罩

//获取歌单详情
const getSongListDetail = (id) => {
  listDetail.value = null
  loading.value = true
  axios.get(`${api.GET_PLAYLIST_DETAIL}?id=${id}`).then(res => {
    if (res.data.code === 200) {
      listDetail.value = res.data
      preparedSongList.value = res.data.playlist.tracks
      canCollect.value = res.data.playlist.userId !== parseInt(Cookies.get('UID'))
      hadCollected.value = res.data.playlist.subscribed
  }
}).finally(() => {
  loading.value = false
  })
}

//播放歌曲
const playSong = (id) => {
  songStore.updateCurSong(id)
  songStore.updateSongList(preparedSongList.value)
}

//播放当前歌单全部歌曲
const playAll = () => {
  songStore.updateCurSong(listDetail.value.playlist.trackIds[0].id)
  songStore.updateSongList(preparedSongList.value)
}

//收藏歌单
const collectSongList = () => {
  hadCollected.value = !hadCollected.value
  axios.get(`${api.COLLECT_PLAYLIST}?t=${hadCollected.value?1:2}&id=${route.params.songListId}`)
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
