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
     <el-form :model="form">
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
     <template #footer>
      <span class="dialog-footer">
        <el-button @click="invisible">取消</el-button>
        <el-button type="primary" @click="phoneLogin(form.phone, form.pwd)">登录</el-button>
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
import {reactive, ref, watch} from "vue";
import axios from "axios";
import {useUserStore} from "@/store/userStore";
import Notification from "@/tools/notification";

let pwdIsVisible = ref(false)
let dialogWidth = 300
let load = ref(false)
let loginVisible = ref(false)
let form = reactive({
  phone: "",
  pwd: ""
})
const userStore = useUserStore()
const emits = defineEmits(["changeVisible"])
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

watch(() => props.visible,(nextVisible) => {
      loginVisible.value = nextVisible
})

// 手机号登录
const phoneLogin = (phone,pwd) => {
  let phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/
  if (!phoneReg.test(phone) || pwd === ''){
    Notification.NORMAL_INFO("请检查输入内容的格式")
    return
  }
  load.value = true
  axios.post(`/login/cellphone?phone=${phone}&password=${pwd}`).then(res=>{
    if (res.data.code === 200) {
      userStore.updateUserInfo()
      invisible()
      location.reload()
    } else {
      Notification.ERROR_INFO("手机号或密码错误")
    }
  }).catch((err)=>{
    Notification.ERROR_INFO("登陆失败，请稍后重试")
  }).finally(() => {
    load.value = false
  })
}
</script>

<style scoped>
@import "../../assets/css/topComponentsCss/loginModule.css";
</style>
