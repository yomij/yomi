<template>
  <div v-show="isShow" class="big-photo" @click.self="isShow = false">
    <div class="img-container">
      <div class="top">
        <i class="iconfont icon-didian mr-10"/>浙江 杭州
        <i class="iconfont icon-web-icon-"/>2018-9-9
      </div>
      <div :class="{enlarge: isEnlarge}" class="middle">
        <img :class="{enlarge: isEnlarge}" :src="imgOb.smallUrl" @click="enlarge"/>
      </div>
      <div class="bottom pd-12-9 c-6">
        后来，我的梦境总是反复出现这场无声无息的火，无数飞虫朝它飞去，它们仿佛是早就存在于这个世界的记忆碎片，旧时尘埃。
      </div>
    </div>
  </div>
</template>

<script>
  
  import {defineComponent} from 'vue';
  
  export default defineComponent({
    name: 'Preview',
    props: {
      imgOb: {
        type: Object,
      },
      screenWidth: {
        default: 0,
        type: Number,
      },
    },
    data() {
      return {
        isEnlarge: false,
        isShow: false,
      };
    },
    watch: {
      isShow(val) {
        if (val) {
          // alert(val)
          document.body.className = 'modal-body';
        } else {
          document.body.className = '';
          this.isEnlarge = false;
        }
      },
      imgOb() {
        this.isShow = true;
      },
    },
    created() {
      // document.body.className = 'modal-body'                                                                                    <34cvv></34cvv>
    },
    methods: {
      enlarge() {
        if (this.screenWidth > 770) {
          this.isEnlarge = !this.isEnlarge;
        }
      },
    },
  });
</script>

<style lang="scss" scoped>
  @media screen and (max-width: 770px) {
    .big-photo {
      padding: 0 30px;
      
      .img-container {
        padding-top: 50px !important;
        
        .middle {
          height: auto !important;
          min-height: auto !important;
          
          img {
            width: 100%;
            height: auto !important;
            cursor: default !important;
          }
        }
      }
    }
  }
  
  @media screen and (min-width: 770px) {
    .big-photo {
      padding: 0 80px;
    }
  }
  
  @media screen and (min-width: 1400px) {
    .big-photo {
      padding: 0 120px;
    }
  }
  
  .big-photo {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 5000;
    background-color: rgba(0, 0, 0, .6);
    overflow: auto;
    width: 100%;
    height: 100%;
    
    .img-container {
      width: 100%;
      position: relative;
      padding-top: 20px;
      height: 100%;
      
      .top {
        position: -webkit-sticky;
        position: sticky;
        width: 100%;
        height: 62px;
        top: 0;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        overflow: hidden;
        background-color: #fff;
        z-index: 1;
      }
      
      .middle {
        position: relative;
        width: 100%;
        background-color: #fff;
        text-align: center;
        height: calc(100% - 120px);
        min-height: 330px;
        padding: 10px 0;
        
        &.enlarge {
          height: auto;
        }
        
        img {
          position: relative;
          margin: 0 auto;
          height: 100%;
          max-width: 100%;
          display: block;
          cursor: zoom-in;
          
          &.enlarge {
            width: 100%;
            cursor: zoom-out;
            max-width: 100%;
            height: auto;
          }
        }
      }
      
      .bottom {
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        background: #fff;
        // height: 80px;
        width: 100%;
        
      }
    }
  }
</style>
