const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};

config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [...config.resolver.sourceExts, "svg"],
  extraNodeModules: {
    "@": path.resolve(__dirname),
  },
};

// InternalBytecode.js 심볼리케이션 에러 방지
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // InternalBytecode.js 관련 요청은 무시
      if (req.url && req.url.includes("InternalBytecode.js")) {
        return res.status(404).end();
      }
      return middleware(req, res, next);
    };
  },
};

module.exports = withNativeWind(config, { input: "./index.css" });
