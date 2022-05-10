<template>
  <!-- hearder -->
  <home-nav></home-nav>
  <!-- main -->
  <home-main class="home-main"></home-main>
  <!-- 脚本导航 -->
  <layout-footer></layout-footer>
</template>
<script setup>
import LayoutFooter from '@/components/LayoutFooter.vue'
import HomeNav from './components/HomeNav.vue'
import HomeMain from './components/HomeMain.vue'
</script>
<style lang="scss" scoped>
.home-main {
  padding: 50px 0;
  background-color: #f7f7f7;
}
</style>