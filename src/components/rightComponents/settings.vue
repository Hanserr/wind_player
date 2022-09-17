<template>
<div id="settings">
  <el-tabs tab-position="left" style="height: 450px" class="demo-tabs">
    <el-tab-pane label="账号">
      <div id="updatePhone">
        <p id="updatePhoneTitle">修改手机号</p>
        <input placeholder="原手机号" id="updatePhoneInp1" v-model="oldPhone">
        <input placeholder="新手机号" id="updatePhoneInp2" v-show="newPhoneInput" v-model="newPhone">
        <input placeholder="验证码" v-model="captcha">
        <button @click="getVerCode" :disabled=buttonIsDisable>{{buttonIsDisable?updatePhoneTime+'秒':'获取验证码'}}</button>
        <br>
        <button id="updatePhoneButton" @click="next">{{button1Title}}</button>
        <p>修改密码</p>
      </div>
    </el-tab-pane>
    <el-tab-pane label="工具">
      <span style="color: #6d75a2">暂未上线工具哦，请耐心等候</span>
    </el-tab-pane>
    <el-tab-pane label="关于风吟音乐">
      <span id="appInfo">
        风吟音乐是基于<a href="https://github.com/Binaryify/NeteaseCloudMusicApi" target="_blank">网易云音乐API</a>开发的一款Web端音乐播放器
        <br>
        目前还在继续完善项目中
        <br>
        <a href="https://github.com/Hanserr" target="_blank">我的Github</a>
      </span>
    </el-tab-pane>
  </el-tabs>
</div>
</template>

<script setup>
import {onUnmounted, ref} from "vue";
import axios from "axios";
import {ElMessage} from "element-plus";
import Cookies from "js-cookie";
import {router} from "@/router/routes";

let oldPhone = ref()
let newPhone = ref()
let oldCaptcha = null
let captcha = ref()
let newPhoneInput = ref(false)
let button1Title = ref("下一步")
let updatePhoneTimer = null
let updatePhoneTime = ref(60)
let buttonIsDisable = ref(false)
let stage = 1

//获取验证码
const getVerCode = () => {
  buttonIsDisable.value = true
  if ((Cookies.get("updateExpireTime1") && stage === 1) || (Cookies.get("updateExpireTime2") && stage === 2)){
    ElMessage({
      message:"操作过于频繁，请稍候再试",
      type:"warning"
    })
    return
  }
  axios.get(`/captcha/sent?phone=${stage === 1?oldPhone.value:newPhone.value}`).then(res => {
    if (res.data.code === 200){
      Cookies.set(`${stage === 1?'updateExpireTime1':'updateExpireTime2'}`," ",{
        expires:new Date(new Date()*1+1000*60)
      })
      ElMessage({
        message:"验证码已发送，请注意查收",
        type:"success"
      })
      //设置验证码倒计时
      updatePhoneTimer = setInterval(() => {
        updatePhoneTime.value--
        if (updatePhoneTime.value === 0){
          buttonIsDisable.value = false
          updatePhoneTime.value = 60
          clearInterval(updatePhoneTimer)
        }
      },1000)
    }else if (res.data.code === 400){
      buttonIsDisable.value = false
      ElMessage({
        message:res.data.message,
        type:"warning"
      })
    }
  })
}

//验证旧手机号验证码，进行下一步换绑操作
const next = () => {
  oldCaptcha = captcha.value
  if (stage === 2)
    rebind()
  else {
    axios.get(`/captcha/verify?phone=${oldPhone.value}&captcha=${oldCaptcha}`).then(res => {
      if (res.data.code === 200){
        button1Title.value = "确认修改"
        newPhoneInput.value = true
        stage = 2
        captcha.value = ''
        buttonIsDisable.value = false
        updatePhoneTime.value = 60
        clearInterval(updatePhoneTimer)
      }else {
        ElMessage({
          message:'验证码错误',
          type:"error"
        })
        captcha.value = ''
      }
    })
  }
}

//换绑手机
const rebind = () => {
  axios.get(`/rebind?phone=${newPhone.value}&oldcaptcha=${oldCaptcha.value}&captcha=${captcha.value}`).then(res => {
    if (res.data.code === 200){
      ElMessage({
        message:"修改成功",
        type:"success"
      })
      buttonIsDisable = false
      router.push('/')
    }else {
      ElMessage({
        message:"修改失败",
        type:"error"
      })
    }
  })
}

onUnmounted(() => {
  clearInterval(updatePhoneTimer)
})
</script>

<style scoped>
@import "../../assets/css/rightComponentsCss/settings.css";
</style>
