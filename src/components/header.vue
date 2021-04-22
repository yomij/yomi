<template>
  <header class="header flex-align" ref="headerRef">
    <a class="title" href="/">YOMI</a>
    <nav class="flex-align-center fs">
      <div v-for="item of themeList" :key="item.value" class="nav-wrapper">
        <a :href="item.href">{{item.value}}</a>
      </div>
    </nav>
  </header>
</template>

<script lang="ts">
  import {defineComponent, ref, computed} from 'vue';

  export default defineComponent({
    name: 'Header',
    data() {
      return {
        themeList: [{
          weights: 100,
          value: '黑与灰',
          href: '/',
        }, {
          weights: 90,
          value: '你与梦',
          href: '/',
        }],
      };
    },
  });
</script>

<style lang="scss" scoped>
  header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 20;
    padding: 2vw 4vw;
    cursor: default;
    user-select: none;
    color: var(--header-font-color);
    font-weight: 500;
    background: var(--main-bg-color);
    
    a {
      color: var(--header-font-color);
      cursor: pointer;
    }
  }
  
  .title {
    font-size: 2rem;
    margin-right: 3rem;
  }
  
  nav {
    font-size: 1rem;
    
  }
  
  .nav-wrapper {
    margin-right: 1rem;
  }
</style>
