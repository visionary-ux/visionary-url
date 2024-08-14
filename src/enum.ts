export enum ImageFormatToken {
  AUTO = "auto",
  AVIF = "avif",
  JPEG = "jpeg",
  WEBP = "webp",
}

export enum ImageSizeToken {
  xs = "xs",
  sm = "sm",
  md = "md",
  lg = "lg",
  xl = "xl",
  xxl = "xxl",
  "4k" = "4k",
  "5k" = "5k",
  /**
   * `full` is image dependent and represents the source image's longest edge
   */
  full = "full",
}

export enum UrlOptionToken {
  DEBUG = "debug",
  DOWNLOAD = "download",
  FOLLOW = "follow",
}
