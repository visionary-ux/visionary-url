export class InvalidBlurhashComponentDimensions extends Error {
  message = "invalid blurhash component dimensions";
}

export class InvalidImageDimensions extends Error {
  message = "invalid image dimensions";
}

export class InvalidEndpoint extends Error {
  message = "invalid endpoint URL (does it contain http/https?)";
}
