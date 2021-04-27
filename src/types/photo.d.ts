import ImgLoader from "../utils/img-loader";

export type PhotoStyle = {
  x: number,
  y: number,
  transformText: string,
  ratio: number,
}

export type Photo = {
  width: number,
  height: number,
  mainUrl: string,
  thumbnail: string,
  offset?: PhotoStyle,
  preview?: Uint8ClampedArray,
  displayHeight?: number,
  loader: ImgLoader,
  join: boolean,
}