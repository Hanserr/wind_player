<template>
<div class="album-info-page">
  <p>专辑简介</p>
  <span v-if="des">{{des}}</span>
</div>
</template>

<script setup>
//获取专辑歌曲列表
import axios from "axios";
import {ElMessage} from "element-plus";
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";

const route = useRoute()
let des = ref() //专辑简介

const getAlbumInfo = (id) => {
  axios.get(`/album?id=${id}`).then(res => {
    if (res.data.code === 200){
      des.value = res.data.album.description
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
@import "../../../assets/css/rightComponentsCss/albumDetailPageComponentsCss/infoPage.css";
</style>