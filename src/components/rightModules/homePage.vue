<template>
  <div class="homePage">
    <div class="homePage-carousel">
      <el-carousel :interval="4000" type="card" height="160px">
        <el-carousel-item v-for="item in bannerList" :key="item">
          <img :src="item.imageUrl" alt="">
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script setup>

import {onMounted, reactive, ref} from "vue";
import axios from "axios";
import {ElCarousel} from "element-plus";

const baseUrl = "https://netease-cloud-music-api-beta-lime.vercel.app" //地址前缀
let bannerList = ref({}) //banner列表

const getBanner = () => {
  axios.get(`${baseUrl}/banner`).then(res => {
    if (res.data.code === 200){
      bannerList.value = res.data.banners
    }
  })
}
onMounted(() => {
  getBanner()
})
</script>

<style scoped>
@import "../../assets/css/rightModulesCss/homePage.css";
</style>