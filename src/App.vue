<template>
  <div id="app">
    <div class="playerPage">

<!--      左侧导航栏-->
      <div class="playerPageLeft">
        <navigation-bar @toSpecifiedPage="pushToPage"></navigation-bar>
      </div>

<!--      顶部搜索栏-->
      <div class="playerPageTop" :style="{backgroundColor:playerPageTopBC}">
<!--        搜索框-->
        <div class="topBar-search">
          <input class="topBar-searchInput" v-model="inputVal" @focus="searchInpFocus(inputVal)" :style="{backgroundColor: topSearchBarBC}">
          <el-icon color="#8896B3FF" class="topBar-search-el-icon" :style="{width: '30px',height: '27px',position:'absolute',backgroundColor:topSearchBarBC}" @click="getSearch(inputVal)">
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
            <el-avatar class="topBar-profile-avatar" :size="35" :src="user.avatarUrl"></el-avatar>
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

<!--        右侧歌曲封面及歌手-->
        <div class="playerBar-left" :style="{top:playBarLeft+'px'}">

          <div class="playerBar-left-top">
            <div id="playBar-left-top-flip" @click="movingWindowDown">
              <svg-icon name="arrowsDown" id="playBar-left-top-flip-arrows"></svg-icon>
            </div>
            <div class="playerBar-left-top-control1">
              <svg-icon name="like" class="playerBar-left-top-control-icon1"></svg-icon>
            </div>
            <div class="playerBar-left-top-control1">
              <svg-icon name="collect" class="playerBar-left-top-control-icon1"></svg-icon>
            </div>
            <div class="playerBar-left-top-control2">
              <svg-icon name="share" class="playerBar-left-top-control-icon2"></svg-icon>
            </div>
          </div>

          <div class="playerBar-left-bottom">
            <div id="cover" v-show="coverVisible" @mouseenter="coverVisible = true" @mouseleave="coverVisible = false" @click="movingWindowUp">
              <svg-icon name="topArrows" id="cover-arrows"></svg-icon>
            </div>
            <svg-icon name="music" id="music-icon" v-show="!song.cover"></svg-icon>
            <img :src="song.cover" v-show="song.cover" @mouseenter="coverVisible = true" @mouseleave="coverVisible = false">
            <p id="playerBar-left-name">{{song.name}}</p>
            <div id="playBar-left-ar-wrap">
              <p id="playBar-left-ar" v-for="i in song.artist" :key="i">{{i.name}}&nbsp;&nbsp;</p>
            </div>
          </div>

        </div>

        <div class="playerBar-audioContent">
          <div class="playerBar-audioContent-panel">
            <svg-icon name="previous" style="margin-left: 290px;cursor: pointer"></svg-icon>
            <svg-icon name="pause" style="margin-left: 20px;cursor: pointer" @click="playOrPause(isPlay)" v-show="isPlay"></svg-icon>
            <svg-icon name="play" style="margin-left: 20px;cursor: pointer" @click="playOrPause(isPlay)" v-show="!isPlay"></svg-icon>
            <svg-icon name="next" style="margin-left: 20px;cursor: pointer"></svg-icon>
          </div>
          <p>{{formatTime(audioRef.currentTime)}}</p>
          <div class="playerBar-audioContent-progressBar">
            <div class="playerBar-audioContent-progressBar-wrap" @mouseenter="enterBar" @mouseleave="leaveBar" @mousedown="mouseDown($event)" @mouseup="mouseUp($event)">
              <div class="playerBar-audioContent-progressBar-durationBar" :style="{width:durationBarWidth+'px'}"></div>
              <div class="playerBar-audioContent-progressBar-point" :style="{left:pointStyle.left+'px',width: pointStyle.width+'px',height:pointStyle.height+'px',display:showPoint}"></div>
            </div>
          </div>
          <p>{{formatTime(audioRef.duration)}}</p>
        </div>
      </div>

<!--        歌曲详情页-->
      <div class="songMovingWindow" :style="{top:songMovingWindowTop+'px'}">
        <el-scrollbar height="450px">

          <div class="songMovingWindow-top">
            <div class="songMovingWindow-top-pan">
              <img src="./assets/pics/header.png" id="header" :style="{transform:headerRotate}">
              <div class="songMovingWindow-top-pan-content" :style="{animationPlayState:panRotateState}">
                <img :src="song.cover" id="vinyl-cover" v-show="song.cover">
                <img src="./assets/pics/pan.png" id="vinyl">
              </div>
            </div>

            <div class="songMovingWindow-top-middle">
              <div class="songMovingWindow-top-middle-header">
                <p id="songName">{{song.name}}</p>
                <div class="songMovingWindow-top-middle-header-ar">
                  <p v-for="i in song.artist" :key="i">{{i.name}}&nbsp;</p>
                  <p>{{song.album === null?'':'- '+song.album.name}}</p>
                </div>
              </div>

              <div class="songMovingWindow-top-middle-lyric">
                <el-scrollbar height="280px" ref="lyricContentWrap">
                  <ul class="lyricContent" ref="lyricContent">
                    <li v-for="(i,index) in song.lyric" :key="i" :style="{color:index+1 === lyricSum?'#FFFFFF':'#606266'}">{{i.content}}</li>
                  </ul>
                </el-scrollbar>
              </div>
            </div>

            <div class="songMovingWindow-top-right">

            </div>

          </div>
          <div class="songMovingWindow-bottom">

          </div>
        </el-scrollbar>
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
import LoginModule from "./components/topComponents/loginModule";
import {router} from "@/router/routes";
import {ElMessage} from "element-plus";
import NavigationBar from "@/components/navigationComponents/navigationBar";

