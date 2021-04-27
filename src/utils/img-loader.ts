import {PHOTO_WATERFALL_STATIC} from "../config";

export default class ImgLoader {
  public src: string;

  public loaded: boolean = false;

  public loading: boolean = false;

  public timer: number = 0;

  readonly delay: number;

  static loaderMap = new Map();

  static clearLoaderMap() {
    for (let [key, value] of ImgLoader.loaderMap) {
      value.cancel();
    }
  }

  static replaceLoaderMap(loaders: ImgLoader[]) {
    ImgLoader.clearLoaderMap();
    for (let loader of loaders) {
      if (loader.loaded) continue;
      loader.load().then(src => {
        console.log(src + '  Loaded!');
      });
    }
  }

  constructor(src: string, delay = PHOTO_WATERFALL_STATIC.IMAGE_LOAD_WAIT_TIME) {
    this.src = src;
    this.delay = delay;
  }

  load () {
    return new Promise(resolve => {
      if (this.loaded) return resolve(this.src);
     let cb = () => {
        this.loaded = true;
        this.loading = false;
        ImgLoader.loaderMap.delete(this.src);
        resolve(this.src);
      }
      this.timer = setTimeout(() => {
        this.loading = true;
        let imgUrl = new Image();
        imgUrl.src = this.src;
        if (imgUrl.complete) {
          cb();
        } else {
          imgUrl.onload = cb;
        }
      }, this.delay)
      ImgLoader.loaderMap.set(this.src, this);
    })
  }

  cancel () {
    if (!this.loading || this.loaded) return;
    window.clearTimeout(this.timer);
    ImgLoader.loaderMap.delete(this.src);
    this.loading = false;
  }
}
