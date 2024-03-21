import { describe, expect, test } from "vitest";

import { VisionaryImageFields } from "../types/visionary.types";
import { ImageFormatToken, ImageSizeToken } from "../enum";
import { InvalidEndpoint } from "../error";
import { generateVisionaryUrl, parseVisionaryString, parseVisionaryUrl } from "../visionary-url";

const sampleFields: VisionaryImageFields = {
  blurhash: "LCDJYN9FxG_M_N%L%M%M4o~ptRIA",
  blurhashX: 4,
  blurhashY: 4,
  bcc: "110044",
  fileId: "vb87s1",
  sourceHeight: 1200,
  sourceWidth: 1600,
};

const sampleUrl =
  "https://cdn.visionary.cloud/image/dmI4N3MxITE2MDAhMTIwMCExMTAwNDQhTENESllOOUZ4R19NX04lTCVNJU00b35wdFJJQQ/strawberries.jpg";

describe("visionary-url", () => {
  describe(parseVisionaryUrl.name, () => {
    test("parses a Visionary URL", () => {
      const { fields, options } = parseVisionaryUrl(sampleUrl)!;

      expect(fields.fileId).toBe("vb87s1");
      expect(Object.keys(options).length).toBe(0);
    });

    test("parses a Visionary URL with options", () => {
      const urlWithOptions =
        "https://cdn.visionary.cloud/image/dmI4N3MxITE2MDAhMTIwMCExMTAwNDQhTENESllOOUZ4R19NX04lTCVNJU00b35wdFJJQQ/4k,avif/strawberries.jpg";

      const { fields, options } = parseVisionaryUrl(urlWithOptions)!;

      expect(fields.fileId).toBe("vb87s1");
      expect(options.size).toBe(ImageSizeToken["4k"]);
      expect(options.format).toBe(ImageFormatToken.AVIF);
      expect(Object.keys(options).length).toBe(2);
    });

    test("handles a bad input", () => {
      const response = parseVisionaryUrl(null as unknown as string);

      expect(response).toBe(null);
    });
  });

  describe(generateVisionaryUrl.name, () => {
    test("generates a URL", () => {
      const url = generateVisionaryUrl(sampleFields);

      const expectedUrl =
        "https://cdn.visionary.cloud/image/dmI4N3MxITE2MDAhMTIwMCExMTAwNDQhTENESllOOUZ4R19NX04lTCVNJU00b35wdFJJQSE0ITQ/image.jpg";

      expect(url).toBe(expectedUrl);
    });

    test("generates a URL with a custom endpoint", () => {
      const url = generateVisionaryUrl(sampleFields, {
        endpoint: "https://cdn.iss.space",
      });

      const expectedUrl =
        "https://cdn.iss.space/image/dmI4N3MxITE2MDAhMTIwMCExMTAwNDQhTENESllOOUZ4R19NX04lTCVNJU00b35wdFJJQSE0ITQ/image.jpg";

      expect(url).toBe(expectedUrl);
    });

    test("generates a URL with the download option specified", () => {
      const url = generateVisionaryUrl(sampleFields, {
        download: true,
      });

      const expectedUrl =
        "https://cdn.visionary.cloud/image/dmI4N3MxITE2MDAhMTIwMCExMTAwNDQhTENESllOOUZ4R19NX04lTCVNJU00b35wdFJJQSE0ITQ/download/image.jpg";

      expect(url).toBe(expectedUrl);
    });

    test("generates a URL with image options", () => {
      const url = generateVisionaryUrl(sampleFields, {
        download: true,
        size: ImageSizeToken.full,
      });

      const expectedUrl =
        "https://cdn.visionary.cloud/image/dmI4N3MxITE2MDAhMTIwMCExMTAwNDQhTENESllOOUZ4R19NX04lTCVNJU00b35wdFJJQSE0ITQ/download,full/image.jpg";

      expect(url).toBe(expectedUrl);
    });

    test("generates a URL with image options and filename", () => {
      const url = generateVisionaryUrl(sampleFields, {
        download: true,
        filename: "flowers.jpg",
        size: ImageSizeToken["4k"],
      });

      const expectedUrl =
        "https://cdn.visionary.cloud/image/dmI4N3MxITE2MDAhMTIwMCExMTAwNDQhTENESllOOUZ4R19NX04lTCVNJU00b35wdFJJQSE0ITQ/4k,download/flowers.jpg";

      expect(url).toBe(expectedUrl);
    });

    test("generates a URL with a custom filename", () => {
      const url = generateVisionaryUrl(sampleFields, {
        filename: "strawberry-fields-vibrant-red.jpg",
      });

      const expectedUrl =
        "https://cdn.visionary.cloud/image/dmI4N3MxITE2MDAhMTIwMCExMTAwNDQhTENESllOOUZ4R19NX04lTCVNJU00b35wdFJJQSE0ITQ/strawberry-fields-vibrant-red.jpg";

      expect(url).toBe(expectedUrl);
    });

    test("generates a URL with only fileId/width/height (no bg color or blurhash)", () => {
      const url = generateVisionaryUrl({
        fileId: "https://iss.space/earth.jpg",
        sourceWidth: 400,
        sourceHeight: 300,
      });

      const expectedUrl =
        "https://cdn.visionary.cloud/image/aHR0cHM6Ly9pc3Muc3BhY2UvZWFydGguanBnITQwMCEzMDA/image.jpg";

      expect(url).toBe(expectedUrl);
    });

    test("returns null on bad inputs", () => {
      expect(generateVisionaryUrl("" as unknown as VisionaryImageFields)).toBeNull();
      expect(generateVisionaryUrl({} as VisionaryImageFields)).toBeNull();
    });

    test("throws on invalid endpoint", () => {
      const testError1 = () => {
        generateVisionaryUrl(sampleFields, {
          endpoint: "notacdn.net", // no protocol specified
        });
      };

      const testError2 = () => {
        generateVisionaryUrl(sampleFields, {
          endpoint: "not-a-url",
        });
      };

      expect(testError1).toThrowError(InvalidEndpoint);
      expect(testError2).toThrowError(InvalidEndpoint);
    });
  });

  describe(parseVisionaryString.name, () => {
    test("parses a Visionary URL", () => {
      const inputString =
        "https://cdn.visionary.cloud/image/dmI4N3MxITE2MDAhMTIwMCExMTAwNDQhTENESllOOUZ4R19NX04lTCVNJU00b35wdFJJQQ/sm,webp/fruit.jpg";

      const { fields, options } = parseVisionaryString(inputString)!;

      expect(fields.fileId).toBe("vb87s1");
      expect(options.size).toBe(ImageSizeToken["sm"]);
      expect(options.format).toBe(ImageFormatToken.WEBP);
    });

    test("parses a Visionary code", () => {
      const inputString =
        "RnpIeUkxUlhPMiEzMzUxITQ5ODkhZDNiZTgwIVVDTixGaXE_MDNeJH5vSVVSOmpbMG5qWHQ2V0UtOnNrYWVhIyE0ITQ";

      const { fields } = parseVisionaryString(inputString)!;

      expect(fields.fileId).toBe("FzHyI1RXO2");
      expect(fields.bcc).toBe("d3be80");
      expect(fields.blurhashX).toBe(4);
      expect(fields.blurhashY).toBe(4);
    });

    test("handles a bad input", () => {
      const response = parseVisionaryString("");

      expect(response).toBe(null);
    });
  });
});