const baseUrl = "https://netease-cloud-music-api-beta-lime.vercel.app" //地址前缀
let inputVal = ref('') //顶部搜索框变量
let songSuggestionList = reactive({}) //建议歌单列表
let suggestionTimer = null //建议歌单列表的定时器
let popVisible = ref(false) //登录弹窗是否可见
let user = reactive({}) //用户信息
let resultListIsVisible = ref(false) //建议歌单是否可见
let isPlay = ref(false) //是否播放中
let song = reactive({
  name:null,
  src:null,
  cover:null,
  artist:null,
  album:null,
  duration:null,
  currentTime:null,
  lyric:null, //歌词
  tlyric:null, //歌词翻译
  transUser:null //翻译提供者
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
let coverVisible = ref(false) //歌曲遮罩
let songMovingWindowTop = ref(70) //520歌曲详情弹窗上距
let playBarLeft = ref(-60) //底部歌曲小页面上下移动距离
let playerPageTopBC = ref() //顶部搜索栏背景色
let topSearchBarBC = ref('#2b2b2b') //顶部搜索框背景色
let headerRotate = ref('rotate(0deg)') //磁头角度
let panRotateState = ref('paused') //盘片是否旋转
let lyricSum = ref(0) //当前歌词下标
let lyricContent = ref(null) //歌词外层包裹
let lyricContentWrap = ref(null) //el-scrollBar

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
  headerPosition(val)
}

// params:e 传入的歌曲id或歌曲完整信息
const playSong = (e) => {
  clearSongInfo()
  let id = null
  if (e.ar && e.al){
    song.cover = e.al.picUrl
    song.artist = e.ar
    song.name = e.name
    song.album = e.album
    id = e.id
  }else{
    id = e
    //如果传入的是歌曲id则会获取歌曲相关信息
    axios.get(`${baseUrl}/song/detail?ids=${id}`).then(res => {
      song.cover = res.data.songs[0].al.picUrl
      song.artist = res.data.songs[0].ar
      song.name = res.data.songs[0].name
      song.album = res.data.songs[0].al
    })
  }
  getLyric(id)
  axios.get(`${baseUrl}/song/url?id=${id}`).then(res => {
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
  if (val){
    resultListIsVisible.value = false
    movingWindowDown()
    router.push(`/searchResultPage/${val}`)
  }
}

//跳转到指定页
const pushToPage = (e) => {
  if (e[1]){
    router.push(`${e[0]}/${e[1]}`)
  }else {
    router.push(e[0])
  }
}

//歌曲弹窗上移
const movingWindowUp = () => {
  songMovingWindowTop.value = 70
  playBarLeft.value = 20
  playerPageTopBC.value = '#2c2c2c'
  topSearchBarBC.value = '#393B3A'
}

//歌曲弹窗下移
const movingWindowDown = () => {
  songMovingWindowTop.value = 520
  playBarLeft.value = -60
  playerPageTopBC.value = '#212121'
  topSearchBarBC.value = '#2b2b2b'
}

//黑椒唱片磁头位置和盘片旋转
const headerPosition = (val) => {
  if (val){
    headerRotate.value = 'rotate(-20deg)'
    panRotateState.value = 'paused'
  }else{
    headerRotate.value = 'rotate(0deg)'
    panRotateState.value = 'running'
  }
}

//获取歌词
const getLyric = (id) => {
  axios.get(`${baseUrl}/lyric?id=${id}`).then(res => {
    let temp = (res.data.lrc.lyric).toString().split('\n')
    for (let i in temp){
      let lyricList = temp[i].split(']')
      temp[i] = {time: lyricTimeFormat(lyricList[0]+']'),content:lyricList[1]}
    }
    temp.splice(temp.length-1,1)
    song.lyric = temp
    song.tlyric = res.data.tlyric.lyric
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

//清除当前所有歌曲信息
const clearSongInfo = () => {
  for (let i in song){
    song[i] = null
  }
  lyricSum.value = 0
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
const mouseUp = () => {
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
  playSong(1919029404)

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
    //进度条和进度点变化
    durationBarWidth.value = (audioRef.value.currentTime/audioRef.value.duration)*600
    pointStyle.left = (audioRef.value.currentTime/audioRef.value.duration)*600 - 4
    //歌词滚动
     if (audioRef.value.currentTime - song.lyric[lyricSum.value].time <= 0.8 && audioRef.value.currentTime - song.lyric[lyricSum.value].time >= -0.2 && lyricSum.value < song.lyric.length){
       let list = lyricContent.value.children
       if (song.lyric[lyricSum.value].content){
         lyricContentWrap.value.setScrollTop(list[lyricSum.value].offsetTop-list[lyricSum.value].clientHeight/2-80)
       }
       lyricSum.value++
     }
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
