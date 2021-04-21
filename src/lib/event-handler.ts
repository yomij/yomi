class EventFactory {
  private listener: EventListener = () => undefined;
  // 是否添加监听事件
  private listening: boolean = false;
  private target: Element | Document | Window;
  private delayTime: number;
  private handler: Function;
  private cbs: Array<Function> = [];

  readonly eventType: string;

  constructor(
    event: string,
    target: Element | Document | Window,
    handler: Function,
    delayTime = 300,
  ) {
    this.delayTime = delayTime;
    this.handler = handler.bind(null, this);
    this.eventType = event;
    this.target = target;
  }

  delay() {
    let timer = false;
    const {delayTime, handler, cbs} = this;
    return function () {
      if (!timer) {
        timer = true;
        setTimeout(() => {
          let data = handler();
          for (let cb of cbs) {
            cb.call(null, data);
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

export const Scroll = new EventFactory('scroll', document, () => document.body.scrollTop + document.documentElement.scrollTop + window.innerHeight);
export const Resize = new EventFactory('resize', window,() => document.documentElement.clientWidth);
