import { describe, expect, test, vi } from "vitest";

import { ImageFormatToken, ImageSizeToken } from "../../dist/constants.js";
import { generateBlurhashUrl, parseBlurhashUrl, parseVisionaryString } from "../../dist/blurhash-url.js";
import { expectedImageUrl, expectedOptionsUrl, sampleFields } from "../runtime-cases";

// Vitest adds Node.js compatibility; hide Buffer to exercise the edge-native path.
vi.stubGlobal("Buffer", undefined);

describe("Cloudflare Workers runtime", () => {
  test("uses Workers APIs without browser or Node.js globals", () => {
    const workerGlobal = globalThis as typeof globalThis & {
      Buffer?: unknown;
      WebSocketPair?: unknown;
    };

    expect(typeof workerGlobal.WebSocketPair).toBe("function");
    expect(typeof globalThis.atob).toBe("function");
    expect(typeof globalThis.btoa).toBe("function");
    expect("document" in globalThis).toBe(false);
    expect(workerGlobal.Buffer).toBeUndefined();
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
