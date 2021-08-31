<template>
  <nav class="flex-align-center fs" :class="[isOpen && 'open']">
    <div
      @click="tagChange(item)"
      v-for="(item, index) of navs"
      :data-value="item._id"
      :key="item._id"
      :ref="(node) => navRef[index] = node"
      :class="[
        'nav-wrapper',
        selectedTag?._id === item?._id && 'selected'
      ]"
    >
      <a :href="item.href">{{item.tag}}</a>
    </div>
    <div
      class="slider"
      v-if="offset > 0"
      :style="{
        width: SLIDER_WIDTH + 'px',
        transform: `translateX(${offset}px)`,
      }"
    />
  </nav>
</template>

<script lang="ts">
  import {TagStore} from "../store/tagStore";
  import emit from "../lib/emit";
  import {ref, watch, nextTick} from 'vue'
  import useRef from "../lib/hooks/useRef";

  const SLIDER_WIDTH = 10;

  type NavProps = {
    navs: TagStore[],
    isOpen: boolean;
  }

  export default {
    props: {
      navs: [],
      isOpen: false,
    } as NavProps,
    setup(props: NavProps) {
      const [selectedTag, setSelectedTag] = useRef<TagStore>()
      const navRef = ref<HTMLDivElement[]>([]);
      const [offset, setOffset] = useRef<number>(0)

      const getTranslate = (value: string) => {
        if (!value) return 0;
        const navs = navRef.value
        let distance = 0
        for (let index = 0; index < navs.length; index++) {
          let i = navs[index] as HTMLDivElement
          if (i.dataset.value!.toString() === value.toString()) {
            distance += (i.clientWidth  - SLIDER_WIDTH) / 2
            break
          }
          distance += (i.clientWidth + parseFloat(getComputedStyle(i).marginRight))
        }
        return distance
      }

      watch(props, () => {
        nextTick(() => {
          setSelectedTag(props.navs[0] || {})
          setOffset(getTranslate(props.navs[0]._id))
        })
      })

      return {
        selectedTag,
        SLIDER_WIDTH,
        navRef,
        offset,
        getTranslate,
        tagChange: (item: TagStore) => {
          selectedTag.value = item
          setOffset(getTranslate(item._id))
          emit.emit('tagChange', item)
        },
      }
    }
  };
</script>

<style lang="scss" scoped>

  nav {
    font-size: .8rem;
    height: 1.5rem;
    line-height: 1.5rem;
    position: relative;
  }

  .nav-wrapper {
    padding: 0 .5rem;
    display: flex;
    align-items: center;
    a {
      color: var(--header-font-color);
      cursor: pointer;

    }
    &.selected {
      font-weight: 600;
      color: var(--black);
    }
  }
  .slider {
    position: absolute;
    left: 0;
    transition: all .3s ease-in-out;
    bottom: -1px;
    height: 1px;
    border-radius: 1px;
    background-color: var(--header-font-color);
  }

  @media only screen and (max-width: 75rem) {
    .slider {
      display: none;
    }
    nav {
      padding: 1rem 0;
      width: 100%;
    }
  }


</style>
