<template>
<div id="registerPage">
  <input type="text" v-model="uInfo.nickname" placeholder="昵称支持中英文、数字和-_" @blur="checkNickname(uInfo.nickname)">
  <input type="text" v-model="uInfo.password" placeholder="密码~">
  <input type="text" v-model="uInfo.phone" placeholder="只支持中国大陆手机号">
  <input type="text" v-model="captcha" maxlength="6" placeholder="验证码~" oninput="value=value.replace(/[^\d]/g,'')">
  <button @click="sendCaptcha()" :disabled="buttonIsDisable">
    {{buttonIsDisable?captchaTime+"秒后重发":"发送验证码"}}
  </button>
  <button @click="register">注册</button>
</div>
</template>

<script setup>
import {onUnmounted, reactive, ref} from "vue";
import axios from "axios";
import {ElMessage} from "element-plus";
import {router} from "@/router/routes";

let uInfo = reactive({
  phone:'',
  password:'',
  nickname: ''
})
let captcha = ref('')
let flag = false
let captchaTimer = null
let captchaTime = ref(60)
let buttonIsDisable = ref(false)
const reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
let countdownTimer = null

//检查昵称是否重复
const checkNickname = (name) => {
  if (!name){
    return
  }
  axios.get(`/nickname/check?nickname=${name}`).then(res => {
    if (res.data.code === 200){
      if (res.data.duplicated){
        ElMessage({
          message:'昵称已被使用啦，换个昵称试试吧~',
          type:"warning"
        })
      }else
        flag = true
    }else{
      ElMessage({
        message:res.data.message,
        type:'error'
      })
    }
  })
}

//发送验证码
const sendCaptcha = () => {
  if (!reg.test(uInfo.phone)){
    ElMessage({
      message:'手机号格式有误！',
      type:"error"
    })
    return
  }
  buttonIsDisable.value = true
  axios.post(`/captcha/sent?phone=${uInfo.phone}`).then(res => {
    if(res.data.code === 200){
        ElMessage({
          message:"验证码已发送，请注意查收",
          type:"success"
        })
        //设置验证码倒计时
        captchaTimer = setInterval(() => {
          captchaTime.value--
        if (captchaTime.value === 0){
          buttonIsDisable.value = false
          captchaTime.value = 60
          clearInterval(captchaTimer)
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
//注册
const register = () => {
  if (!(flag && uInfo.phone !== '' && uInfo.password !== '' && captcha.value !== '')){
    ElMessage({
      message:"请检查输入数据是否有误",
      type:"warning"
    })
    return
  }
  axios.post(`/register/cellphone?phone=${uInfo.phone}&password=${uInfo.password}&captcha=${captcha.value}&nickname=${uInfo.password}`).then(res => {
    if (res.data.code === 200) {
      ElMessage({
        message: '注册成功！三秒后跳转至首页',
        type: "info"
      })
      countdownTimer = setTimeout(() => {
        router.push('/')
      }, 3000)
    }
  }).catch(() => {
    ElMessage({
      message:'请检查输入格式是否正确',
      type:"warning"
    })
  })
}

onUnmounted(() => {
  clearTimeout(countdownTimer)
  clearInterval(captchaTimer)
})
</script>

<style scoped>
@import "../assets/css/views/register.css";
</style>
