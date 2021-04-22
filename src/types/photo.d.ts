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
}