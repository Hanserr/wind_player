<template>
  <div id="main">
    <audio ref="audioRef" :src="songStore.getCurSong().value.src || null" style="display: none"/>
    <div class="playerPage">

      <!--      左侧导航栏-->
      <div class="playerPageLeft">
        <navigation-bar></navigation-bar>
      </div>
      <!--      顶部搜索栏-->
      <div class="playerPageTop" :style="{backgroundColor:playerPageTopBC}">
        <svg-icon name="logoIcon" style="width: 50px;height: 50px;margin-left: 10px;margin-top: 10px;cursor:pointer;" @click="toHome"></svg-icon>
        <!--        搜索框-->
        <div class="topBar-search">
          <input class="topBar-searchInput" v-model="inputVal" @focus="searchInpFocus(inputVal)" :style="{backgroundColor: topSearchBarBC}">
          <el-icon color="#8896B3FF" class="topBar-search-el-icon" :style="{width: '30px',height: '27px',position:'absolute',backgroundColor:topSearchBarBC}" @click="getSearch(inputVal)">
            <Search/>
          </el-icon>
        </div>
        <!--        建议列表-->
        <div class="topBar-list" v-show="inputVal.length != 0 || resultListIsVisible">
          <el-scrollbar max-height="400px" class="topBar-list-main">
            <!--      歌曲-->
            <div class="topBar-list-main-title" v-show="songSuggestionList.artists !== undefined">
              <svg-icon name="song" style="width: 19px"></svg-icon>
              <p>单曲</p>
            </div>
            <p v-for="item in songSuggestionList.songs" :key="item" class="scrollbar-demo-item" @click="songStore.updateCurSong(item.id);resultListIsVisible = false">
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
            <p v-for="item in songSuggestionList.albums" :key="item" class="scrollbar-demo-item" @click="$router.push(`/albumDetail/songlistPage/${item.id}`);resultListIsVisible = false">
              {{item.name}}
              <span v-for="(i,index) in item.artists" :key="index">{{i.name+" "}}</span>
            </p>
            <!--      歌单-->
            <div class="topBar-list-main-title" v-show="songSuggestionList.playlists !== undefined">
              <svg-icon name="list" style="width: 20px"></svg-icon>
              <p>歌单</p>
            </div>
            <p v-for="item in songSuggestionList.playlists" :key="item" class="scrollbar-demo-item" @click="toSongListPage(item.id);resultListIsVisible = false">
              {{item.name}}
              <span v-for="(i,index) in item.artists" :key="index">{{i.name+" "}}</span>
            </p>
          </el-scrollbar>
        </div>

        <!--        用户登录-->
        <div class="userProfile">
          <div class="topBar-profile">
            <el-avatar class="topBar-profile-avatar" :size="35" :src="user?user.avatarUrl:''" @click="userStore.getLoginStatus().value?pushingTools.toCreation(0):0"></el-avatar>
          </div>
          <a @click = "popVisible = true" id="topBar-login" v-if="!userStore.getLoginStatus().value">登录</a>
          <p v-if="userStore.getLoginStatus().value" id="topBar-nickname" @click="displayUserInfo = !displayUserInfo">{{userStore.getUserInfo().value.nickname}}</p>
          <div class="topBar-profile-popWindow" v-show="displayUserInfo">
            <div class="topBar-profile-popWindow-numberArea">
              <span v-if="userStore.getUserInfo()" class="topBar-profile-popWindow-numberArea-p1">{{userStore.getUserInfo().value.eventCount}}</span>
              <span class="topBar-profile-popWindow-numberArea-p2">动态</span>
            </div>
            <div class="topBar-profile-popWindow-numberArea">
              <span v-if="userStore.getUserInfo()" class="topBar-profile-popWindow-numberArea-p1">{{userStore.getUserInfo().value.follows}}</span>
              <span class="topBar-profile-popWindow-numberArea-p2">关注</span>
            </div>
            <div class="topBar-profile-popWindow-numberArea">
              <span v-if="userStore.getUserInfo()" class="topBar-profile-popWindow-numberArea-p1">{{userStore.getUserInfo().value.follower}}</span>
              <span class="topBar-profile-popWindow-numberArea-p2">粉丝</span>
            </div>
            <div class="topBar-profile-popWindow-bottomDiv">
              我的会员
              <svg-icon name="arrowsRight" class="topBar-profile-popWindow-svg"></svg-icon>
            </div>
            <div class="topBar-profile-popWindow-bottomDiv">
              等级
              <svg-icon name="arrowsRight" class="topBar-profile-popWindow-svg"></svg-icon>
            </div>
            <div class="topBar-profile-popWindow-bottomDiv" @click="router.push('/settings')">
              设置
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
            :inPlay="songStore.getCurSong().value.src"
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

        <!--        左侧歌曲封面及歌手-->
        <div class="playerBar-left" v-if="songStore">
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
              <svg-icon name="music" id="music-icon" v-show="!songStore.getCurSong().value.cover"></svg-icon>
              <img :src="songStore.getCurSong().value.cover" v-if="songStore.getCurSong().value.cover" @mouseenter="coverVisible = true" @mouseleave="coverVisible = false" alt="">
              <p id="playerBar-left-name">{{songStore.getCurSong().value.name}}</p>
              <div id="playBar-left-ar-wrap">
                <p id="playBar-left-ar" v-for="i in songStore.getCurSong().value.artist" :key="i">{{i.name}}&nbsp;&nbsp;</p>
              </div>
            </div>
          </div>
        </div>

        <div class="playerBar-audioContent" v-if="songStore">
          <div class="playerBar-audioContent-panel">
            <svg-icon name="previous" style="margin-left: 290px;cursor: pointer" @click="previousSong"></svg-icon>
            <svg-icon name="pause" style="margin-left: 20px;cursor: pointer" @click="playOrPause(isPlay)" v-show="isPlay"></svg-icon>
            <svg-icon name="play" style="margin-left: 20px;cursor: pointer" @click="playOrPause(isPlay)" v-show="!isPlay"></svg-icon>
            <svg-icon name="next" style="margin-left: 20px;cursor: pointer"  @click="nextSong"></svg-icon>
          </div>
          <p>{{formatTime(songStore.shareAudio?.currentTime)}}</p>
          <div class="playerBar-audioContent-progressBar">
            <div class="playerBar-audioContent-progressBar-wrap" @mousedown="mouseDown" @mouseup="mouseUp" @mousemove="mouseMove">
              <div class="playerBar-audioContent-progressBar-durationBar" :style="{width:durationBarWidth+'px'}"></div>
            </div>
          </div>
          <p>{{formatTime(songStore.shareAudio?.duration)}}</p>
        </div>
        <svg-icon name="volume" id="volumeIcon" v-show="!audioRef?.muted" @click="isMuted" @mouseover="volumeBarVisibleBeforeFunc" @mouseleave="volumeBarVisibleAfterFunc"></svg-icon>
        <svg-icon name="muted" id="volumeIcon" v-show="audioRef?.muted" @click="isMuted" @mouseover="volumeBarVisibleBeforeFunc" @mouseleave="volumeBarVisibleAfterFunc"></svg-icon>
        <div id="volumeIconBody" v-show="volumeBarVisible" @mouseover="volumeBarVisibleBeforeFunc" @mouseleave="volumeBarVisibleAfterFunc">
          <div id="volumeIconBodyContainer" @mousemove="volumeMouseMove" @mousedown="volumeMouseDown" @mouseup="volumeMouseUp" @mouseleave="volumeMouseOut">
            <div id="volumeIconBodyBar" :style="{height: volumeValue+'px'}"></div>
          </div>
        </div>
        <svg-icon name="playlistHeart" id="playlistIcon" @click="preparedSongListRight = preparedSongListRight===0?-400:0"></svg-icon>
        <!--      待播放歌曲列表-->
        <div id="preparedSongList" :style="{right:preparedSongListRight+'px'}">
          <div id="preparedSLTop">
            <span>待播放</span>
            <span>共{{songStore.getSongList().value.length !== 0?songStore.getSongList().value.length:"0"}}首音乐</span>
            <span @click="songStore.cleatSongList()">清空列表</span>
          </div>
          <div id="cutOff"></div>
          <div id="preparedSLBottom">
            <el-scrollbar height="359px">
              <div class="preparedSongContent"
                   v-for="(i, index) in songStore.getSongList().value"
                   :key="i"
                   @dblclick="songStore.updateCurSong(i.al.id)">
                <div>
                  <span :style="{color:index == songStore.getCurIndexInList().value?'#EC4141':'#ffffff'}">{{i.name}}</span>
                </div>
                <div>
                  <span v-for="ar in i.ar" :key="ar">{{ar.name}}</span>
                </div>
                <div>
                  <span>{{format.durationFormat(i.dt)}}</span>
                </div>
              </div>
            </el-scrollbar>
          </div>
        </div>
      </div>

      <!--        歌曲详情页-->
      <div class="songMovingWindow" :style="{top:songMovingWindowTop+'px'}" v-if="songStore">
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
                <img :src="songStore.getCurSong().value.cover" id="vinyl-cover" v-if="songStore.getCurSong().value.cover" alt="">
                <img src="./assets/pics/pan.webp" id="vinyl" alt="">
              </div>
            </div>

            <div class="songMovingWindow-top-middle" v-if="songStore.getCurSong().value.artist&&songStore.getCurSong().value.album&&songStore.getCurSong().value.lyric">
              <div class="songMovingWindow-top-middle-header">
                <p id="songName">{{songStore.getCurSong().value.name}}</p>
                <div class="songMovingWindow-top-middle-header-ar">
                  <p v-for="i in songStore.getCurSong().value.artist" :key="i">{{i.name}}&nbsp;</p>
                  <p>{{songStore.getCurSong().value.album === null?'':'- '+songStore.getCurSong().value.album.name}}</p>
                </div>
              </div>
              <div class="songMovingWindow-top-middle-lyric">
                <el-scrollbar height="280px" ref="lyricContentWrap">
                  <ul class="lyricContent" ref="lyricContent">
                    <li v-for="(i,index) in songStore.getCurSong().value.lyric" :key="i" :style="{color:index+1 === lyricIndex?'#FFFFFF':'#606266'}" @click="toSpecificLyric(i.time,index)">{{i.content}}{{i.tlyric===null?"":i.tlyric}}</li>
                  </ul>
                </el-scrollbar>
              </div>
            </div>
          </div>

          <!--          底部评论区-->
          <div
              v-loading="true"
              id="loadingCover"
              element-loading-text="评论加载中···"
              element-loading-background="transparent"
              v-if="!songStore.getCurSong().value.total">
          </div>
          <div class="songMovingWindow-bottom" ref="commentsRef">
            <span id="allCommentsTitle" v-if="songStore.getCurSong().value.total">全部评论({{songStore.getCurSong().value.total}})</span>

            <div class="songHotCommentsContent" v-for="i in songStore.getCurSong().value.hotComments" :key="i">
              <img :src="i.user.avatarUrl" alt="" class="commentsUserAvatar" @click="toUserInfoPage(i.user.userId)">
              <div class="songCommentContentTop">
                <span class="commentsUserName">{{i.user.nickname}}:</span>
                <span class="commentsContent">{{i.content}}</span>
                <div class="parentComment" v-if="i.beReplied.length > 0" >
                  <span>@{{i.beReplied[0].user.nickname}}:</span>
                  <span>{{i.beReplied[0].content}}</span>
                </div>
              </div>
              <div class="songCommentContentBottom">
                <span class="commentsPublishTime">{{format.commentTimeFormat(i.time)}}</span>
                <svg-icon name="thumbUp" class="thumbupComment" v-if="i.liked" @click="i.liked = false;--i.likedCount;isThumbUpComment(i.commentId,1)"></svg-icon>
                <svg-icon name="unThumbUp" class="thumbupComment" v-if="!i.liked" @click="i.liked = true;++i.likedCount;isThumbUpComment(i.commentId,0)"></svg-icon>
                <span class="commentsThumbUpCount">{{i.likedCount}}</span>
                <svg-icon name="sendCommentToSomeone" class="sendCommentToSomeone" @click="openCommentArea(i.commentId,i.user.nickname)"></svg-icon>
              </div>
              <div class="commentDivider"></div>
            </div>

            <button id="checkMoreHotCommentsButton" v-show="songStore.getCurSong().value.total">更多精彩评论</button>
            <div class="songCommentContent" v-for="i in songStore.getCurSong().value.comments" :key="i">
              <img :src="i.user.avatarUrl" alt="" class="commentsUserAvatar" @click="toUserInfoPage(i.user.userId)">
              <div class="songCommentContentTop">
                <span class="commentsUserName">{{i.user.nickname}}:</span>
                <span class="commentsContent">{{i.content}}</span>
                <div class="parentComment" v-if="i.beReplied.length > 0" >
                  <span>@{{i.beReplied[0].user.nickname}}:</span>
                  <span>{{i.beReplied[0].content}}</span>
                </div>
              </div>

              <div class="songCommentContentBottom">
                <span class="commentsPublishTime">{{format.commentTimeFormat(i.time)}}</span>
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
import {onMounted, onUnmounted, reactive, ref, unref, watch} from "vue";
import {Search} from "@element-plus/icons-vue";
import axios from "axios";
import SvgIcon from "@/components/SvgIcon";
import LoginModule from "./components/topComponents/loginModule";
import {router} from "@/router/routes";
import {ElMessage, ElMessageBox} from "element-plus";
import NavigationBar from "@/components/navigationComponents/navigationBar";
import {useRoute} from "vue-router";
import {useUserStore} from "@/store/userStore";
import {useSongStore} from "@/store/songStore";
import format from "@/tools/format";
import api from "./tools/apiCollection";
import pushingTools from "@/tools/pushingTools";

