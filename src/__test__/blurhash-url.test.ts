import { describe, expect, test } from "vitest";

import { VisionaryImageFields } from "../types/visionary.types";
import { ImageFormatToken, ImageSizeToken } from "../enum";
import { InvalidEndpoint } from "../error";
import { generateBlurhashUrl, parseBlurhashUrl, parseVisionaryString } from "../blurhash-url";

const sampleFields: VisionaryImageFields = {
  blurhash: "LCDJYN9FxG_M_N%L%M%M4o~ptRIA",
  blurhashX: 4,
  blurhashY: 4,
  bcc: "110044",
  sourceHeight: 1200,
  sourceWidth: 1600,
  url: "vb87s1",
};

const sampleUrl =
  "https://blurhash.link/image/dmI4N3MxITE2MDAhMTIwMCExMTAwNDQhTENESllOOUZ4R19NX04lTCVNJU00b35wdFJJQQ/strawberries.jpg";

describe("blurhash-url", () => {
  describe(parseBlurhashUrl.name, () => {
    test("parses a Blurhash URL", () => {
      const { fields, options } = parseBlurhashUrl(sampleUrl)!;

      expect(fields.url).toBe("vb87s1");
      expect(Object.keys(options).length).toBe(0);
    });

    test("parses a Blurhash URL with options", () => {
      const urlWithOptions =
        "https://blurhash.link/image/dmI4N3MxITE2MDAhMTIwMCExMTAwNDQhTENESllOOUZ4R19NX04lTCVNJU00b35wdFJJQQ/4k,avif/strawberries.jpg";

      const { fields, options } = parseBlurhashUrl(urlWithOptions)!;

      expect(fields.url).toBe("vb87s1");
      expect(options.size).toBe(ImageSizeToken["4k"]);
      expect(options.format).toBe(ImageFormatToken.AVIF);
      expect(Object.keys(options).length).toBe(2);
    });

    test("handles a bad input", () => {
      const response = parseBlurhashUrl(null as unknown as string);

      expect(response).toBe(null);
    });
  });

  describe(generateBlurhashUrl.name, () => {
    test("generates a URL", () => {
      const url = generateBlurhashUrl(sampleFields);

      const expectedUrl =
        "https://blurhash.link/image/dmI4N3MxITE2MDAhMTIwMCExMTAwNDQhTENESllOOUZ4R19NX04lTCVNJU00b35wdFJJQQ/image.jpg";

      expect(url).toBe(expectedUrl);
    });

    test("generates a URL with a custom endpoint", () => {
      const url = generateBlurhashUrl(sampleFields, {
        endpoint: "https://cdn.iss.space",
      });

      const expectedUrl =
        "https://cdn.iss.space/image/dmI4N3MxITE2MDAhMTIwMCExMTAwNDQhTENESllOOUZ4R19NX04lTCVNJU00b35wdFJJQQ/image.jpg";

      expect(url).toBe(expectedUrl);
    });

    test("generates a URL with the download option specified", () => {
      const url = generateBlurhashUrl(sampleFields, {
        download: true,
      });

      const expectedUrl =
        "https://blurhash.link/image/dmI4N3MxITE2MDAhMTIwMCExMTAwNDQhTENESllOOUZ4R19NX04lTCVNJU00b35wdFJJQQ/download/image.jpg";

      expect(url).toBe(expectedUrl);
    });

    test("generates a URL with image options", () => {
      const url = generateBlurhashUrl(sampleFields, {
        download: true,
        size: ImageSizeToken.full,
      });

      const expectedUrl =
        "https://blurhash.link/image/dmI4N3MxITE2MDAhMTIwMCExMTAwNDQhTENESllOOUZ4R19NX04lTCVNJU00b35wdFJJQQ/download,full/image.jpg";

      expect(url).toBe(expectedUrl);
    });

    test("generates a URL with image options and filename", () => {
      const url = generateBlurhashUrl(sampleFields, {
        download: true,
        filename: "flowers.jpg",
        size: ImageSizeToken["4k"],
      });

      const expectedUrl =
        "https://blurhash.link/image/dmI4N3MxITE2MDAhMTIwMCExMTAwNDQhTENESllOOUZ4R19NX04lTCVNJU00b35wdFJJQQ/4k,download/flowers.jpg";

      expect(url).toBe(expectedUrl);
    });

    test("generates a URL with a custom filename", () => {
      const url = generateBlurhashUrl(sampleFields, {
        filename: "strawberry-fields-vibrant-red.jpg",
      });

      const expectedUrl =
        "https://blurhash.link/image/dmI4N3MxITE2MDAhMTIwMCExMTAwNDQhTENESllOOUZ4R19NX04lTCVNJU00b35wdFJJQQ/strawberry-fields-vibrant-red.jpg";

      expect(url).toBe(expectedUrl);
    });

    test("generates a URL with only url/width/height (no bg color or blurhash)", () => {
      const url = generateBlurhashUrl({
        url: "https://iss.space/earth.jpg",
        sourceWidth: 400,
        sourceHeight: 300,
      });

      const expectedUrl =
        "https://blurhash.link/image/aHR0cHM6Ly9pc3Muc3BhY2UvZWFydGguanBnITQwMCEzMDA/image.jpg";

      expect(url).toBe(expectedUrl);
    });

    test("returns null on bad inputs", () => {
      expect(generateBlurhashUrl("" as unknown as VisionaryImageFields)).toBeNull();
      expect(generateBlurhashUrl({} as VisionaryImageFields)).toBeNull();
    });

    test("throws on invalid endpoint", () => {
      const testError1 = () => {
        generateBlurhashUrl(sampleFields, {
          endpoint: "notacdn.net", // no protocol specified
        });
      };

      const testError2 = () => {
        generateBlurhashUrl(sampleFields, {
          endpoint: "not-a-url",
        });
      };

      expect(testError1).toThrowError(InvalidEndpoint);
      expect(testError2).toThrowError(InvalidEndpoint);
    });
  });

  describe(parseVisionaryString.name, () => {
    test("parses a Blurhash URL", () => {
      const inputString =
        "https://blurhash.link/image/dmI4N3MxITE2MDAhMTIwMCExMTAwNDQhTENESllOOUZ4R19NX04lTCVNJU00b35wdFJJQQ/sm,webp/fruit.jpg";

      const { fields, options } = parseVisionaryString(inputString)!;

      expect(fields.url).toBe("vb87s1");
      expect(options.size).toBe(ImageSizeToken["sm"]);
      expect(options.format).toBe(ImageFormatToken.WEBP);
    });

    test("parses a Visionary code", () => {
      const inputString =
        "RnpIeUkxUlhPMiEzMzUxITQ5ODkhZDNiZTgwIVVDTixGaXE_MDNeJH5vSVVSOmpbMG5qWHQ2V0UtOnNrYWVhIyE0ITQ";

      const { fields } = parseVisionaryString(inputString)!;

      expect(fields.url).toBe("FzHyI1RXO2");
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
