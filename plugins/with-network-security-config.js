// Expo config plugin to ensure android:networkSecurityConfig and XML file exist on prebuild

const fs = require("fs");
const path = require("path");
const {
  withAndroidManifest,
  withDangerousMod,
} = require("@expo/config-plugins");

const XML_RELATIVE_PATH = path.join(
  "app",
  "src",
  "main",
  "res",
  "xml",
  "network_security_config.xml"
);

function ensureApplicationAttributes(androidManifest) {
  const app = androidManifest.manifest.application?.[0];
  if (!app) return androidManifest;

  app.$ = app.$ || {};
  // Ensure cleartext allowed
  app.$["android:usesCleartextTraffic"] = "true";
  // Ensure networkSecurityConfig reference
  app.$["android:networkSecurityConfig"] = "@xml/network_security_config";
  return androidManifest;
}

function writeNetworkSecurityXml(androidProjectRoot) {
  const targetDir = path.join(
    androidProjectRoot,
    "app",
    "src",
    "main",
    "res",
    "xml"
  );
  const targetPath = path.join(targetDir, "network_security_config.xml");

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const xmlContent = `<?xml version="1.0" encoding="utf-8"?>\n<network-security-config>\n    <base-config cleartextTrafficPermitted="true">\n        <trust-anchors>\n            <certificates src="system" />\n            <certificates src="user" />\n        </trust-anchors>\n    </base-config>\n</network-security-config>\n`;

  fs.writeFileSync(targetPath, xmlContent, { encoding: "utf8" });
}

const withNetworkSecurityConfig = (config) => {
  // Add / enforce AndroidManifest application attributes
  config = withAndroidManifest(config, (mod) => {
    mod.modResults = ensureApplicationAttributes(mod.modResults);
    return mod;
  });

  // Write XML file into android project during prebuild
  config = withDangerousMod(config, [
    "android",
    async (mod) => {
      writeNetworkSecurityXml(mod.modRequest.platformProjectRoot);
      return mod;
    },
  ]);

  return config;
};

module.exports = withNetworkSecurityConfig;
