<template>
  <div class="homePage">
    <el-scrollbar>

      <div class="homePage-top">
        <div class="homePage-carousel">
          <el-carousel :interval="4000" type="card" height="160px" arrow="never">
            <el-carousel-item v-for="item in bannerList.length>1?bannerList:8" :key="item" style="border-radius: 10px;">
              <img :src="item.imageUrl?item.imageUrl:beforeBanner" alt="" @click="getBannerSong(item)">
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>

      <div class="homePage-bottom">
        <div class="recommendListDiv" v-for="i in recommendSongs" :key="i">
          <img :src="i.picUrl || i.coverImgUrl ||cover" class="recommendListDivCover" @click="toSongListDetail(i.id)">
          {{i.name}}
        </div>
      </div>

    </el-scrollbar>
  </div>
</template>

<script setup>

import {onMounted, ref} from "vue";
import axios from "axios";
import {ElCarousel} from "element-plus";
import {router} from "@/router/routes";

let bannerList = ref({'':''}) //banner列表
let beforeBanner = require('../../assets/pics/beforeBanner.webp') //banner未加载完成时的替代图
let recommendSongs = ref([]) //日推歌曲
let cover = require("../../assets/pics/cover.webp") //日推封面
// eslint-disable-next-line no-undef
const emits = defineEmits(['songID','toSongListDetailPage'])

//获取首页轮播图
const getBanner = () => {
  axios.get(`/banner`).then(res => {
    if (res.data.code === 200){
      bannerList.value = res.data.banners
    }
  })
}

//获取轮播图歌曲 已知targetType对应 1:单曲  10:专辑  1000:歌单  3000:活动页面
const getBannerSong = (item) => {
  if (item.targetType === 1){
    emits("songID",item.targetId)
  } else if(item.targetType === 10){
    router.push(`/albumDetail/songlistPage/${item.targetId}`)
  }else if (item.targetType === 1000){
    router.push({
      name:'songListDetailPage',
      params:{
        songListId:item.targetId
      }
    })
  }else if (item.targetType === 3000){
    window.open(item.url,'_blank')
  }
}

//获取日推歌曲
const getDailyRecommendSongs = () => {
  axios.get(`/recommend/songs`).then(res => {
    if (res.data.code === 200){
      recommendSongs.value.push(res.data.data.dailySongs)
    }
  })
}

//获取日推歌单
const getDailyRecommendSongLists = () => {
  recommendSongs.value.push({name:"每日歌曲推荐",id:-1})
  axios.get(`/recommend/resource`).then(res => {
    if (res.data.code === 200){
      for(let i in res.data.recommend){
        recommendSongs.value.push(res.data.recommend[i])
      }
      axios.get('/top/playlist/highquality?limit=3').then(res => {
        if (res.data.code === 200){
          for(let i in res.data.playlists){
            recommendSongs.value.push(res.data.playlists[i])
          }
        }
      })
    }
  })
}

//跳转至歌单详情页
const toSongListDetail = (id) => {
  if (id !== -1 && id !== ''){
    emits('toSongListDetailPage',id)
}
}

onMounted(() => {
  getBanner()
  getDailyRecommendSongLists()
})
</script>

<style scoped>
@import "../../assets/css/rightComponentsCss/homePage.css";
</style>