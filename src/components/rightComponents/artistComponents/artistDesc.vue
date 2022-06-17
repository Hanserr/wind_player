<template>
  <div id="artistDesc">
    {{route.params.desc}}
  </div>
</template>

<script setup>
import {useRoute} from "vue-router";

const route = useRoute()
</script>

<style scoped>
@import "../../../assets/css/rightComponentsCss/artistComponents/artistDesc.css";
</style>
