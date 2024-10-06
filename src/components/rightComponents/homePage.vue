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
        <div class="recommendListDiv" v-for="i in recommendSongsList" :key="i">
          <img :src="i.picUrl || i.coverImgUrl || cover" class="recommendListDivCover" @click="pushingTools.toSongListDetail(i.id)" alt="">
          {{i.name}}
        </div>
      </div>

    </el-scrollbar>
  </div>
</template>

<script setup>
import {onMounted, ref, watch} from "vue";
import axios from "axios";
import {ElCarousel} from "element-plus";
import {router} from "@/router/routes";
import api from "@/tools/apiCollection";
import {useUserStore} from "@/store/userStore";
import {useSongStore} from "@/store/songStore";
import pushingTools from "@/tools/pushingTools";

let bannerList = ref({'':''}) //banner列表
let beforeBanner = require('../../assets/pics/beforeBanner.webp') //banner未加载完成时的替代图
let recommendSongsList = ref([]) //日推歌单
let cover = require("../../assets/pics/cover.webp") //日推封面
const userStore = useUserStore()
const songStore = useSongStore()

//获取首页轮播图
const getBanner = () => {
  axios.get(api.GET_BANNER).then(res => {
    if (res.data.code === 200){
      bannerList.value = res.data.banners
    }
  })
}

//获取轮播图歌曲 已知targetType对应 1:单曲  10:专辑  1000:歌单  3000:活动页面
const getBannerSong = (item) => {
  if (item.targetType === 1){
    songStore.updateCurSong(item.targetId)
  }else if(item.targetType === 10){
    router.push(`/albumDetail/songlistPage/${item.targetId}`)
  }else if (item.targetType === 1000){
    toSongListDetail(item.targetId)
  }else if (item.targetType === 3000){
    window.open(item.url,'_blank')
  }
}

//获取日推歌单
const getDailyRecommendSongLists = () => {
  if (userStore.getLoginStatus().value) {
    //每日个性化定制歌单
    recommendSongsList.value.push({name:"每日歌曲推荐",id:-1})
    //其他推荐歌单
    axios.get(api.GET_DAILY_RECOMMEND_LIST).then(res => {
      if (res.data.code === 200){
        for(let i of res.data.recommend){
          recommendSongsList.value.push(i)
        }
      }
    })
  }
}

watch(() => userStore.getLoginStatus().value,(n) => {
  if (n) {
    getDailyRecommendSongLists()
  }
})

onMounted(() => {
  getBanner()
})
</script>

<style scoped>
@import "../../assets/css/rightComponentsCss/homePage.css";
</style>
