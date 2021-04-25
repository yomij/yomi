<template>
  <div class="as-photographer" ref="containerRef">
    <div class="photos-container">
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
  import { Scroll, Resize } from '../../../utils/event-handler';
  import ImgLoader from "../../../utils/img-loader";
  import {getStyles, getElWidth, getWindowHeight, getScrollTop} from "../../../utils/dom-handler";
  import { decodeImage, encodeImageToBlurhash } from "../../../lib/blurhash-helper";
  import { PHOTO_WATERFALL_STATIC } from '../../../config';

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
        const maxOffset = offset + getWindowHeight()
        if (maxOffset > this.biggestOffset - PHOTO_WATERFALL_STATIC.TRIGGER_THRESHOLD) {
          this.getData().then(() => this.calculation(offset, maxOffset));
        } else {
          this.calculation(offset, maxOffset);
        }
      });
      // 屏幕大小变化监听
      Resize.add(() => {
        this.calculatedQuantity = 0;
        this.containerWidth = this.getContainerWidth();
        this.listCount = this.getCount();
        const evt = document.createEvent('HTMLEvents');
        evt.initEvent('scroll', true, false);
        document.dispatchEvent(evt);
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
        this.calculation(0, getWindowHeight());
      },
      getContainerWidth() {
        const containerRef = this.containerRef! as HTMLElement;
        const styles = getStyles(containerRef);
        return getElWidth(containerRef) - Number.parseFloat(styles.paddingLeft)  - Number.parseFloat(styles.paddingRight);
      },
      calculation(minOffset: number, maxOffset: number) {
        console.time('calculation')
        const {listCount, imgList} = this;
        // 计算图片标准宽度
        const vw = this.containerWidth / 100;
        const gap = Math.max(PHOTO_WATERFALL_STATIC.PHOTO_PADDING * vw, PHOTO_WATERFALL_STATIC.MIN_GAP);
        this.standardWidth = (this.getContainerWidth() - (listCount - 1) * gap * 2) / listCount;

        // 图片可视范围
        const containerOffsetTop = (this.containerRef! as HTMLElement).offsetTop;
        minOffset -= containerOffsetTop;
        maxOffset -= containerOffsetTop;
        let visualList = []
        // 开始计算位置
        for (let i = this.calculatedQuantity; i < imgList.length; i++) {
          let item = imgList[i];
          const top = imgList[i - listCount];
          const left = i % listCount ? imgList[i % listCount - 1] : null;
          const ratio = item.width / this.standardWidth
          const x = (left && left.offset ? left.offset.x + this.standardWidth : 0) +
                    gap * (left && left.offset ? 2 : 0);
          const y = top && top.offset
                    ? top.offset.y + (top.displayHeight as number) + gap * 2
                    : 0;
          item.displayHeight = item.height / ratio;
          item.offset = {
            ratio, y, x,
            transformText: `matrix(1, 0, 0, 1, ${x}, ${y})`,
          };

          if (y + item.displayHeight > minOffset && y < maxOffset) {
            if (!item.loader.loaded) visualList.push(item.loader)
          }
        }

        for (let i = 0; i < this.calculatedQuantity; i++) {
          const item = imgList[i];
          const y = item.offset!.y;
          if (y + (item.displayHeight as number) > minOffset && y < maxOffset) {
            if (!item.loader.loaded) visualList.push(item.loader)
          }
        }

        ImgLoader.replaceLoaderMap(visualList)

        this.calculatedQuantity = imgList.length
        this.$nextTick(this.getBiggestOffset)
        console.timeEnd('calculation')
      },
      async getData() {
        const ex = [
          'https://images.unsplash.com/photo-1534865244288-b47fca3a35e0?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a37ca6252a729bfa42706b52771382f2&auto=format&fit=crop&w=334&q=80',
          'https://images.unsplash.com/photo-1535626412646-58a028a96cde?ixlib=rb-0.3.5&s=cf5d6abe4bf8993853185aba4d0d2875&auto=format&fit=crop&w=334&q=80',
          'https://images.unsplash.com/photo-1534941946572-23438b26af30?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=2a39cbef202ec33200977e0d25e9f5e8&auto=format&fit=crop&w=750&q=80',
        ]

        const decodeImageList = [
          'W88g,3]$=v-Usmf6}?}@^jw]oJof~B=^$$xGj[WV+[={xFoLWqR*',
          'W.L;HbRjIoWVWBWB~qWCs:ayWBj[Nxofs.oft7oLaJofR*ofofj@',
          'WfHe:[IURjWXfQay_NM|xuWBWBfR4nWCxuj]ofayE1RjRjt7s:fk',
        ]
        console.time('decodeStart')
        const data: Photo[] = [
        {
          mainUrl: ex[1],
          height: 501,
          width: 334,
          thumbnail: decodeImageList[1],
          preview: decodeImage(
            decodeImageList[1],
            PHOTO_WATERFALL_STATIC.BLUR_IMAGE_WIDTH,
            Math.floor(501 / 334 * PHOTO_WATERFALL_STATIC.BLUR_IMAGE_WIDTH)
          ),
          loader: new ImgLoader(ex[1]),
        }, {
          mainUrl: ex[0],
          height: 501,
          width: 334,
          thumbnail: decodeImageList[0],
          loader: new ImgLoader(ex[0]),
          preview: decodeImage(decodeImageList[0], PHOTO_WATERFALL_STATIC.BLUR_IMAGE_WIDTH, Math.floor(501 / 334 * PHOTO_WATERFALL_STATIC.BLUR_IMAGE_WIDTH))
        }, {
          mainUrl: ex[2],
          height: 500,
          width: 750,
          thumbnail: decodeImageList[2],
          loader: new ImgLoader(ex[2]),
          preview: decodeImage(decodeImageList[2], PHOTO_WATERFALL_STATIC.BLUR_IMAGE_WIDTH, Math.floor(500 / 750 * PHOTO_WATERFALL_STATIC.BLUR_IMAGE_WIDTH))
        }];
        console.timeEnd('decodeStart')
        this.imgList.push(...data);
      },
      getCount() {
        // TODO finish this
        return 3
      },
      // 获取最下一张图片的偏移量
      getBiggestOffset() {
        let { listCount, imgList } = this;
        let biggestOffset = 0;
        while (listCount) {
          let photo = imgList[imgList.length - listCount--];
          biggestOffset = Math.max(photo.offset!.y + photo.height, biggestOffset);
        }
        this.biggestOffset = biggestOffset;
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
