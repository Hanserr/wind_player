<script setup>
import {useThemeStore} from "@/store/themeStore";
import {onMounted, ref} from "vue";
import axios from "axios";
import Notification from "@/tools/notification";
import apiCollection from "@/tools/apiCollection";
import notification from "@/tools/notification";
import {useUserStore} from "@/store/userStore";

const themeStore = useThemeStore()
const userStore = useUserStore()
let dialogColorVisible = ref()
let TABC = ref()
let MIDC = ref()
let data = ref({
  os:null,
  my: null,
  other:null,
})
let clickCount = ref(0)
let clickTimer = null

//上传主题
const submitColor = () => {
  if(TABC.value && MIDC.value){
    // 发送添加主题的请求
    dialogColorVisible.value = false
    themeStore.pageTheme.middleColor = MIDC.value
    themeStore.pageTheme.topAndBottomColor = TABC.value
    axios.post(`${apiCollection.UPLOAD_CUSTOM_COLOR}?t_upDownBack=${encodeURIComponent(TABC.value)}&t_mainBack=${encodeURIComponent(MIDC.value)}&creator=${userStore.getUserInfo().value.userId}`).then(res => {
      if(res.data.code === 200) {
        getTheme()
      } else {
        notification.UPLOAD_THEME_FAILED()
      }
    }).catch(() => {
      notification.UPLOAD_THEME_FAILED()
    })
  } else {
    Notification.LESS_COLOR()
  }
}

//获取配色主题
const getTheme = () => {
  axios.get(`${apiCollection.GET_COLOR_SET}`).then(res => {
    if(res.data.code === 200) {
      data.value = res.data.data
      let osTheme = []
      let myTheme = []
      let otherTheme = []
      for(let i of res.data.data){
        if(i.creator === "-1") {
          osTheme.push(i)
        } else if (i.creator == userStore.getUserInfo().value.userId){
          myTheme.push(i)
        } else {
          otherTheme.push(i)
        }
      }
      data.value.my = myTheme
      data.value.other = otherTheme
      data.value.os = osTheme
    } else {
      notification.GET_THEME_FAILED()
    }
  }).catch(() => {
    notification.GET_THEME_FAILED()
  })
}

//单击逻辑
const clickEvent = (i) => {
  clickCount.value++;
  if (clickCount.value === 1) {
    clickTimer = setTimeout(() => {
      alterUserTheme(i)
      clickCount.value = 0;
    }, 150);
  }
}

//双击逻辑
const dbclickEvent = (i) => {
  clearTimeout(clickTimer);
  clickCount.value = 0;
  deleteTheme(userStore.getUserInfo().value.userId, i.tid)
}

//更改主题
const alterUserTheme = (i) => {
  themeStore.updateTheme(userStore.getUserInfo().value.userId, i.t_upDownBack, i.t_mainBack, i.id)
  console.log(i)
  axios.post(`${apiCollection.ALTER_CUR_SET}?uid=${userStore.getUserInfo().value.userId}&tid=${i.tid}`).then(res => {
    console.log(res)
  })
}

const deleteTheme = (uid, tid) => {
  axios.get(`${apiCollection.DELETE_CUSTOM_COLOR}?tid=${tid}&uid=${uid}`).then(res => {
    if(res.data.code === 200) {
      getTheme()
    } else {
      notification.DELETE_THEME_FAILED()
    }
  }).catch(() => {
    notification.DELETE_THEME_FAILED()
  })
}

onMounted(() => {
  getTheme()
})
</script>

<template>
  <div class="theme-main">
    <p class="theme-title">个性化你的播放器（*暂未适配所有页面，仅作演示）</p>
    <el-scrollbar height="385px">
      <p class="theme-title">系统主题</p>
      <div class="theme-wrapper"
           v-for="i in data.os"
           @click="alterUserTheme(i)"
           :style="{background:`linear-gradient(${i.t_upDownBack},${i.t_mainBack})`}"
      >
      </div>
      <p class="theme-title">我创建的主题</p>
      <div class="theme-wrapper"
           v-for="i in data.my"
           @click="clickEvent(i)"
           @dblclick="dbclickEvent(i)"
           :style="{background:`linear-gradient(${i.t_upDownBack},${i.t_mainBack})`}"
      >
      </div>
      <p class="theme-title">其他主题</p>
      <div class="theme-wrapper"
           v-for="i in data.other"
           @click="alterUserTheme(i)"
           :style="{background:`linear-gradient(${i.t_upDownBack},${i.t_mainBack})`}"
      >
      </div>

      <div class="theme-wrapper"
           @click="dialogColorVisible = true"
           style="background: conic-gradient(#9ED110, #50B517, #179067, #476EAF, #9f49ac, #CC42A2, #FF3BA7, #FF5800, #FF8100, #FEAC00, #FFCC00, #EDE604);line-height: 150px;color: white;font-weight: bold">
        <span>自定义主题</span>
      </div>

      <el-dialog v-model="dialogColorVisible" title="自定义配色方案" width="800">
        顶部和底部播放栏的颜色：<el-color-picker v-model="TABC" />
        <br>
        中间页面的颜色：<el-color-picker v-model="MIDC" />
        <br>
        <div class="demonstrate">
          <div class="demonstrate-tab" :style="{backgroundColor:TABC}"></div>
          <div class="demonstrate-mid" :style="{backgroundColor:MIDC}"></div>
          <div class="demonstrate-tab" :style="{backgroundColor:TABC}"></div>
        </div>
        <br>
        <el-button @click="dialogColorVisible = false">关闭</el-button>
        <el-button type="primary" @click="submitColor()">应用并添加到共享主题</el-button>
      </el-dialog>
    </el-scrollbar>
  </div>
</template>

<style scoped>
@import "@/assets/css/rightComponentsCss/theme.css";
</style>