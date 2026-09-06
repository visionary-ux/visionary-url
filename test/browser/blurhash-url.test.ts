import { describe, expect, test } from "vitest";

import { ImageFormatToken, ImageSizeToken } from "../../dist/constants.js";
import { generateBlurhashUrl, parseBlurhashUrl, parseVisionaryString } from "../../dist/blurhash-url.js";
import { expectedImageUrl, expectedOptionsUrl, sampleFields } from "../runtime-cases";

describe("Chromium runtime", () => {
  test("uses browser APIs without Node.js globals", () => {
    expect(typeof window).toBe("object");
    expect(typeof globalThis.atob).toBe("function");
    expect(typeof globalThis.btoa).toBe("function");
    expect("Buffer" in globalThis).toBe(false);
  });

  test("generates and parses Blurhash URLs", () => {
    expect(generateBlurhashUrl(sampleFields)).toBe(expectedImageUrl);

    const parsed = parseBlurhashUrl(expectedOptionsUrl);

    expect(parsed?.fields.url).toBe(sampleFields.url);
    expect(parsed?.fields.blurhash).toBe(sampleFields.blurhash);
    expect(parsed?.options.format).toBe(ImageFormatToken.WEBP);
    expect(parsed?.options.size).toBe(ImageSizeToken["4k"]);
  });

  test("parses Visionary codes from generated URLs", () => {
    const parsed = parseVisionaryString(expectedImageUrl);

    expect(parsed?.fields.sourceWidth).toBe(sampleFields.sourceWidth);
    expect(parsed?.fields.sourceHeight).toBe(sampleFields.sourceHeight);
  });
});
