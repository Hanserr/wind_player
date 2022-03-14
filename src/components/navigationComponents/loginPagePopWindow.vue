<template>
  <div class="loginPage" v-if="show">

<!--    手机号密码登录-->
    <div class="loginPage-pwd"
       v-loading="loading"
       element-loading-text="登录中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)"
       v-if="this.option === 0">
     <div class="loginPage-pwd-top">
       <a class="loginPage-pwd-top-close" @click="close()">关闭</a>
       <input class="loginPage-account-inp" placeholder="输入手机号" v-model="loginProperty.phone">
       <input class="loginPage-account-inp" placeholder="输入密码" v-model="loginProperty.pwd">
       <div class="loginPage-pwd-top-option">
         <a @click="changeOption(0)" v-if="this.option !== 0">{{this.loginOption[0]}}&emsp;</a>
         <a @click="changeOption(1)" v-if="this.option !== 1">{{this.loginOption[1]}}&emsp;</a>
         <a @click="changeOption(2)" v-if="this.option !== 2">{{this.loginOption[2]}}&emsp;</a>
       </div>
       <hr>
     </div>
     <div class="loginPage-pwd-bottom">
       <button @click="phoneLogin(loginProperty.phone,loginProperty.pwd)" class="loginPage-pwd-close">登录</button>
     </div>
    </div>
<!--    二维码登陆-->
    <div class="loginPage-QR" v-if="this.option === 1">
      <div class="loginPage-QR-top">
        <a class="loginPage-QR-top-close" @click="close()">关闭</a>
        <div class="loginPage-QR-top-img"
             v-loading="loading"
             element-loading-text="二维码加载中···"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.8)">
          <img :src=QRCodeBase64 v-if="QRCodeBase64 !== ''">
          <div class="loginPage-QR-top-img-cover" v-if="QRCover">
            <p>扫码成功</p>
          </div>
        </div>
        <hr>
        <div class="loginPage-QR-top-option">
          <a @click="changeOption(0)" v-if="this.option !== 0">{{this.loginOption[0]}}&emsp;</a>
          <a @click="changeOption(1)" v-if="this.option !== 1">{{this.loginOption[1]}}&emsp;</a>
          <a @click="changeOption(2)" v-if="this.option !== 2">{{this.loginOption[2]}}&emsp;</a>
        </div>
      </div>
      <div class="loginPage-pwd-bottom">
      </div>
    </div>
<!--    验证码登录-->
    <div class="loginPage-validation">
    </div>

  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "loginPagePopWindow",
  data(){
    return{
      baseUrl:"https://netease-cloud-music-api-beta-lime.vercel.app",
      loginOption: [
        '手机号登录',
        '二维码登录',
        '验证码登录'
    ],
      option:0,
      loginProperty:{
        phone:'',
        pwd:'',
      },
      countryNumSelect:86,
      loading:false,
      QRCodeBase64:'',
      QRCodeTimer:'',
      QRCover:false,

    }
  },
  props:["show"],
  methods:{
    //关闭弹窗
    close(){
      this.$emit("update:show",false)
    },
    //改变登陆方式
    changeOption(num){
      this.option = num
      if(num === 1){
        this.getQRCode()
      }
    },
    //手机号登录
    phoneLogin(phone,pwd){
      this.loading = true
      axios.post(this.baseUrl+"/login/cellphone?phone="+phone+"&password="+pwd).then(res=>{
        if (res.data.code === 200) {
          localStorage.setItem("neToken",res.data.token)
          // eslint-disable-next-line no-undef
          Cookies.set("neCookie",res.data.cookie)
          this.$emit("func",res.data.profile)
          this.loading = false
          console.log(res.data)
          this.$emit("update:show",false)
        }
      }).catch(()=>{
        this.$message("手机号或密码错误")
        this.loading = false
      })
    },
    //获取登录二维码
    // async getQRCode(){
    //   this.loading = true
    //   let QR = null
    //   let unikeyData = (await axios.get(this.baseUrl + "/login/qr/key?timestamp=" + Date.now())).data.data
    //   if(unikeyData.code === 200){
    //       QR = await axios.get(this.baseUrl+"/login/qr/create?&key="+unikeyData.unikey+"&qrimg=true")
    //       if (QR.data.code === 200){
    //         let status = await axios.get(this.baseUrl+"/login/qr/check?key="+unikeyData.unikey)
    //         if (status.data.code === 200){
    //           this.QRCodeTimer = setInterval(async ()=>{
    //             console.log(QR.data);
    //             this.loading = false
    //             this.QRCodeBase64 = QR.data.data.qrimg
    //             if (QR.data.code === 800){
    //               await this.getQRCode()
    //             }else if(QR.data.code === 802){
    //               this.QRCover = true
    //             }else if(QR.data.code === 803){
    //               this.$cookies.set("netEaseCookie",QR.data.cookie)
    //               console.log(this.$cookies.get("netEaseCookie"))
    //               this.$message({
    //                 message: QR.data.message,
    //                 type: 'success'
    //               });
    //             }
    //           },3000)
    //           }
    //         }
    //   }
    // },


  },
  mounted(){

  },
  beforeUnmount() {
    clearInterval(this.QRCodeTimer)
  }
}
</script>

<style scoped>
@import "../../assets/css/navigationComponentsCss/loginPagePopWindow.css";
</style>