const userStore = useUserStore();
const songStore = useSongStore();
const route = useRoute()
const audioRef = ref() //播放器DOM
let inputVal = ref('') //顶部搜索框变量
let songSuggestionList = reactive({}) //建议歌单列表
let suggestionTimer = null //建议歌单列表的定时器
let popVisible = ref(false) //登录弹窗是否可见
let user = userStore.getUserInfo()//用户信息
let displayUserInfo = ref(false) //展示用户部分信息（vip时间，注销···）弹窗
let resultListIsVisible = ref(false) //建议歌单是否可见
let isPlay = ref(false) //是否播放中
let playerTimer = null //播放器载入新歌曲地址后的定时器
let durationBarWidth = ref(0) //进度条宽度
let coverVisible = ref(false) //歌曲遮罩
let songMovingWindowTop = ref(520) //520歌曲详情弹窗上距
let playBarLeft = ref(-60) //底部歌曲小页面上下移动距离
let playerPageTopBC = ref() //顶部搜索栏背景色
let topSearchBarBC = ref('#2b2b2b') //顶部搜索框背景色
let headerRotate = ref('rotate(0deg)') //磁头角度
let panRotateState = ref('paused') //盘片是否旋转
let lyricIndex = ref(0) //当前歌词下标
let lyricContent = ref(null) //歌词外层包裹
let lyricContentWrap = ref(null) //el-scrollBar
let onBarMark = false //鼠标是否在进度条上点击
let volumeValue = ref(80) //音量
let tempVolumeValue = 0 //临时音量
let tempVolumeBeforeMuted = 0 //静音前临时保存音量值
let mousePositionInVolumeBar = 0 //鼠标在音量条内点击的初始位置
let volumeMouseClick = false //鼠标在音量条内是否按下
let volumeBarVisible = ref(false) //音量条是否显示
let volumeBarVisibleTimer = null //音量条是否可见定时器
let preparedSongListRight = ref(-400) //待播放列表位置
let commentsOffset = 0 //评论分页偏移量
let commentsRef = ref(null)//歌曲详情页ref
let refreshCommentTimer = null //评论刷新定时器
let cancel = true //评论懒加载间隔时间段
let elInfiniteScroll = ref(null) //懒加载滚动条
let fmIsEnded = ref(false) //当前fm是否已播放完毕

