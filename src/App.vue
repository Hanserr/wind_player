<template>
  <div id="app">
    <router-view
    v-slot="{Component}">
    <keep-alive>
      <component :is="Component" :key="$route.name" v-if="$route.meta.keepAlive" ></component>
    </keep-alive>
    <component :is="Component" :key="$route.name" v-if="!$route.meta.keepAlive" ></component>
    </router-view>
  </div>
  <audio ref="audioRef" :src="songStore.getCurSong().value.src || null"/>
</template>

<script setup>
import {useSongStore} from "@/store/songStore";
import {onMounted, ref} from "vue";
const songStore = useSongStore();

const audioRef = ref() //播放器DOM

onMounted(() => {
  songStore.initAudio(audioRef.value)
})
</script>

<style>
@import "assets/css/app.css";
</style>
