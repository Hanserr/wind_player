<template>
<div class="playerPage">
  <div class="playerPageLeft">
   <navigation></navigation>
  </div>
</div>
</template>

<script>
import Navigation from "@/components/navigation";
export default {
  name: "mainPage",
  components: {Navigation}
}
</script>

<style scoped>
@import "../assets/css/main.css";
</style>