<template>
  <div id="app">
    <div class="playerPage">

<!--      左侧导航栏-->
      <div class="playerPageLeft">
        <navigation-bar></navigation-bar>
      </div>
<!--      顶部搜索栏-->
      <div class="playerPageTop" :style="{backgroundColor:playerPageTopBC}">
        <svg-icon name="logoIcon" style="width: 50px;height: 50px;margin-left: 10px;margin-top: 10px;cursor:pointer;" @click="toHome"></svg-icon>
        <div class="playerPageTop-control">
          <div @click="$router.go(-1)">&lt;</div>
          <div @click="$router.go(1)">></div>
        </div>
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
           <el-avatar class="topBar-profile-avatar" :size="35" :src="user?user.avatarUrl:''" @click="toUserInfoPage"></el-avatar>
          </div>
          <a @click = "popVisible = true" id="topBar-login" v-if="user === undefined">登录</a>
          <p v-if="user !== undefined" id="topBar-nickname" @click="displayUserInfo = !displayUserInfo">{{user.nickname}}</p>
          <div class="topBar-profile-popWindow" v-show="displayUserInfo">
            <div class="topBar-profile-popWindow-numberArea">
              <span v-if="user !== undefined" class="topBar-profile-popWindow-numberArea-p1">{{user.eventCount}}</span>
              <span class="topBar-profile-popWindow-numberArea-p2">动态</span>
            </div>
            <div class="topBar-profile-popWindow-numberArea">
              <span v-if="user !== undefined" class="topBar-profile-popWindow-numberArea-p1">{{user.follows}}</span>
              <span class="topBar-profile-popWindow-numberArea-p2">关注</span>
            </div>
            <div class="topBar-profile-popWindow-numberArea">
              <span v-if="user !== undefined" class="topBar-profile-popWindow-numberArea-p1">{{user.followeds}}</span>
              <span class="topBar-profile-popWindow-numberArea-p2">粉丝</span>
            </div>
            <button @click="dailySignin">签到</button>
            <div class="topBar-profile-popWindow-bottomDiv">
              我的会员
              <svg-icon name="arrowsRight" class="topBar-profile-popWindow-svg"></svg-icon>
            </div>
            <div class="topBar-profile-popWindow-bottomDiv">
              等级
              <svg-icon name="arrowsRight" class="topBar-profile-popWindow-svg"></svg-icon>
            </div>
            <div class="topBar-profile-popWindow-bottomDiv">
              个人信息设置
              <svg-icon name="arrowsRight" class="topBar-profile-popWindow-svg"></svg-icon>
            </div>
            <div class="topBar-profile-popWindow-bottomDiv" @click="checkLogoutAgain()">
              注销登录
              <svg-icon name="arrowsRight" class="topBar-profile-popWindow-svg"></svg-icon>
            </div>
          </div>
          <!--    登录模块-->
          <login-module :visible="popVisible" @changeVisible="closePop"></login-module>
        </div>
      </div>

<!--      中间结果栏-->
      <div class="searchResult">
          <router-view
              @closeResultList="closeResultList"
              @songID="playSong"
              @tracks="pushPreparedSongList"
              @audioState="playOrPause"
              :audioRefState="isPlay"
              :inPlay="song.src"
              :timeChange="songTimeChange"
              :fmIsEnded="fmIsEnded"
              v-slot="{Component}">
            <keep-alive>
              <component :is="Component" :key="$route.name" v-if="$route.meta.keepAlive" ></component>
            </keep-alive>
            <component :is="Component" :key="$route.name" v-if="!$route.meta.keepAlive" ></component>
          </router-view>
      </div>

<!--      底部播放栏-->
      <div class="playerBar">
        <audio ref="audioRef" :src="song.src"></audio>

