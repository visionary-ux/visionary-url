import { ImageFormatEnum, ImageSizeEnum, ImageTokenEnum } from "./enum";
import { isDebugToken, isDownloadToken, isFormatString, isImageSizeToken } from "./token";
import { ImageOptions } from "./types/visionary.types";

export const parseOptionsString = (options = ""): ImageOptions => parseOptionTokens(options.split(","));

export const parseOptionTokens = (optionTokens: string[] = []): ImageOptions => {
  const returnOptions: ImageOptions = {};
  for (const token of optionTokens) {
    if (isImageSizeToken(token)) {
      returnOptions.size = ImageSizeEnum[token];
    } else if (isDebugToken(token)) {
      returnOptions.debug = true;
    } else if (isDownloadToken(token)) {
      returnOptions.download = true;
    } else if (isFormatString(token)) {
      returnOptions.format = token;
    }
  }
  return returnOptions;
};

export const generateOptionsString = (options: ImageOptions): string | null => {
  if (!options || typeof options !== "object") {
    return null;
  }
  const tokenArr: Array<ImageTokenEnum | ImageFormatEnum | ImageSizeEnum> = [];
  if (options.debug) {
    tokenArr.push(ImageTokenEnum.DEBUG);
  }
  if (options.download) {
    tokenArr.push(ImageTokenEnum.DOWNLOAD);
  }
  if (options.format) {
    if (options.format !== ImageFormatEnum.AUTO) {
      tokenArr.push(options.format);
    }
  }
  if (options.size && isImageSizeToken(options.size)) {
    tokenArr.push(options.size);
  }
  return tokenArr.length ? tokenArr.sort().join(",") : null;
};
