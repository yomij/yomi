class Scroll {
  public listener: EventListener;
  private delayTime: number;

  constructor(callback: Function, delayTime = 300) {
    this.listener = this.delay(callback);
    this.delayTime = delayTime;
    document.addEventListener('scroll', this.listener);
  }

  delay(callback: Function) {
    let timer = false;
    const {delayTime} = this;
    return function () {
      if (!timer) {
        timer = true;
        setTimeout(() => {
          const scrollTop =
            document.body.scrollTop +
            document.documentElement.scrollTop +
            window.innerHeight;
          callback(scrollTop);
          timer = false;
        }, delayTime);
      }
    };
  }

  drop() {
    document.removeEventListener('scroll', this.listener);
  }
}

export default Scroll;
