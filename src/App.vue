<template>
  <main>
    <Header
      ref="headerRef"
      class="header"
      :style="{
        transform: `translateY(${scrollDir === ScrollEnum.DOWN && scrollTop > THRESHOLD ? '-100%' : 0})`,
        boxShadow: scrollTop > 100 ? '0 2px 8px 0 rgb(16 7 104 / 7%)' : 'none',
      }"
    />
    <div :style="{paddingTop: height}">
      <RouterView />
    </div>
  </main>
</template>

<script lang="ts">
  import {defineComponent, getCurrentInstance, ref} from 'vue';
  import {RouterView} from 'vue-router';
  import Header from './components/header.vue';
  import {getStyles} from "./utils/dom-handler";
  import {Resize, Scroll} from "./utils/event-handler";
  import {useProvider} from "./lib/store";
  import tagStore, {TagStore} from "./store/tagStore";
  import request from "./request";
  import OS from "./utils/os";
  import {HEADER_STATIC} from './config'


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
        scrollTop: 0,
      }
    },
    setup: () => {
      const headerRef = ref<any>(null);
      const [themeList, setThemeList] = useProvider(tagStore);
      request.getTagByGroup<TagStore[]>({ params: { group: 'photograph' }})
        .then((themeList) => setThemeList(themeList) )
      return { headerRef, OS, THRESHOLD: HEADER_STATIC.THRESHOLD }
    },
    mounted() {
      this.styleHandler()
    },
    methods: {
      styleHandler() {

        // 计算header高度
        this.height = getStyles(this.headerRef.$el).height;
        Resize.add(() => (this.height = getStyles(this.headerRef.$el).height));
        // 判断滚动方向
        let oldScrollTop = 0
        Scroll.add((scrollTop: number) => {
          const diff = oldScrollTop - scrollTop
          if (
            diff > 60 ||
            diff > 0 &&
            scrollTop <= Number.parseFloat(this.height)
          ) {
            this.scrollDir = ScrollEnum.UP
          }
          if (diff < 0) {
            this.scrollDir = ScrollEnum.DOWN
          } else if (diff >= this.THRESHOLD && this.scrollDir === ScrollEnum.DOWN) {
            this.scrollDir = ScrollEnum.UP
          }
          oldScrollTop = scrollTop
          this.scrollTop = scrollTop
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
    transition: all .3s ease-in-out;
  }
</style>
