<template>
  <main>
    <Header
      ref="headerRef"
      class="header"
      :style="{
        transform: `translateY(${scrollDir === ScrollEnum.DOWN ? '-100%' : 0})`
      }"
    />
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
  import {Resize, Scroll} from "./utils/event-handler";

  enum ScrollEnum {
    UP = 'up',
    DOWN = 'down',
  }

  export default defineComponent({
    name: 'App',
    components: {
      RouterView,
      Header,
    },
    data () {
      return {
        height: '',
        scrollDir: '' as ScrollEnum,
        ScrollEnum,
      }
    },
    setup: () => {
      const headerRef = ref<any>(null);
      return {
        headerRef,
      }
    },
    mounted() {
      this.styleHandler()
    },
    methods: {
      styleHandler() {
        const THRESHOLD = 100
        // 计算header高度
        this.height = getStyles(this.headerRef.$el).height;;
        Resize.add(() => {
          this.height = getStyles(this.headerRef.$el).height;
        });
        // 判断滚动方向
        let oldScrollTop = 0
        Scroll.add((scrollTop: number) => {
          if (
            oldScrollTop - scrollTop > 0 &&
            scrollTop <= Number.parseFloat(this.height)
          ) {
            this.scrollDir = ScrollEnum.UP
          }
          if (scrollTop - oldScrollTop > 0) {
            this.scrollDir = ScrollEnum.DOWN
          } else if (oldScrollTop - scrollTop >= THRESHOLD && this.scrollDir === ScrollEnum.DOWN) {
            this.scrollDir = ScrollEnum.UP
          }
          oldScrollTop = scrollTop
        });
      }
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

  body {
    overflow-y: scroll;
  }
  
  #app {
    font-family: FCN, Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    background-color: var(--main-bg-color);
  }

  .header {
    transition: all .1s ease-in-out;
  }
</style>
