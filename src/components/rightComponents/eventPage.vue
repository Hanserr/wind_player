<template>
  <div class="eventPageWrap" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.8)" element-loading-text="加载中···">
  <el-scrollbar @scroll="eventPageRefScroll">
    <div class="eventPage" ref="eventPageRef" v-if="eventsList">
        <p>动态</p>
        <div class="eventContent" v-for="i in eventsList" :key="i">
          <div class="eventContent-avatarArea">
            <img :src="i.user.avatarUrl" alt="" class="eventContent-userAvatar">
            <svg-icon name="VBadge" class="event-avatar-badge" v-if="i.user.userType === 2 || i.user.userType === 3 || i.user.userType === 10"></svg-icon>
            <svg-icon name="NEMusician" class="event-avatar-NEMusician" v-if="i.user.userType === 4"></svg-icon>
          </div>
          <div class="eventContent-right">
            <div class="eventContent-right-top">
              <span class="eventContent-nickname">{{i.user.nickname}}</span>
              <span>发布动态</span>
              <br>
              <span>{{this.$commentTimeFormat(i.eventTime)}}</span>
            </div>

            <div class="eventContent-right-middle">
              <div class="eventContent-right-middle-content" v-html="urlToText(JSON.parse(i.json).msg,i.bottomActivityInfos?i.bottomActivityInfos[0].h5Target:null)"></div>
              <div class="eventContent-right-middle-share" v-if="i.info.commentThread.resourceInfo.eventType === 18" @click="toPlay(JSON.parse(i.json).song.id)">
                <img :src="JSON.parse(i.json).song.album.picUrl" alt="">
                <span>{{JSON.parse(i.json).song.name}}</span>
                <br>
                <span v-for="i in JSON.parse(i.json).song.artists" :key="i">{{i.name}}</span>
              </div>
              <div class="eventContent-right-middle-share" v-if="i.info.commentThread.resourceInfo.eventType === 19" @click="this.$pushingTools.toAlbumDetail(JSON.parse(i.json).album.id)">
                <img :src="JSON.parse(i.json).album.picUrl" alt="">
                <span>{{JSON.parse(i.json).album.name}}</span>
                <br>
                <span>{{JSON.parse(i.json).album.artist.name}}</span>
              </div>
              <div class="eventContent-right-middle-pic">
                <div class="eventContent-right-middle-pic-wrap" v-for="(pic,index) in i.pics" :key="pic" :style="{ height:i.pics.length===9?140+'px':105+'px',width:i.pics.length===9?140+'px':105+'px'}">
                  <img :src="pic.originUrl"
                       alt=""
                       :style="{
                        height: pic.height>pic.width?'auto':100+'%',
                        width: pic.width>pic.height?'auto':100+'%'}"
                       @click="showCompletePic(index,i.pics)">
                </div>
              </div>
            </div>

            <div class="eventContent-right-bottom">
              <svg-icon name="unThumbUp" v-if="!i.info.liked" class="eventContent-right-bottom-thumb" @click="thumbup(i.info.threadId,i.id,1);++i.info.likedCount;i.info.liked=!i.info.liked"></svg-icon>
              <svg-icon name="thumbUp" v-if="i.info.liked" class="eventContent-right-bottom-thumb" @click="thumbup(i.info.threadId,i.id,1);--i.info.likedCount;i.info.liked=!i.info.liked"></svg-icon>
              <span>{{i.info.likedCount}}</span>
              <svg-icon name="sendCommentToSomeone" class="eventContent-right-bottom-comment"></svg-icon>
              <span>{{i.info.commentCount}}</span>
            </div>

          </div>
          <div class="eventContent-divider"></div>
        </div>

        <div class="completePicArea" v-show="showPicArea" @dblclick="showPicArea = false">
          <el-carousel height="450px" arrow="hover" trigger="click" :autoplay="false" ref="picCarouselRef">
            <el-carousel-item v-for="pic in presentlyCompletePicList" :key="pic">
              <div class="carousel-wrapper">
                <img :src="pic.originUrl"
                     alt=""
                     :style="{
                    height: pic.height>pic.width?'auto':450+'px',
                    width: pic.width>pic.height?'auto':450+'px'}">
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
    </div>
  </el-scrollbar>
  </div>
</template>

<script setup>
import axios from "axios";
import {onMounted, onUnmounted, ref} from "vue";
import {ElMessage} from "element-plus";
import SvgIcon from "@/components/SvgIcon";
import {router} from "@/router/routes";

let lastTime = -1
let eventsList = ref() //动态列表
let loading = ref(false)
let showPicArea = ref(false)
let presentlyCompletePicList = ref(['']) //当前大图列表
let picCarouselRef = ref(null) //轮播图ref
let eventPageRef = ref(null)
let eventGettingMark = true
// eslint-disable-next-line no-unused-vars
let eventTimer = null //获取动态的冷却时间
// eslint-disable-next-line no-undef
const emits = defineEmits(['songID'])

//获取动态数据
const getEvents = () => {
  if (!eventGettingMark)
    return
  eventGettingMark = false
  loading.value = true
  axios.get(`/event?pagesize=20&lasttime=${lastTime}`).then(res => {
    console.log(res.data)
    if (res.data.code === 200){
      lastTime = res.data.lasttime
      if (eventsList.value){
        for (let i of res.data.event){
          eventsList.value.push(i)
          }
        }else{
        eventsList.value = res.data.event
      }
      eventTimer = setTimeout(() => {
        eventGettingMark = true
      },1000)
    }else {
     ElMessage({
       message:"获取动态失败",
       type:"error"
     })
    }
  }).finally(() => {
    loading.value = false
  })
}

//展示完整的图片
const showCompletePic = (index,pic_list) => {
  presentlyCompletePicList.value = pic_list
  showPicArea.value = true
  setTimeout(() => {
    picCarouselRef.value.setActiveItem(pic_list.length-index-1)
  },10)
}

//懒加载
const eventPageRefScroll = (e) => {
  if (eventPageRef.value.clientHeight - e.scrollTop < 1000)
    getEvents()
}

//链接转可点击文本
const urlToText = (str,actID) => {
  let reUrl = /((http|https):\/\/[-A-Za-z\d+&@#/%?=~_|!:,.;]+[-A-Za-z\d+&@#/%=~_|])/g
  let reTag = /#.+#/g
  str = str.replace(reUrl, (url) => {
    return `<a href='${url}' target='_blank'>➜网页链接</a>`
  });
  if (!actID)
    return str
  str = str.replace(reTag,(tag) => {
    return `<a href='${actID}' target='_blank'>${tag}</a>`
  })
  return str;
};

//点赞
const thumbup = (tid,t) => {
  axios.get(`/resource/like?t=${t}&type=6&threadId=${tid}`)
}

//播放
const toPlay = (id) => {
  emits('songID',id)
}

onMounted(() => {
  getEvents()
})

onUnmounted(() => {
  clearTimeout(eventTimer)
})
</script>

<style scoped>
@import "../../assets/css/rightComponentsCss/eventPage.css";
</style>
