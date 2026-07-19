/* global console */
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const requirePackage = createRequire(import.meta.url);

const fields = {
  blurhash: "LCDJYN9FxG_M_N%L%M%M4o~ptRIA",
  sourceHeight: 1200,
  sourceWidth: 1600,
  url: "vb87s1",
};

const checkRoot = ({ generateBlurhashUrl, ImageSizeToken, parseBlurhashUrl }) => {
  assert.equal(ImageSizeToken, undefined);

  const url = generateBlurhashUrl(fields);
  assert.equal(typeof url, "string");
  assert.equal(parseBlurhashUrl(url).fields.url, fields.url);
};

const checkConstants = ({ IMAGE_SIZES, IMAGE_SIZE_LOOKUP, ImageSizeToken }) => {
  assert.equal(ImageSizeToken.lg, "lg");
  assert.equal(IMAGE_SIZES.lg, 1280);
  assert.equal(IMAGE_SIZE_LOOKUP[1280], "lg");
};

checkRoot(requirePackage("blurhash-url"));
checkRoot(await import("blurhash-url"));
checkConstants(requirePackage("blurhash-url/constants"));
checkConstants(await import("blurhash-url/constants"));

console.log("package smoke ok");