<!--        右侧歌曲封面及歌手-->
        <div class="playerBar-left">
          <div class="playerBar-left-wrap" :style="{top:playBarLeft+'px'}">
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
              <img :src="song.cover" v-show="song.cover" @mouseenter="coverVisible = true" @mouseleave="coverVisible = false" alt="">
              <p id="playerBar-left-name">{{song.name}}</p>
              <div id="playBar-left-ar-wrap">
                <p id="playBar-left-ar" v-for="i in song.artist" :key="i">{{i.name}}&nbsp;&nbsp;</p>
              </div>
            </div>
          </div>
        </div>

        <div class="playerBar-audioContent">
          <div class="playerBar-audioContent-panel">
            <svg-icon name="previous" style="margin-left: 290px;cursor: pointer" @click="previousSong"></svg-icon>
            <svg-icon name="pause" style="margin-left: 20px;cursor: pointer" @click="playOrPause(isPlay)" v-show="isPlay"></svg-icon>
            <svg-icon name="play" style="margin-left: 20px;cursor: pointer" @click="playOrPause(isPlay)" v-show="!isPlay"></svg-icon>
            <svg-icon name="next" style="margin-left: 20px;cursor: pointer"  @click="nextSong"></svg-icon>
          </div>
          <p>{{formatTime(audioRef.currentTime)}}</p>
          <div class="playerBar-audioContent-progressBar">
            <div class="playerBar-audioContent-progressBar-wrap" @mousedown="mouseDown" @mouseup="mouseUp" @mousemove="mouseMove">
              <div class="playerBar-audioContent-progressBar-durationBar" :style="{width:durationBarWidth+'px'}"></div>
            </div>
          </div>
          <p>{{formatTime(audioRef.duration)}}</p>
        </div>
        <svg-icon name="volume" id="volumeIcon" v-show="!audioRef.muted" @click="isMuted" @mouseover="volumeBarVisibleBeforeFunc" @mouseleave="volumeBarVisibleAfterFunc"></svg-icon>
        <svg-icon name="muted" id="volumeIcon" v-show="audioRef.muted" @click="isMuted" @mouseover="volumeBarVisibleBeforeFunc" @mouseleave="volumeBarVisibleAfterFunc"></svg-icon>
        <div id="volumeIconBody" v-show="volumeBarVisible" @mouseover="volumeBarVisibleBeforeFunc" @mouseleave="volumeBarVisibleAfterFunc">
          <div id="volumeIconBodyContainer" @mousemove="volumeMouseMove" @mousedown="volumeMouseDown" @mouseup="volumeMouseUp" @mouseleave="volumeMouseOut">
            <div id="volumeIconBodyBar" :style="{height: volumeValue+'px'}"></div>
          </div>
        </div>
        <svg-icon name="playlistHeart" id="playlistIcon" @click="preparedSongListRight = preparedSongListRight===0?-400:0"></svg-icon>
        <div id="preparedSongList" :style="{right:preparedSongListRight+'px'}">
          <div id="preparedSLTop">
            <span>当前播放</span>
            <span>共{{preparedSongList?preparedSongList.length:"--"}}首音乐</span>
            <span @click="preparedSongList = null">清空列表</span>
          </div>
          <div id="cutOff"></div>
          <div id="preparedSLBottom">
            <el-scrollbar height="359px">
              <div class="preparedSongContent" v-for="i in preparedSongList" :key="i" @dblclick="playSong(i.id)">
                <div>
                  <span>{{i.name}}</span>
                </div>
                <div>
                  <span v-for="ar in i.ar" :key="ar">{{ar.name}}</span>
                </div>
                <div>
                  <span>{{this.$durationFormat(i.dt)}}</span>
                </div>
              </div>
            </el-scrollbar>
          </div>
        </div>
      </div>

<!--        歌曲详情页-->
      <div class="songMovingWindow" :style="{top:songMovingWindowTop+'px'}">
