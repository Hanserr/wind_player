<template>
  <div id="app">
    <div class="playerPage">

<!--      左侧导航栏-->
      <div class="playerPageLeft">

          <div class="navigation1">
            <div class="navigationMain-profile">
              <el-avatar class="navigationMain-profile-avatar" :size="50" :src="user.avatarUrl"></el-avatar>
            </div>

            <a @click = "popVisible = true" id="navigation-login" v-if="user.nickname === undefined">登录</a>
            <p v-if="user.nickname !== undefined" id="navigation-nickname">{{user.nickname}}</p>
            <!--    登录模块-->
            <login-module :visible="popVisible" @changeVisible="closePop"></login-module>
          </div>

      </div>

<!--      顶部搜索栏-->
      <div class="playerPageTop">
        <div class="topBar-search">
          <input class="topBar-searchInput" v-model="inputVal" @focus="searchInpFocus(inputVal)">
          <el-icon color="#8896B3FF" class="topBar-search-el-icon" style="width: 30px;height: 27px;position:absolute;" @click="getSearch(inputVal)">
            <Search/>
          </el-icon>
        </div>
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
          <div class="playerBar-audioContent-progressBar">

          </div>
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

const baseUrl = "https://netease-cloud-music-api-beta-lime.vercel.app"
let inputVal = ref('')
let songSuggestionList = reactive({})
let suggestionTimer = null
let popVisible = ref(false)
let user = reactive({})
let resultListIsVisible = ref(false)
let isPlay = ref(false)
let song = reactive({
  src:null,
  cover:null,
  artist:null,
  album:null,
  duration:null,
  currentTime:null
})
const audioRef = ref(null)
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

//获取到歌曲id后再获取歌曲地址
const playSong = (e) => {
  axios.get(`${baseUrl}/song/url?id=${e}`).then(res => {
    if (res.data.code === 200){
      console.log(res.data.data[0].url)
      song.src = res.data.data[0].url
    }
  })
}
//监听到子组件传来的值
watch(
    () => popVisible.value,(next) => {
      popVisible.value = next
      getUserProfile()
    }
)

//监听输入框值，返回建议结果
watch(
    () => inputVal.value,(newVal) => {
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
    }
)

//从sessionstorage中获取用户信息
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

const getSearch = (val) => {
  if (val !== ''){
    resultListIsVisible.value = false
    router.push(`/searchResultPage/${val}`)
  }
}

onMounted(() => {
  getUserProfile()
})

onUnmounted(()=>{
  clearInterval(suggestionTimer)
})
</script>

<style>
@import "assets/css/app.css";
</style>
