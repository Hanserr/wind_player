<script setup>
import {useThemeStore} from "@/store/themeStore";

const themeStore = useThemeStore();
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
</script>

<template>
  <div class="theme-main">
    <p class="theme-title">个性化定制你的播放器</p>
    <el-scrollbar height="450px">
      <div class="theme-wrapper"
           v-for="i in data"
           @click="themeStore.updateTheme(i.top_color, i.middle_color, i.id)"
           :style="{background:`linear-gradient(${i.top_color},${i.middle_color})`}"
      ></div>
      <div class="theme-wrapper"
           style="background: conic-gradient(#9ED110, #50B517, #179067, #476EAF, #9f49ac, #CC42A2, #FF3BA7, #FF5800, #FF8100, #FEAC00, #FFCC00, #EDE604);line-height: 150px;color: white;font-weight: bold">
        <span>自定义主题</span>
      </div>
      <div class="reset-theme" @click="themeStore.resetTheme()">
        <span>重置主题</span>
      </div>
    </el-scrollbar>
  </div>
</template>

<style scoped>
@import "@/assets/css/rightComponentsCss/theme.css";
</style>