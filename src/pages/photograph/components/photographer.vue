<template>
  <div class="as-photographer">
    {{listCount}}
    <div v-if="listCount" class="photos-container">
      <Preview :img-ob="showImg" :screen-width="screenWidth"/>
      <div
          ref="photolist"
          :style="{width: 100.0 / listCount + '%'}"
          class="photos" @click="lookBigPhoto($event, i - 1)"
      >
        <PhotoItem
            v-for="(img, index) in imgList"
            :key="index"
            :data-index='index'
            :img-ob="img"
            :standard-width="standardWidth"
            :style="{
              width: '400px',
              position: 'absolute',
              transform: img.offset[listCount - 1].text
            }"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import Scroll from '../../../lib/Scroll.ts';
  import PhotoItem from './photo-item.vue';
  import Preview from './preview.vue';
  import {defineComponent} from 'vue';
  
  export default defineComponent({
    name: 'Photographer',
    components: {
      Preview,
      PhotoItem,
    },
    data() {
      return {
        screenWidth: 0,
        listCount: 3,
        timer: false,
        lists: [],
        showImg: {},
        standardWidth: 0,
        biggestOffset: 0,
        imgList: [],
        scroll: undefined,
        MAX_COL: 3,
      };
    },
    watch: {
      listCount() {
        if (this.listCount === 1) {
          this.lists = [this.imgList];
          this.getBiggestOffset();
          return;
        }
        let lists = [];
        this.imgList.forEach((item, index) => {
          let f = index % this.listCount;
          if (typeof lists[f] === 'object') {
            lists[f].push(item);
          } else {
            lists[f] = [item];
          }
        });
        this.lists = lists;
        this.getBiggestOffset();
      },
      imgList() {
        if (this.listCount === 1) {
          this.lists = [this.imgList];
          this.getBiggestOffset();
          return;
        }
        let lists = [];
        this.imgList.forEach((item, index) => {
          let f = index % this.listCount;
          if (typeof lists[f] === 'object') {
            lists[f].push(item);
          } else {
            lists[f] = [item];
          }
        });
        this.lists = lists;
        this.getBiggestOffset();
      },
      
    },
    mounted() {
      
      this.screenWidth = document.documentElement.clientWidth;
      this.listCount = this.getCount(this.screenWidth);
      this.getData();
      // 获取数据
      this.scroll = new Scroll(e => {
        if (e > this.biggestOffset - 200) {
          this.getData();
        }
      });
      
      window.addEventListener('resize', () => {
        if (!this.timer) {
          this.timer = true;
          setTimeout(() => {
            let screenWidth = document.documentElement.clientWidth;
            this.screenWidth = screenWidth;
            this.listCount = this.getCount(screenWidth);
            this.timer = false;
            this.getBiggestOffset();
          }, 300);
        }
      });
    },
    unmounted() {
      window.onresize = null;
      this.scroll.drop();
    },
    methods: {
      calculation() {
        // TODO 相对高度
        const {listCount, imgList} = this;
        for (let i = 0; i < imgList.length; i++) {
          let item = imgList[i];
          if (item.offset[listCount - 1]) continue;
          const top = imgList[i - listCount];
          const left = i % listCount ? imgList[i % listCount - 1] : null;
          item.offset[listCount - 1] = {
            y: top ? top.offset[listCount - 1].y + item.height : 0,
            x: left ? left.offset[listCount - 1].x + item.height : 0,
            text: `matrix(1, 0, 0, 1, ${left ? left.offset[listCount - 1].x + item.height : 0}, ${top ? top.offset[listCount - 1].y + item.height : 0})`,
            calculated: true,
          };
        }
        console.log(imgList);
      },
      getData() {
        this.imgList.push(...[{
          smallUrl: 'https://images.unsplash.com/photo-1535626412646-58a028a96cde?ixlib=rb-0.3.5&s=cf5d6abe4bf8993853185aba4d0d2875&auto=format&fit=crop&w=334&q=80',
          height: 501,
          width: 334,
          thumbnail: '',
          offset: [],
        }, {
          smallUrl: 'https://images.unsplash.com/photo-1534865244288-b47fca3a35e0?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a37ca6252a729bfa42706b52771382f2&auto=format&fit=crop&w=334&q=80',
          height: 501,
          width: 334,
          thumbnail: '',
          offset: [],
        }, {
          smallUrl: 'https://images.unsplash.com/photo-1534941946572-23438b26af30?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=2a39cbef202ec33200977e0d25e9f5e8&auto=format&fit=crop&w=750&q=80',
          height: 500,
          width: 750,
          thumbnail: '',
          offset: [],
        }, {
          smallUrl: 'https://images.unsplash.com/photo-1535626412646-58a028a96cde?ixlib=rb-0.3.5&s=cf5d6abe4bf8993853185aba4d0d2875&auto=format&fit=crop&w=334&q=80',
          height: 501,
          width: 334,
          thumbnail: '',
          offset: [],
        }, {
          smallUrl: 'https://images.unsplash.com/photo-1534865244288-b47fca3a35e0?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a37ca6252a729bfa42706b52771382f2&auto=format&fit=crop&w=334&q=80',
          height: 501,
          width: 334,
          thumbnail: '',
          offset: [],
        }, {
          smallUrl: 'https://images.unsplash.com/photo-1534941946572-23438b26af30?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=2a39cbef202ec33200977e0d25e9f5e8&auto=format&fit=crop&w=750&q=80',
          height: 500,
          width: 750,
          thumbnail: '',
          offset: [],
        }, {
          smallUrl: 'https://images.unsplash.com/photo-1535626412646-58a028a96cde?ixlib=rb-0.3.5&s=cf5d6abe4bf8993853185aba4d0d2875&auto=format&fit=crop&w=334&q=80',
          height: 501,
          width: 334,
          thumbnail: '',
          offset: [],
        }, {
          smallUrl: 'https://images.unsplash.com/photo-1534865244288-b47fca3a35e0?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a37ca6252a729bfa42706b52771382f2&auto=format&fit=crop&w=334&q=80',
          height: 501,
          width: 334,
          thumbnail: '',
          offset: [],
        }, {
          smallUrl: 'https://images.unsplash.com/photo-1534941946572-23438b26af30?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=2a39cbef202ec33200977e0d25e9f5e8&auto=format&fit=crop&w=750&q=80',
          height: 500,
          width: 750,
          thumbnail: '',
          offset: [],
        }, {
          smallUrl: 'https://images.unsplash.com/photo-1535626412646-58a028a96cde?ixlib=rb-0.3.5&s=cf5d6abe4bf8993853185aba4d0d2875&auto=format&fit=crop&w=334&q=80',
          height: 501,
          width: 334,
          thumbnail: '',
          offset: [],
        }, {
          smallUrl: 'https://images.unsplash.com/photo-1534865244288-b47fca3a35e0?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a37ca6252a729bfa42706b52771382f2&auto=format&fit=crop&w=334&q=80',
          height: 501,
          width: 334,
          thumbnail: '',
          offset: [],
        }, {
          smallUrl: 'https://images.unsplash.com/photo-1534941946572-23438b26af30?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=2a39cbef202ec33200977e0d25e9f5e8&auto=format&fit=crop&w=750&q=80',
          height: 500,
          width: 750,
          thumbnail: '',
          offset: [],
        }, {
          smallUrl: 'https://images.unsplash.com/photo-1535626412646-58a028a96cde?ixlib=rb-0.3.5&s=cf5d6abe4bf8993853185aba4d0d2875&auto=format&fit=crop&w=334&q=80',
          height: 501,
          width: 334,
          thumbnail: '',
          offset: [],
        }, {
          smallUrl: 'https://images.unsplash.com/photo-1534865244288-b47fca3a35e0?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a37ca6252a729bfa42706b52771382f2&auto=format&fit=crop&w=334&q=80',
          height: 501,
          width: 334,
          thumbnail: '',
          offset: [],
        }, {
          smallUrl: 'https://images.unsplash.com/photo-1534941946572-23438b26af30?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=2a39cbef202ec33200977e0d25e9f5e8&auto=format&fit=crop&w=750&q=80',
          height: 500,
          width: 750,
          thumbnail: '',
          offset: [],
        }]);
        this.calculation();
      },
      getCount(screenWidth) {
        if (screenWidth > 1320) {
          this.standardWidth = (1320 / 3.0) - 24.0;
          return 3;
        }
        if (screenWidth > 768) {
          this.standardWidth = (screenWidth / 2.0) - 24.0;
          return 2;
        }
        this.standardWidth = screenWidth - 24.0;
        return 1;
      },
      getBiggestOffset() {
        let list = this.$refs.photolist;
        if (list && Array.from(list).filter(i => i).length === this.lists.length) {
          let offset = Infinity;
          for (let i = 0; i < this.lists.length; i++) {
            let nodes = list[i].querySelectorAll('.photo-item');
            if (nodes.length === this.lists[i].length) {
              let node = nodes[nodes.length - 1];
              let nowoffset = node.offsetTop + node.offsetHeight;
              if (nowoffset < offset) {
                offset = nowoffset;
              }
            } else {
              setTimeout(this.getBiggestOffset, 300);
              return;
            }
          }
          
          this.biggestOffset = offset || 0;
          
        } else {
          setTimeout(this.getBiggestOffset, 300);
        }
      },
      lookBigPhoto(e, i) {
        if (e.target.className === 'operation') {
          let index = e.target.parentNode.dataset.index;
          if (index >= 0) {
            this.showImg = this.lists[i][index];
          }
        }
      },
    },
  });
</script>

<style lang="scss" scoped>
  .as-photographer {
    width: 100%;
    padding: 4vw;
    min-height: 100px;
    overflow-y: auto;
    
    .photos-container {
      margin: auto;
      
      .photos {
        float: left;
        padding: 0 .25vw;
      }
    }
  }
</style>
