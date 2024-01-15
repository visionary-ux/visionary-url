import { encode as encodeBase64Url } from "universal-base64url";
import { describe, expect, test } from "vitest";

import { V_CODE_SEPARATOR } from "../constants";
import { parseVisionaryCode, generateVisionaryCode } from "../visionary-code";

import { VisionaryImageFields } from "../types/visionary.types";

describe("visionary-code", () => {
  /**
   * parseVisionaryCode
   */
  describe(parseVisionaryCode.name, () => {
    test("parses a barebones code with fileId and image dimensions", () => {
      const code = "aW1hZ2U6MTAwMDEhODAwITYwMA";

      const fields = parseVisionaryCode(code);

      expect(fields?.fileId).toBe("image:10001");
      expect(fields?.sourceWidth).toBe(800);
      expect(fields?.sourceHeight).toBe(600);
    });

    test("parses a code with fileId, image dimensions, and background color code", () => {
      const code = "aW1hZ2U6MTAwMDEhODAwITYwMCEjQkVFRUVG";

      const fields = parseVisionaryCode(code);

      expect(fields?.fileId).toBe("image:10001");
      expect(fields?.sourceWidth).toBe(800);
      expect(fields?.sourceHeight).toBe(600);
      expect(fields?.bcc).toBe("#BEEEEF");
    });

    test("parses a full visionary code", () => {
      const code = "aW1hZ2U6MTAwMDEhODAwITYwMCEjQkVFRUVGIVRDTSpCYl4rUmt4dXh1YWd-cVdDaj9Ne017ZmohMyE0";

      const fields = parseVisionaryCode(code);

      expect(fields?.fileId).toBe("image:10001");
      expect(fields?.sourceWidth).toBe(800);
      expect(fields?.sourceHeight).toBe(600);
      expect(fields?.bcc).toBe("#BEEEEF");
      expect(fields?.blurhash).toBe("TCM*Bb^+Rkxuxuag~qWCj?M{M{fj");
      expect(fields?.blurhashX).toBe(3);
      expect(fields?.blurhashY).toBe(4);
    });

    test("parses a code with a URL as fileId", () => {
      const code =
        "aHR0cDovL2kuaW1hZ2VjZG40Mi5zcGFjZS9wdWJsaWMvaW1hZ2UtMTEuanBnITQzMiE2NDEhI2JhY2NhZSFCT0JnOV5-cS07fnE_Ynh1ITMhMg";

      const fields = parseVisionaryCode(code);

      expect(fields?.sourceWidth).toBe(432);
      expect(fields?.bcc).toBe("#baccae");
      expect(fields?.fileId).toBe("http://i.imagecdn42.space/public/image-11.jpg");
      expect(fields?.blurhash).toBe("BOBg9^~q-;~q?bxu");
      expect(fields?.blurhashX).toBe(3);
      expect(fields?.blurhashY).toBe(2);
    });

    test("ignores a bad code", () => {
      const badCode = "haha~~not-a-code!";

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
      const fields: VisionaryImageFields = {
        bcc: "be3e3f",
        blurhash: "blurhashvalllue",
        blurhashX: 4,
        blurhashY: 3,
        fileId: "jk92",
        sourceHeight: 100,
        sourceWidth: 200,
      };

      const code = generateVisionaryCode(fields);

      const expectedCode = "ams5MiEyMDAhMTAwIWJlM2UzZiFibHVyaGFzaHZhbGxsdWUhNCEz";

      expect(code).toBe(expectedCode);
    });

    test("generates a code with alt text", () => {
      const fields: VisionaryImageFields = {
        altText: "Happy cow on a farm",
        blurhash: "blurhashvalllue",
        blurhashX: 3,
        blurhashY: 3,
        bcc: "be3e3f",
        fileId: "jk93",
        sourceHeight: 100,
        sourceWidth: 100,
      };

      const code = generateVisionaryCode(fields);

      const expectedCode =
        "ams5MyExMDAhMTAwIWJlM2UzZiFibHVyaGFzaHZhbGxsdWUhMyEzIUhhcHB5IGNvdyBvbiBhIGZhcm0";

      expect(code).toBe(expectedCode);
    });

    test("generates a barebones code (with only imageId and dimensions)", () => {
      const fields: VisionaryImageFields = {
        fileId: "42",
        sourceHeight: 300,
        sourceWidth: 300,
      };

      const expectedVisionaryCode = encodeBase64Url(
        [fields.fileId, fields.sourceWidth, fields.sourceHeight].join(V_CODE_SEPARATOR)
      );

      const visionaryCode = generateVisionaryCode(fields);

      expect(visionaryCode).toBe(expectedVisionaryCode);
    });

    test("generates a code with imageId, dimensions, and bcc (no blurhash)", () => {
      const fields: VisionaryImageFields = {
        bcc: "ff6699",
        fileId: "42",
        sourceHeight: 300,
        sourceWidth: 300,
      };

      const visionaryCode = generateVisionaryCode(fields);

      expect(visionaryCode).toBe("NDIhMzAwITMwMCFmZjY2OTk");
    });
  });
});
