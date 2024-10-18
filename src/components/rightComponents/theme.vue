<script setup>
import {useThemeStore} from "@/store/themeStore";
import {ref} from "vue";
import Notification from "@/tools/notification";
const themeStore = useThemeStore();
let dialogColorVisible = ref()
let TABC = ref()
let MIDC = ref()

//
let data = [
  {
    top_color: "#30415d",
    middle_color: "#6b7a8f",
    id: 1
  },
  {
    top_color: "#626e60",
    middle_color: "#3c3c3c",
    id: 2
  },
  {
    top_color: "#dcd0c0",
    middle_color: "#9f9f9f",
    id: 3
  },
]

const submitColor = () => {
  if(TABC.value && MIDC.value){
    // 发送添加主题的请求
    dialogColorVisible.value = false
    themeStore.pageTheme.middleColor = MIDC.value
    themeStore.pageTheme.topAndBottomColor = TABC.value
  } else {
    Notification.LESS_COLOR()
  }
}
</script>

<template>
  <div class="theme-main">
    <p class="theme-title">个性化你的播放器（*暂未适配所有页面，仅作演示）</p>
    <el-scrollbar height="450px">
      <div class="theme-wrapper"
           v-for="i in data"
           @click="themeStore.updateTheme(i.top_color, i.middle_color, i.id)"
           :style="{background:`linear-gradient(${i.top_color},${i.middle_color})`}"
      ></div>
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
      <div class="reset-theme" @click="themeStore.resetTheme()">
        <span>重置主题</span>
      </div>
    </el-scrollbar>
  </div>
</template>

<style scoped>
@import "@/assets/css/rightComponentsCss/theme.css";
</style>