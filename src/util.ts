import { BASE_BLURHASH_DIMENSIONS } from "./constants";
import { ImageFormatToken } from "./enum";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const compact = (items: any[]) => items.filter(Boolean);

export const createUrl = (url: string): URL | null => {
  try {
    return new URL(url);
  } catch (_) {
    return null;
  }
};

export const formatToContentType = (format: ImageFormatToken) => {
  switch (format) {
    case ImageFormatToken.AVIF:
      return { contentType: "image/avif", extension: "avif" };
    case ImageFormatToken.JPEG:
      return { contentType: "image/jpeg", extension: "jpg" };
    case ImageFormatToken.WEBP:
      return { contentType: "image/webp", extension: "webp" };
    default:
      throw new Error(`formatToContentType: unknown format ${format}`);
  }
};

export const isBase64UrlEncoded = (str = "") => /^[A-Za-z0-9_-]*$/.test(str);

/**
 * This is purposely kept simple as sometimes cranking these values up results in a good image, other times not.
 * Defaults to 4x4 (or 4x3 for landscape images).
 */
export const suggestedBlurhashComponentDimensions = (
  width: number,
  height: number
): [x: number, y: number] => {
  const aspectRatio = width / height;
  const x = BASE_BLURHASH_DIMENSIONS;
  let y = BASE_BLURHASH_DIMENSIONS;

  // landscape
  if (aspectRatio >= 1.6) {
    y = 3;
  }

  return [x, y];
};

/**
 * Note: this function is not entirely accurate as 'unfactoring' can't determine order of x, y
 * (e.g. two blurhash strings with x,y components (3,4) and (4,3) will return the same result).
 * We keep it here as a debugging tool; it's not used in the library.
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
