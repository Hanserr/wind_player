<template>
<div class="editUserInfo"
     v-if="user"
     v-loading="loading"
     element-loading-background="rgba(0, 0, 0, 0.8)">

  <div class="editionPageLeft">
    <el-upload
        action=""
        class="avatar-uploader"
        :show-file-list="false"
        :http-request="alterAvatar">
      <img v-if="user.avatarUrl" :src="user.avatarUrl" class="avatar"/>
      <el-icon v-else class="avatar-uploader-icon"><Plus/></el-icon>
      <div class="avatar-cover" v-show="showUploadingProgress"></div>
      <el-progress type="circle" :percentage="uploadingProgress" v-show="showUploadingProgress"/>
    </el-upload>
  </div>

  <div class="editionPageRight">
    <p>编辑个人信息</p>
    <span id="nickName">昵称:</span>
    <input type="text" id="nickNameInput" v-model="user.nickname">
    <br>
    <span id="introduction">介绍:</span>
    <textarea id="introductionInput" rows="5" cols="56" v-model="user.intro"></textarea>
    <br>
    <span id="gender">性别:</span>
    <input type="radio" name="gender" value="0" class="genderOption" style="margin-left: 30px;margin-top: 20px" v-model="user.gender">保密
    <input type="radio" name="gender" value="1" v-model="user.gender">男
    <input type="radio" name="gender" value="2" v-model="user.gender">女
    <br>
    <span id="birthday">生日:</span>
    <el-date-picker v-model="user.birthday" type="date" style="margin-top: 20px;margin-left: 5px"/>
    <br>
    <span id="region">地区:</span>
    <select v-model="tempProvince" class="regionSelect" style="margin-left: 5px">
      <option v-for="r in region" :key="r">{{r[1]}}</option>
    </select>
    <select v-model="tempUserRegion" class="regionSelect" style="margin-left: 20px">
      <option v-for="r in tempRegion" :key="r">{{r}}</option>
    </select>
    <br>
    <button id="confirmAltering" @click="alterUserProfile">确认修改</button>
  </div>

</div>
</template>

<script setup>
import Cookies from "js-cookie";
import {region} from "@/tools/region";
import {onMounted, reactive, ref, watch} from "vue";
import axios from "axios";
import {ElMessage} from "element-plus";
import { Plus } from '@element-plus/icons-vue';

let user = reactive({
  avatarUrl:null,
  nickname:null,
  intro:null,
  gender:null,
  birthday:null,
  province:null,
  region:null
}) //用户信息
let tempProvince = ref() //临时存放省市数据
let tempRegion = ref() //市级城市临时数据
let tempUserRegion = ref() //临时存放用户地区数据
let loading = ref(false) //加载遮罩
let uploadingProgress = ref(0) //头像上传进度条
let showUploadingProgress = ref(false) //展示头像上传进度条

//获取用户信息
const getUserInfo = () => {
  if (Cookies.get("UID")){
    axios.get(`/user/detail?uid=${Cookies.get("UID")}`).then(res => {
      if (res.data.code === 200){
        user.nickname = res.data.profile.nickname
        user.avatarUrl = res.data.profile.avatarUrl
        user.birthday = res.data.profile.birthday
        user.gender = res.data.profile.gender
        user.intro = res.data.profile.signature
        user.region = res.data.profile.city
        user.province = res.data.profile.province
      }
    })
  }
}

//动态改变当前市级地区数据
watch(() => tempProvince.value, next => {
  for (let i of region){
    if (i[1] === next){
      tempProvince.value = i[1]
      tempRegion.value = i[2]
      break
    }
  }
})

//修改用户信息
const alterUserProfile = () => {
  loading.value = true
  if (user.nickname === null){
    ElMessage({
      message:"昵称不能为空",
      type:"warning"
    })
    return
  }
  for (let i of region){
    if( i[1] === tempProvince.value){
      user.province = i[0]
      for (let a in i[2]){
        if (tempUserRegion.value === i[2][a]){
          user.region = parseInt(a)
          break
        }
      }
      break
    }
  }
  axios.get(`/user/update?gender=${user.gender}&signature=${user.intro}&city=${user.region}&nickname=${user.nickname}&birthday=${user.birthday}&province=${user.province}`).then(res => {
   if (res.data.code === 200){
     ElMessage({
       message:"修改成功!",
       type:"success"
     })
   }else{
     ElMessage({
       message:"修改失败!",
       type:"error"
     })
   }
  }).finally(() => {
    loading.value = false
  })
}

// 修改头像
const alterAvatar = async (f) => {
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
    url: `/avatar/upload?imgSize=${size}&timestamp=${Date.now()}`,
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
      user.avatarUrl = res.data.data.url
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
  getUserInfo()
})
</script>

<style scoped>
@import "../../assets/css/rightComponentsCss/editUserInfo.css";
</style>