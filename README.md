**Visionary URL** is a lightweight Typescript library for generating image URLs with built-in Blurhash placeholders.

![NPM version](https://img.shields.io/npm/v/visionary-url?style=flat-square&color=528987) ![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/visionary-ux/visionary-url/.github%2Fworkflows%2Fci-cd-workflow.yml?branch=master&style=flat-square)
![NPM bundle size](https://img.shields.io/bundlephobia/minzip/visionary-url?style=flat-square&color=blue)

## Features

- Generate image URLs with embedded blurhash data, enabling instant image placeholders (via [visionary-image](#))
- Compatible with browser, Node.js, and worker environments
- Supports both ES Modules and CommonJS
- Small footprint, just over 2 kb minzipped

## Getting started

### Installation

```bash
npm install --save visionary-url
```

### Generating a Visionary URL

Wrap a public image URL with Visionary data:

```javascript
import { generateVisionaryUrl } from "visionary-url";

const visionaryUrl = generateVisionaryUrl({
  // Blurhash string and number of x, y components
  blurhash: "LCDJYN9FxG_M_N%L%M%M4o~ptRIA",
  blurhashX: 4,
  blurhashY: 4,
  // Background color code
  bcc: "#baccae",
  // Source image dimensions
  sourceHeight: 1200,
  sourceWidth: 1600,
  // Image URL or internal image ID
  url: "https://example.cdn/media/gato.jpg",
});
```

## URL Structure

A Visionary URL path consists of 3 or 4 segments:
| | Base path | | Visionary Code | | Options (optional) | | Filename |
| -- | -- | -- | -- | -- | -- | -- | -- |
| `/` | `image` | `/` | `<base64url-encoded Visionary data>` | `/` |`<option tokens>` | `/` | `image.jpg` |

### Base path

Defaults to "image".

### Visionary Code

The `Visionary Code` field is a base64url-encoded string containing the following fields:

| Index | Attribute             | Description                                                                    |
| ----- | --------------------- | ------------------------------------------------------------------------------ |
| `0`   | Image URL / ID        | Image URL or internal image ID. <br/> **required**                             |
| `1`   | Image width           | Used for aspect ratio and max-width of image placeholder. <br/> **required**   |
| `2`   | Image height          | Used for aspect ratio and max-height of image placeholder. <br/> **required**  |
| `3`   | Background color code | Base layer color (e.g. `#BACCAE`).                                             |
| `4`   | Blurhash code         | Blurhash string of the image.                                                  |
| `5`   | Blurhash x components | Number of x components in blurhash.                                            |
| `6`   | Blurhash y components | Number of y components in blurhash.                                            |
| `7`   | Alt text              | Alt text to render on the image — optional, but recommended for accessibility. |

> [!NOTE]
> The first three fields are required to render a properly sized placeholder. The other fields may be omitted.

### Image Options

Image options may be specified as a set of comma-separated tokens.

#### Format tokens

Specify image format: `auto` (default), `avif`, `jpeg`, `webp`.

Format tokens are defined in the `ImageFormatToken` enum in [enum.ts](src/enum.ts).

#### Size tokens

Specify image size: `xs`, `sm`, `md`, `lg`, `xl`, `xxl`, `4k`, `5k`.

Size tokens are defined in the `ImageSizeToken` enum in [enum.ts](src/enum.ts). Size to pixel mapping is defined in the `IMAGE_SIZES` variable in [constants.ts](src/constants.ts).

#### Download token

| token      | description                                                                            |
| ---------- | -------------------------------------------------------------------------------------- |
| `download` | Indication for server to return `content-disposition: attachment` in response headers. |

### Filename

Defaults to `image.jpg`.

Use descriptive filenames (like `great-bamboo-forest-kyoto-japan.jpg`) to improve image discoverability in search.

## FAQ

### What are the benefits of using Visionary URL?

Visionary URLs contain all data necessary to render beautiful image placeholders. This approach eliminates the need for separate API calls to fetch blurhash placeholder data, resulting in faster initial page renders and a smoother visual loading experience for users.

Furthermore, you can use Visionary to update your existing image URL field. No need for data migrations to add blurhash columns in your DB.

### How are fields separated in the Visionary Code

Visionary Code fields are separated with an exclamation `!` before being base64url-encoded. This separator must be a value not used by blurhash/base83. See here for more details: https://github.com/woltapp/blurhash/blob/master/Algorithm.md#base-83
