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
      <span class="dialog-footer">
        <el-button @click="invisible">取消</el-button>
        <el-button type="primary" @click="option === 2?verificatonLogin(form.phone,form.code):phoneLogin(form.phone,form.pwd)">登录</el-button>
      </span>
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
import Cookies from "js-cookie";
import {ElMessage} from "element-plus";

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
const baseUrl = "https://netease-cloud-music-api-beta-lime.vercel.app"
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
  axios.post(`${baseUrl}/login/status`).then(res => {
    if (res.data.data.code !== 200 || !res.data.data.account){
      ElMessage({
        message:'登陆失败，请稍后再试',
        type:'error'
      })
    }else {
      location.reload()
    }
  })
}

//手机号登录
const phoneLogin = (phone,pwd) => {
  let phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/
  if (!phoneReg.test(phone) || pwd === ''){
    ElMessage({
      message:'请检查手机号或密码格式',
      type:"warning"
    })
    return
  }
  load.value = true
  axios.post(`${baseUrl}/login/cellphone?phone=${phone}&password=${pwd}`).then(res=>{
    console.log(res.data)
    if (res.data.code === 200) {
      let cookiesList = res.data.cookie.split(';;')
      for (let i = 0;i<cookiesList.length;i++){
        let d = cookiesList[i].split(';')
        let name = d[0].split('=')[0]
        let val = d[0].split('=')[1]
        let expire = new Date(d[2].split('=')[1])
        let p = d[3].split('=')[1]
        Cookies.set(name,val,{
          expires:expire,
          path:p
        })
      }
      Cookies.set('UID',res.data.profile.userId,{
        expires: 15
      })
      invisible()
      location.reload()
    }else {
      ElMessage({
        message:"手机号或密码错误",
        type:"error"
      })
    }
  }).catch((err)=>{
    console.log(err)
    ElMessage({
      message:"出错啦",
      type:"error"
    })
  }).finally(() => {
    load.value = false
  })
}

//二维码登录
const getQRCode = async () => {
  let QR = null
  //先获取unikey  防止被缓存 这里传入时间戳
  let unikeyData = (await axios.get(`${baseUrl}/login/qr/key?timestamp=${Date.now()}`)).data.data
  if (unikeyData.code === 200) {
    //传入前面的unikey获取二维码base64编码
    QR = await axios.get(`${baseUrl}/login/qr/create?&key=${unikeyData.unikey}&qrimg=true`)
    if (QR.data.code === 200) {
      QRCodeBase64.value = QR.data.data.qrimg
      //开始轮询接口获取二维码状态
      QRCodeTimer = setInterval(async () => {
        let status = await axios.get(`${baseUrl}/login/qr/check?key=${unikeyData.unikey}`)
        //800 为二维码过期,801 为等待扫码,802 为待确认,803 为授权登录成功(803 状态码下会返回 cookies)
        if (status.data.code === 800) {
          getQRCode()
        }else if (status.data.code === 803) {
          axios.get(`${baseUrl}/login/status`).then(res => {
          Cookies.set('UID',res.data.data.account.id,{
            expires:15
          })
          })
          status.data.cookie.split(/csrf=.{0,120};;/)
          let MU = status.data.cookie.match(/MUSIC_U=.{0,230}GMT;/)
          status.data.cookie.split(/MUSIC_U=.{0,230}GMT;/)
          Cookies.set('MUSIC_U',MU,{
            expires:15
          })
          let cookiesList =  status.data.cookie.split('HTTPOnly;')
          for (let i = 0;i<cookiesList.length;i++){
            let d = cookiesList[i].split(';')
            let name = d[0].split('=')[0]
            let val = d[0].split('=')[1]
            let expire = new Date(d[2].split('=')[1])
            let p = d[3].split('=')[1]
            Cookies.set(name,val,{
              expires:expire,
              path:p,
            })
          }
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

//获取验证码
const getVerificationCode = (phoneNumber) => {
  //获取前先判定cookie中是否有未过期的获取记录
  if (Cookies.get("verExpireTime")){
    ElMessage({
      message:'获取验证码间隔时间过短',
      type:'warning'
    })
    return;
  }
  //正则检查手机号格式
  const phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
  if (!phoneReg.test(phoneNumber)){
    ElMessage({
      message:'请检查手机号格式',
      type:'warning'
    })
    return;
  }
  buttonIsDisable.value = true
  axios.post(`${baseUrl}/captcha/sent?phone=${phoneNumber}`).then(res => {
    if(res.data.code === 200){
      Cookies.set("verExpireTime"," ",{
        expires:new Date(new Date()*1+1000*60)
      })
      ElMessage({
        message:"验证码已发送，请注意查收",
        type:"success"
      })
      //设置验证码倒计时
      verificationTimer = setInterval(() => {
      verTime.value--
      if (verTime.value === 0){
        buttonIsDisable.value = false
        verTime.value = 60
        clearInterval(verificationTimer)
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

//验证码登录
const verificatonLogin = (phoneNumber,code) => {
  const phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
  if (!phoneReg.test(phoneNumber) || code === ''){
    ElMessage({
      message:'请检查手机号或验证码格式',
      type:'warning'
    })
    return;
  }
  load.value = true
  axios.post(`${baseUrl}/captcha/verify?phone=${phoneNumber}&captcha=${code}`).then(res => {
    if (res.data.code === 503){
      ElMessage({
        message:res.data.message,
        type:"error"
      })
      form.code = ''
    }else if(res.data.code === 200){
      axios.get(`${baseUrl}/login/status`).then(res => {
        if (res.data.data.code === 200){
          Cookies.set('UID',res.data.data.account.id)
        }
      })
      getUserStatus()
      ElMessage({
        message:'登陆成功',
        type:"success"
      })
      invisible()
    }
  }).finally(() => {
    load.value = false
  })
}

onUnmounted(() => {
  clearInterval(verificationTimer)
})
</script>

<style scoped>
@import "../../assets/css/topComponentsCss/loginModule.css";
</style>