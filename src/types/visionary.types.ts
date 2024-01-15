import { ImageFormatEnum, ImageSizeEnum } from "../enum";

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
   * Visionary File ID or Image URL
   */
  fileId: string;

  /**
   * Height of original upload image (also max height)
   */
  sourceHeight: number;

  /**
   * Width of original upload image (also max width)
   */
  sourceWidth: number;
}

export interface VisionaryUrlParts {
  code: string;
  optionTokens: string[];
}

export interface VisionaryImage {
  fields: VisionaryImageFields;
  options: ImageOptions;
}

/**
 * Details encoded in the second segment of the URL (after Visionary code)
 */
export interface ImageOptions {
  debug?: boolean;

  /**
   * Specifies that server should send the file as an attachment download
   * (e.g. content-disposition: attachment)
   */
  download?: boolean;
  format?: ImageFormatEnum;
  size?: ImageSizeEnum;
}

/**
 * Fields passed to generateVisionaryUrl()
 */
export interface GenerateVisionaryUrlOptions extends ImageOptions {
  /**
   * Specifies a custom endpoint
   */
  endpoint?: string;

  /**
   * Specifies a filename for the image URL. Defaults to `image.jpg`.
   * NOTE: It's recommended to specify a filename as this helps improve discoverability of images by search engines.
   */
  filename?: string;
}
