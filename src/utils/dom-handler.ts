export function getStyles(el: HTMLElement) {
  return window.getComputedStyle(el);
}

export function getElWidth(el: HTMLElement) {
 return el.clientWidth;
}

export function getScrollTop() {
 return document.body.scrollTop + document.documentElement.scrollTop + window.innerHeight;
}