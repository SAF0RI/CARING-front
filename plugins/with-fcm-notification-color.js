// plugins/with-fcm-notification-color.js
const fs = require("fs");
const path = require("path");
const {
  withAndroidManifest,
  AndroidConfig,
  withDangerousMod,
} = require("@expo/config-plugins");

const COLOR_RESOURCE_NAME_DEFAULT = "notification_icon_color";

function ensureColorResource(xml, name, value) {
  // xml이 없으면 기본 템플릿 생성
  if (!xml) {
    return `<?xml version="1.0" encoding="utf-8"?>
<resources>
  <color name="${name}">${value}</color>
</resources>`;
  }
  // 이미 같은 name이 있으면 값만 교체
  if (xml.includes(`name="${name}"`)) {
    return xml.replace(
      new RegExp(`(<color\\s+name="${name}">)([^<]+)(</color>)`, "m"),
      `$1${value}$3`
    );
  }
  // 없으면 끝에 추가
  return xml.replace(
    /<\/resources>\s*$/m,
    `  <color name="${name}">${value}</color>\n</resources>`
  );
}

const withFcmDefaultNotificationColor = (config, props = {}) => {
  const colorHex = props.color || "#FFFFFF";
  const resourceName = props.resourceName || COLOR_RESOURCE_NAME_DEFAULT;

  // 1) AndroidManifest.xml에 <meta-data> 추가 (+ tools:replace 보장)
  config = withAndroidManifest(config, (c) => {
    const manifest = c.modResults;
    const app = AndroidConfig.Manifest.getMainApplicationOrThrow(manifest);

    // idempotent하게 추가
    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      app,
      "com.google.firebase.messaging.default_notification_color",
      `@color/${resourceName}`
    );

    // tools 네임스페이스 보장
    try {
      if (manifest?.manifest?.$ && !manifest.manifest.$["xmlns:tools"]) {
        manifest.manifest.$["xmlns:tools"] = "http://schemas.android.com/tools";
      }
    } catch {}

    // 해당 meta-data에 tools:replace="android:resource" 보장
    try {
      const metaItems = app["meta-data"] || [];
      for (const item of metaItems) {
        const name = item?.$?.["android:name"];
        if (
          name === "com.google.firebase.messaging.default_notification_color"
        ) {
          if (!item.$) item.$ = {};
          item.$["tools:replace"] = "android:resource";
        }
      }
    } catch {}

    return c;
  });

  // 2) res/values/colors.xml에 color 리소스 보장
  config = withDangerousMod(config, [
    "android",
    async (c) => {
      const projectRoot = c.modRequest.projectRoot;
      const colorsPath = path.join(
        projectRoot,
        "android",
        "app",
        "src",
        "main",
        "res",
        "values",
        "colors.xml"
      );

      let xml = null;
      try {
        xml = fs.readFileSync(colorsPath, "utf8");
      } catch {
        // 파일이 없으면 디렉터리부터 보장
        fs.mkdirSync(path.dirname(colorsPath), { recursive: true });
      }

      const nextXml = ensureColorResource(xml, resourceName, colorHex);
      fs.writeFileSync(colorsPath, nextXml, "utf8");

      return c;
    },
  ]);

  return config;
};

module.exports = withFcmDefaultNotificationColor;
module.exports.default = withFcmDefaultNotificationColor;
