<template>
  <div class="homePage">
    <div class="homePage-carousel">
      <el-carousel :interval="4000" type="card" height="160px" arrow="never">
        <el-carousel-item v-for="item in bannerList" :key="item" style="border-radius: 10px;">
          <img :src="item.imageUrl" alt="" @click="getBannerSong(item.encodeId)">
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

// eslint-disable-next-line no-undef
const emits = defineEmits(['songID'])
//获取首页轮播图
const getBanner = () => {
  axios.get(`${baseUrl}/banner`).then(res => {
    if (res.data.code === 200){
      bannerList.value = res.data.banners
    }
  })
}
//获取轮播图歌曲
const getBannerSong = (id) => {
  emits("songID",id)
}

onMounted(() => {
  getBanner()
})
</script>

<style scoped>
@import "../../assets/css/rightComponentsCss/homePage.css";
</style>