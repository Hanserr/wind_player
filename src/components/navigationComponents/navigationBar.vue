<template>
  <div class="navigationBar">
    <el-scrollbar height="450px">
      <p class="navigationBar-p" @click="router.push('/')">&nbsp;&nbsp;探索音乐</p>
      <p class="navigationBar-p">&nbsp;&nbsp;视频</p>
      <p class="navigationBar-p" @click="router.push('/event')">&nbsp;&nbsp;关注</p>
      <p class="navigationBar-p" @click="router.push('/personalFm')">&nbsp;&nbsp;私人FM</p>
      <p class="navigationBar-p" @click="router.push('/subscribed')">&nbsp;&nbsp;我的收藏</p>

      <div class="navigationBar-p-headline-wrap" @click="createdSongListIsFold = !createdSongListIsFold">
        <p class="navigationBar-p-headline">&nbsp;&nbsp;创建的歌单</p>
        <svg-icon name="arrowsRight" class="navigationBar-p-headline-wrap-svg" v-show="createdSongListIsFold"></svg-icon>
        <svg-icon name="arrowsDown" class="navigationBar-p-headline-wrap-svg" v-show="!createdSongListIsFold"></svg-icon>
      </div>

      <div class="createdSongList" v-show="!createdSongListIsFold">
        <div class="createdSongList-wrapper"
             v-for="item in createdSongList"
             :key="item"
             @click="pushingTools.toSongListDetail(item.id)">
          <svg-icon name="songList"></svg-icon>
          <span class="createdSongList-p" >{{item.name}}</span>
        </div>
      </div>

      <div class="navigationBar-p-headline-wrap" @click="collectedSongIsFold = !collectedSongIsFold">
        <p class="navigationBar-p-headline">&nbsp;&nbsp;收藏的歌单</p>
        <svg-icon name="arrowsRight" class="navigationBar-p-headline-wrap-svg" v-show="collectedSongIsFold"></svg-icon>
        <svg-icon name="arrowsDown" class="navigationBar-p-headline-wrap-svg" v-show="!collectedSongIsFold"></svg-icon>
      </div>

      <div class="collectedSongList" v-show="!collectedSongIsFold">
        <div class="createdSongList-wrapper"
             v-for="item in collectionSongList"
             :key="item"
             @click="pushingTools.toSongListDetail(item.id)">
          <svg-icon name="songList"></svg-icon>
          <span class="createdSongList-p" >{{item.name}}</span>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup>
import {ref, watch} from "vue";
import SvgIcon from "@/components/SvgIcon";
import axios from "axios";
import {router} from "@/router/routes";
import api from "@/tools/apiCollection";
import pushingTools from "@/tools/pushingTools";
import {useUserStore} from "@/store/userStore";

const userStore = useUserStore();
let createdSongListIsFold = ref(true) //创建的歌单列表是否折叠
let collectedSongIsFold = ref(true) //收藏的歌单是否折叠
let createdSongList = ref() //创建的歌单列表
let collectionSongList = ref() //收藏的歌单列表

//获取歌单列表
const getSongList = () => {
  axios.get(`${api.GET_USER_PLAYLIST}?uid=${userStore.getUserInfo().value.userId}`).then(res => {
    if (res.data.code === 200){
      classifySongList(res.data.playlist)
    }
  })
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

watch(() => userStore.getUserInfo().value.userId, (n) => {
  if(n) {
    getSongList()
  }
},{
  immediate: true,
  deep: true,
})

</script>

<style scoped>
@import "../../assets/css/navigationComponentsCss/navigationBar.css";
</style>
