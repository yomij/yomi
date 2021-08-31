<template>
  <div class="as-photographer" ref="containerRef">
    <div class="photos-container" :style="{height: containerHeight + 'px'}">
      <Preview :img-ob="showImg" :screen-width="containerWidth"/>
      <PhotoItem
        :data-index='index'
        :img-ob="img"
        :key="img.url"
        :standard-width="standardWidth"
        :style="{
          width: standardWidth + 'px',
          height: img.displayHeight + 'px',
          transform: img.offset?.transformText,
          marginTop: !img.join ? '50px' : 0,
        }"
        class="absolute item"
        :collectImgInstance="collector.bind(this, index)"
        v-for="(img, index) in imgList"
      />
    </div>
    <div class="no-more" v-if="!loading && isFinish">
      木得了😯😯😯
    </div>
  </div>
</template>

<script lang="ts">
  import PhotoItem from './photo-item.vue';
  import Preview from './preview.vue';
  import {defineComponent, ref} from 'vue';
  import {Photo} from "../../../types/photo";
  import {Resize, Scroll} from '../../../utils/event-handler';
  import ImgLoader from "../../../utils/img-loader";
  import {getElWidth, getStyles, getWindowHeight} from "../../../utils/dom-handler";
  import {decodeImage} from "../../../lib/blurhash-helper";
  import {PHOTO_WATERFALL_STATIC} from '../../../config';
  import api from '../../../request'
  import emit from "../../../lib/emit";
  import tagStore, {TagStore} from "../../../store/tagStore";
  import {useInjector} from "../../../lib/store";
  import useRef from "../../../lib/hooks/useRef";

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
        calculatedQuantity: 0,
        imgList: [] as Photo[],
        lastRow: [] as Photo[],
        showImg: {} as Photo,
        tag: {} as TagStore,
        visualList: [] as Photo[],

        page: {
          pageSize: 5,
          pageNo: 1,
        },
        loading: false,
        isFinish: false,
      };
    },
    setup() {
      const containerRef = ref<HTMLDivElement>();
      const [themeList] = useInjector(tagStore);
      const [imgElementList, setImageList] = useRef<HTMLImageElement[]>([]);

      function collector(index: number, img: HTMLImageElement) {
        imgElementList.value[index] = img
        setImageList(imgElementList.value)
      }

      return {
        containerRef,
        themeList,
        tag: themeList.value[0],
        imgElementList,
        collector,
      }
    },
    watch: {
      themeList(v) {
        this.tag = v[0]
        this.getData()
      }
    },
    computed: {
      containerHeight() {
        // @ts-ignore
        const data = this.lastRow.map((item: Photo) => item.offset!.y + item.displayHeight!)
        return Math.max(...data)
      }
    },
    mounted() {
      this.init()
      // 滚动事件监听
      Scroll.add(async (offset: number) => {
        if (!this.tag._id) return;
        const maxOffset = offset + getWindowHeight()
        if (maxOffset > this.biggestOffset - PHOTO_WATERFALL_STATIC.TRIGGER_THRESHOLD) {
          await this.getData()
        }
        this.calculation(offset, maxOffset)
      });
      // 屏幕大小变化监听
      Resize.add(() => {
        this.reset()
        const evt = document.createEvent('HTMLEvents');
        evt.initEvent('scroll', true, false);
        document.dispatchEvent(evt);
      });
      // 切换标签
      emit.on('tagChange', this.tagChange)
    },
    unmounted() {
      Resize.drop();
      Scroll.drop();
    },
    methods: {
      reset() {
        this.page = { ...this.page, pageNo: 1 };
        this.lastRow = []
        this.calculatedQuantity = 0;
        this.listCount = this.getCount(this.containerWidth = this.getContainerWidth());
      },
      async init() {
        this.imgList = []
        this.isFinish = false;
        this.loading = false;
        this.reset()
        await this.getData()
        this.calculation(0, getWindowHeight());
      },
      tagChange (item: TagStore) {
        this.tag = item
        this.init()
      },
      getContainerWidth() {
        const containerRef = this.containerRef!;
        const styles = getStyles(containerRef);
        return getElWidth(containerRef) - Number.parseFloat(styles.paddingLeft) - Number.parseFloat(styles.paddingRight);
      },
      calculation(minOffset: number, maxOffset: number) {
        console.time('calculation')
        const {listCount, imgList} = this;
        // 计算图片标准宽度
        const vw = this.containerWidth / 100;
        const gap = Math.max(PHOTO_WATERFALL_STATIC.PHOTO_PADDING * vw, PHOTO_WATERFALL_STATIC.MIN_GAP);
        this.standardWidth = (this.getContainerWidth() - (listCount - 1) * gap * 2) / listCount;
        // 图片可视范围
        const containerOffsetTop = this.containerRef!.offsetTop + Number.parseFloat(getStyles(this.containerRef!).paddingLeft);
        minOffset -= containerOffsetTop;
        maxOffset -= containerOffsetTop;
        let visualList: Photo[] = []
        // 开始计算位置
        for (let i = this.calculatedQuantity; i < imgList.length; i++) {
          let item = imgList[i];
          const minOffsetIndex = this.getMinOffsetIndex()
          const minOffsetItem = this.lastRow[minOffsetIndex]
          if (this.lastRow.length < this.listCount) {
            this.lastRow.push(item)
          }
          const ratio = item.width / this.standardWidth
          const x = minOffsetItem && minOffsetItem.offset ? minOffsetItem.offset.x : (this.standardWidth + gap * 2) * minOffsetIndex;
          const y = minOffsetItem && minOffsetItem.offset
            ? minOffsetItem.offset.y + (minOffsetItem.displayHeight as number) + gap * 2
            : 0;
          item.displayHeight = item.height / ratio;
          item.offset = {
            ratio, y, x,
            transformText: `matrix(1, 0, 0, 1, ${x}, ${y})`,
          };
          this.lastRow[minOffsetIndex] = item
          if (y + item.displayHeight < minOffset || y > maxOffset) {
            // 可视区域外
          } else if (!item.loader.loaded){
            visualList.push(item)
          }
        }

        // 获取可视范围內的图片，
        for (let i = 0; i < this.calculatedQuantity; i++) {
          const item = imgList[i];
          const y = item.offset!.y;
          if (y + item.displayHeight! < minOffset || y > maxOffset) {
            // 可视区域外
          } else if (!item.loader.loaded){
            visualList.push(item)
          }
        }
        ImgLoader.replaceLoaderMap(visualList.map(item => item.loader))
        this.visualList = visualList;
        this.calculatedQuantity = imgList.length
        this.$nextTick(() => {
          this.getMaxOffset()
          visualList.map(item => item.join = true)
        })
        console.timeEnd('calculation')
      },
      async getData() {
        if (this.loading || this.isFinish) { return }
        this.loading = true
        const remoteData = await api.getPhotographList<any>({
          data: { ...this.page, tag: [this.tag._id] }
        })
        if (this.imgList.length >= remoteData.total) {
          this.isFinish = true
          this.loading = false
          return
        }
        console.log(this.imgElementList, 111)
        const data: Photo[] = remoteData.list.map((item: any) => (
          {
            mainUrl: item.url + '-WEBP',
            height: item.meta.height,
            width: item.meta.width,
            thumbnail: item.blurStr,
            preview: decodeImage(
              item.blurStr,
              PHOTO_WATERFALL_STATIC.BLUR_IMAGE_WIDTH,
              Math.floor(item.meta.height / item.meta.width * PHOTO_WATERFALL_STATIC.BLUR_IMAGE_WIDTH)
            ),
            loader: new ImgLoader(item.url + '-WEBP'),
            join: false,
          }
        ))
        this.imgList.push(...data);
        this.page.pageNo++;
        this.loading = false
      },
      getCount(clientWidth: number) {
        console.log(clientWidth)
        // TODO finish this
        if (clientWidth < 700) { return 1; }
        if (clientWidth < 1100) { return 2; }
        return 3
      },
      // 获取最下一张图片的偏移量
      getMaxOffset() {
        let { lastRow } = this;
        this.biggestOffset = Math.max(...lastRow.map(item => (item.offset?.y || 0) + (item.displayHeight || 0)), this.biggestOffset);
      },
      getMinOffsetIndex() {
        let {listCount, lastRow, lastRow: { length }} = this;
        if (length < listCount || !length) { return length }
        const list = lastRow.map(item => (item.offset?.y || 0) + item.displayHeight!)
        return list.indexOf(Math.min(...list))
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

      .item {
        transition: margin-top .5s;
      }
    }
    .no-more {
      margin-top: 10px;
    }
  }
</style>
