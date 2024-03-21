import { describe, expect, test } from "vitest";

import { ImageFormatToken } from "../enum";
import { isImageSizeToken, tokeni } from "../token";
import {
  compact,
  suggestedBlurhashComponentDimensions,
  formatToContentType,
  isBase64UrlFormatted,
  extractBlurhashComponentDimensions,
} from "../util";

describe("Visionary URL utils", () => {
  describe(isImageSizeToken.name, () => {
    test("returns true for size token", () => {
      const isSize = isImageSizeToken("lg");

      expect(isSize).toBe(true);
    });

    test("returns false for non-size", () => {
      const isSize = isImageSizeToken("zzz");

      expect(isSize).toBe(false);
    });
  });

  describe(formatToContentType.name, () => {
    test("returns proper content type", () => {
      const result = formatToContentType(ImageFormatToken.JPEG);

      expect(result.contentType).toBe("image/jpeg");
    });

    test("throws on unknown format", () => {
      expect(() => {
        formatToContentType("haha" as ImageFormatToken);
      }).toThrow(/unknown format/);
    });
  });

  describe(isBase64UrlFormatted.name, () => {
    test("returns true for valid base64url values", () => {
      expect(isBase64UrlFormatted("dmlzaW9uYXJ5")).toBe(true);

      expect(isBase64UrlFormatted("dGhpcyBpcyBhIHZhbGlkIGJhc2U2NHVybCB2YWx1ZSBzaXI")).toBe(true);
    });

    test("returns false for invalid base64url values", () => {
      expect(isBase64UrlFormatted("YmFzZQ==")).toBe(false);
      expect(isBase64UrlFormatted("invalid!")).toBe(false);
    });
  });

  describe(compact.name, () => {
    test("can compact an array of strings", () => {
      const items = ["", "image", "xyzzz", null, false, 0, "image.jpg"];

      const compactedItems = compact(items);

      expect(compactedItems).toEqual(["image", "xyzzz", "image.jpg"]);
    });
  });

  describe(suggestedBlurhashComponentDimensions.name, () => {
    test("can compute x, y blurhash components from image dimensions", () => {
      // square
      expect(suggestedBlurhashComponentDimensions(400, 400)).toEqual([4, 4]);

      // portrait
      expect(suggestedBlurhashComponentDimensions(2400, 3200)).toEqual([4, 4]);

      // landscape (AR > 2)
      expect(suggestedBlurhashComponentDimensions(1280, 605)).toEqual([4, 3]);
    });
  });

  describe(extractBlurhashComponentDimensions.name, () => {
    test("can extract blurhash dimensions", () => {
      const testBlurhash1 = "UNL#hSRQ]z%30b-pxubIGcWV59NHa1I;W=of"; // 4x4

      expect(extractBlurhashComponentDimensions(testBlurhash1)).toEqual({
        xComponents: 4,
        yComponents: 4,
      });

      // Note: this function can't tell the order of x,y so there's no use testing non-square dimensions
      // const testBlurhash2 = "%89=QlbH]+bG1Msn1Mn*#.S3}CNv$#oKoKw_"; // 2x8
    });
  });
});
