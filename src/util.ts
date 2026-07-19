import { BASE_BLURHASH_DIMENSIONS } from "./constants";
import { ImageFormatToken } from "./enum";
import { InvalidBlurhashComponentDimensions } from "./error";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const compact = (items: any[]) => items.filter(Boolean);

export const createUrl = (url: string): URL | null => {
  try {
    return new URL(url);
  } catch {
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

export const isValidImageDimension = (dimension: number) => Number.isInteger(dimension) && dimension > 0;

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
 * Extracts the X/Y component dimensions from a Blurhash string
 */
export const extractBlurhashComponentDimensions = (blurhash: string) => {
  if (!blurhash || blurhash.length < 6) {
    throw new InvalidBlurhashComponentDimensions();
  }

  const sizeDigit = base83Chars(blurhash[0]);

  // Size character isn't a valid base83 digit, so component dimensions can't be computed
  if (sizeDigit < 0) {
    throw new InvalidBlurhashComponentDimensions();
  }

  const xComponents = (sizeDigit % 9) + 1;
  const yComponents = Math.floor(sizeDigit / 9) + 1;
  const expectedLength = 4 + 2 * xComponents * yComponents;

  if (blurhash.length !== expectedLength) {
    throw new InvalidBlurhashComponentDimensions();
  }

  return {
    xComponents,
    yComponents,
  };
};

const base83Chars = (str: string) =>
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#$%*+,-.:;=?@[]^_{|}~".indexOf(str);
