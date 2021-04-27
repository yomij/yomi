import { getElWidth, getScrollTop } from "./dom-handler";
import { PHOTO_WATERFALL_STATIC } from "../config";

class EventFactory {
  private listener: EventListener = () => undefined;
  // 是否添加监听事件
  private listening: boolean = false;
  private target: Element | Document | Window;
  private delayTime: number;
  private handler: Function;
  private cbs: Array<Function> = [];
  private errorHandle: Function;

  readonly eventType: string;

  constructor(
    event: string,
    target: Element | Document | Window,
    handler: Function,
    delayTime = 300,
    errorHandle: Function = (e: Error) => { throw e },
  ) {
    this.delayTime = delayTime;
    this.handler = handler.bind(null, this);
    this.eventType = event;
    this.target = target;
    this.errorHandle = errorHandle;
  }

  delay() {
    let timer = false;
    const {delayTime, handler, cbs, errorHandle} = this;
    return function () {
      if (!timer) {
        timer = true;
        setTimeout(() => {
          let data = handler();
          for (let cb of cbs) {
            try {
              cb.call(null, data);
            } catch (e) {
              errorHandle(e)
            }
          }
          timer = false;
        }, delayTime);
      }
    };
  }

  add(callback: Function) {
    if (!this.cbs.includes(callback)) {
      this.cbs.push(callback);
      this.listener = this.delay();
    }
    if (!this.listening) {
      this.target.addEventListener(this.eventType, this.listener);
      this.listening = true;
    }
  }

  remove(callback: Function) {
    if (!this.cbs.length) {
      this.drop();
      return;
    }
    for (let i = 0; i < this.cbs.length - 1; i++) {
      if (this.cbs[i] === callback) {
        this.cbs.splice(i, 1);
        this.listener = this.delay();
        break;
      }
    }
  }

  drop() {
    this.target.removeEventListener(this.eventType, this.listener);
  }
}

export const Scroll = new EventFactory('scroll', document, getScrollTop, PHOTO_WATERFALL_STATIC.SCROLL_THROTTLE_TIME);
export const Resize = new EventFactory('resize', window, getElWidth.bind(null, document.documentElement), PHOTO_WATERFALL_STATIC.RESIZE_THROTTLE_TIME);
