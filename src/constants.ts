import { ImageFormatToken, ImageSizeToken } from "./enum";
import { VisionaryImageOptions } from "./types/visionary.types";

/**
 * Defaults blurhash components to [4, 4] (or [4, 3] for landscape photos)
 */
export const BASE_BLURHASH_DIMENSIONS = 4;

/**
 * Default endpoint for generating Visionary URLs
 * - Can be overridden in the `options` field of generateVisionaryUrl()
 */
export const DEFAULT_ENDPOINT = "https://link.visionary.cloud";

export const DEFAULT_OPTIONS: VisionaryImageOptions = {
  debug: false,
  format: ImageFormatToken.AUTO,
  size: ImageSizeToken.lg,
};

/**
 * Maps bootstrap-inspired size codes to pixels
 */
export const IMAGE_SIZES: Record<ImageSizeToken, number> = {
  [ImageSizeToken.xs]: 160,
  [ImageSizeToken.sm]: 320,
  [ImageSizeToken.md]: 640,
  [ImageSizeToken.lg]: 1280,
  [ImageSizeToken.xl]: 1920,
  [ImageSizeToken.xxl]: 2560,
  [ImageSizeToken["4k"]]: 3840,
  [ImageSizeToken["5k"]]: 5120,
  [ImageSizeToken.full]: 0,
};

export const IMAGE_SIZE_LOOKUP: Record<number, ImageSizeToken> = Object.keys(IMAGE_SIZES).reduce(
  (obj, key) => {
    const keyEnum = key as ImageSizeToken;
    const numericalValue = IMAGE_SIZES[keyEnum];
    if (numericalValue) {
      obj[numericalValue] = keyEnum;
    }
    return obj;
  },
  {} as Record<number, ImageSizeToken>
);

/**
 * Charater used to separate Visionary code fields.
 * (This must be a value not used by blurhash/base83 — see here: https://github.com/woltapp/blurhash/blob/master/Algorithm.md#base-83)
 */
export const V_CODE_SEPARATOR = "!";
