<template>
  <div class="navigationBar">
    <el-scrollbar height="450px">
      <p class="navigationBar-p" @click="router.push('/')">&nbsp;&nbsp;探索音乐</p>
      <p class="navigationBar-p">&nbsp;&nbsp;视频</p>
      <p class="navigationBar-p" @click="router.push('/event')">&nbsp;&nbsp;关注</p>
      <p class="navigationBar-p">&nbsp;&nbsp;直播</p>
      <p class="navigationBar-p" @click="router.push('/personalFm')">&nbsp;&nbsp;私人FM</p>
      <p class="navigationBar-p">&nbsp;&nbsp;我的收藏</p>
      <p class="navigationBar-p">&nbsp;&nbsp;潘多拉魔盒</p>

      <div class="navigationBar-p-headline-wrap" @click="createdSongListIsFold = !createdSongListIsFold">
        <p class="navigationBar-p-headline">&nbsp;&nbsp;创建的歌单</p>
        <svg-icon name="arrowsRight" class="navigationBar-p-headline-wrap-svg" v-show="createdSongListIsFold"></svg-icon>
        <svg-icon name="arrowsDown" class="navigationBar-p-headline-wrap-svg" v-show="!createdSongListIsFold"></svg-icon>
      </div>

      <div class="createdSongList" v-show="!createdSongListIsFold">
        <p v-for="item in createdSongList" :key="item" class="createdSongList-p" @click="this.$pushingTools.toSongListDetail(item.id)">&nbsp;&nbsp;{{item.name}}</p>
      </div>

      <div class="navigationBar-p-headline-wrap" @click="collectedSongIsFold = !collectedSongIsFold">
        <p class="navigationBar-p-headline">&nbsp;&nbsp;收藏的歌单</p>
        <svg-icon name="arrowsRight" class="navigationBar-p-headline-wrap-svg" v-show="collectedSongIsFold"></svg-icon>
        <svg-icon name="arrowsDown" class="navigationBar-p-headline-wrap-svg" v-show="!collectedSongIsFold"></svg-icon>
      </div>

      <div class="collectedSongList" v-show="!collectedSongIsFold">
        <p v-for="item in collectionSongList" :key="item" class="createdSongList-p" @click="this.$pushingTools.toSongListDetail(item.id)">&nbsp;&nbsp;{{item.name}}</p>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import SvgIcon from "@/components/SvgIcon";
import axios from "axios";
import Cookies from "js-cookie";
import {router} from "@/router/routes";

// eslint-disable-next-line no-undef
let createdSongListIsFold = ref(true) //创建的歌单列表是否折叠
let collectedSongIsFold = ref(true) //收藏的歌单是否折叠
let createdSongList = ref() //创建的歌单列表
let collectionSongList = ref() //收藏的歌单列表

//获取用户歌单列表
const getUserSongList = () => {
  let id = Cookies.get('UID')
  if (id && Cookies.get('MUSIC_U')){
    axios.get(`/user/playlist?uid=${JSON.parse(id)}`).then(res => {
      if (res.data.code === 200){
        classifySongList(res.data.playlist)
      }
    })
  }
}

//歌单分类
const classifySongList = (list) => {
  let temp1 = []
  let temp2 = []
  createdSongList.value = {}
  collectionSongList.value = {}
  for(let i of list){
    if (i.subscribed){
      temp1.push(i)
    }else {
      temp2.push(i)
    }
    createdSongList.value = temp2
    collectionSongList.value = temp1
  }
}

onMounted(() => {
  getUserSongList()
})
</script>

<style scoped>
@import "../../assets/css/navigationComponentsCss/navigationBar.css";
</style>
