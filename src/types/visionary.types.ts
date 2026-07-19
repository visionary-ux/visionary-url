import { ImageFormatToken, ImageSizeToken } from "../enum";

/** Fields used to generate a Blurhash URL */
export interface GenerateBlurhashUrlInput {
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

/** Image metadata fields decoded from a Blurhash URL */
export interface BlurhashUrlFields extends GenerateBlurhashUrlInput {
  /**
   * Number of _x_ components the blurhash string represents.
   * Derived from the blurhash string during parsing.
   */
  blurhashX?: number;

  /**
   * Number of _y_ components the blurhash string represents.
   * Derived from the blurhash string during parsing.
   */
  blurhashY?: number;
}

export interface BlurhashUrlParts {
  code: string;
  optionTokens: string[];
}

export interface BlurhashUrl {
  fields: BlurhashUrlFields;
  options: BlurhashUrlOptions;
}

/**
 * Options are encoded in the second path segment of a Blurhash URL
 */
export interface BlurhashUrlOptions {
  debug?: boolean;
  /**
   * Specifies that server should send the file as an attachment download
   * (e.g. content-disposition: attachment)
   */
  download?: boolean;
  /** Specifies a custom endpoint using `generateBlurhashUrl()` */
  endpoint?: string;
  follow?: boolean;
  format?: ImageFormatToken;
  size?: ImageSizeToken;
}

export interface GenerateUrlOptions extends BlurhashUrlOptions {
  /**
   * Specifies a filename for the image URL. Defaults to `image.jpg`.
   * @NOTE It's highly recommended to specify a descriptive filename as this helps improve discoverability of images by search engines.
   */
  filename?: string;
}
