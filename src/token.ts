import { ImageFormatToken, ImageSizeToken, UrlOptionToken } from "./enum";

export const isDebugToken = (token: string) => token === UrlOptionToken.DEBUG;

export const isDownloadToken = (token: string) => token === UrlOptionToken.DOWNLOAD;

export const isFollowToken = (token: string) => token === UrlOptionToken.FOLLOW;

export const isImageFormatToken = (format: string): format is ImageFormatToken =>
  Object.values(ImageFormatToken).includes(format as ImageFormatToken);

export const isImageSizeToken = (token: string): token is ImageSizeToken =>
  Object.values(ImageSizeToken).includes(token as ImageSizeToken);
