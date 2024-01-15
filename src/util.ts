import { ImageFormatEnum } from "./enum";

const BASE_BLURHASH_DIMENSIONS = 4;
const regexBase64Url = /^[A-Za-z0-9_-]*$/;

export const compact = (items: any[]) => items.filter(Boolean);

export const formatToContentType = (format: ImageFormatEnum) => {
  switch (format) {
    case ImageFormatEnum.AVIF:
      return { contentType: "image/avif", extension: "avif" };
    case ImageFormatEnum.JPEG:
      return { contentType: "image/jpeg", extension: "jpg" };
    case ImageFormatEnum.WEBP:
      return { contentType: "image/webp", extension: "webp" };
    default:
      throw new Error(`formatToContentType: unknown format ${format}`);
  }
};

export const isBase64UrlFormatted = (str = "") => regexBase64Url.test(str);

/**
 * This is purposely kept simple as sometimes cranking these values up results in a good image, other times not.
 * Defaults to 4x4 (or 4x3 for landscape images).
 */
export const suggestedBlurhashComponentDimensions = (
  width: number,
  height: number
): [x: number, y: number] => {
  const aspectRatio = width / height;
  let x = BASE_BLURHASH_DIMENSIONS,
    y = BASE_BLURHASH_DIMENSIONS;

  // landscape
  if (aspectRatio >= 1.6) {
    y = 3;
  }

  return [x, y];
};

/**
 * Note: this function is not entirely accurate as 'unfactoring' can't determine order of x, y
 * (e.g. two blurhash strings with x,y components (3,4) and (4,3) will return the same result)
 */
export const extractBlurhashComponentDimensions = (blurhash: string) => {
  const sizeDigit = base83Chars(blurhash[0]);
  const xComponents = Math.floor(sizeDigit / 9) + 1;
  const yComponents = (sizeDigit % 9) + 1;
  return {
    xComponents,
    yComponents,
  };
};

const base83Chars = (str: string) =>
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#$%*+,-.:;=?@[]^_{|}~".indexOf(str);

export const createUrl = (url: string): URL | null => {
  try {
    return new URL(url);
  } catch (_) {
    return null;
  }
};
