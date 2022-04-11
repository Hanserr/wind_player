<template>
  <div class="homePage">
    <div class="homePage-carousel">
      <el-carousel :interval="4000" type="card" height="160px" arrow="never">
        <el-carousel-item v-for="item in bannerList.length>1?bannerList:8" :key="item" style="border-radius: 10px;">
          <img :src="item.imageUrl?item.imageUrl:beforeBanner" alt="" @click="getBannerSong(item)">
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script setup>

import {onMounted, ref} from "vue";
import axios from "axios";
import {ElCarousel} from "element-plus";

const baseUrl = "https://netease-cloud-music-api-beta-lime.vercel.app" //地址前缀
let bannerList = ref({'':''}) //banner列表
let beforeBanner = require('../../assets/pics/beforeBanner.webp')

// eslint-disable-next-line no-undef
const emits = defineEmits(['songID','toSpecifiedPage'])

//获取首页轮播图
const getBanner = () => {
  axios.get(`${baseUrl}/banner`).then(res => {
    if (res.data.code === 200){
      bannerList.value = res.data.banners
    }
  })
}

//获取轮播图歌曲 已知targetType对应 1:单曲  3000:活动页面
const getBannerSong = (item) => {
  if (item.targetType === 1){
    emits("songID",item.targetId)
  }else if (item.targetType === 1000){
    emits("toSpecifiedPage",['/songListDetail',item.targetId])
  }else if (item.targetType === 3000){
    window.open(item.url,'_blank')
  }
}

onMounted(() => {
  getBanner()
})
</script>

<style scoped>
@import "../../assets/css/rightComponentsCss/homePage.css";
</style>