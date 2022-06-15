<template>
<div class="artistAlbumInfoMain">

</div>
</template>

<script setup>
import {onMounted} from "vue";
import {useRoute} from "vue-router";
import axios from "axios";

const route = useRoute()

//获取专辑
const getAlbum = (id) => {
  axios.get(`/artist/album?id=${id}`).then(res => {
    console.log(res.data)
  })
}

onMounted(() => {
  getAlbum(route.params.arID)
})
</script>

<style scoped>
@import "../../../assets/css/rightComponentsCss/artistComponents/artistAlbumInfo.css";
</style>
