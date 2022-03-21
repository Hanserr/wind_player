<template>
<div class="searchResultPage">
  <el-scrollbar height="500px" @click="closeList()">
    <div class="searchResultPage-resultList" v-for="(song,index) in resultList.songs" :key="index">
      <p style="margin-left: 30px">{{(index+1).toString().length === 1?0+""+(index+1):index+1}}{{"&nbsp;&nbsp;&nbsp;&nbsp;"+song.name}}</p>
    </div>
  </el-scrollbar>
</div>
</template>

<script setup>
import axios from "axios";
import {onMounted, reactive, watch} from "vue";
import {useRoute} from "vue-router"

const baseUrl = "https://netease-cloud-music-api-beta-lime.vercel.app"
const route = useRoute()
let resultList = reactive({})

// eslint-disable-next-line no-undef
const emits = defineEmits(["closeResultList"])
const closeList = () => {
  resultList = undefined
  emits('closeResultList',false)
}

const getResult = (val) => {
  axios.get(`${baseUrl}/cloudsearch?keywords=${val}&limit=50`).then(res => {
    if (res.data.code === 200){
      resultList.songs = res.data.result.songs
    }
    console.log(res.data.result.songs)
  })
}

//监听用户搜索数据的变化
watch(
    () => route.params.inp,(next) => {
      if (next !== ''){
        getResult(route.params.inp)
      }
    }
)
onMounted(() => {
  getResult(route.params.inp)
})
</script>

<style scoped>
@import "../../assets/css/rightModulesCss/searchResultPage.css";
</style>