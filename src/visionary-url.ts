import { CDN_ENDPOINT } from "./constants";
import { generateOptionsString, parseOptionTokens } from "./image-options";
import { compact, createUrl, isBase64UrlFormatted } from "./util";
import { generateVisionaryCode, parseVisionaryCode } from "./visionary-code";

import {
  GenerateVisionaryUrlOptions,
  VisionaryImage,
  VisionaryImageFields,
  VisionaryUrlParts,
} from "./types/visionary.types";
import { InvalidEndpoint } from "./error";

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
  options?: GenerateVisionaryUrlOptions
): string | null => {
  const visionaryCode = generateVisionaryCode(fields);
  if (visionaryCode instanceof Error) {
    return null;
  }
  let endpoint = new URL(CDN_ENDPOINT);
  if (options?.endpoint) {
    const endpointOverride = createUrl(options.endpoint);
    if (endpointOverride) {
      endpoint = endpointOverride;
    } else {
      throw new InvalidEndpoint(
        "Cannot construct URL: bad endpoint. Ensure endpoint starts with http:// or https://"
      );
    }
  }

  const urlParts = [endpoint.origin, "image", visionaryCode];
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
  const url = new URL(inputUrl);
  const pathParts = compact(url.pathname.split("/"));
  if (pathParts[0] !== "image" || ![3, 4].includes(pathParts.length)) {
    throw new Error("Unrecognized URL");
  }
  const code = pathParts[1].trim();
  if (!code.length || !isBase64UrlFormatted(code)) {
    throw new Error("URL is not formatted as base64url");
  }
  // Options defined in URL
  if (pathParts.length === 4) {
    const optionTokens = pathParts[2].split(",");
    return {
      code,
      optionTokens,
    };
  }
  // Options not defined in URL
  if (pathParts.length === 3) {
    return {
      code,
      optionTokens: [],
    };
  }
  return null;
};
