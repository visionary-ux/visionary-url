import { ImageFormatEnum, ImageSizeEnum } from "./enum";
import { ImageOptions } from "./types/visionary.types";

/**
 * Defaults blurhash components to [4, 4] (or [4, 3] for landscape photos)
 */
export const BASE_BLURHASH_DIMENSIONS = 4;

/**
 * Default CDN base URL.
 * - Can be overridden in the `options` field of generateVisionaryUrl()
 */
export const CDN_ENDPOINT = "https://cdn.visionary.cloud";

export const DEFAULT_OPTIONS: ImageOptions = {
  debug: false,
  format: ImageFormatEnum.AUTO,
  size: ImageSizeEnum.lg,
};

/**
 * Maps bootstrap-inspired size codes to pixels
 */
export const IMAGE_SIZES: Partial<Record<ImageSizeEnum, number>> = {
  [ImageSizeEnum.xs]: 160,
  [ImageSizeEnum.sm]: 320,
  [ImageSizeEnum.md]: 640,
  [ImageSizeEnum.lg]: 1280,
  [ImageSizeEnum.xl]: 1920,
  [ImageSizeEnum.xxl]: 2560,
  [ImageSizeEnum["4k"]]: 3840,
  [ImageSizeEnum["5k"]]: 5120,
};

export const IMAGE_SIZE_LOOKUP: Record<number, ImageSizeEnum> = Object.keys(IMAGE_SIZES).reduce(
  (obj, key) => {
    const keyEnum = key as ImageSizeEnum;
    const numericalValue = IMAGE_SIZES[keyEnum];
    if (numericalValue) {
      obj[numericalValue] = keyEnum;
    }
    return obj;
  },
  {} as Record<number, ImageSizeEnum>
);

/**
 * Charater used to separate Visionary code fields.
 * (This must be a value not used by blurhash/base83 — see here: https://github.com/woltapp/blurhash/blob/master/Algorithm.md#base-83)
 */
export const V_CODE_SEPARATOR = "!";