<!--        发条评论吧-->
        <div id="sendAMessage" @click="openCommentAreaToSong">
          <svg-icon name="sendComment"></svg-icon>
          <span>写条评论吧</span>
        </div>

        <el-scrollbar @scroll="infiniteScroll" ref="elInfiniteScroll">

          <div class="songMovingWindow-top">
            <div class="songMovingWindow-top-pan">
              <img src="./assets/pics/header.webp" id="header" :style="{transform:headerRotate}" alt="">
              <div class="songMovingWindow-top-pan-content" :style="{animationPlayState:panRotateState}">
                <img :src="song.cover" id="vinyl-cover" v-show="song.cover" alt="">
                <img src="./assets/pics/pan.webp" id="vinyl" alt="">
              </div>
            </div>

            <div class="songMovingWindow-top-middle" v-if="song.artist&&song.album&&song.lyric">
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
                    <li v-for="(i,index) in song.lyric" :key="i" :style="{color:index+1 === lyricSum?'#FFFFFF':'#606266'}" @click="toSpecificLyric(i.time,index)">{{i.content}}{{i.tlyric===null?"":i.tlyric}}</li>
                  </ul>
                </el-scrollbar>
            </div>
            <div class="songMovingWindow-top-right">

            </div>

          </div>
          </div>

<!--          底部评论区-->
          <div
              v-loading="true"
              id="loadingCover"
              element-loading-text="评论加载中···"
              element-loading-background="transparent"
              v-if="!song.total">
          </div>
          <div class="songMovingWindow-bottom" ref="commentsRef">
            <span id="allCommentsTitle" v-show="song.total">全部评论({{song.total}})</span>

            <div class="songHotCommentsContent" v-for="i in song.hotComments" :key="i">
              <img :src="i.user.avatarUrl" alt="" class="commentsUserAvatar">
              <div class="songCommentContentTop">
                <span class="commentsUserName">{{i.user.nickname}}:</span>
                <span class="commentsContent">{{i.content}}</span>
                <div class="parentComment" v-if="i.beReplied.length > 0" >
                  <span>@{{i.beReplied[0].user.nickname}}:</span>
                  <span>{{i.beReplied[0].content}}</span>
                </div>
              </div>
              <div class="songCommentContentBottom">
                <span class="commentsPublishTime">{{this.$commentTimeFormat(i.time)}}</span>
                <svg-icon name="thumbUp" class="thumbupComment" v-if="i.liked" @click="i.liked = false;--i.likedCount;isThumbUpComment(i.commentId,1)"></svg-icon>
                <svg-icon name="unThumbUp" class="thumbupComment" v-if="!i.liked" @click="i.liked = true;++i.likedCount;isThumbUpComment(i.commentId,0)"></svg-icon>
                <span class="commentsThumbUpCount">{{i.likedCount}}</span>
                <svg-icon name="sendCommentToSomeone" class="sendCommentToSomeone" @click="openCommentArea(i.commentId,i.user.nickname)"></svg-icon>
              </div>
              <div class="commentDivider"></div>
            </div>

            <button id="checkMoreHotCommentsButton" v-show="song.total">更多精彩评论</button>
            <div class="songCommentContent" v-for="i in song.comments" :key="i">
              <img :src="i.user.avatarUrl" alt="" class="commentsUserAvatar">

              <div class="songCommentContentTop">
                <span class="commentsUserName">{{i.user.nickname}}:</span>
                <span class="commentsContent">{{i.content}}</span>
                <div class="parentComment" v-if="i.beReplied.length > 0" >
                  <span>@{{i.beReplied[0].user.nickname}}:</span>
                  <span>{{i.beReplied[0].content}}</span>
                </div>
              </div>

              <div class="songCommentContentBottom">
                <span class="commentsPublishTime">{{this.$commentTimeFormat(i.time)}}</span>
                <svg-icon name="thumbUp" class="thumbupComment" v-if="i.liked" @click="i.liked = false;--i.likedCount;isThumbUpComment(i.commentId,1)"></svg-icon>
                <svg-icon name="unThumbUp" class="thumbupComment" v-if="!i.liked" @click="i.liked = true;++i.likedCount;isThumbUpComment(i.commentId,0)"></svg-icon>
                <span class="commentsThumbUpCount">{{i.likedCount}}</span>
                <svg-icon name="sendCommentToSomeone" class="sendCommentToSomeone" @click="openCommentArea(i.commentId,i.user.nickname)"></svg-icon>
              </div>

              <div class="commentDivider"></div>
            </div>

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
import LoginModule from "./components/topComponents/loginModule";
import {router} from "@/router/routes";
import {ElMessage, ElMessageBox} from "element-plus";
import NavigationBar from "@/components/navigationComponents/navigationBar";
import Cookies from "js-cookie";
import {useRoute} from "vue-router";

