<template>
  <div class="personalFm"
       v-loading="!songList"
       element-loading-background="rgba(0, 0, 0, 0.8)">
    <div class="personalFm-left" v-if="songList">

      <div class="personalFm-control"
           :style="{left:controlBottomPosition.left+'px',
           top:controlBottomPosition.top+'px'}">
        <svg-icon name="redPlay" class="personalFMBottom" v-if="!props.audioRefState" @click="playSong(songList[0].id)"></svg-icon>
        <svg-icon name="redPause" class="personalFMBottom" v-if="props.audioRefState" @click="pause"></svg-icon>
      </div>

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

    <div class="personalFm-right" v-if="song.artist&&song.album&&song.lyric">

      <div class="personalFm-header">
        <p id="personalFmSongName">{{song.name}}</p>
        <div class="personalFm-ar">
          <p v-for="i in song.artist" :key="i">{{i.name}}&nbsp;</p>
          <p>{{song.album === null?'':'- '+song.album.name}}</p>
        </div>
      </div>

      <div class="personalFm-lyric">
        <el-scrollbar height="290px" ref="personalFmLyricContentWrap">
          <ul class="personalFm-lyricContent" ref="personalFmLyricContent">
            <li v-for="(i,index) in song.lyric" :key="i" :style="{color:index+1 === lyricSum?'#FFFFFF':'#606266'}">{{i.content}}{{i.tlyric===null?"":i.tlyric}}</li>
          </ul>
        </el-scrollbar>
      </div>

    </div>

  </div>
</template>

<script setup>
import axios from "axios";
import {onMounted, reactive, ref, watch} from "vue";
import SvgIcon from "@/components/SvgIcon";
import api from "@/tools/apiCollection";

// eslint-disable-next-line no-undef
const emits = defineEmits(['songID','audioState'])
// eslint-disable-next-line no-undef
const props = defineProps(['audioRefState','inPlay','timeChange','fmIsEnded'])
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
  width:260,
  height:260,
  top:60,
  left:450,
  zIndex:92,
  opacity: 0
})
let songList = ref() //歌曲列表
let tempCover = ref(require("../../assets/pics/cover.webp")) //已播放歌曲的封面
let controlBottomPosition = ref({
  left: 205,
  top: 165
})
let song = reactive({
  id:null,
  name:null,
  artist:null,
  album:null,
  lyric:null, //歌词
  transUser:null, //翻译提供者
  total:-1, //评论数
  hotComments:[],
  comments:[]
}) //歌曲信息
let personalFmLyricContentWrap = ref(null)//歌词外层包裹
let personalFmLyricContent = ref(null)//el-scrollBar
let lyricSum = ref(0) //当前歌词下标
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
        playSong(songList.value[0].id)
      }
    }
  })
}
//播放音乐
const playSong = (id) => {
  lyricSum.value = 0
  song.artist = songList.value[0].artists
  song.id = id
  song.name =  songList.value[0].name
  song.album = songList.value[0].album
  getLyric(id)
  controlBottomPosition.value.left = 315
  controlBottomPosition.value.top = 275
  if (props.inPlay){
    emits('audioState',false)
    return
  }
  emits("songID",id)
}
//暂停歌曲
const pause = () => {
  controlBottomPosition.value.left = 205
  controlBottomPosition.value.top = 165
  emits('audioState',true)
}
//下一首  列表内歌曲数小于等于3时再次获取
const playNext = () => {
  lyricSum.value = 0
  tempCover.value = songList.value.shift().album.blurPicUrl
  getLyric(songList.value[0].id)
  song.artist = songList.value[0].artists
  song.id =  songList.value[0].id
  song.name =  songList.value[0].name
  song.album = songList.value[0].album
  emits("songID",songList.value[0].id)
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
//获取歌词
const getLyric = (id) => {
  axios.get(`${api.GET_LYRIC}?id=${id}`).then(res => {
    let lyric = (res.data.lrc.lyric).toString().split('\n')
    for (let i in lyric){
      let lyricList = lyric[i].split(']')
      lyric[i] = {time: lyricTimeFormat(lyricList[0]+']'),content:lyricList[1],tlyric:null}
    }
    let tempTLyric = []
    if (res.data.tlyric && res.data.tlyric.lyric.length>=1){
      let tlyric = (res.data.tlyric.lyric).toString().split('\n')
      let tlyricReg = /^\[[0-9]{2}:[0-9]{2}\.[0-9]{2,3}$/
      for (let i = 0;i<tlyric.length;i++){
        let tlyricList = tlyric[i].split(']')
        //去空
        if (tlyricReg.test(tlyricList[0])){
          tempTLyric.push({time: lyricTimeFormat(tlyricList[0]+']'),content:tlyricList[1]})
        }
      }
      let tlyricSum = 0
      for (let a = 0;a < lyric.length-1;a++){
        if (lyric[a].time === tempTLyric[tlyricSum].time) {
          lyric[a].tlyric = "\n"+tempTLyric[tlyricSum].content
          tlyricSum === tempTLyric.length-1?tlyricSum = tempTLyric.length-1:tlyricSum++
        }
      }
    }
    lyric.splice(lyric.length-1,1)
    song.lyric = lyric
    song.transUser = res.data.transUser
  })
}
//歌词时间格式化
const lyricTimeFormat = (time) => {
  let temp = time.slice(1,time.length-1)
  let tList = temp.split(':')
  let min = tList[0]
  let sec = tList[1]
  return min*60+sec*1
}
watch(() => props.audioRefState, next => {
  if (next){
    controlBottomPosition.value.left = 315
    controlBottomPosition.value.top = 275
  }else{
    controlBottomPosition.value.left = 205
    controlBottomPosition.value.top = 165
  }
})
watch(() => props.timeChange, next => {
  //歌词滚动
  try {
    if (song.lyric && next - song.lyric[lyricSum.value].time <= 1 && next - song.lyric[lyricSum.value].time >= -0.2){
      if (song.lyric[lyricSum.value].content && personalFmLyricContent){
        let list = personalFmLyricContent.value.children
        personalFmLyricContentWrap.value.setScrollTop(list[lyricSum.value].offsetTop-list[lyricSum.value].clientHeight/2-80)
      }
      lyricSum.value = lyricSum.value <= song.lyric.length-1?++lyricSum.value:song.lyric.length-1
    }
  }catch(err) {
    console.log(err)
  }
})
watch(() => props.fmIsEnded, () => {
  playNext()
})
onMounted(() => {
  getFm()
})
</script>

<style scoped>
@import "../../assets/css/rightComponentsCss/personalFm.css";
</style>