//路由守卫
router.beforeEach((to) => {
  resultListIsVisible.value = false
  return !(to.name === 'songListDetailPage' && to.params.songListId === undefined);
})

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
  if (!val){
    resultListIsVisible.value = true
  }
}

//获取用户可能搜索的结果
const searchSuggestion = (val) => {
  axios.get(`${api.GET_SUGGEST_SEARCH}?keywords=${val}`).then(res => {
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
  if(val) {
    songStore.shareAudio.pause()
  } else {
    songStore.shareAudio.play()
  }
  isPlay.value = !val
  headerPosition(val)
}

const playSong = () => {
  if(songStore.shareAudio){
    playerTimer = setTimeout(() => {
      playOrPause(false)
    },150)
    elInfiniteScroll.value.setScrollTop = 0
  }
}

//播放上一首
const previousSong = () => {
  if (route.path==='personalFm' || !songStore.getSongList().value){
    return
  }
  playSong()
  if (songStore.getCurIndexInList().value == 0){
    songStore.updateCurSong(songStore.getSongList().value[songStore.getSongList().value.length-1].id)
  } else {
    songStore.updateIndexInList(songStore.getCurIndexInList().value - 1)
    songStore.updateCurSong(songStore.getSongList().value[songStore.getCurIndexInList().value].id)
  }
}

//播放下一首
const nextSong = () => {
  if (route.path==='personalFm' || !songStore.getSongList().value){
    return
  }
  playSong()
  if (songStore.getCurIndexInList().value >= songStore.getSongList().value.length-1){
    songStore.updateCurSong(songStore.getSongList().value[0].id)
  } else {
    songStore.updateIndexInList(songStore.getCurIndexInList().value + 1)
    songStore.updateCurSong(songStore.getSongList().value[songStore.getCurIndexInList().value].id)
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

//黑胶唱片磁头位置和盘片旋转
const headerPosition = (val) => {
  if (val){
    headerRotate.value = 'rotate(-20deg)'
    panRotateState.value = 'paused'
  }else{
    headerRotate.value = 'rotate(0deg)'
    panRotateState.value = 'running'
  }
}

//点击歌词跳转到指定位置
const toSpecificLyric = (time,index) => {
  lyricIndex.value = index+1
  songStore.shareAudio.currentTime = time
  playOrPause(false)
}

//清除当前所有歌曲信息
const clearSongInfo = () => {
  songStore.shareAudio.pause()
  songStore.clearCurSong()
  lyricIndex.value = 0
  commentsOffset = 0
}

//确认是否登出
const checkLogoutAgain = () => {
  ElMessageBox.confirm(
      '确定注销登录吗?',
      {
        closeOnClickModal:false,
        closeOnPressEscape:false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
    axios.get(api.LOGOUT).then(res => {
      if (res.data.code === 200){
        userStore.clearUserInfo()
        user.value = userStore.getUserInfo().value
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
  if (songStore.shareAudio.src){
    onBarMark = true
    songStore.shareAudio.currentTime = e.offsetX/600*songStore.shareAudio.duration
    durationBarWidth.value = (songStore.shareAudio.currentTime/songStore.shareAudio.duration)*600
  }
}

//鼠标在进度条上松开事件
const mouseUp = (e) => {
  if (songStore.shareAudio.src) {
    songStore.shareAudio.currentTime = e.offsetX/600*songStore.shareAudio.duration
    playOrPause(false)
    onBarMark = false
    //鼠标从进度条松开时跳转歌词位置
    for(let i in songStore.getCurSong().value.lyric){
      if (songStore.getCurSong().value.lyric[i].time > songStore.shareAudio.currentTime){
        toSpecificLyric(songStore.shareAudio.currentTime,i-1)
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
    songStore.shareAudio.volume = parseFloat((volumeValue.value/80).toFixed(2))
  }
}

//鼠标在音量条上按下
const volumeMouseDown = (e) => {
  volumeValue.value = e.target.clientHeight - e.offsetY
  songStore.shareAudio.volume = volumeValue.value/80
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
  if (songStore.shareAudio.muted){
    songStore.shareAudio.muted = false
    volumeValue.value = tempVolumeBeforeMuted
  }else{
    tempVolumeBeforeMuted = volumeValue.value
    songStore.shareAudio.muted = true
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
  axios.get(`${api.GET_SONG_COMMENT}?id=${id}&limit=30&offset=${commentsOffset}`).then( res => {
    if (res.data.code === 200){
      songStore.getCurSong().value.total = res.data.total
      songStore.getCurSong().value.hotComments = res.data.hotComments
      if (commentsOffset === 0){
        songStore.getCurSong().value.comments = res.data.comments
      }else{
        for (let i in res.data.comments){
          songStore.getCurSong().value.comments.push(res.data.comments[i])
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
    getComments(songStore.getCurSong().value.id)
  }
}

//点赞或取消点赞评论
const  isThumbUpComment = (cid,val) => {
  axios.get(`${api.LIKE_COMMENT}?id=${songStore.getCurSong().id}&cid=${cid}&t=${val}&type=0`).then(res => {
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
    if (!value){
      ElMessage({
        message: '评论不能为空',
        type: "warning"
      })
      return
    }
    axios.get(`${api.COMMENT_SONG}?t=2&type=0&id=${songStore.getCurSong().value.id}&commentId=${cid}&content=${value}`).then(res => {
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
    axios.get(`${api.COMMENT_SONG}?t=2&type=0&id=${songStore.getCurSong().value.id}&content=${value}`).then(res => {
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

//跳转到歌单详情页
const toSongListPage = (id) => {
  router.push({
    name:'songListDetailPage',
    params:{
      songListId:id
    }
  })
}

//返回首页
const toHome = () => {
  router.push('/')
  movingWindowDown()
  preparedSongListRight.value = -400
}

//歌曲播放中
const playingChange = () => {
  //进度条和进度点变化
  if (!onBarMark){
    durationBarWidth.value = (songStore.shareAudio.currentTime/songStore.shareAudio.duration)*600
  }
  //歌词滚动
  try {
    if (songStore.getCurSong().value.lyric && songStore.shareAudio.currentTime - songStore.getCurSong().value.lyric[lyricIndex.value]?.time <= 1 && songStore.shareAudio.currentTime - songStore.getCurSong().value.lyric[lyricIndex.value]?.time >= -0.2){
      if (songStore.getCurSong().value.lyric[lyricIndex.value].content && lyricContent){
        let list = lyricContent.value.children
        lyricContentWrap.value.setScrollTop(list[lyricIndex.value].offsetTop-list[lyricIndex.value].clientHeight/2-80)
      }
      lyricIndex.value = lyricIndex.value <= songStore.getCurSong().value.lyric.length-1?++lyricIndex.value:songStore.getCurSong().value.lyric.length-1
    }
  }catch(err){
    console.log(err)
  }
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

//获取到歌词后和当前播放进度对比，动态改变当前歌词位置 有问题
watch(() => songStore.getCurSong().value.lyric,(next) => {
  if (next != null){
    lyricIndex.value = 0
    let a = 0
    for(let i of songStore.getCurSong().value.lyric){
      if (i.time > songStore.shareAudio.currentTime){
        lyricIndex.value = a
        break
      }
      ++a
    }
  }
},{
  deep: true
})

//动态获取当前歌曲信息
watch(() => songStore.songHasLoaded, (n) => {
  playSong()
},{
  deep: true
})

//获取评论
watch(() => songMovingWindowTop.value,(next) => {
  if (next === 70){
    getComments(songStore.getCurSong().value.id)
  }
})

onMounted(() => {
  songStore.initAudio(audioRef.value)
  if (!userStore.getLoginStatus().value){
    userStore.updateUserInfo()
  }
  addEventListener('mouseup',() => {
    if (onBarMark){
      onBarMark = false
    }
  })

  //播放时间变化
  songStore.shareAudio.ontimeupdate = () => {
    playingChange()
  }

  // 音频播放完毕
  songStore.shareAudio.onended = () => {
    fmIsEnded.value = songStore.getCurSong().value.id
    if (!songStore.getSongList().value){
      return
    }
    playOrPause(true)
    if(songStore.getSongList().value && (songStore.getCurIndexInList().value < songStore.getSongList().value.length - 1)) {
      songStore.updateIndexInList(songStore.getCurIndexInList().value + 1)
      songStore.updateCurSong(songStore.getSongList().value[songStore.getCurIndexInList().value].id)
    }
  }
})

onUnmounted(() => {
  clearInterval(suggestionTimer)
  clearTimeout(refreshCommentTimer)
})
</script>

<style>
@import "assets/css/app.css";
</style>
