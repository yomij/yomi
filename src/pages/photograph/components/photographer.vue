<template>
  <div class="as-photographer">
    <div class="photos-container" ref="containerRef">
      <Preview :img-ob="showImg" :screen-width="containerWidth"/>
      <PhotoItem
        class="absolute"
        v-for="(img, index) in imgList"
        :key="index"
        :data-index='index'
        :img-ob="img"
        :standard-width="standardWidth"
        :style="{
          width: standardWidth + 'px',
          transform: img.offset.transformText
        }"
      />
    </div>
  </div>
</template>

<script lang="ts">
  import PhotoItem from './photo-item.vue';
  import Preview from './preview.vue';
  import { defineComponent, ref } from 'vue';
  import { Photo } from "../../../types/photo";
  import { Scroll, Resize } from '../../../lib/event-handler';

  const PHOTO_PADDING = 0.25; // 单位 vm
  const TRIGGER_THRESHOLD = 200; // 单位 px
  const MIN_GAP = 20; // 单位 px

  export default defineComponent({
    name: 'Photographer',
    components: {
      Preview,
      PhotoItem,
    },
    data() {
      return {
        containerWidth: 0,
        standardWidth: 0,
        biggestOffset: 0,
        listCount: 0,
        showImg: {} as Photo,
        imgList: [] as Array<Photo>,
        calculatedQuantity: 0,
      };
    },
    setup() {
      const containerRef = ref<any>(null);
      return {
        containerRef,
      }
    },
    mounted() {
      this.init();
      // 滚动事件监听会掉
      Scroll.add((offset: number) => {
        if (offset > this.biggestOffset - TRIGGER_THRESHOLD) {
          this.getData();
        }
      });
      // 屏幕大小变化监听
      Resize.add(() => {
        this.calculatedQuantity = 0;
        this.containerWidth = this.getContainerWidth();
        this.listCount = this.getCount();
        this.getBiggestOffset();
        this.calculation();
      });
    },
    unmounted() {
      Resize.drop();
      Scroll.drop();
    },
    methods: {
      init() {
        this.containerWidth = this.getContainerWidth();
        this.listCount = this.getCount();
        this.getData();
        this.calculation();
      },
      getContainerWidth() {
        const containerRef = this.containerRef! as HTMLElement;
        const styles = window.getComputedStyle(containerRef);
        return containerRef.clientWidth - Number.parseFloat(styles.paddingLeft)  - Number.parseFloat(styles.paddingRight);
      },
      calculation() {
        const {listCount, imgList} = this;
        // 计算标准宽度
        const vw = Math.max(this.containerWidth / 100, MIN_GAP);
        this.standardWidth = (this.containerWidth - listCount * PHOTO_PADDING * 2 * vw) / listCount;
        for (let i = this.calculatedQuantity; i < imgList.length; i++) {
          let item = imgList[i];
          const top = imgList[i - listCount];
          const left = i % listCount ? imgList[i % listCount - 1] : null;
          const ratio = item.width / this.standardWidth
          const x = (left && left.offset ? left.offset.x + this.standardWidth : 0) +
                    PHOTO_PADDING * (left && left.offset ? 2 : 1) * vw;
          const y = top && top.offset ? top.offset.y + top.height / top.offset.ratio +
                    PHOTO_PADDING * 2 * vw : 0
          item.offset = {
            ratio, y, x,
            transformText: `matrix(1, 0, 0, 1, ${x}, ${y})`,
          };
        }
        this.calculatedQuantity = imgList.length
      },
      getData() {
        this.imgList.push(...[{
          mainUrl: 'https://images.unsplash.com/photo-1535626412646-58a028a96cde?ixlib=rb-0.3.5&s=cf5d6abe4bf8993853185aba4d0d2875&auto=format&fit=crop&w=334&q=80',
          height: 501,
          width: 334,
          thumbnail: '',
        }, {
          mainUrl: 'https://images.unsplash.com/photo-1534865244288-b47fca3a35e0?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a37ca6252a729bfa42706b52771382f2&auto=format&fit=crop&w=334&q=80',
          height: 501,
          width: 334,
          thumbnail: '',
        }, {
          mainUrl: 'https://images.unsplash.com/photo-1534941946572-23438b26af30?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=2a39cbef202ec33200977e0d25e9f5e8&auto=format&fit=crop&w=750&q=80',
          height: 500,
          width: 750,
          thumbnail: '',
        }, {
          mainUrl: 'https://images.unsplash.com/photo-1535626412646-58a028a96cde?ixlib=rb-0.3.5&s=cf5d6abe4bf8993853185aba4d0d2875&auto=format&fit=crop&w=334&q=80',
          height: 501,
          width: 334,
          thumbnail: '',
        }, {
          mainUrl: 'https://images.unsplash.com/photo-1534865244288-b47fca3a35e0?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a37ca6252a729bfa42706b52771382f2&auto=format&fit=crop&w=334&q=80',
          height: 501,
          width: 334,
          thumbnail: '',
        }, {
          mainUrl: 'https://images.unsplash.com/photo-1534941946572-23438b26af30?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=2a39cbef202ec33200977e0d25e9f5e8&auto=format&fit=crop&w=750&q=80',
          height: 500,
          width: 750,
          thumbnail: '',
        }, {
          mainUrl: 'https://images.unsplash.com/photo-1535626412646-58a028a96cde?ixlib=rb-0.3.5&s=cf5d6abe4bf8993853185aba4d0d2875&auto=format&fit=crop&w=334&q=80',
          height: 501,
          width: 334,
          thumbnail: '',
        }, {
          mainUrl: 'https://images.unsplash.com/photo-1534865244288-b47fca3a35e0?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a37ca6252a729bfa42706b52771382f2&auto=format&fit=crop&w=334&q=80',
          height: 501,
          width: 334,
          thumbnail: '',
        }, {
          mainUrl: 'https://images.unsplash.com/photo-1534941946572-23438b26af30?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=2a39cbef202ec33200977e0d25e9f5e8&auto=format&fit=crop&w=750&q=80',
          height: 500,
          width: 750,
          thumbnail: '',
        }, {
          mainUrl: 'https://images.unsplash.com/photo-1535626412646-58a028a96cde?ixlib=rb-0.3.5&s=cf5d6abe4bf8993853185aba4d0d2875&auto=format&fit=crop&w=334&q=80',
          height: 501,
          width: 334,
          thumbnail: '',
        }, {
          mainUrl: 'https://images.unsplash.com/photo-1534865244288-b47fca3a35e0?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a37ca6252a729bfa42706b52771382f2&auto=format&fit=crop&w=334&q=80',
          height: 501,
          width: 334,
          thumbnail: '',
        }, {
          mainUrl: 'https://images.unsplash.com/photo-1534941946572-23438b26af30?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=2a39cbef202ec33200977e0d25e9f5e8&auto=format&fit=crop&w=750&q=80',
          height: 500,
          width: 750,
          thumbnail: '',
        }, {
          mainUrl: 'https://images.unsplash.com/photo-1535626412646-58a028a96cde?ixlib=rb-0.3.5&s=cf5d6abe4bf8993853185aba4d0d2875&auto=format&fit=crop&w=334&q=80',
          height: 501,
          width: 334,
          thumbnail: '',
        }, {
          mainUrl: 'https://images.unsplash.com/photo-1534865244288-b47fca3a35e0?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a37ca6252a729bfa42706b52771382f2&auto=format&fit=crop&w=334&q=80',
          height: 501,
          width: 334,
          thumbnail: '',
        }, {
          mainUrl: 'https://images.unsplash.com/photo-1534941946572-23438b26af30?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=2a39cbef202ec33200977e0d25e9f5e8&auto=format&fit=crop&w=750&q=80',
          height: 500,
          width: 750,
          thumbnail: '',
        }]);
        this.calculation();
      },
      getCount() {
        return 1
      },
      // 获取最下一张图片的偏移量
      getBiggestOffset() {
        let { listCount, imgList } = this;
        let biggestOffset = 0;
        while (listCount) {
          let photo = imgList[imgList.length - listCount--];
          biggestOffset = Math.max(photo.offset!.y + photo.height, biggestOffset);
        }
        return biggestOffset;
      },
      // TODO finish this
      lookBigPhoto(e: Event, i: number) {
        const target = e.target as HTMLElement;
        if (target.className === 'operation') {
          let index = Number((target.parentNode as HTMLElement).dataset.index);
        }
      },
    },
  });
</script>

<style lang="scss" scoped>
  .as-photographer {
    width: 100%;
    padding: 3.75vw;
    min-height: 10vw;
    overflow-y: auto;
    .photos-container {
      width: 100%;
      .photos {
        padding: 0 .25vw;
      }
    }
  }
</style>
