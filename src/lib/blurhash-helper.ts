import { decode, encode } from "blurhash";

export function decodeImage(t: string, width: number, height: number) {
  console.time('decodeSingle')
  const data = decode(t, width, height)
  console.timeEnd('decodeSingle')
  return data;
}

const loadImage = async (src: string) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (...args) => reject(args);
    img.src = src;
  });

const getImageData = (image: HTMLImageElement) => {
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext("2d")!;
  context.drawImage(image, 0, 0);
  return context.getImageData(0, 0, image.width, image.height);
};

export const encodeImageToBlurhash = async (imageUrl: string) => {
  const image = await loadImage(imageUrl) as HTMLImageElement;
  const imageData = getImageData(image);
  return encode(imageData.data, imageData.width, imageData.height, 4, 4);
};