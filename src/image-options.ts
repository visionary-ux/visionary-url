import { ImageFormatToken, ImageSizeToken, UrlOptionToken } from "./enum";
import { isDebugToken, isDownloadToken, isFormatString, isImageSizeToken } from "./token";
import { ImageOptions } from "./types/visionary.types";

export const parseOptionsString = (options = ""): ImageOptions => parseOptionTokens(options.split(","));

export const parseOptionTokens = (optionTokens: string[] = []): ImageOptions => {
  const returnOptions: ImageOptions = {};
  for (const token of optionTokens) {
    if (isImageSizeToken(token)) {
      returnOptions.size = ImageSizeToken[token];
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
  const tokenArr: Array<ImageFormatToken | ImageSizeToken | UrlOptionToken> = [];
  if (options.debug) {
    tokenArr.push(UrlOptionToken.DEBUG);
  }
  if (options.download) {
    tokenArr.push(UrlOptionToken.DOWNLOAD);
  }
  if (options.format) {
    if (options.format !== ImageFormatToken.AUTO) {
      tokenArr.push(options.format);
    }
  }
  if (options.size && isImageSizeToken(options.size)) {
    tokenArr.push(options.size);
  }
  return tokenArr.length ? tokenArr.sort().join(",") : null;
};
