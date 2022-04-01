<template>
  <div id="app">
    <div class="playerPage">

<!--      左侧导航栏-->
      <div class="playerPageLeft">

      </div>

<!--      顶部搜索栏-->
      <div class="playerPageTop">
<!--        搜索框-->
        <div class="topBar-search">
          <input class="topBar-searchInput" v-model="inputVal" @focus="searchInpFocus(inputVal)">
          <el-icon color="#8896B3FF" class="topBar-search-el-icon" style="width: 30px;height: 27px;position:absolute;" @click="getSearch(inputVal)">
            <Search/>
          </el-icon>
        </div>
<!--        建议列表-->
        <div class="topBar-list" v-show="resultListIsVisible">
          <el-scrollbar max-height="400px" class="topBar-list-main">
            <!--      歌曲-->
            <div class="topBar-list-main-title" v-show="songSuggestionList.artists !== undefined">
              <svg-icon name="song" style="width: 19px"></svg-icon>
              <p>单曲</p>
            </div>
            <p v-for="item in songSuggestionList.songs" :key="item" class="scrollbar-demo-item">
              {{item.name+"-"}}
              <span v-for="(i,index) in item.artists" :key="index">{{i.name+" "}}</span>
            </p>
            <!--      歌手-->
            <div class="topBar-list-main-title" v-show="songSuggestionList.artists !== undefined">
              <svg-icon name="artist" style="width: 20px"></svg-icon>
              <p>歌手</p>
            </div>
            <p v-for="item in songSuggestionList.artists" :key="item" class="scrollbar-demo-item">
              {{item.name}}
            </p>
            <!--      专辑-->
            <div class="topBar-list-main-title" v-show="songSuggestionList.albums !== undefined">
              <svg-icon name="album" style="width: 18px"></svg-icon>
              <p>专辑</p>
            </div>
            <p v-for="item in songSuggestionList.albums" :key="item" class="scrollbar-demo-item">
              {{item.name}}
              <span v-for="(i,index) in item.artists" :key="index">{{i.name+" "}}</span>
            </p>
            <!--      歌单-->
            <div class="topBar-list-main-title" v-show="songSuggestionList.playlists !== undefined">
              <svg-icon name="list" style="width: 20px"></svg-icon>
              <p>歌单</p>
            </div>
            <p v-for="item in songSuggestionList.playlists" :key="item" class="scrollbar-demo-item">
              {{item.name}}
              <span v-for="(i,index) in item.artists" :key="index">{{i.name+" "}}</span>
            </p>
          </el-scrollbar>
        </div>
<!--        用户登录-->
        <div class="userProfile">
          <div class="topBar-profile">
            <el-avatar class="topBar-profile-avatar" :size="45" :src="user.avatarUrl"></el-avatar>
          </div>
          <a @click = "popVisible = true" id="topBar-login" v-if="user.nickname === undefined">登录</a>
          <p v-if="user.nickname !== undefined" id="topBar-nickname">{{user.nickname}}</p>
          <!--    登录模块-->
          <login-module :visible="popVisible" @changeVisible="closePop"></login-module>
        </div>
      </div>

<!--      中间结果栏-->
      <div class="searchResult">
        <router-view @closeResultList="closeResultList" @songID="playSong"></router-view>
      </div>

<!--      底部播放栏-->
      <div class="playerBar">
        <audio ref="audioRef" :src="song.src"></audio>
        <div class="playerBar-audioContent">
          <div class="playerBar-audioContent-panel">
            <svg-icon name="previous" style="margin-left: 290px;cursor: pointer"></svg-icon>
            <svg-icon name="pause" style="margin-left: 20px;cursor: pointer" @click="playOrPause(isPlay)" v-show="isPlay"></svg-icon>
            <svg-icon name="play" style="margin-left: 20px;cursor: pointer" @click="playOrPause(isPlay)" v-show="!isPlay"></svg-icon>
            <svg-icon name="next" style="margin-left: 20px;cursor: pointer"></svg-icon>
          </div>
          <p>{{formatTime(audioRef.currentTime)}}</p>
          <div class="playerBar-audioContent-progressBar">
            <div class="playerBar-audioContent-progressBar-wrap" @mouseover="enterBar" @mouseleave="leaveBar" @mousedown="mouseDown($event)" @mouseup="mouseUp($event)">
              <div class="playerBar-audioContent-progressBar-durationBar" :style="{width:durationBarWidth+'%'}"></div>
              <div class="playerBar-audioContent-progressBar-point" :style="{left:pointStyle.left+'%',width: pointStyle.width+'px',height:pointStyle.height+'px',display:showPoint}"></div>
            </div>
          </div>
          <p>{{formatTime(audioRef.duration)}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, onUnmounted, reactive, ref, watch} from "vue";
import {Search} from "@element-plus/icons-vue";
import axios from "axios";
import SvgIcon from "@/components/SvgIcon";
import Cookies from "js-cookie";
import LoginModule from "./components/navigationComponents/loginModule";
import {router} from "@/router/routes";
import {ElMessage} from "element-plus";

const baseUrl = "https://netease-cloud-music-api-beta-lime.vercel.app" //地址前缀
let inputVal = ref('') //顶部搜索框变量
let songSuggestionList = reactive({}) //建议歌单列表
let suggestionTimer = null //建议歌单列表的定时器
let popVisible = ref(false) //登录弹窗是否可见
let user = reactive({}) //用户信息
let resultListIsVisible = ref(false) //建议歌单是否可见
let isPlay = ref(false) //是否播放中
let song = reactive({
  src:null,
  cover:null,
  artist:null,
  album:null,
  duration:null,
  currentTime:null
}) //歌曲信息
// eslint-disable-next-line no-unused-vars
let playerTimer = null //播放器载入新歌曲地址后的定时器
let durationBarWidth = ref(0) //进度条宽度
let pointStyle = reactive({
  left:0,
  width:8,
  height:8
}) //进度点样式
let audioRef = ref({
  currentTime:null,
  duration:null
}) //播放器DOM
let showPoint = ref('none') //是否展示进度点

