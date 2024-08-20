**Visionary URL** is a lightweight Typescript library for generating image URLs with built-in Blurhash placeholders.

![NPM version](https://img.shields.io/npm/v/visionary-url?style=flat-square&color=beige) ![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/visionary-ux/visionary-url/.github%2Fworkflows%2Fci-cd-workflow.yml?branch=master&style=flat-square) ![NPM bundle size](https://img.shields.io/bundlephobia/minzip/visionary-url?style=flat-square&color=blue) ![NPM Downloads](https://img.shields.io/npm/d18m/visionary-url?color=lightgray)

#### `visionary-url` includes:

- **Blurhash image URLs**: Generate image URLs with embedded Blurhash data, enabling instant image placeholders (via [visionary-image](https://github.com/visionary-ux/visionary-image)).
- **Cache optimized**: Optimizes browser and CDN caching with path-based placeholder encoding and deterministic URL generation.
- **Runtime compatibility**: Works seamlessly in browsers, Node.js, and worker environments.
- **Module support**: Compatible with ES Modules and CommonJS.
- **Lightweight**: Small footprint, under 3 kB minzipped.

---

## Installation

```bash
npm install --save visionary-url
```

## Usage

#### Turn your image URL into a Blurhash URL:

```typescript
import { generateVisionaryUrl } from "visionary-url";

// Your image URL
const inputUrl = "https://example.cdn/path/to/image.jpg";

// Values from https://visionary.cloud/image-to-blurhash
const visionaryUrl = generateVisionaryUrl({
  url: inputUrl,
  blurhash: "AUFZT.%L_N%1",
  blurhashX: 2,
  blurhashY: 2,
  bcc: "#baccae",
  sourceHeight: 720,
  sourceWidth: 960,
});

// output: https://link.visionary.cloud/image/aHR0cHM6Ly9leGFtcGxlLmNkbi9wYXRoL3RvL2ltYWdlLmpwZyE5NjAhNzIwITg2OTZhYyFBVUZaVC4lTF9OJTEhMiEy/image.jpg
```

## Anatomy of a Visionary URL

A Visionary URL contains 3 or 4 path segments, arranged as follows:

|     | Base path |     | Visionary Code                         |     | Options (optional) |     | Filename    |
| --- | --------- | --- | -------------------------------------- | --- | ------------------ | --- | ----------- |
| `/` | `image`   | `/` | `<base64url-encoded placeholder data>` | `/` | `<option tokens>`  | `/` | `image.jpg` |

### Base path

Defaults to `/image`.

### Visionary Code

The `Visionary Code` field is a base64url-encoded string containing the following ordered fields:

| Index | Attribute             | Description                                                                         |
| ----- | --------------------- | ----------------------------------------------------------------------------------- |
| `0`   | Image URL / ID        | The URL of the image or an internal image ID. <br/> **required**                    |
| `1`   | Image width           | Used to calculate aspect ratio and constrain placeholder width. <br/> **required**  |
| `2`   | Image height          | Used to calculate aspect ratio and constrain placeholder height. <br/> **required** |
| `3`   | Background color code | Base layer color (e.g. `#BACCAE`).                                                  |
| `4`   | Blurhash code         | Blurhash code for the image.                                                        |
| `5`   | Blurhash X components | Number of X components in the Blurhash code.                                        |
| `6`   | Blurhash Y components | Number of Y components in the Blurhash code.                                        |
| `7`   | Alt text              | Optional alt text.                                                                  |

> [!NOTE]
> The first three fields are required to render a properly sized placeholder. If the other fields are omitted, a placeholder with a semi-transparent black background (`rgba(0, 0, 0, 0.7)`) will be rendered.

### Image Options

Image options in Visionary URLs are optional and placed in the options segment of the URL, located between the base64url-encoded Visionary code and the filename.

<code>/image/djQyITEyODAhODUzITg2OTZhYw/<strong>\<options\></strong>/cornflakes.jpg</code>

Options are represented as comma-separated tokens. For deterministic URLs and optimized browser and CDN caching, this tokens are sorted lexicographically.

**Example:**

Options tokens instructing the server to return an `xl` sized image as a downloadable file (content-type: attachment).

`download,xl`

These options within the Visionary URL:

<code>https://link.visionary.cloud/image/djQyITEyODAhODUzITg2OTZhYw/<strong>download,xl</strong>/cornflakes.jpg</code>

#### Format tokens

Specify the image format using the following tokens:
`auto` (default), `avif`, `jpeg`, `webp`

- `auto` selects the image format based on the browser's `Accept` request header.
- `avif`, `jpeg`, `webp` force the image to be served in the specified format.

Format tokens are defined in the `ImageFormatToken` enum in [enum.ts](src/enum.ts).

#### Size tokens

Specify the image size using the following tokens:
`xs`, `sm`, `md`, `lg`, `xl`, `xxl`, `4k`, `5k`

Size tokens are defined in the `ImageSizeToken` enum in [enum.ts](src/enum.ts). The size-to-pixel mapping is defined in the `IMAGE_SIZES` variable in [constants.ts](src/constants.ts).

#### Control tokens

| token      | description                                                                                                 |
| ---------- | ----------------------------------------------------------------------------------------------------------- |
| `debug`    | Instructs the server to display debug information for this URL.                                             |
| `download` | Instructs the server to set `Content-Disposition: attachment` in response headers.                          |
| `follow`   | Instructs the server to issue a redirect and follow the URL field for external URLs on whitelisted domains. |

### Filename

Defaults to `image.jpg`.

> [!TIP]
> Use descriptive filenames (e.g. `bamboo-grove-sunrise-kyoto.jpg`) to improve image discoverability in search engines.

The filename can also be used to generate new URLs for the same image. For instance, if the original image is updated but the old URL is cached by your CDN, appending a version number (e.g., changing the filename from `starship-stacked.jpg` to `starship-stacked-v2.jpg`) ensures that the new image is loaded fresh.

## Frequently Asked Questions

### What are the benefits of using Visionary URL?

Visionary URLs contain all data necessary to render beautiful image placeholders. This approach eliminates the need for separate API calls to fetch blurhash placeholder data, resulting in faster initial page renders and a smoother visual loading experience for users.

Furthermore, you can use Visionary to update your existing image URL field. No need for data migrations to add blurhash columns in your DB.

### How are fields separated in the Visionary Code

Visionary Code fields are separated with an exclamation `!` before being base64url-encoded. This separator must be a value not used by blurhash/base83. See here for more details: https://github.com/woltapp/blurhash/blob/master/Algorithm.md#base-83
