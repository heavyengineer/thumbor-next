"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  FitInType: () => FitInType,
  HorizontalPosition: () => HorizontalPosition,
  VerticalPosition: () => VerticalPosition,
  createThumbor: () => createThumbor,
  getImageSrcSet: () => getImageSrcSet,
  getOptimizedImageUrl: () => getOptimizedImageUrl,
  getResponsiveImageUrls: () => getResponsiveImageUrls,
  getThumbor: () => getThumbor
});
module.exports = __toCommonJS(index_exports);

// src/thumbor.ts
var import_crypto = __toESM(require("crypto"));

// src/types.ts
var FitInType = /* @__PURE__ */ ((FitInType2) => {
  FitInType2["DEFAULT"] = "fit-in";
  FitInType2["FULL"] = "full-fit-in";
  FitInType2["ADAPTIVE"] = "adaptative-fit-in";
  return FitInType2;
})(FitInType || {});
var VerticalPosition = /* @__PURE__ */ ((VerticalPosition2) => {
  VerticalPosition2["TOP"] = "top";
  VerticalPosition2["MIDDLE"] = "middle";
  VerticalPosition2["BOTTOM"] = "bottom";
  return VerticalPosition2;
})(VerticalPosition || {});
var HorizontalPosition = /* @__PURE__ */ ((HorizontalPosition2) => {
  HorizontalPosition2["LEFT"] = "left";
  HorizontalPosition2["CENTER"] = "center";
  HorizontalPosition2["RIGHT"] = "right";
  return HorizontalPosition2;
})(HorizontalPosition || {});

