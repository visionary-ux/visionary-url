import { encodeBase64Url } from "visionary-base64url";
import { describe, expect, test } from "vitest";

import { V_CODE_SEPARATOR } from "../constants";
import { parseVisionaryCode, generateVisionaryCode } from "../visionary-code";

import { GenerateBlurhashUrlInput } from "../types/visionary.types";

describe("visionary-code", () => {
  /**
   * parseVisionaryCode
   */
  describe(parseVisionaryCode.name, () => {
    test("parses a barebones code with url and image dimensions only", () => {
      const code = "cE1uOVohODAwITYwMA";

      const fields = parseVisionaryCode(code);

      expect(fields?.url).toBe("pMn9Z");
      expect(fields?.sourceWidth).toBe(800);
      expect(fields?.sourceHeight).toBe(600);
    });

    test("parses a code with image dimensions and background color code", () => {
      const code = "aW1hZ2U6MTAwMDEhODAwITYwMCEjQkVFRUVG";

      const fields = parseVisionaryCode(code);

      expect(fields?.url).toBe("image:10001");
      expect(fields?.sourceWidth).toBe(800);
      expect(fields?.sourceHeight).toBe(600);
      expect(fields?.bcc).toBe("#BEEEEF");
    });

    test("parses a full visionary code with fileId as url", () => {
      const code = "aW1hZ2U6MTAwMDEhODAwITYwMCEjQkVFRUVGIVRDTSpCYl4rUmt4dXh1YWd-cVdDaj9Ne017ZmohMyE0";

      const fields = parseVisionaryCode(code);

      expect(fields?.url).toBe("image:10001");
      expect(fields?.sourceWidth).toBe(800);
      expect(fields?.sourceHeight).toBe(600);
      expect(fields?.bcc).toBe("#BEEEEF");
      expect(fields?.blurhash).toBe("TCM*Bb^+Rkxuxuag~qWCj?M{M{fj");
      expect(fields?.blurhashX).toBe(3);
      expect(fields?.blurhashY).toBe(4);
    });

    test("parses a code containing a URL", () => {
      const code =
        "aHR0cDovL2kuaW1hZ2VjZG40Mi5zcGFjZS9wdWJsaWMvaW1hZ2UtMTEuanBnITQzMiE2NDEhI2JhY2NhZSFCT0JnOV5-cS07fnE_Ynh1ITMhMg";

      const fields = parseVisionaryCode(code);

      expect(fields?.sourceWidth).toBe(432);
      expect(fields?.bcc).toBe("#baccae");
      expect(fields?.url).toBe("http://i.imagecdn42.space/public/image-11.jpg");
      expect(fields?.blurhash).toBe("BOBg9^~q-;~q?bxu");
      expect(fields?.blurhashX).toBe(3);
      expect(fields?.blurhashY).toBe(2);
    });

    test("infers blurhash dimensions from blurhash string", () => {
      const altText = "Ancient template in morning light";
      const code = encodeBase64Url(
        ["image:10001", 800, 600, "#baccae", "TCM*Bb^+Rkxuxuag~qWCj?M{M{fj", altText].join(V_CODE_SEPARATOR)
      );

      const fields = parseVisionaryCode(code);

      expect(fields?.blurhash).toBe("TCM*Bb^+Rkxuxuag~qWCj?M{M{fj");
      expect(fields?.blurhashX).toBe(3);
      expect(fields?.blurhashY).toBe(4);
      expect(fields?.altText).toBe(altText);
    });

    test("parses alt text when blurhash is omitted", () => {
      const altText = "Butterfly on a purple flower";
      const code = encodeBase64Url(["image:88592", 800, 600, "#c0ffee", "", altText].join("!"));

      const fields = parseVisionaryCode(code);

      expect(fields?.url).toBe("image:88592");
      expect(fields?.bcc).toBe("#c0ffee");
      expect(fields?.blurhash).toBeUndefined();
      expect(fields?.altText).toBe(altText);
    });

    // legacy url tests (remove)

    test("parses a legacy visionary code with x/y and alt text", () => {
      const code = encodeBase64Url(
        ["image:10001", 800, 600, "#BEEEEF", "TCM*Bb^+Rkxuxuag~qWCj?M{M{fj", 3, 4, "Legacy alt text"].join(
          V_CODE_SEPARATOR
        )
      );

      const fields = parseVisionaryCode(code);

      expect(fields?.blurhash).toBe("TCM*Bb^+Rkxuxuag~qWCj?M{M{fj");
      expect(fields?.blurhashX).toBe(3);
      expect(fields?.blurhashY).toBe(4);
      expect(fields?.altText).toBe("Legacy alt text");
    });

    test("returns null when inferred blurhash dimensions are invalid", () => {
      const code = encodeBase64Url(["image:10001", 800, 600, "#BEEEEF", "abcde"].join(V_CODE_SEPARATOR));

      expect(parseVisionaryCode(code)).toBeNull();
    });

    test("ignores an invalid code", () => {
      const badCode = "haha~~not~~valid!";

      const test = parseVisionaryCode(badCode);

      expect(test).toBeNull();
    });

    test("ignores an empty code", () => {
      expect(parseVisionaryCode("")).toBeNull();
    });
  });

  /**
   * generateVisionaryCode
   */

  describe(generateVisionaryCode.name, () => {
    test("generates a code", () => {
      const fields: GenerateBlurhashUrlInput = {
        bcc: "be3e3f",
        blurhash: "18D+9+}S",
        sourceHeight: 100,
        sourceWidth: 200,
        url: "NdCJU",
      };

      const code = generateVisionaryCode(fields);

      const expectedCode = encodeBase64Url(
        [fields.url, fields.sourceWidth, fields.sourceHeight, fields.bcc, fields.blurhash].join(
          V_CODE_SEPARATOR
        )
      );

      expect(code).toBe(expectedCode);
    });

    test("generates a code with alt text", () => {
      const fields: GenerateBlurhashUrlInput = {
        altText: "Happy cow on a farm",
        blurhash: "A8D+9+}S01S$",
        bcc: "be3e3f",
        sourceHeight: 100,
        sourceWidth: 100,
        url: "I2zUw",
      };

      const code = generateVisionaryCode(fields);

      const expectedCode = encodeBase64Url(
        [
          fields.url,
          fields.sourceWidth,
          fields.sourceHeight,
          fields.bcc,
          fields.blurhash,
          fields.altText,
        ].join(V_CODE_SEPARATOR)
      );

      expect(code).toBe(expectedCode);
    });

    test("generates a barebones code (with only url/fileId and dimensions)", () => {
      const fields: GenerateBlurhashUrlInput = {
        sourceHeight: 300,
        sourceWidth: 300,
        url: "42",
      };

      const expectedVisionaryCode = encodeBase64Url(
        [fields.url, fields.sourceWidth, fields.sourceHeight].join(V_CODE_SEPARATOR)
      );

      const visionaryCode = generateVisionaryCode(fields);

      expect(visionaryCode).toBe(expectedVisionaryCode);
    });

    test("generates a code with fileId as url, dimensions, and bcc (no blurhash)", () => {
      const fields: GenerateBlurhashUrlInput = {
        bcc: "ff6699",
        sourceHeight: 300,
        sourceWidth: 300,
        url: "42",
      };

      const visionaryCode = generateVisionaryCode(fields);

      expect(visionaryCode).toBe("NDIhMzAwITMwMCFmZjY2OTk");
    });
  });
});
