<template>
<div class="album-songlist-page">
  <div class="albumPageTopTitle">
    <span style="margin-left: 30px">标题</span>
    <span style="margin-left: 202px">歌手</span>
    <span style="margin-left: 142px">专辑</span>
    <span style="margin-left: 126px">时长</span>
    <span style="margin-left: 60px">热度</span>
  </div>
  <div class="albumPageBottomContent">
    <div v-for="(i,index) in albumSongs" :key="i"  class="albumPageBottomContent-bottom" @dblclick="songStore.updateCurSong(i.id)">
      <span class="albumSongIndex">{{(index+1).toString().length<2?"0"+(index+1):index+1}}</span>
      <div class="albumSongTitle"><span>{{i.name}}</span></div>
      <div class="albumSongAr"><span v-for="ar in i.ar" :key="ar" @click="this.$pushingTools.toArPage(ar.id)">{{ar.name}}&nbsp;&nbsp;</span></div>
      <div class="albumSongName"><span>{{i.al.name}}</span></div>
      <div class="albumSongDt"><span>{{this.$durationFormat(i.dt)}}</span></div>
      <div class="albumSongPop">
        <div class="albumSongPop-content" :style="{width:i.pop+'%'}"></div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import axios from "axios";
import {ElMessage} from "element-plus";
import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import api from "@/tools/apiCollection";
import {useSongStore} from "@/store/songStore";

const route = useRoute()
const songStore = useSongStore();
let albumSongs = ref() //专辑歌曲内容

//获取专辑歌曲列表
const getAlbumInfo = (id) => {
  axios.get(`${api.GET_ALBUM}?id=${id}`).then(res => {
    if (res.data.code === 200){
      albumSongs.value = res.data.songs
    }else {
      ElMessage({
        message:'获取信息失败！',
        type:'error'
      })
    }
  })
}

onMounted(() => {
  getAlbumInfo(route.params.id)
})
</script>

<style scoped>
@import "../../../assets/css/rightComponentsCss/albumDetailPageComponentsCss/songlistPage.css";
</style>
