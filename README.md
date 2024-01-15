**Visionary URL** is a lightweight library for generating image URLs with embedded placeholder data (image dimensions, background color, blurhash).


## Getting started

Install `visionary-url` via npm. Both ES modules and CommonJS modules are supported.

```bash
npm install --save visionary-url
```

### Generating a Visionary URL

```javascript
import { generateVisionaryUrl } from 'visionary-url';

const url = generateVisionaryUrl({
  blurhash: "LCDJYN9FxG_M_N%L%M%M4o~ptRIA", // blurhash string
  blurhashX: 4, // blurhash x components
  blurhashY: 4, // blurhash y components
  bcc: "#baccae", // background color code
  fileId: "image:101", // image ID or URL
  sourceHeight: 1200, // image height
  sourceWidth: 1600, // image width
});
```



## How it works

A Visionary URL is formatted using 3 or 4 URL segments:
|  | base path | | visionary code | | options (optional) | | filename |
| -- | -- | -- | -- | -- | -- | -- | -- |
| `/` | `image` | `/` | `<visionary code, base64url>` | `/` |`<option tokens>` | `/` | `image.jpg` |

### Example URLs

```
https://examplecdn.cloud/image/aW1hZ2U6MTAwMDEhODAwITYwMA/image.jpg
https://examplecdn.cloud/image/aW1hZ2U6MTAwMDEhODAwITYwMA/4k/image.jpg
```

### Visionary code

The **Visionary code** is a base64url'd, exclamation-point separated list of image placeholder data, detailed as the following:


| Attribute | Description |
| -- | -- |
| Image ID | Image URL or internal image ID (required) |
| Image width | Used to compute aspect ratio of image placeholder (required) |
| Image height | Used to compute aspect ratio of image placeholder (required) |
| Background color code | Base layer background color code (e.g. `#BACCAE`) |
| Blurhash code | Blurhash string of the image |
| Blurhash x components | Number of x components the blurhash code represents |
| Blurhash y components | Number of y components the blurhash code represents |


### Image options

Image options are optional and are provided as comma separated tokens.


#### Size token

One of the following tokens may be included in the options string to specify an image size: `xs`, `sm`, `md`, `lg`, `xl`, `xxl`, `4k`, `5k`

#### Download token

| token | description |
| --  |   --- |
| `download`  | Indication for server to return `content-disposition: attachment;` in response headers  |



