<template>
  <!--    登录弹窗-->
  <el-dialog  v-model="loginVisible"
              title="登录"
              :width="dialogWidth"
              :append-to-body="true"
              :close-on-click-modal="false"
              :center="true"
              class="navigationMain-dialog">
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
    </div>
    <!--      验证码-->
    <el-form :model="form" v-show="option === 2">
      <el-form-item>
        <el-input v-model="form.phone" autocomplete="off" placeholder="请输入手机号"/>
      </el-form-item>
      <el-form-item>
        <el-input  v-model="form.code" autocomplete="off" placeholder="请输入验证码"/>
        <div class="navigationMain-verification">
          <p>发送验证码</p>
        </div>
      </el-form-item>
    </el-form>

    <div class="navigationMain-dialog-bottom">
      <a @click="option = 0" v-if="option !== 0">{{loginOption[0]}}&emsp;</a>
      <a @click="option = 1" v-if="option !== 1">{{loginOption[1]}}&emsp;</a>
      <a @click="option = 2" v-if="option !== 2">{{loginOption[2]}}&emsp;</a>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="invisible">取消</el-button>
        <el-button type="primary" @click="option === 2?verificatonLogin(form.phone,form.code):phoneLogin(form.phone,form.pwd)">登录</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {View} from "@element-plus/icons-vue";
import {Hide} from "@element-plus/icons-vue";
import {Loading} from "@element-plus/icons-vue";
import {reactive, ref, watch} from "vue";
import axios from "axios";
import Cookies from "js-cookie";
import {ElMessage} from "element-plus";

let pwdIsVisible = ref(true)
let dialogWidth = 300
let load = ref(false)
let loginVisible = ref(false)
const baseUrl = "https://netease-cloud-music-api-beta-lime.vercel.app"
// eslint-disable-next-line no-unused-vars
let QRCodeTimer = 0
let QRCodeBase64 = ref(0)
let option = ref(2)

const user = reactive({
  avatarUrl:'',
  nickname:''
})
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
//提前定义emit事件
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
  emits('changeVisible',false)
}
//监听父组件传来的值的变化 发生改变则赋值给loginVisible
watch(
    () => props.visible,(next) => {
      loginVisible.value = next
})
//手机号登录
const phoneLogin = (phone,pwd) => {
  load.value = true
  axios.post(baseUrl+"/login/cellphone?phone="+phone+"&password="+pwd).then(res=>{
    if (res.data.code === 200) {
      localStorage.setItem("neToken",res.data.token)
      sessionStorage.setItem("neProfile",JSON.stringify(res.data.profile))
      Cookies.set("neCookie",res.data.cookie)
      load.value = false
      loginVisible.value = false
      user.avatarUrl = JSON.parse(sessionStorage.getItem("neProfile")).avatarUrl
      user.nickname = JSON.parse(sessionStorage.getItem("neProfile")).nickname
    }
  }).catch(()=>{
    this.$message("手机号或密码错误")
    load.value = false
  })
}
//二维码登录
const getQRCode = async () => {
  // load = true
  let QR = null
  //先获取unikey  防止被缓存 这里传入时间戳
  let unikeyData = (await axios.get(baseUrl + "/login/qr/key?timestamp=" + Date.now())).data.data
  if (unikeyData.code === 200) {
    //传入前面的unikey获取二维码base64编码
    QR = await axios.get(baseUrl + "/login/qr/create?&key=" + unikeyData.unikey + "&qrimg=true")
    if (QR.data.code === 200) {
      QRCodeBase64.value = QR.data.data.qrimg
      //开始轮询接口获取二维码状态
      QRCodeTimer = setInterval(async () => {
        let status = await axios.get(baseUrl + "/login/qr/check?key=" + unikeyData.unikey)
        // load = false
        //800 为二维码过期,801 为等待扫码,802 为待确认,803 为授权登录成功(803 状态码下会返回 cookies)
        if (status.data.code === 800) {
          getQRCode()
        } else if (status.data.code === 802) {
          // this.QRCover = true
        } else if (status.data.code === 803) {
          Cookies.set("neCookie", QR.data.cookie)
          console.log(Cookies.get("neCookie"))
          ElMessage({
            message: status.data.message,
            type: 'success'
          });
        }
      }, 3000)
    }
  }
}
//获取验证码
const getVerificationCode = (phoneNumber) => {
  axios.post(baseUrl+"/captcha/sent?phone="+phoneNumber).then(res => {
    if(res.data.code === 200){
      ElMessage({
        message:"验证码已发送，请注意查收",
        type:"success"
      })
    }
  })
}
//验证码登录
const verificatonLogin = (phone,code) => {
}
watch(
    () => option.value,(next) => {
      if(next === 1){
        getQRCode()
      }
    }
)
</script>

<style scoped>
@import "../../assets/css/navigationComponentsCss/loginModule.css";
</style>