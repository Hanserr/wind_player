<template>
 <div class="loginModule">
   <!--    登录弹窗-->
   <el-dialog  v-model="loginVisible"
                title="登录"
                :width="dialogWidth"
                :append-to-body="true"
                :close-on-click-modal="false"
                :center="true"
                :before-close="invisible">
     <!--      遮罩层-->
     <div class="navigationMain-cover" v-if="load">
       <p>登录中</p>
       <el-icon class="is-loading">
         <Loading/>
       </el-icon>
     </div>
     <!--      手机号登录表单-->
     <el-form :model="form" v-show="option ===0">
       <el-form-item>
         <el-input v-model="form.phone" autocomplete="off" placeholder="请输入手机号"/>
       </el-form-item>
       <el-form-item>
         <el-input  v-model="form.pwd" autocomplete="off" placeholder="请输入密码" :type="pwdIsVisible?'text':'password'"/>
         <div class="shiftPwd">
           <el-icon v-show="pwdIsVisible" @click="pwdIsVisible = false"><Hide class="navigationMain-icon"/></el-icon>
           <el-icon v-show="!pwdIsVisible" @click="pwdIsVisible = true"><View  class="navigationMain-icon"/></el-icon>
         </div>
       </el-form-item>
     </el-form>
     <!--      二维码-->
     <div class="navigationMain-QRCode" v-show="option === 1">
       <div id="QRCode_cover" v-show="QRCodeBase64 === 0 ">
         <p>正在获取二维码</p>
       </div>
       <p>打开手机网易云音乐扫一扫</p>
       <img :src="QRCodeBase64" v-show="QRCodeBase64 !== 0"/>
       <div id="loginQRCodeWrapper" v-if="code802">
         <span>请在手机上确认登录</span>
       </div>
     </div>
     <!--      验证码-->
     <el-form :model="form" v-show="option === 2">
       <el-form-item>
         <el-input v-model="form.phone" autocomplete="off" placeholder="请输入手机号" maxlength="11"/>
       </el-form-item>
       <el-form-item>
         <el-input  v-model="form.code" autocomplete="off" placeholder="请输入验证码" maxlength="4" style="width: 140px" />
         <el-button
             @click="getVerificationCode(form.phone)"
             class="navigationMain-verify-button"
             :disabled="buttonIsDisable">
           {{buttonIsDisable?verTime+"秒后重发":"发送验证码"}}
         </el-button>
       </el-form-item>
     </el-form>

     <div class="navigationMain-dialog-bottom">
       <a @click="option = 0" v-if="option !== 0">{{loginOption[0]}}&emsp;</a>
       <a @click="option = 1" v-if="option !== 1">{{loginOption[1]}}&emsp;</a>
       <a @click="option = 2" v-if="option !== 2">{{loginOption[2]}}&emsp;</a>
     </div>
     <template #footer>
      <span class="dialog-footer" v-show="option !== 1">
        <el-button @click="invisible">取消</el-button>
        <el-button type="primary" @click="option === 2?verificatonLogin(form.phone,form.code):phoneLogin(form.phone,form.pwd)">登录</el-button>
      </span>
      <a id="registerButton" href="/register" target="_blank">→注册</a>
     </template>
   </el-dialog>
 </div>
</template>

<script setup>
import {View} from "@element-plus/icons-vue";
import {Hide} from "@element-plus/icons-vue";
import {Loading} from "@element-plus/icons-vue";
import {onUnmounted, reactive, ref, watch} from "vue";
import axios from "axios";
import {ElMessage} from "element-plus";
import {Auth} from "@/store";
import api from "@/tools/apiCollection";

let pwdIsVisible = ref(false)
let dialogWidth = 300
let load = ref(false)
let loginVisible = ref(false)
// eslint-disable-next-line no-unused-vars
let QRCodeTimer = 0
let QRCodeBase64 = ref(0)
let option = ref(0)
let verificationTimer  = 0
let buttonIsDisable = ref(false)
let verTime = ref(60)
let code802 = ref(false)
const form = reactive({
  phone:'',
  pwd:'',
  code:''
})
const loginOption = [
  '手机号登录',
  '二维码登录',
  '验证码登录'
]
const store = Auth()

// eslint-disable-next-line no-undef
const emits = defineEmits(["changeVisible"])
// eslint-disable-next-line no-undef
const props = defineProps({
  visible:{
    type:Boolean,
    default:false
  }
})

//关闭弹窗
const invisible = () => {
  clearInterval(QRCodeTimer)
  option.value = 0
  emits('changeVisible',false)
}

watch(() => props.visible,(nextVisible) => {
      loginVisible.value = nextVisible
})

watch(() => option.value,(nextOption) => {
      if(nextOption === 1){
        getQRCode()
      }
    })

//获取用户登陆状态
const getUserStatus = () => {
  if (store.getUID)
    return
  if (store.getUserStatus())
    location.reload()
}

// 手机号登录
const phoneLogin = (phone,pwd) => {
  ElMessage({
    message:'因网易增加了网易云盾验证,密码登录暂时无法使用。请使用二维码登陆',
    type:"warning"
  })
}

// 二维码登录
const getQRCode = async () => {
  let QR = null
  //先获取unikey  防止被缓存 这里传入时间戳
  let unikeyData = (await axios.get(`${api.GET_LOGIN_QR_UNIKEY}?timestamp=${Date.now()}`)).data.data
  if (unikeyData.code === 200) {
    //传入前面的unikey获取二维码base64编码
    QR = await axios.get(`${api.GET_LOGIN_QR_BASE64}?&key=${unikeyData.unikey}&qrimg=true`)
    if (QR.data.code === 200) {
      QRCodeBase64.value = QR.data.data.qrimg
      //开始轮询接口获取二维码状态
      QRCodeTimer = setInterval(async () => {
        let status = await axios.get(`${api.POLLING_LOGIN_QR_STATUS}?key=${unikeyData.unikey}&timestamp=${Date.now()}`)
        //800 为二维码过期,801 为等待扫码,802 为待确认,803 为授权登录成功(803 状态码下会返回 cookies)
        if (status.data.code === 800) {
          getQRCode()
        }else if(status.data.code === 802){
          code802.value = true
        }else if (status.data.code === 803) {
          code802.value = false
          store.processCookie(status.data.cookie)
          clearInterval(QRCodeTimer)
          getUserStatus()
          ElMessage({
            message: status.data.message,
            type: 'success'
          });
        }
      }, 5000)
    }
  }
}

// 获取验证码
const getVerificationCode = (phoneNumber) => {
  ElMessage({
    message:'因网易增加了网易云盾验证,验证码登录暂时无法使用。请使用二维码登陆',
    type:"warning"
  })
}

//验证码登录
const verificatonLogin = (phoneNumber,code) => {
  ElMessage({
    message:'因网易增加了网易云盾验证,验证码登录暂时无法使用。请使用二维码登陆',
    type:"warning"
  })
}

onUnmounted(() => {
  clearInterval(verificationTimer)
  clearInterval(QRCodeTimer)
})
</script>

<style scoped>
@import "../../assets/css/topComponentsCss/loginModule.css";
</style>