// src/thumbor.ts
function createThumbor(options) {
  const {
    serverUrl,
    securityKey,
    requiresSecurityKey = !!securityKey,
    cloaked = false
  } = options;
  let operations = createEmptyOperations();
  function createEmptyOperations() {
    return {
      imagePath: "",
      filters: []
    };
  }
  function resetOperations() {
    operations = createEmptyOperations();
  }
  function setImagePath(path) {
    operations.imagePath = path.startsWith("/") ? path.slice(1) : path;
    return api;
  }
  function setImageUrl(url) {
    operations.imagePath = url;
    return api;
  }
  function resize(width, height) {
    operations.width = width;
    operations.height = height;
    operations.fitIn = void 0;
    return api;
  }
  function smartCrop(enable = true) {
    operations.smart = enable;
    return api;
  }
  function trim() {
    operations.trim = true;
    return api;
  }
  function fitIn(width, height, type = "fit-in" /* DEFAULT */) {
    operations.width = width;
    operations.height = height;
    operations.fitIn = type;
    return api;
  }
  function flipHorizontally() {
    operations.flipHorizontally = true;
    return api;
  }
  function flipVertically() {
    operations.flipVertically = true;
    return api;
  }
  function horizontalAlign(align) {
    operations.halign = align;
    return api;
  }
  function verticalAlign(align) {
    operations.valign = align;
    return api;
  }
  function filter(filterCall) {
    operations.filters = operations.filters || [];
    operations.filters.push(filterCall);
    return api;
  }
  function crop(crop2) {
    operations.crop = crop2;
    return api;
  }
  function format(format2) {
    return filter(`format(${format2})`);
  }
  function quality(quality2) {
    return filter(`quality(${quality2})`);
  }
  function brightness(amount) {
    return filter(`brightness(${amount})`);
  }
  function contrast(amount) {
    return filter(`contrast(${amount})`);
  }
  function grayscale() {
    return filter("grayscale()");
  }
  function blur(radius) {
    return filter(`blur(${radius})`);
  }
  function getUrlParts() {
    const parts = [];
    if (operations.trim) {
      parts.push("trim");
    }
    if (operations.crop) {
      parts.push(
        `${operations.crop.left}x${operations.crop.top}:${operations.crop.right}x${operations.crop.bottom}`
      );
    }
    if (operations.fitIn) {
      parts.push(operations.fitIn);
    }
    if (operations.width !== void 0 || operations.height !== void 0 || operations.flipHorizontally || operations.flipVertically) {
      let sizeString = "";
      if (operations.flipHorizontally) {
        sizeString += "-";
      }
      sizeString += operations.width ?? 0;
      sizeString += "x";
      if (operations.flipVertically) {
        sizeString += "-";
      }
      sizeString += operations.height ?? 0;
      parts.push(sizeString);
    }
    if (operations.halign) {
      parts.push(operations.halign);
    }
    if (operations.valign) {
      parts.push(operations.valign);
    }
    if (operations.smart) {
      parts.push("smart");
    }
    if (operations.filters && operations.filters.length > 0) {
      parts.push(`filters:${operations.filters.join(":")}`);
    }
    return parts;
  }
  function getOperationPath() {
    const parts = getUrlParts();
    return parts.length > 0 ? parts.join("/") : "";
  }
  function buildUrl() {
    const operationPath = getOperationPath();
    const imagePath = operations.imagePath;
    const dataToEncrypt = operationPath ? `${operationPath}/${imagePath}` : imagePath;
    let url = `${serverUrl}/unsafe/${dataToEncrypt}`;
    if (securityKey && requiresSecurityKey) {
      const digest = import_crypto.default.createHmac("sha1", securityKey).update(dataToEncrypt).digest("base64").replace(/\+/g, "-").replace(/\//g, "_");
      url = `${serverUrl}/${digest}/${dataToEncrypt}`;
    }
    if (cloaked) {
      url = `${serverUrl}/${dataToEncrypt}`;
    }
    resetOperations();
    return url;
  }
  const api = {
    setImagePath,
    setImageUrl,
    resize,
    smartCrop,
    trim,
    fitIn,
    flipHorizontally,
    flipVertically,
    horizontalAlign,
    verticalAlign,
    filter,
    crop,
    format,
    quality,
    brightness,
    contrast,
    grayscale,
    blur,
    buildUrl
  };
  return api;
}

// src/utils.ts
var thumborClientInstance = null;
function getThumbor(options) {
  const getEnv = (key) => {
    if (typeof process !== "undefined" && process.env) {
      return process.env[key] || "";
    }
    return "";
  };
  const defaultOptions = {
    serverUrl: getEnv("NEXT_PUBLIC_THUMBOR_SERVER_URL"),
    securityKey: getEnv("THUMBOR_SECURITY_KEY"),
    requiresSecurityKey: !!getEnv("THUMBOR_SECURITY_KEY")
  };
  if (!thumborClientInstance || options) {
    thumborClientInstance = createThumbor({
      ...defaultOptions,
      ...options
    });
  }
  return thumborClientInstance;
}
function getOptimizedImageUrl(originalUrl, options = {}) {
  if (!originalUrl) return "";
  const thumbor = getThumbor();
  let imageBuilder = thumbor.setImageUrl(originalUrl);
  if (options.width !== void 0 || options.height !== void 0) {
    imageBuilder = imageBuilder.resize(options.width, options.height);
  }
  if (options.smartCrop) {
    imageBuilder = imageBuilder.smartCrop(true);
  }
  if (options.quality) {
    imageBuilder = imageBuilder.quality(options.quality);
  }
  if (options.format) {
    imageBuilder = imageBuilder.format(options.format);
  }
  if (options.blur) {
    imageBuilder = imageBuilder.blur(options.blur);
  }
  if (options.grayscale) {
    imageBuilder = imageBuilder.grayscale();
  }
  if (options.trim) {
    imageBuilder = imageBuilder.trim();
  }
  if (options.flipHorizontally) {
    imageBuilder = imageBuilder.flipHorizontally();
  }
  if (options.flipVertically) {
    imageBuilder = imageBuilder.flipVertically();
  }
  return imageBuilder.buildUrl();
}
function getResponsiveImageUrls(originalUrl, options = {}) {
  return {
    small: getOptimizedImageUrl(originalUrl, {
      ...options,
      width: options.width ? Math.floor(options.width / 3) : 320
    }),
    medium: getOptimizedImageUrl(originalUrl, {
      ...options,
      width: options.width ? Math.floor(options.width / 1.5) : 768
    }),
    large: getOptimizedImageUrl(originalUrl, options)
  };
}
function getImageSrcSet(originalUrl, options = {}) {
  const widths = [320, 640, 960, 1280, 1920];
  return widths.map((width) => {
    const url = getOptimizedImageUrl(originalUrl, {
      ...options,
      width,
      height: options.height ? Math.floor(options.height * width / (options.width || width)) : void 0
    });
    return `${url} ${width}w`;
  }).join(", ");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FitInType,
  HorizontalPosition,
  VerticalPosition,
  createThumbor,
  getImageSrcSet,
  getOptimizedImageUrl,
  getResponsiveImageUrls,
  getThumbor
});
//# sourceMappingURL=index.js.map