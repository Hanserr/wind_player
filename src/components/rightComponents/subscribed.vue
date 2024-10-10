<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";
import apiCollection from "@/tools/apiCollection";
import pushingTools from "@/tools/pushingTools";
let artist = ref()

onMounted(() => {
  axios.get(apiCollection.SUBSCRIBED_ARTIST).then(res => {
    if(res.data.code === 200) {
      artist.value = res.data.data
    }
  })
})
</script>

<template>
  <div class="subscribed-wrapper" v-if="artist">
    <p class="my-sub-artist-title">我收藏的歌手</p>
    <el-scrollbar height="450px">
      <div class="subscribed-el-wrapper">
        <div v-for="i in artist" :key="i" class="sub-artist-box" @click="pushingTools.toArPage(i.id)">
          <img :src="i.picUrl" alt=""/>
          <br>
          <span>{{i.name}}</span>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<style scoped>
@import "/src/assets/css/rightComponentsCss/subscribed.css";
</style>