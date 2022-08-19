<template>
<div class="editSongListInfo"
     v-loading="loading"
     element-loading-background="rgba(0, 0, 0, 0.8)">
  <div class="leftContent">
    <p>编辑歌单信息</p>
    <span>歌单名:</span>
    <input type="text" id="listNameInp" v-model="songList.name">
    <br>
    <span id="songListInfoDesc">简&emsp;介:</span>
    <textarea id="SongListInfoDescription" rows="7" v-model="songList.description"></textarea>
    <br>
    <button @click="alterSongListInfo" id="preserveBtn">保存</button>
    <button @click="$router.go(-1)" id="cancelBtn">取消</button>
  </div>
  <div class="rightContent">
    <el-upload
        action=""
        class="songListCover-uploader"
        :show-file-list="false"
        :http-request="alterSongListCover">
      <img v-if="songList.cover" :src="songList.cover" class="cover"/>
      <el-icon v-else class="songListCover-uploader-icon"><Plus/></el-icon>
      <div class="songListCover-cover" v-show="showUploadingProgress"></div>
      <el-progress type="circle" :percentage="uploadingProgress" v-show="showUploadingProgress"/>
    </el-upload>
  </div>
</div>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import {ElMessage} from "element-plus";
import axios from "axios";
import {useRoute} from "vue-router";
import { Plus } from '@element-plus/icons-vue';

const route = useRoute()

let songList = reactive({
  id:null,
  name:null,
  description:null,
  cover:null,
  label:null
})
let showUploadingProgress = ref(false) //上传进度条
let uploadingProgress = ref(0) //上传进度
let loading = ref(false)

//获取歌单信息
const getSongListInfo = (id) => {
  axios.get(`/playlist/detail?id=${id}`).then(res => {
    songList.name = res.data.playlist.name
    songList.description = res.data.playlist.description
    songList.cover = res.data.playlist.coverImgUrl
  })
}

//修改歌单
const alterSongListInfo = () => {
  loading.value = true
  axios(`/playlist/update?id=${songList.id}&name=${songList.name}&desc=${songList.description}`).then(res => {
    if (res.data.code === 200){
      ElMessage({
        message:"修改成功",
        type:"success"
      })
    }else {
      ElMessage({
        message:"修改失败",
        type:"error"
      })
  }
}).finally(() => {
  loading.value = false
  })
}

// 修改歌单封面
const alterSongListCover = async (f) => {
  const isJPG = f.file.type === 'image/jpeg';
  const isPNG = f.file.type === 'image/png'
  const isLt2M = f.file.size / 1024 / 1024 < 2;
  if (!(isJPG || isPNG)) {
    ElMessage({
      message:'只能上传JPG/PNG图像！',
      type:'warning'
    })
    return
  }
  if (!isLt2M) {
    ElMessage({
      message:'图片大小请限制在2MB内',
      type:'warning'
    })
    return
  }
  showUploadingProgress.value = true
  let formData = new FormData()
  formData.append('imgFile', f.file)
  let size = await getImgSize(f.file)
  size = size.height>size.width?size.width:size.height
  axios({
    method: 'post',
    url: `/playlist/cover/update?id=${songList.id}&imgSize=${size}&timestamp=${Date.now()}`,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
    onUploadProgress:(progressEvent) => {
      if (progressEvent.lengthComputable){
        uploadingProgress.value = Math.ceil((progressEvent.loaded / progressEvent.total) * 100)
      }
    }
  }).then(res => {
    if (res.data.code === 200){
      songList.cover = res.data.data.url
      showUploadingProgress.value = false
      uploadingProgress.value = 0
    }else{
      ElMessage({
        message:'上传失败',
        type:'error'
      })
    }
  })
}

//获取图像尺寸
const getImgSize = (file) => {
  return new Promise((resolve) => {
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      let image = new Image()
      image.src = e.target.result
      image.onload = () => {
        resolve({
          width: image.width,
          height: image.height,
        })
      }
    }
  })
}

onMounted(() => {
  songList.id = route.params.editSongListInfoId
  getSongListInfo(route.params.editSongListInfoId)
})
</script>

<style scoped>
@import "../../assets/css/rightComponentsCss/editSongListInfo.css";
</style>
