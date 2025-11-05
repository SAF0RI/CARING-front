// Expo config plugin to add tools:replace to Firebase notification color meta-data
// This resolves the conflict between @react-native-firebase/messaging and expo-notifications

const { withAndroidManifest } = require("@expo/config-plugins");

function addToolsReplaceToFirebaseNotificationColor(androidManifest) {
  const app = androidManifest.manifest.application?.[0];
  if (!app) return androidManifest;

  // Find the Firebase notification color meta-data
  const metaData = app["meta-data"] || [];
  
  for (let i = 0; i < metaData.length; i++) {
    const meta = metaData[i];
    if (
      meta.$ &&
      meta.$["android:name"] === "com.google.firebase.messaging.default_notification_color"
    ) {
      // Add tools:replace attribute
      meta.$["tools:replace"] = "android:resource";
      break;
    }
  }

  return androidManifest;
}

const withFirebaseNotificationConfig = (config) => {
  config = withAndroidManifest(config, (mod) => {
    mod.modResults = addToolsReplaceToFirebaseNotificationColor(mod.modResults);
    return mod;
  });

  return config;
};

module.exports = withFirebaseNotificationConfig;

