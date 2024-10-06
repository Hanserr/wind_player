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
import api from "@/tools/apiCollection";
import {useSongStore} from "@/store/songStore";

const route = useRoute()
const songStore = useSongStore()
let resultList = reactive({})
let loading = ref(false)
let resultListHeight = ref(100)
let offset = ref(0)
let mark = ref(true)
let markTimer = null
let resultTimeCounter = 0
const emits = defineEmits(["closeResultList"])

//点击歌单区域关闭搜索建议
const closeList = () => {
  emits('closeResultList',false)
}
//把歌曲id传给父元素
const playSong = (id) => {
  songStore.updateCurSong(id)
}

//获取搜索结果
const getResult = (val) => {
  offset.value = 0
  loading.value = true
  axios.get(`${api.SEARCH}?keywords=${val}&limit=50&offset=${offset.value}`).then(res => {
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
    axios.get(`${api.SEARCH}?keywords=${route.params.inp}&limit=50&offset=${offset.value}`).then(res => {
      if(res.data.code === 200){
        resultTimeCounter++
        resultListHeight.value = resultList.songs.length>17?10+(resultList.songs.length-16)*30:10
        for (let item of res.data.result.songs){
          resultList.songs.push(item)
        }
      }
    })
  }
}

//监听用户搜索数据的变化
watch(
    () => route.params.inp,(next) => {
      if (next){
        getResult(next)
      }
    })

watch(
    () => mark.value, (next) => {
      if (!next){
        markTimer = setTimeout(() => {
          mark.value = true
          clearTimeout(markTimer)
        },1000)
      }
})

onMounted(() => {
  closeList()
  //由于生命周期的原因第一次跳转时需要在onMounted内获取值
  if (route.params.id){
    getResult(route.params.id)
  }
})
onUnmounted(() => {
  clearTimeout(markTimer)
})
</script>

<style scoped>
@import "../../assets/css/rightComponentsCss/searchResultPage.css";
</style>