//关闭登录弹窗
const closePop = (e) => {
  popVisible.value = e
}

//关闭搜索推荐弹窗
const closeResultList = (e) => {
  resultListIsVisible.value = e
}

//输入框聚焦事件
const searchInpFocus = (val) => {
  if (val !== ''){
    resultListIsVisible.value = true
  }
}

//获取用户可能搜索的结果
const searchSuggestion = (val) => {
  axios.get(baseUrl+`/search/suggest?keywords=${val}`).then(res => {
    if (res.data.code === 200){
      songSuggestionList.albums = res.data.result.albums
      songSuggestionList.artists = res.data.result.artists
      songSuggestionList.order = res.data.result.order
      songSuggestionList.playlists = res.data.result.playlists
      songSuggestionList.songs = res.data.result.songs
      resultListIsVisible.value = true
    }
  })
}

//播放或暂停
const playOrPause = (val) => {
  if (song.src === null){
    return
  }
  val === true?audioRef.value.pause():audioRef.value.play()
  isPlay.value = !val
}

//获取到歌曲id 歌曲地址后播放
const playSong = (e) => {
  axios.get(`${baseUrl}/song/url?id=${e}`).then(res => {
    if (res.data.code === 200){
      song.src = res.data.data[0].url
      //加个定时器给播放器预留缓冲时间
      playerTimer = setTimeout(() => {
        audioRef.value.pause()
        audioRef.value.play()
        isPlay.value = true
      },150)
    }else {
      ElMessage({
        message:'出错啦，请稍后再试',
        type:"warning"
      })
    }
  }).catch(() => {
    ElMessage({
      message:'出错啦，请稍后再试',
      type:"warning"
    })
  })
}

//格式化时间
const formatTime = (time) => {
  if (!time){
    return '00:00'
  }
  let min = Math.floor(time/60).toString().padStart(2,'0')
  let sec = Math.floor(time%60).toString().padStart(2,'0')
  return `${min}:${sec}`
}

//从session-storage中获取用户信息
const getUserProfile = () => {
  if (sessionStorage.getItem("neProfile")){
    let u = JSON.parse(sessionStorage.getItem("neProfile"))
    user.nickname = u.nickname
    user.avatarUrl = u.avatarUrl
    user.birthday = u.birthday
    user.city = u.city
    user.followed = u.followed
    user.follows = u.follows
    user.gender = u.gender
    user.province = u.province
    user.signature = u.signature
    user.userId = u.userId
    user.vipType = u.vipType
  } else {
    if(Cookies.get('neCookie')){
      axios.post(baseUrl+"/login/status").then(res => {
        if(res.data.data.code === 200){
          sessionStorage.setItem('neProfile',JSON.stringify(res.data.data.profile))
          getUserProfile()
        }
      })
    }
  }
}

//顶部搜索
const getSearch = (val) => {
  if (val !== ''){
    resultListIsVisible.value = false
    router.push(`/searchResultPage/${val}`)
  }
}

//鼠标进入进度条
const enterBar = () => {
  showPoint.value = 'block'
}

//鼠标离开进度条
const leaveBar = () => {
  showPoint.value = 'none'
}

//鼠标在进度条上按下事件
const mouseDown = (e) => {
  console.log(e.target.offsetLeft)
  console.log(e.clientX)
}

//鼠标在进度条上松开事件
const mouseUp = (e) => {
}

//监听到子组件传来的值
watch(() => popVisible.value,(next) => {
      popVisible.value = next
      getUserProfile()
    })

//监听输入框值，返回建议结果
watch(() => inputVal.value,(newVal) => {
      if (newVal !== ''){
        clearInterval(suggestionTimer)
        suggestionTimer = setInterval(() => {
          searchSuggestion(newVal)
          clearInterval(suggestionTimer)
        },300)
      }else {
        suggestionTimer = setTimeout(() => {
          songSuggestionList.albums = undefined
          songSuggestionList.artists = undefined
          songSuggestionList.order = undefined
          songSuggestionList.playlists = undefined
          songSuggestionList.songs = undefined
          resultListIsVisible.value = false
        },300)
      }
    })

onMounted(() => {
  // 加载歌曲时缓冲
  audioRef.value.onprogress = () => {
  }
  //产生打断事件后缓冲
  audioRef.value.onseeked  = () => {
  }
  //音频时长变化;得到时长数据
  audioRef.value.ondurationchange = () =>{
  }
  //播放时间变化
  audioRef.value.ontimeupdate = () => {
    durationBarWidth.value = (audioRef.value.currentTime/audioRef.value.duration)*100
    pointStyle.left = (audioRef.value.currentTime/audioRef.value.duration)*100 - 1
  }
  // 当前数据可以触发
  audioRef.value.oncanplay = () => {
  }
  // 音频播放完毕
  audioRef.value.onended = () => {
  }
  // 错误
  audioRef.value.onerror = () => {
  }

  getUserProfile()
})

onUnmounted(()=>{
  clearInterval(suggestionTimer)
})
</script>

<style>
@import "assets/css/app.css";
</style>
