import { ImageFormatToken, ImageSizeToken } from "../enum";

/**
 * Image metadata fields encoded in a Visionary URL
 */
export interface VisionaryImageFields {
  /**
   * Alt text
   */
  altText?: string;

  /**
   * Background color code
   */
  bcc?: string;

  /**
   * Blurhash string
   */
  blurhash?: string;

  /**
   * Number of _x_ components the blurhash string represents
   */
  blurhashX?: number;

  /**
   * Number of _y_ components the blurhash string represents
   */

  blurhashY?: number;

  /**
   * Height of original upload image (also max height)
   */
  sourceHeight: number;

  /**
   * Width of original upload image (also max width)
   */
  sourceWidth: number;

  /**
   * Image URL or internal image identifier
   */
  url: string;
}

export interface VisionaryUrlParts {
  code: string;
  optionTokens: string[];
}

export interface VisionaryImage {
  fields: VisionaryImageFields;
  options: VisionaryImageOptions;
}

/**
 * Options are encoded in the second segment of a Visionary URL
 */
export interface VisionaryImageOptions {
  debug?: boolean;
  /**
   * Specifies that server should send the file as an attachment download
   * (e.g. content-disposition: attachment)
   */
  download?: boolean;
  /** Specifies a custom endpoint when `generateVisionaryUrl()` is used */
  endpoint?: string;
  follow?: boolean;
  format?: ImageFormatToken;
  size?: ImageSizeToken;
}

export interface GenerateUrlOptions extends VisionaryImageOptions {
  /**
   * Specifies a filename for the image URL. Defaults to `image.jpg`.
   * @NOTE It's highly recommended to specify a descriptive filename as this helps improve discoverability of images by search engines.
   */
  filename?: string;
}
