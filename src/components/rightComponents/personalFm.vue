<template>
  <div class="personalFm"
       v-loading="!songList"
       element-loading-background="rgba(0, 0, 0, 0.8)">
    <div class="personalFm-left" v-if="songList">

      <div class="personalFm-left-cover1" :style="{
        transition:cover1.transition,
        width:cover1.width+'px',
        height:cover1.height+'px',
        top:cover1.top+'px',
        left:cover1.left+'px',
        zIndex:cover1.zIndex,
        opacity:cover1.opacity}">
        <img v-if="songList[0] || songList[1]"
             :src="cover1.left===100?songList[0].album.blurPicUrl:cover1.left===80?tempCover:songList[1].album.blurPicUrl"
             alt="">
      </div>

      <div class="personalFm-left-cover2" :style="{
        transition:cover2.transition,
        width:cover2.width+'px',
        height:cover2.height+'px',
        top:cover2.top+'px',
        left:cover2.left+'px',
        zIndex:cover2.zIndex,
        opacity:cover2.opacity}">
        <img v-if="songList[0] || songList[1]"
             :src="cover2.left===100?songList[0].album.blurPicUrl:cover2.left===80?tempCover:songList[1].album.blurPicUrl"
             alt="">
      </div>

      <div class="personalFm-left-cover3" :style="{
        transition:cover3.transition,
        width:cover3.width+'px',
        height:cover3.height+'px',
        top:cover3.top+'px',
        left:cover3.left+'px',
        zIndex:cover3.zIndex,
        opacity:cover3.opacity}">
        <img v-if="songList[0] || songList[1]"
             :src="cover3.left===100?songList[0].album.blurPicUrl:cover3.left===80?tempCover:songList[1].album.blurPicUrl"
             alt="">
      </div>
      <div class="personalFm-left-bottom">
        <div><svg-icon name="likeSong_2" @click="likeSong"></svg-icon></div>
        <div><svg-icon name="delSong" @click="toTrash"></svg-icon></div>
        <div><svg-icon name="next" @click="playNext"></svg-icon></div>
      </div>
    </div>

    <div class="personalFm-right" v-if="songStore.getCurSong().value.lyric">

      <div class="personalFm-header">
        <p id="personalFmSongName">{{songStore.getCurSong().value.name}}</p>
        <div class="personalFm-ar">
          <p v-for="i in songStore.getCurSong().value.artist" :key="i">{{i.name}}&nbsp;</p>
          <p>{{songStore.getCurSong().value.album === null?'':'- '+songStore.getCurSong().value.album.name}}</p>
        </div>
      </div>

      <div class="personalFm-lyric">
        <el-scrollbar
            height="290px"
            max-height="290px"
            ref="personalFmLyricContentWrap"
            wrap-class="personalFm-lyric-scrollbar"
            noresize>
          <ul class="personalFm-lyricContent" ref="personalFmLyricContent">
            <li v-for="(i,index) in songStore.getCurSong().value.lyric" :key="i" :style="{color:index+1 === lyricIndex?'#FFFFFF':'#606266'}">{{i.content}}{{i.tlyric===null?"":i.tlyric}}</li>
          </ul>
        </el-scrollbar>
      </div>
    </div>

  </div>
</template>

<script setup>
import axios from "axios";
import {nextTick, onMounted, ref, watch} from "vue";
import SvgIcon from "@/components/SvgIcon";
import api from "@/tools/apiCollection";
import {useSongStore} from "@/store/songStore";

const songStore = useSongStore();

//center
let cover1 = ref({
  transition:'0.3s linear',
  width:260,
  height:260,
  top:60,
  left:100,
  zIndex:91,
  opacity: 1,
})
//left
let cover2 = ref({
  transition:'0.3s linear',
  width:200,
  height:200,
  top:90,
  left:80,
  zIndex:90,
  opacity: 1
})
//right
let cover3 = ref({
  transition:'none',
  width:100,
  height:100,
  top:60,
  left:450,
  zIndex:92,
  opacity: 0
})
let songList = ref() //歌曲列表
let tempCover = ref(require("../../assets/pics/cover.webp")) //已播放歌曲的封面
let personalFmLyricContentWrap = ref(null)//el-scrollBar
let personalFmLyricContent = ref(null)//歌词外层包裹
let lyricIndex = ref(0) //当前歌词下标

//获取FM
const getFm = () => {
  axios.get(`${api.GET_FM}?timestamp=${Date.now()}`).then(res => {
    if (res.data.code === 200){
      if (songList.value){
        for (let i of res.data.data){
          songList.value.push(i)
        }
      }else{
        songList.value = res.data.data
        songStore.updateCurSong(songList.value[0].id)
      }
    }
  })
}

//下一首  列表内歌曲数小于等于3时再次获取
const playNext = () => {
  lyricIndex.value = 0
  tempCover.value = songList.value.shift().album.blurPicUrl
  songStore.updateCurSong(songList.value[0].id)
  changeCoverPosition()
  if (songList.value.length <= 3){
    getFm()
  }
}

//切换歌曲时改变封面位置
const changeCoverPosition = () => {
  let temp = cover3.value
  cover3.value = cover1.value
  cover1.value = cover2.value
  cover2.value = temp
}

//私人FM音乐垃圾桶
const toTrash = () => {
  axios.get(`${api.MUSIC_TRASH}?id=${songList.value[0].id}`)
  playNext()
}

//喜欢音乐
const likeSong = () => {
  axios.get(`${api.LIKE_SONG}?id=${songList.value[0].id}`)
}

onMounted(() => {
  getFm()
  //歌词滚动
  songStore.shareAudio.ontimeupdate = async () => {
    try {
      if (songStore.getCurSong().value.lyric && songStore.shareAudio.currentTime - songStore.getCurSong().value.lyric[lyricIndex.value].time <= 1 && songStore.shareAudio.currentTime - songStore.getCurSong().value.lyric[lyricIndex.value].time >= -0.2){
        if (songStore.getCurSong().value.lyric[lyricIndex.value].content && personalFmLyricContent){
          await nextTick()
          let list = personalFmLyricContent.value.children
          personalFmLyricContentWrap.value.setScrollTop(list[lyricIndex.value].offsetTop-list[lyricIndex.value].clientHeight/2-80)
        }
        lyricIndex.value = lyricIndex.value <= songStore.getCurSong().value.lyric.length-1?++lyricIndex.value:songStore.getCurSong().value.lyric.length-1
      }
    }catch(err) {
      console.log(err)
    }
  }
  songStore.shareAudio.onended = () => {
    playNext()
  }
})
</script>

<style scoped>
@import "../../assets/css/rightComponentsCss/personalFm.css";
</style>
