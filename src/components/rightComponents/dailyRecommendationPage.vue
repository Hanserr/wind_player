<template>
  <div class="dailyRecommendation"
       v-loading="loading"
       element-loading-background="rgba(0, 0, 0, 0.8)"
       element-loading-text="加载中···">
    <el-scrollbar>
      <div class="dailyRecommendation-top" v-if="!loading">
        <div>
          <span>{{new Date().getDate()}}</span>
        </div>
        <svg-icon name="calender" id="recCalender"></svg-icon>
        <span>每日音乐推荐</span>
        <span>根据你的听歌风格生成的歌单，每日6点刷新</span>
        <button @click="playAll">播放全部</button>
        <button>收藏</button>
      </div>
      <div class="dailyRecommendation-bottom">
        <div class="dailyRecommendationPageTopTitle">
          <span style="margin-left: 60px">标题</span>
          <span style="margin-left: 200px">歌手</span>
          <span style="margin-left: 180px">专辑</span>
          <span style="margin-left: 140px">时长</span>
          <span style="margin-left: 100px">热度</span>
        </div>
        <div class="dailyRecommendationPageBottomContent">
          <div v-for="(i,index) in dailyList" :key="i"  class="dailyRecommendationPageBottomContent-bottom" @dblclick="playMusic(i.id, index)">
            <span class="dailyRecommendationSongIndex">{{(index+1).toString().length<2?"0"+(index+1):index+1}}</span>
            <div class="dailyRecommendationSongTitle"><span>{{i.name}}</span></div>
            <div class="dailyRecommendationSongAr"><span v-for="ar in i.ar" :key="ar" @click="pushingTools.toArPage(ar.id)">{{ar.name}}</span></div>
            <div class="dailyRecommendationSongName"><span @click="pushingTools.toAlbumDetail(i.al.id)">{{i.al.name}}</span></div>
            <div class="dailyRecommendationSongDt"><span>{{format.durationFormat(i.dt)}}</span></div>
            <div class="dailyRecommendationSongPop">
              <div class="dailyRecommendationSongPop-content" :style="{width:i.pop+'%'}"></div>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup>
import {onMounted,ref} from "vue";
import axios from "axios";
import {ElMessage} from "element-plus";
import SvgIcon from "@/components/SvgIcon";
import api from "@/tools/apiCollection";
import {useSongStore} from "@/store/songStore";
import format from "@/tools/format";
import pushingTools from "@/tools/pushingTools";

const songStore = useSongStore();
let dailyList = ref() //日推歌单
let loading = ref(false)

//获取日推歌曲
const getDailyRecommendSongs = () => {
  loading.value = true
  axios.get(api.GET_DAILY_RECOMMEND_SONGS).then(res => {
    if (res.data.code === 200){
      dailyList.value = res.data.data.dailySongs
    }else {
      ElMessage({
        message:'获取数据失败',
        type:'error'
      })
    }
  }).finally(() => {
    loading.value = false
  })
}

//播放音乐
const playMusic = (id, index) => {
  songStore.updateCurSong(id)
  songStore.updateSongList(dailyList.value)
  songStore.updateIndexInList(index)
}

//播放当前歌单全部歌曲
const playAll = () => {
  songStore.updateCurSong(dailyList.value[0].id)
  songStore.updateSongList(dailyList.value)
  songStore.updateIndexInList(0)
}

onMounted(() => {
  getDailyRecommendSongs()
})
</script>

<style src="../../assets/css/rightComponentsCss/dailyRecommendationPage.css" scoped>
</style>
