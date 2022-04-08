<template>
<div class="searchResultPage"
     v-loading="loading"
     element-loading-text="搜索ing···"
     element-loading-background="rgba(0, 0, 0, 0.8)">
  <div class="searchResultPage-title">
    <p>音乐标题</p>
    <p>歌手</p>
    <p>专辑</p>
  </div>
  <el-scrollbar max-height="400px" @click="closeList()" @scroll="infiniteScroll">
    <div class="searchResultPage-resultList" v-for="(song,index) in resultList.songs" :key="index" @dblclick="playSong(song)">

      <div class="searchResultPage-resultList-name">
        <p>{{(index+1).toString().length === 1?"0"+(index+1):index+1}}&nbsp;&nbsp;&nbsp;&nbsp;{{song.name}}</p>
      </div>

      <div class="searchResultPage-resultList-artist">
        <p v-for="(ar,index) in song.ar" :key="index" style="margin-left: 5px">{{ar.name}}</p>
      </div>

      <div class="searchResultPage-resultList-album">
        <p>{{song.al.name}}</p>
      </div>

    </div>
  </el-scrollbar>
</div>
</template>

<script setup>
import axios from "axios";
import {onMounted, onUnmounted, reactive, ref, watch} from "vue";
import {useRoute} from "vue-router"

const baseUrl = "https://netease-cloud-music-api-beta-lime.vercel.app"
const route = useRoute()
let resultList = reactive({})
let loading = ref(false)
let resultListHeight = ref(100)
let offset = ref(0)
let mark = ref(true)
let markTimer = null
let resultTimeCounter = 0
// eslint-disable-next-line no-undef
const emits = defineEmits(["closeResultList","songID"])

//点击歌单区域关闭搜索建议
const closeList = () => {
  emits('closeResultList',false)
}
//把歌曲id传给父元素
const playSong = (detail) => {
  emits('songID',detail)
}

//获取搜索结果
const getResult = (val) => {
  offset.value = 0
  loading.value = true
  axios.get(`${baseUrl}/cloudsearch?keywords=${val}&limit=50&offset=${offset.value}`).then(res => {
    if (res.data.code === 200){
      resultTimeCounter = 0
      resultList.songs = res.data.result.songs
      resultListHeight.value = resultList.songs.length>17?10+(resultList.songs.length-16)*30:10
      loading.value = false
    }
  })
}

//懒加载
const infiniteScroll = (e) => {
  if (resultListHeight.value - e.scrollTop <= 150 && mark.value && resultTimeCounter <=3){
    offset.value++
    mark.value = false
    axios.get(`${baseUrl}/cloudsearch?keywords=${route.params.inp}&limit=50&offset=${offset.value}`).then(res => {
      if(res.data.code === 200){
        resultTimeCounter++
        resultListHeight.value = resultList.songs.length>17?10+(resultList.songs.length-16)*30:10
        for (let item in res.data.result.songs){
          resultList.songs.push(res.data.result.songs[item])
        }
      }
    })
  }
}

//监听用户搜索数据的变化
watch(
    () => route.params.inp,(next) => {
      if (next !== ''){
        getResult(route.params.inp)
      }
    }
)
watch(
    () => mark.value, (next) => {
      if (!next){
        markTimer = setTimeout(() => {
          mark.value = true
          clearTimeout(markTimer)
        },1000)
      }
}
)
onMounted(() => {
  closeList()
})
onUnmounted(() => {
  clearTimeout(markTimer)
})
</script>

<style scoped>
@import "../../assets/css/rightComponentsCss/searchResultPage.css";
</style>