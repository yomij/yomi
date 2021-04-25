<template>
  <div class="photo-main-item">
    <Sketch
      class="sketch"
      :key="imgOb.thumbnail"
      :standardWidth="standardWidth"
      :imgOb="imgOb"
      v-if="!imgUrl"
    />
    <img :src="imgUrl" @mouseenter="isShow = true" class="photo-item" v-else/>
    <div @mouseleave="isShow = false" class="operation" v-show="isShow">
      <a class="like button-common">
        <svg aria-hidden="false" class="heart-icon" height="32" version="1.1" viewBox="0 0 32 32" width="32">
          <path
              d="M17.4 29c-.8.8-2 .8-2.8 0l-12.3-12.8c-3.1-3.1-3.1-8.2 0-11.4 3.1-3.1 8.2-3.1 11.3 0l2.4 2.8 2.3-2.8c3.1-3.1 8.2-3.1 11.3 0 3.1 3.1 3.1 8.2 0 11.4l-12.2 12.8z"></path>
        </svg>
      </a>
      <div class="bottom-tip">
        <p class="PhotoItem-inf">
          <i class="iconfont icon-xiangjisheying fs-18"></i> yomi
          <i class="iconfont icon-web-icon- fs-20"></i> 18-7-30
        </p>
        <a class="download button-common">
          <svg aria-hidden="false" class="download-icon" height="32" version="1.1" viewBox="0 0 32 32" width="32">
            <path d="M25.8 15.5l-7.8 7.2v-20.7h-4v20.7l-7.8-7.2-2.7 3 12.5 11.4 12.5-11.4z"></path>
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {defineComponent, PropType} from 'vue'
  import {Photo} from "../../../types/photo";
  import Sketch from './sketch.vue'

  export default defineComponent({
    name: 'PhotoItem',
    components: {
      Sketch,
    },
    props: {
      imgOb: {
        type: Object as PropType<Photo>,
        default: () => {}
      },
      standardWidth: {
        default: 0,
        type: Number
      },
    },
    created() {
      this.imgLoading(this.imgOb);
    },
    data() {
      return {
        imgUrl: '',
        isShow: false,
      }
    },
    methods: {
      imgLoading(imgOb: Photo) {
        let imgUrl = new Image();
        imgUrl.src = imgOb.mainUrl;
        if (imgUrl.complete) {
          this.imgUrl = imgOb.mainUrl;
        } else {
          imgUrl.onload = () => {
            this.imgUrl = imgOb.mainUrl;
          }
        }
      }
    },
    watch: {
      imgOb: {
        handler: function (val: Photo) {
          this.imgLoading(val)
        },
        deep: true
      }
    }
  })
</script>

<style lang="scss" scoped>
  .photo-main-item {
    width: 100%;
    margin-bottom: .5vw;
    height: auto;
    display: block;
    .sketch {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 12;
      width: 100%;
      height: auto;
    }

    .photo-item {
      cursor: zoom-in;
      width: 100%;
    }
    
    .operation {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      cursor: zoom-in;
      padding: 20px;
      background-image: linear-gradient(180deg, rgba(0, 0, 0, .2) 0, transparent 40%, transparent 60%, rgba(0, 0, 0, .3));
      
      .like {
        // width: 80px;
        float: right;
        background-color: hsla(0, 0%, 100%, .85);
        border: 1px solid transparent;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .04);
        
        &:hover {
          background-color: hsla(0, 0%, 100%, 1);
        }
        
        .heart-icon {
          position: relative;
          top: -1px;
          width: 15px;
          fill: #f15151
        }
      }
      
      .bottom-tip {
        position: absolute;
        bottom: 20px;
        width: calc(100% - 40px);
        line-height: 32px;
        box-sizing: border-box;
        
        .PhotoItem-inf {
          color: hsla(0, 0%, 100%, .85);
          cursor: pointer;
          display: inline-block;;
          
          &:hover {
            color: hsla(0, 0%, 100%, 1);
          }
        }
        
        .download {
          float: right;
          color: hsla(0, 0%, 100%, .85);
          background-color: hsla(0, 0%, 100%, .85);
          border: 1px solid transparent;
          box-shadow: 0 1px 1px rgba(0, 0, 0, .04);
          
          &:hover {
            background-color: hsla(0, 0%, 100%, 1);
          }
          
          .download-icon {
            position: relative;
            top: -1px;
            width: 15px;
            color: #777;
            fill: currentColor;
          }
        }
      }
    }
  }
</style>
