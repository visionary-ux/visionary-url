import { decodeBase64Url, encodeBase64Url } from "visionary-base64url";

import { V_CODE_SEPARATOR } from "./constants";
import { extractBlurhashComponentDimensions, isBase64UrlEncoded } from "./util";

import { BlurhashUrlFields, GenerateBlurhashUrlInput } from "./types/visionary.types";

/**
 * Generates a Visionary image code
 */
export const generateVisionaryCode = (fields: GenerateBlurhashUrlInput): string | Error => {
  const { altText, bcc, blurhash, sourceHeight, sourceWidth, url } = fields;
  if (!url || !sourceWidth || !sourceHeight) {
    return new Error("Cannot construct visionary code: missing required url/width/height");
  }

  const visionaryComponents: Array<string | number> = [url, sourceWidth, sourceHeight];

  if (!bcc) {
    return joinAndEncodeComponents(visionaryComponents);
  }
  visionaryComponents.push(bcc);
  if (!blurhash) {
    return joinAndEncodeComponents(visionaryComponents);
  }
  visionaryComponents.push(blurhash);
  if (altText) {
    visionaryComponents.push(altText);
  }
  return joinAndEncodeComponents(visionaryComponents);
};

const joinAndEncodeComponents = (components: Array<string | number>): string =>
  encodeBase64Url(components.join(V_CODE_SEPARATOR));

export const parseVisionaryCode = (code: string): BlurhashUrlFields | null => {
  if (typeof code !== "string") {
    return null;
  }
  const sanitizedCode = code.trim();
  if (!sanitizedCode.length || !isBase64UrlEncoded(sanitizedCode)) {
    return null;
  }
  const imageDataStr = decodeBase64Url(sanitizedCode);
  if (!imageDataStr) {
    return null;
  }
  const imageDataParts = imageDataStr.split(V_CODE_SEPARATOR);
  // Visionary codes must contain at a minimum: url, width, height
  if (imageDataParts.length < 3) {
    return null;
  }
  const imageData =
    imageDataParts.length > 6 ? convertLegacyBlurhashPayload(imageDataParts) : imageDataParts;
  if (imageData.length > 6) {
    console.error("Cannot parse Visionary Code: unexpected component count", imageData);
    return null;
  }
  const [urlInput, widthInput, heightInput, bcc, blurhash, altText] = imageData;
  const url = urlInput.trim();
  if (!url.length) {
    console.error("Cannot parse code, empty file id/url");
    return null;
  }
  const sourceWidth = Number(widthInput.trim());
  const sourceHeight = Number(heightInput.trim());
  if (!sourceWidth || !sourceHeight) {
    console.error("Cannot parse Visionary Code: invalid image dimensions", widthInput, heightInput);
    return null;
  }
  const fields: BlurhashUrlFields = {
    sourceHeight,
    sourceWidth,
    url,
  };

  if (bcc) {
    fields.bcc = bcc;
  }

  if (blurhash) {
    fields.blurhash = blurhash;
    try {
      const blurhashComponents = extractBlurhashComponentDimensions(blurhash);
      fields.blurhashX = blurhashComponents.xComponents;
      fields.blurhashY = blurhashComponents.yComponents;
    } catch {
      console.error(
        "Cannot parse Visionary Code: invalid blurhashX/blurhashY component dimensions",
        blurhash,
        altText
      );
      return null;
    }
  }

  if (altText) {
    fields.altText = altText;
  }

  return fields;
};

/**
 * Converts legacy code payloads from:  [url, width, height, bcc, blurhash, x, y, alt?]
 * to new payload format:               [url, width, height, bcc, blurhash, alt?]
 */
const convertLegacyBlurhashPayload = (payload: string[]): string[] => {
  if (payload.length < 7) {
    return payload;
  }

  const blurhash = payload[4];
  const xComponents = payload[5];
  const yComponents = payload[6];
  const hasLegacyDimensions =
    blurhash.length > 0 &&
    xComponents.length > 0 &&
    yComponents.length > 0 &&
    !Number.isNaN(Number(xComponents)) &&
    !Number.isNaN(Number(yComponents));

  if (!hasLegacyDimensions) {
    return payload;
  }

  const altText = payload.slice(7).join(V_CODE_SEPARATOR);
  const compactPayload = payload.slice(0, 5);
  if (altText.length) {
    compactPayload.push(altText);
  }
  return compactPayload;
};
