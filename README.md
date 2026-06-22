**Blurhash URL** generates image URLs with embedded Blurhash placeholders.

![NPM version](https://img.shields.io/npm/v/blurhash-url?color=beige) ![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/visionary-ux/blurhash-url/.github%2Fworkflows%2Fci-cd-workflow.yml?branch=master) ![NPM bundle size](https://img.shields.io/bundlephobia/minzip/blurhash-url?color=blue) ![NPM Downloads](https://img.shields.io/npm/d18m/blurhash-url?color=lightgray)

## Features

- **URL-powered placeholders**: Image URLs with built-in Blurhash placeholders; enables rapid-render image placeholders and optimized web vitals (via [visionary-image](https://github.com/visionary-ux/visionary-image)).
- **Cache-friendly**: Deterministic URLs with path-based encoding maximize browser and CDN cache hits.
- **Universal**: Works in browsers, Node.js, and worker environments.
- **Module support**: Compatible with ES Modules and CommonJS.
- **Lightweight**: Under 3 kB minzipped.

## Installation

```bash
pnpm add blurhash-url
```

## Usage

### Generate a Blurhash URL

```typescript
import { generateBlurhashUrl } from "blurhash-url";

const blurhashUrl = generateBlurhashUrl({
  url: "image:42", // Image ID or Image URL
  bcc: "#8696ac", // Background color code (base layer)
  blurhash: "AUFZT.%L_N%1", // Blurhash code
  sourceHeight: 720, // Dimensions of image this placeholder represents
  sourceWidth: 960, // Used to determine aspect ratio and max-width of placeholder
});
```

This generates the following Blurhash URL with placeholder data embedded. The bolded section below highlights the encoded placeholder data ("Visionary Code"):

<code>https:<span>//blurhash</span>.link/image/<strong>aW1nIzQyITk2MCE3MjAhODY5NmFjIUFVRlpULiVMX04lMQ</strong>/image.jpg</code>

You can configure a custom domain to serve Blurhash URLs. See [Using Your Own Domain](#using-your-own-domain) for more details.

## Anatomy of a Blurhash URL

A Blurhash URL consists of 3 or 4 path segments:

|     | Base path |     | Visionary Code                         |     | Options (optional) |     | Filename    |
| --- | --------- | --- | -------------------------------------- | --- | ------------------ | --- | ----------- |
| `/` | `image`   | `/` | `<base64url-encoded placeholder data>` | `/` | `<option tokens>`  | `/` | `image.jpg` |

### Base path

Defaults to `/image`.

### Visionary Code

The `Visionary Code` is a base64url-encoded string with the following fields (in order):

| Index | Attribute             | Description                                                                         |
| ----- | --------------------- | ----------------------------------------------------------------------------------- |
| `0`   | Image URL / ID        | The URL of the image or an internal image ID. <br/> **required**                    |
| `1`   | Image width           | Used to calculate aspect ratio and constrain placeholder width. <br/> **required**  |
| `2`   | Image height          | Used to calculate aspect ratio and constrain placeholder height. <br/> **required** |
| `3`   | Background color code | Base layer color (e.g. `#BACCAE`).                                                  |
| `4`   | Blurhash code         | Blurhash code for the image.                                                        |
| `5`   | Alt text              | Optional alt text.                                                                  |

> [!NOTE]
> The first three fields are required to render a properly sized placeholder. If the other fields are omitted, a placeholder with a semi-transparent black background (`rgba(0, 0, 0, 0.7)`) will be rendered.

### Image Options

Image options control how the image is served. To add them, include comma-separated tokens in the URL segment between the Visionary Code and the filename.

<code>/image/djQyITEyODAhODUzITg2OTZhYw/<strong>\<options\></strong>/image.jpg</code>

> [!NOTE]
> Options should be sorted alphabetically (e.g., `download,jpg` not `jpg,download`) to ensure consistent URLs for the same set of options. This maximizes cache hit rates across browsers and CDNs. When you generate URLs with `blurhash-url`, options are automatically sorted correctly.

#### Example

Options tokens instructing the server to return an `xl` sized image as a downloadable file (content-type: attachment).

`download,xl`

These options in the Blurhash URL:
<code>https:<span>//blurhash</span>.link/image/djQyITEyODAhODUzITg2OTZhYw/<strong>download,xl</strong>/image.jpg</code>

#### Format tokens

Specify the image format using one of the following tokens:
`auto` (default), `avif`, `jpeg`, `webp`

- `auto` selects the most ideal format based on the browser's `Accept` header (default)
- `avif`, `jpeg`, `webp` force the image to be served in the specified format.

Format tokens are defined in the `ImageFormatToken` enum in [enum.ts](./src/enum.ts).

#### Size tokens

Specify the image size using one of the following tokens (in increasing order):
`xs`, `sm`, `md`, `lg`, `xl`, `xxl`, `4k`, `5k`

Size tokens are defined in the `ImageSizeToken` enum in [enum.ts](./src/enum.ts). The size-to-pixel mapping is defined in the `IMAGE_SIZES` variable in [constants.ts](./src/constants.ts).

#### Control tokens

| token      | description                                                                                                 |
| ---------- | ----------------------------------------------------------------------------------------------------------- |
| `debug`    | Instructs the server to display debug information for this URL.                                             |
| `download` | Instructs the server to set `Content-Disposition: attachment` in response headers.                          |
| `follow`   | Instructs the server to issue a redirect and follow the URL field for external URLs on whitelisted domains. |

### Filename

Defaults to `image.jpg`.

> [!TIP]
> Use descriptive filenames (e.g. `tokyo-shibuya-crossing-neon-rainy.jpg`) to improve image discoverability in search engines.

The filename can be modified to force a cache refresh. If an outdated image is still being served due to caching, append a version number or date (e.g. `starship-stacked-v2.jpg` or `starship-stacked-20250609.jpg`) to ensure the latest version is loaded.

## Using Your Own Domain

To serve Blurhash URLs from your own domain, configure these routes:

```typescript
app.get("/image/:visionaryCode/:filename", handler);
app.get("/image/:visionaryCode/:options/:filename", handler);
```

`handler` extracts the Blurhash placeholder data from the URL and serves the corresponding image.

```typescript
import { parseVisionaryString } from "blurhash-url";

export const handler = (request: Request) => {
  const data = parseVisionaryString(request.url);

  const imageUrl = data.fields.url;

  // Load, serve, or redirect your image as needed
};
```

## Frequently Asked Questions

### What are the benefits of using Blurhash URL?

Blurhash URLs embed all data needed to render beautiful image placeholders directly in the URL. This eliminates the need for separate API calls to fetch placeholder data, resulting in faster initial page renders and a smoother visual loading experience.

Additionally, you can use Blurhash URLs to replace your existing image URL fields—no database migrations or additional columns required.

### How is the Visionary Code structured?

Visionary Code fields are separated by an exclamation mark (`!`) before being base64url-encoded. This separator was chosen to avoid conflicts with characters used by Blurhash's base83 encoding. For more details, see [this section](https://github.com/woltapp/blurhash/blob/master/Algorithm.md#base-83) of the Blurhash Algorithm docs.