const route = useRoute()
let inputVal = ref('') //顶部搜索框变量
let songSuggestionList = reactive({}) //建议歌单列表
let suggestionTimer = null //建议歌单列表的定时器
let popVisible = ref(false) //登录弹窗是否可见
let user = ref() //用户信息
let displayUserInfo = ref(false) //展示用户部分信息（vip时间，注销···）弹窗
let resultListIsVisible = ref(false) //建议歌单是否可见
let isPlay = ref(false) //是否播放中
let song = reactive({
  id:null,
  name:null,
  src:null,
  cover:null,
  artist:null,
  album:null,
  duration:null,
  currentTime:null,
  lyric:null, //歌词
  transUser:null, //翻译提供者
  total:-1, //评论数
  hotComments:[],
  comments:[]
}) //歌曲信息
// eslint-disable-next-line no-unused-vars
let playerTimer = null //播放器载入新歌曲地址后的定时器
let durationBarWidth = ref(0) //进度条宽度
let audioRef = ref({
  currentTime:null,
  duration:null
}) //播放器DOM
let coverVisible = ref(false) //歌曲遮罩
let songMovingWindowTop = ref(520) //520歌曲详情弹窗上距
let playBarLeft = ref(-60) //底部歌曲小页面上下移动距离
let playerPageTopBC = ref() //顶部搜索栏背景色
let topSearchBarBC = ref('#2b2b2b') //顶部搜索框背景色
let headerRotate = ref('rotate(0deg)') //磁头角度
let panRotateState = ref('paused') //盘片是否旋转
let lyricSum = ref(0) //当前歌词下标
let lyricContent = ref(null) //歌词外层包裹
let lyricContentWrap = ref(null) //el-scrollBar
let preparedSongList = ref() //待播放歌曲列表
let presentSongIndexInPreparedList = 0 //当前播放的歌曲在待播列表中的位置
// eslint-disable-next-line no-unused-vars
let onBarMark = false //鼠标是否在进度条上点击
let volumeValue = ref(80) //音量
let tempVolumeValue = 0 //临时音量
let tempVolumeBeforeMuted = 0 //静音前临时保存音量值
// eslint-disable-next-line no-unused-vars
let mousePositionInVolumeBar = 0 //鼠标在音量条内点击的初始位置
// eslint-disable-next-line no-unused-vars
let volumeMouseClick = false //鼠标在音量条内是否按下
let volumeBarVisible = ref(false) //音量条是否显示
let volumeBarVisibleTimer = null //音量条是否可见定时器
let preparedSongListRight = ref(-400) //待播放列表位置
let commentsOffset = 0 //评论分页偏移量
let commentsRef = ref(null)//歌曲详情页ref
let refreshCommentTimer = null //评论刷新定时器
let cancel = true //评论懒加载间隔时间段
let elInfiniteScroll = ref(null) //懒加载滚动条
let songTimeChange = ref() //歌曲播放时间的变化，供FM页面使用
let fmIsEnded = ref(false) //当前fm是否已播放完毕

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
  axios.get(`/search/suggest?keywords=${val}`).then(res => {
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
  if (!song.src){
    return
  }
  val?audioRef.value.pause():audioRef.value.play()
  isPlay.value = !val
  headerPosition(val)
}

// params:e 传入的歌曲id或歌曲完整信息
const playSong = (e) => {
  elInfiniteScroll.value.setScrollTop = 0
  clearSongInfo()
  if (e.ar && e.al){
    //先获取歌词再获取播放地址防止报错
    getLyric(e.id)
    song.cover = e.al.picUrl
    song.artist = e.ar
    song.name = e.name
    song.album = e.al
    song.id = e.id
  }else{
    song.id = e
    //先获取歌词再获取播放地址防止报错
    getLyric(song.id)
    //如果传入的是歌曲id则会获取歌曲相关信息
    axios.get(`/song/detail?ids=${song.id}`).then(res => {
      song.cover = res.data.songs[0].al.picUrl
      song.artist = res.data.songs[0].ar
      song.name = res.data.songs[0].name
      song.album = res.data.songs[0].al
    })
  }
  axios.get(`/song/url?id=${song.id}`).then(res => {
    if (res.data.code === 200){
      song.src = res.data.data[0].url
      //加个定时器给播放器预留缓冲时间
      playerTimer = setTimeout(() => {
        audioRef.value.pause()
        audioRef.value.play()
        isPlay.value = true
        playOrPause(false)
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

//播放上一首
const previousSong = () => {
  if (route.path==='personalFm' || !preparedSongList.value){
    return
  }
  if (presentSongIndexInPreparedList === 0){
    playSong(preparedSongList.value[preparedSongList.value.length-1].id)
  }else {
    playSong(preparedSongList.value[--presentSongIndexInPreparedList].id)
  }

}

//播放下一首
const nextSong = () => {
  if (route.path==='personalFm' || !preparedSongList.value){
    return
  }
  if (presentSongIndexInPreparedList >= preparedSongList.value.length-1){
    playSong(preparedSongList.value[0].id)
  }else {
    playSong(preparedSongList.value[++presentSongIndexInPreparedList].id)
  }
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

//获取用户登陆状态
const getUserProfile = () => {
  if (Cookies.get('UID') || Cookies.get('MUSIC_U')){
    let uid = Cookies.get('UID')
    axios.get(`/user/detail?uid=${uid}`).then(res => {
      if (res.data.code === 200){
        user.value = res.data.profile
      }
    })
  }
}

//顶部搜索
const getSearch = (val) => {
  if (val){
    resultListIsVisible.value = false
    movingWindowDown()
    router.push({
      name:'searchResultPage',
      params:{
        id:val
      }
    })
  }
}

//获取待播放列表
const pushPreparedSongList = (e) => {
  preparedSongList.value = e[0].value
  presentSongIndexInPreparedList = e[1]
}

//歌曲弹窗上移
const movingWindowUp = () => {
  //处于FM页面时禁止上移歌曲详情页
  if (route.name === "personalFmPage"){
    return
  }
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
  axios.get(`/lyric?id=${id}`).then(res => {
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

//点击歌词跳转到指定位置
const toSpecificLyric = (time,index) => {
  lyricSum.value = index+1
  audioRef.value.currentTime = time
  playOrPause(false)
}

//清除当前所有歌曲信息
const clearSongInfo = () => {
  audioRef.value.pause()
  for (let i in song){
    song[i] = null
  }
  lyricSum.value = 0
  commentsOffset = 0
}

//确认是否登出
const checkLogoutAgain = async () => {
  ElMessageBox.confirm(
    '确定注销登录吗?',
    {
      closeOnClickModal:false,
      closeOnPressEscape:false,
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      axios.get(`/logout`).then(res => {
        if (res.data.code === 200){
          Cookies.remove('MUSIC_U')
          Cookies.remove('_remember_me')
          Cookies.remove('_csrf')
          Cookies.remove('UID')
          user.value = undefined
          displayUserInfo.value = false
          location.reload()
        }
      })
      }).catch(() => {
        displayUserInfo.value = false
        ElMessage({
          message:'登出失败',
          type:'error'
        })
      })
}

//鼠标在进度条上按下事件
const mouseDown = (e) => {
  if (audioRef.value.src){
    onBarMark = true
    audioRef.value.currentTime = e.offsetX/600*audioRef.value.duration
    durationBarWidth.value = (audioRef.value.currentTime/audioRef.value.duration)*600
  }
}

//鼠标在进度条上松开事件
const mouseUp = (e) => {
  if (audioRef.value.src) {
    audioRef.value.currentTime = e.offsetX/600*audioRef.value.duration
    playOrPause(false)
    onBarMark = false
    //鼠标从进度条松开时跳转歌词位置
    for(let i in song.lyric){
      if (song.lyric[i].time > audioRef.value.currentTime){
        toSpecificLyric(audioRef.value.currentTime,i-1)
        break
      }
    }
  }
}

//鼠标移动
const mouseMove = (e) => {
  if (onBarMark){
    durationBarWidth.value = e.offsetX
  }
}

//鼠标在音量条内移动
const volumeMouseMove = (e) => {
  if (volumeMouseClick){
    let temp = mousePositionInVolumeBar-e.clientY
    volumeValue.value = (tempVolumeValue+temp)>80?80:tempVolumeValue+temp
    audioRef.value.volume = parseFloat((volumeValue.value/80).toFixed(2))
  }
}

//鼠标在音量条上按下
const volumeMouseDown = (e) => {
  volumeValue.value = e.target.clientHeight - e.offsetY
  audioRef.value.volume = volumeValue.value/80
  tempVolumeValue = volumeValue.value
  mousePositionInVolumeBar = e.clientY
  volumeMouseClick = true
}

//鼠标在音量条上松开
const volumeMouseUp = () => {
  volumeMouseClick = false
}

//鼠标离开音量条
const volumeMouseOut = () => {
  volumeMouseClick = false
}

//是否静音
const isMuted = () => {
  if (audioRef.value.muted){
    audioRef.value.muted = false
    volumeValue.value = tempVolumeBeforeMuted
  }else{
    tempVolumeBeforeMuted = volumeValue.value
    audioRef.value.muted = true
    volumeValue.value = 0
  }
}

//是否显示音量条
const volumeBarVisibleBeforeFunc = () => {
  volumeBarVisible.value = true
  clearTimeout(volumeBarVisibleTimer)
}
const volumeBarVisibleAfterFunc = () => {
  volumeBarVisibleTimer = setTimeout(() => {
    volumeBarVisible.value = false
  },200)
}

//获取评论
const getComments = (id) => {
 axios.get(`/comment/music?id=${id}&limit=30&offset=${commentsOffset}`).then( res => {
    if (res.data.code === 200){
      song.total = res.data.total
      song.hotComments = res.data.hotComments
      if (commentsOffset === 0){
        song.comments = res.data.comments
      }else{
        for (let i in res.data.comments){
          song.comments.push(res.data.comments[i])
        }
      }
      refreshCommentTimer = setTimeout(() => {
        cancel = true
      },1000)
      commentsOffset += 30
    }
 })
}

//歌曲评论懒加载
const infiniteScroll = (e) => {
  if (commentsRef.value.clientHeight - e.scrollTop < 800 && cancel){
    cancel = false
    getComments(song.id)
  }
}

//点赞或取消点赞评论
const  isThumbUpComment = (cid,val) => {
  axios.get(`/comment/like?id=${song.id}&cid=${cid}&t=${val}&type=0`).then(res => {
    if (res.data.code !== 200){
      ElMessage({
        message:'操作失败，请稍后再试',
        type:'error'
      })
    }
  })
}

//回复评论
const openCommentArea = (cid,targetUser) => {
  ElMessageBox.prompt('', `评论@${targetUser}`, {
    confirmButtonText: '发送',
    cancelButtonText: '取消',
  }).then(({value}) => {
    axios.get(`/comment?t=2&type=0&id=${song.id}&commentId=${cid}&content=${value}`).then(res => {
      if (res.data.code !== 200){
        ElMessage({
          message:'发送失败，请稍后再试',
          type:'error'
        })
      }
    })
    ElMessage({
      type: 'success',
      message: `发送成功`,
    })
  })
}

//发送评论
const openCommentAreaToSong = () => {
  ElMessageBox.prompt('', `评论`, {
    confirmButtonText: '发送',
    cancelButtonText: '取消',
  }).then(({value}) => {
    axios.get(`/comment?t=2&type=0&id=${song.id}&content=${value}`).then(res => {
      if (res.data.code !== 200){
        ElMessage({
          message:'发送失败，请稍后再试',
          type:'error'
        })
      }
    })
    ElMessage({
      type: 'success',
      message: `发送成功`,
    })
  })
}

//每日签到
const dailySignin = () => {
  if (Cookies.get("signed")){
    ElMessage({
      message:"今天已经签到过了哟",
      type:'success'
    })
    return
  }
  axios.get(`/daily_signin`).then(res => {
    if (res.data.code === 200){
      Cookies.set('signed','1',{
        expires:new Date(new Date(new Date().toLocaleDateString()).getTime() +24 * 60 * 60 * 1000 -1)
      })
    }
  })
}

//返回首页
const toHome = () => {
  router.push('/')
  movingWindowDown()
  preparedSongListRight.value = -400
}

//跳转至编辑用户界面
const toUserInfoPage = () => {
  if (!user.value)
    return
  router.push("/userInfoPage")
}

//监听输入框值，返回建议结果
watch(() => inputVal.value,(newVal) => {
      if (newVal !== ''){
        clearInterval(suggestionTimer)
        suggestionTimer = setTimeout(() => {
          searchSuggestion(newVal)
          clearInterval(suggestionTimer)
        },300)
      }else {
        suggestionTimer = setTimeout(() => {
          for (let i in songSuggestionList){
            // eslint-disable-next-line no-unused-vars
            i = undefined
          }
          resultListIsVisible.value = false
        },300)
      }
    })

//获取到歌词后和当前播放进度对比，动态改变当前歌词位置
watch(() => song.lyric,(next) => {
  if (next){
    lyricSum.value = 0
    let a = 0
      for(let i of song.lyric){
        if (i.time > audioRef.value.currentTime){
          lyricSum.value = a
          break
        }
        ++a
    }
  }
})

//获取评论
watch(() => songMovingWindowTop.value,(next) => {
  if (next === 70){
    getComments(song.id)
  }
})

onMounted(() => {
  getUserProfile()

  addEventListener('mouseup',() => {
    if (onBarMark){
      onBarMark = false
    }
  })


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
    songTimeChange.value = audioRef.value.currentTime
    //进度条和进度点变化
    if (!onBarMark){
      durationBarWidth.value = (audioRef.value.currentTime/audioRef.value.duration)*600
    }
    //歌词滚动
    try {
        if (song.lyric && audioRef.value.currentTime - song.lyric[lyricSum.value].time <= 1 && audioRef.value.currentTime - song.lyric[lyricSum.value].time >= -0.2){
          if (song.lyric[lyricSum.value].content && lyricContent){
            let list = lyricContent.value.children
            lyricContentWrap.value.setScrollTop(list[lyricSum.value].offsetTop-list[lyricSum.value].clientHeight/2-80)
          }
          lyricSum.value = lyricSum.value <= song.lyric.length-1?++lyricSum.value:song.lyric.length-1
      }
    }catch(err){
      console.log(err)
    }
  }

  // 当前数据可以触发
  audioRef.value.oncanplay = () => {
  }
  // 音频播放完毕
  audioRef.value.onended = () => {
    fmIsEnded.value = song.id
    if (!preparedSongList.value){
      playOrPause(true)
      return
    }
    playOrPause(true)
    playSong(preparedSongList.value[++presentSongIndexInPreparedList].id)
  }
  // 错误
  audioRef.value.onerror = () => {
  }
})

onUnmounted(()=>{
  clearInterval(suggestionTimer)
  clearTimeout(refreshCommentTimer)
})
</script>

<style>
@import "assets/css/app.css";
</style>
