<script setup>
import {useThemeStore} from "@/store/themeStore";
import {onMounted, onUnmounted, ref} from "vue";
import axios from "axios";
import Notification from "@/tools/notification";
import apiCollection from "@/tools/apiCollection";
import notification from "@/tools/notification";
import {useUserStore} from "@/store/userStore";
import {ElMessageBox} from "element-plus";
import timer from "@element-plus/icons-vue/dist/es/timer.mjs";

const themeStore = useThemeStore()
const userStore = useUserStore()
let dialogColorVisible = ref()
let TABC = ref()
let MIDC = ref()
let data = ref({
  os:[],
  my: [],
  other:[],
})
let clickTimer = null
let otherThemeRef = ref(null)
const activeNames = ref(['1'])
let pageNo = 1 //分页
let canGetTheme = true //是否到达最后一页
let gapTimer = null

//上传主题
const submitColor = () => {
  if(TABC.value && MIDC.value){
    // 发送添加主题的请求
    dialogColorVisible.value = false
    axios.post(`${apiCollection.UPLOAD_CUSTOM_COLOR}?t_upDownBack=${encodeURIComponent(TABC.value)}&t_mainBack=${encodeURIComponent(MIDC.value)}&creator=${userStore.getUserInfo().value.userId}`).then(res => {
      if(res.data.code === 200) {
        getCurUserData()
      } else {
        notification.ERROR_INFO("添加主题失败")
      }
    }).catch(() => {
      notification.ERROR_INFO("添加主题失败")
    })
  } else {
    Notification.WARNING_INFO("请同时设置两个配色")
  }
}

//获取配色主题
const getTheme = () => {
  if(canGetTheme) {
    axios.get(`${apiCollection.GET_THEME_BY_PAGE_NO}?page=${pageNo}&pageSize=15`).then(res => {
      if(res.data.code === 200) {
        pageNo++
        if (res.data.data.length < 15) {
          canGetTheme = false
        }
        for(let i of res.data.data){
          if(i.creator === "-1") {
            data.value.os.push(i)
          } else if (i.creator == userStore.getUserInfo().value.userId && data.value.my.length > 0){
            data.value.my.push(i)
          } else {
            data.value.other.push(i)
          }
        }
      } else {
        notification.ERROR_INFO("获取主题列表失败")
      }
    }).catch(() => {
      notification.ERROR_INFO("获取主题列表失败")
    })
  }
}

//mousedown新建计时器
const pressEvent = (i) => {
  clickTimer = setTimeout(() => {
    recheck(i)
  },800)
}

//mouseup逻辑
const mouseupEvent = () => {
  clearTimeout(clickTimer)
}

//更改主题
const alterUserTheme = (i) => {
  axios.post(`${apiCollection.ALTER_CUR_SET}?uid=${userStore.getUserInfo().value.userId}&tid=${i.tid}`).then(res => {
    if(res.data.code === 200) {
      themeStore.updateTheme(userStore.getUserInfo().value.userId, i.t_upDownBack, i.t_mainBack, i.tid)
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
      if(tid == themeStore.pageTheme.tid) {
        let i = {
          uid: null,
          t_upDownBack:'#212121',
          t_mainBack: '#2b2b2b',
          tid: -1
        }
        alterUserTheme(i)
      }
      data.value.my = data.value.my.filter(function(item) {
        return item.tid !== tid
      })
    } else {
      notification.ERROR_INFO("删除主题失败")
    }
  }).catch(() => {
    notification.ERROR_INFO("删除主题失败")
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

//滚动事件
const infiniteScroll = (e) => {
  if (otherThemeRef.value.clientHeight - e.scrollTop < 250 && activeNames.value == 3){
    debounce(500)
  }
}

//防抖
const debounce = (delay) => {
  clearTimeout(gapTimer)
  gapTimer = setTimeout(() => {
    getTheme()
  },delay)
}

//获取当前用户的数据
const getCurUserData = () => {
  axios.get(`${apiCollection.GET_COLOR_SET}`).then(res => {
    if(res.data.code === 200) {
      data.value.my = res.data.data.filter(function(item) {
        return item.creator == userStore.getUserInfo().value.userId
      })
    }
  })
}

onMounted(() => {
  getTheme()
  getCurUserData()
})

onUnmounted(() => {
  clearTimeout(clickTimer)
  clearTimeout(gapTimer)
})
</script>

<template>
  <div class="theme-main">
    <p class="theme-title">个性化你的播放器（双击应用主题）*暂未适配所有页面，仅作演示</p>
    <a :href="apiCollection.EXPORT_THEME_EXCEL" class="download-theme">导出主题excel</a>
    <el-scrollbar height="385px" @scroll="infiniteScroll">
      <el-collapse v-model="activeNames" accordion @change="changeA">
        <el-collapse-item title="&emsp;系统内置主题" name="1">
          <div class="theme-wrapper"
               v-for="i in data.os"
               @dblclick="alterUserTheme(i)"
               :style="{background:`linear-gradient(${i.t_upDownBack},${i.t_mainBack})`, border}">
          </div>
        </el-collapse-item>
        <el-collapse-item title="&emsp;我的主题" name="2">
          <span style="color: #b5b5b5;margin-left: 10px;font-size: 15px">长按删除主题</span>
          <br>
          <div class="theme-wrapper"
               v-for="i in data.my"
               :key="i"
               @dblclick="alterUserTheme(i)"
               @mousedown="pressEvent(i)"
               @mouseup="mouseupEvent()"
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
        </el-collapse-item>
        <el-collapse-item title="&emsp;共享主题" name="3">
          <div ref="otherThemeRef">
            <div class="theme-wrapper"
                 v-for="i in data.other"
                 @dblclick="alterUserTheme(i)"
                 :style="{background:`linear-gradient(${i.t_upDownBack},${i.t_mainBack})`}">
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>

    </el-scrollbar>
  </div>
</template>

<style scoped>
@import "@/assets/css/rightComponentsCss/theme.css";
</style>