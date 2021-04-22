<template>
  <main>
    <Header ref="headerRef"/>
    <div :style="{paddingTop: height}">
      <RouterView />
    </div>
  </main>
</template>

<script lang="ts">
  import {defineComponent, ref} from 'vue';
  import {RouterView} from 'vue-router';
  import Header from './components/header.vue';
  import {getStyles} from "./utils/dom-handler";
  import {Resize} from "./utils/event-handler";

  export default defineComponent({
    name: 'App',
    components: {
      RouterView,
      Header,
    },
    data () {
      return {
        height: '',
      }
    },
    setup: () => {
      const headerRef = ref<any>(null);
      return {
        headerRef,
      }
    },
    mounted() {
      this.height = this.headerRef.$el;
      Resize.add(() => {
        this.height =  getStyles(this.headerRef.$el).height;
      });
    }
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
