<template>
  <header class="header" ref="headerRef" :class="[ isOpen && 'is-open' ]">
    <div class="header-inner">
      <a class="menu" @click="setOpen"></a>
      <a class="title" href="/">Y&Mi</a>
      <Nav class="flex-align-center fs header-nav" :navs="themeList" :isOpen="isOpen" />
      <i class="iconfont icon-chat"/>
    </div>
  </header>
</template>

<script lang="ts">
  import {useInjector} from "../lib/store";
  import tagStore from "../store/tagStore";
  import Nav from './nav.vue'
  import useRef from "../lib/hooks/useRef";
  import emit from "../lib/emit";

  export default {
    components: { Nav },
    setup() {
      const [themeList] = useInjector(tagStore);
      const [isOpen, setIsOpen] = useRef<boolean>(false);

      const setOpen = () => {
        document.body.style.overflow = !isOpen.value ? 'hidden' : 'inherit';
        setIsOpen(!isOpen.value)
      }

      emit.on('tagChange', setOpen)

      return { themeList, isOpen, setOpen }
    },
  };
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
  .header-inner {
    display: grid;
    width: 100%;
    grid-column-gap: 2.5rem;
    grid-template-areas: 'logo nav info';
    grid-template-columns: auto 1fr auto;
    .menu {
      grid-area: menu;
      align-self: center;
      &:after, &:before {
        background-color: currentColor;
        border-radius: 1px;
        content: "";
        display: block;
        height: 2px;
        transform: rotate(0deg);
        transform-origin: left;
        transition: transform .3s ease 0s,box-shadow .3s ease .3s;
        width: 20px;
        will-change: transform;
      }
      &:before {
        box-shadow: 0 7px 0 currentColor;
        margin-bottom: 12px;
      }
    }
    .title {
      font-size: 1.3rem;
      grid-area: logo;
    }
    .header-nav {
      grid-area: nav;
      justify-self: start;
      align-self: center;
    }
    .menu {
      display: none;
    }
    i {
      align-self: center;
      grid-area: info;
    }
  }

  @media only screen and (max-width: 75rem) {
    .header-inner {
      height: 2rem;
      grid-column-gap: 1rem;
      grid-template-areas: 'menu logo info'
                           'nav nav nav';
      grid-template-rows: auto 1fr;
      /*grid-template-columns: auto 1fr auto;*/
      .menu {
        display: block;
      }
    }
    header {
      height: calc(2rem + 4vw);
      .header-nav {
        display: none;
      }
      &.is-open {
        height: 100%;
        .header-nav {
          display: block;
          align-self: start;
        }
        .menu {
          &:after {
            transform: rotate(-45deg);
          }
          &:before {
            transform: rotate(45deg);
            box-shadow: 0 7px 0 transparent;
            transition: box-shadow .3s ease 0s;
          }
        }
      }
    }
  }

</style>
