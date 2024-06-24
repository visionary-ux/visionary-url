import { CDN_ENDPOINT } from "./constants";
import { InvalidEndpoint } from "./error";
import { generateOptionsString, parseOptionTokens } from "./image-options";
import { compact, createUrl, isBase64UrlEncoded } from "./util";
import { generateVisionaryCode, parseVisionaryCode } from "./visionary-code";

import {
  VisionaryUrlOptions,
  VisionaryImage,
  VisionaryImageFields,
  VisionaryUrlParts,
} from "./types/visionary.types";

/**
 * Parses input string for Visionary data contained within
 * @param visionaryCodeOrUrl string which represents a Visionary Code or Visionary URL
 */
export const parseVisionaryString = (visionaryCodeOrUrl: string): VisionaryImage | null => {
  const isFormattedAsCode = isBase64UrlEncoded(visionaryCodeOrUrl);
  if (isFormattedAsCode) {
    const fields = parseVisionaryCode(visionaryCodeOrUrl);
    if (fields) {
      return {
        fields,
        options: {},
      };
    }
  }
  return parseVisionaryUrl(visionaryCodeOrUrl);
};

export const parseVisionaryUrl = (url: string): VisionaryImage | null => {
  if (!url) {
    return null;
  }
  const sanitizedUrl = url.trim();
  if (!sanitizedUrl) {
    return null;
  }
  try {
    const parts = extractUrlParts(sanitizedUrl);
    if (!parts) {
      return null;
    }
    const { code, optionTokens } = parts;
    const fields = parseVisionaryCode(code);
    if (!fields) {
      return null;
    }
    const options = parseOptionTokens(optionTokens);
    return {
      fields,
      options,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error parsing URL: ${error.message}`, error);
    } else {
      console.error("uncaught error", error);
    }
  }
  return null;
};

export const generateVisionaryUrl = (
  fields: VisionaryImageFields,
  options?: VisionaryUrlOptions
): string | null => {
  const visionaryCode = generateVisionaryCode(fields);
  if (visionaryCode instanceof Error) {
    return null;
  }

  let urlEndpoint: URL | null = null;
  if (options?.endpoint) {
    urlEndpoint = createUrl(options?.endpoint);
    if (!urlEndpoint) {
      throw new InvalidEndpoint(
        "Cannot construct URL: bad endpoint. Ensure endpoint starts with http:// or https://"
      );
    }
  }
  if (!urlEndpoint) {
    urlEndpoint = createUrl(CDN_ENDPOINT) as URL;
  }
  const urlParts = [urlEndpoint.origin, "image", visionaryCode];
  const optionsString = options ? generateOptionsString(options) : null;
  if (optionsString) {
    urlParts.push(optionsString);
  }
  if (options?.filename) {
    urlParts.push(options.filename);
  } else {
    urlParts.push("image.jpg");
  }
  return urlParts.join("/");
};

/**
 * Given a Visionary URL, extracts the code and any options tokens
 */
const extractUrlParts = (inputUrl: string): VisionaryUrlParts | null => {
  try {
    const url = new URL(inputUrl);
    const pathParts = compact(url.pathname.split("/"));
    if (pathParts[0] !== "image" || ![3, 4].includes(pathParts.length)) {
      throw new Error("Unrecognized URL");
    }
    const code = pathParts[1].trim();
    if (!code.length || !isBase64UrlEncoded(code)) {
      throw new Error("URL is not formatted as base64url");
    }
    // Options specified
    if (pathParts.length === 4) {
      const optionTokens = pathParts[2].split(",");
      return {
        code,
        optionTokens,
      };
    }
    // Options not specified
    if (pathParts.length === 3) {
      return {
        code,
        optionTokens: [],
      };
    }
  } catch (_) {
    return null;
  }
  return null;
};
