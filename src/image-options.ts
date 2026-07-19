import { ImageFormatToken, ImageSizeToken, UrlOptionToken } from "./enum";
import {
  isDebugToken,
  isDownloadToken,
  isFollowToken,
  isImageFormatToken,
  isImageSizeToken,
} from "./token";
import { BlurhashUrlOptions } from "./types/visionary.types";

export const parseOptionTokens = (optionTokens: string[] = []): BlurhashUrlOptions => {
  const returnOptions: BlurhashUrlOptions = {};
  for (const token of optionTokens) {
    if (isImageSizeToken(token)) {
      returnOptions.size = token;
    } else if (isDebugToken(token)) {
      returnOptions.debug = true;
    } else if (isDownloadToken(token)) {
      returnOptions.download = true;
    } else if (isFollowToken(token)) {
      returnOptions.follow = true;
    } else if (isImageFormatToken(token)) {
      returnOptions.format = token;
    }
  }
  return returnOptions;
};

export const generateOptionsString = (options: BlurhashUrlOptions): string | null => {
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
  if (options.follow) {
    tokenArr.push(UrlOptionToken.FOLLOW);
  }
  if (options.format && options.format !== ImageFormatToken.AUTO) {
    tokenArr.push(options.format);
  }
  if (options.size && isImageSizeToken(options.size)) {
    tokenArr.push(options.size);
  }
  return tokenArr.length ? tokenArr.sort().join(",") : null;
};

export const parseOptionsString = (options = ""): BlurhashUrlOptions =>
  parseOptionTokens(options.split(","));
