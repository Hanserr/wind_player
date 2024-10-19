<script setup>
import {useThemeStore} from "@/store/themeStore";
import {onMounted, onUnmounted, ref} from "vue";
import axios from "axios";
import Notification from "@/tools/notification";
import apiCollection from "@/tools/apiCollection";
import notification from "@/tools/notification";
import {useUserStore} from "@/store/userStore";
import {ElMessageBox} from "element-plus";

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
let clickTimer = null

//上传主题
const submitColor = () => {
  if(TABC.value && MIDC.value){
    // 发送添加主题的请求
    dialogColorVisible.value = false
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

//mousedown逻辑
const pressEvent = (i) => {
  clickTimer = setTimeout(() => {
    recheck(i)
  },1000)
}

//mouseup逻辑
const mouseupEvent = () => {
  clearTimeout(clickTimer)
}

//更改主题
const alterUserTheme = (i) => {
  axios.post(`${apiCollection.ALTER_CUR_SET}?uid=${userStore.getUserInfo().value.userId}&tid=${i.tid}`).then(res => {
    if(res.data.code === 200) {
      themeStore.updateTheme(userStore.getUserInfo().value.userId, i.t_upDownBack, i.t_mainBack, i.id)
    } else {
      notification.ERROR_INFO("修改主题失败，稍后重试～")
    }
  }).catch(() => {
    notification.ERROR_INFO("修改主题失败，稍后重试～")
  })
}

//删除主题
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

//删除前确认框
const recheck = (i) => {
  ElMessageBox.confirm(
      '确定删除吗？',
      '危险操作🙅🏻‍♂️',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(() => {
    deleteTheme(userStore.getUserInfo().value.userId, i.tid)
  }).catch(() => {
  })
}

onMounted(() => {
  getTheme()
})

onUnmounted(() => {
  clearTimeout(clickTimer)
})
</script>

<template>
  <div class="theme-main">
    <p class="theme-title">个性化你的播放器（双击应用主题）*暂未适配所有页面，仅作演示</p>
    <el-scrollbar height="385px">

      <p class="theme-title">系统主题</p>
      <div class="theme-wrapper"
           v-for="i in data.os"
           @dblclick="alterUserTheme(i)"
           :style="{background:`linear-gradient(${i.t_upDownBack},${i.t_mainBack})`}">
      </div>

      <p class="theme-title">我创建的主题（长按删除主题）</p>
        <div class="theme-wrapper"
             v-for="i in data.my"
             :key="i"
             @dblclick="alterUserTheme(i)"
             @mousedown="pressEvent(i)"
             @mouseup="mouseupEvent()"
             :style="{background:`linear-gradient(${i.t_upDownBack},${i.t_mainBack})`}">
        </div>

      <p class="theme-title">其他主题</p>
      <div class="theme-wrapper"
           v-for="i in data.other"
           @dblclick="alterUserTheme(i)"
           :style="{background:`linear-gradient(${i.t_upDownBack},${i.t_mainBack})`}">
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
        <el-button type="primary" @click="submitColor()">添加到共享主题</el-button>
      </el-dialog>
    </el-scrollbar>
  </div>
</template>

<style scoped>
@import "@/assets/css/rightComponentsCss/theme.css";
</style>