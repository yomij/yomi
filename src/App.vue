<template>
  <Header />
	<RouterView />
  <router-link :to="{name: 'Photograph'}">
    http://192.168.31.194:3000/photograph
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { RouterView } from 'vue-router';
import Header from './components/header.vue';

export default defineComponent({
  name: 'App',
  components: {
    RouterView,
    Header,
  },
  created(): void {
    console.log();
  },
});
</script>

<style lang="scss">
@import './assets/css/index.scss';
@import "./assets/css/values.css";

@font-face {
  font-family: 'FCN';
  src: url('./assets/font/font-cn.ttf');
}

#app {
  font-family: FCN, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: var(--main-bg-color);
}
</style>
