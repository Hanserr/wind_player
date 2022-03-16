<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
#app{
  width: 100vw;
  height: 100vh;
  background: url("./assets/pic/bg.webp") no-repeat center 0;
  background-size: cover;
  -webkit-background-size: cover;
  -o-background-size: cover;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
