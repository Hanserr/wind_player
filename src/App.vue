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
</template>

<script setup>

</script>

<style>
@import "assets/css/app.css";
</style>
