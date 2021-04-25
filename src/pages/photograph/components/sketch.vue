<template>
  <img :src="SRC" class="blur"/>
</template>

<script lang="ts">
  import { defineComponent, ref, PropType } from 'vue';
  import { Photo } from "../../../types/photo";
  import { PHOTO_WATERFALL_STATIC } from "../../../config";

  export default defineComponent({
    name: 'Sketch',
    props: {
      imgOb: {
        type: Object as PropType<Photo>,
        default: {},
      },
      standardWidth: {
        default: 0,
        type: Number
      },
    },
    setup() {
      const canvasElement = ref<any>(null);
      return {
        canvasElement,
      }
    },
    data () {
      return {
        SRC: '',
      }
    },
    created() {
      this.createImage()
    },
    methods: {
      createImage() {
        const { BLUR_IMAGE_WIDTH } = PHOTO_WATERFALL_STATIC;
        const buffer = document.createElement('canvas');
        const height = Math.floor(this.imgOb.height * BLUR_IMAGE_WIDTH / this.imgOb.width);
        buffer.width = BLUR_IMAGE_WIDTH;
        buffer.height = height;
        const ctx = buffer.getContext('2d')!;
        const imageData = ctx.createImageData(BLUR_IMAGE_WIDTH, height);
        imageData.data.set(this.imgOb.preview!);
        ctx.putImageData(imageData, 0, 0);
        this.SRC = buffer.toDataURL('image/png');
      }
    }
  });
</script>

<style lang="scss" scoped>
  .blur {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>