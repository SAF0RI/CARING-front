const { withGradleProperties } = require("@expo/config-plugins");

function upsertGradleProp(propsArray, key, value) {
  const idx = propsArray.findIndex(
    (p) => p.type === "property" && p.key === key
  );
  const entry = { type: "property", key, value };
  if (idx >= 0) propsArray[idx] = entry;
  else propsArray.push(entry);
}

const withGradlePropsTuning = (config, opts = {}) => {
  const {
    // 기본값은 네가 올린 sed 명령과 동일하게 세팅
    orgGradleJvmargs = "-Xmx4096m -Xms1024m -XX:MaxMetaspaceSize=1024m -Dfile.encoding=UTF-8",
    kotlinDaemonJvmOptions = "-Xmx2048m,-Xms512m,-XX:MaxMetaspaceSize=1024m",
    // 채널 하드코딩 옵션: 미지정 시 ENV → 없으면 production
    channel = process.env.EXPO_UPDATES_CHANNEL || "production",
  } = opts;

  return withGradleProperties(config, (c) => {
    const props = c.modResults ?? [];

    upsertGradleProp(props, "org.gradle.jvmargs", orgGradleJvmargs);

    // kotlin.daemon.jvm.options 없으면 추가
    // (기존 값이 있어도 덮어쓰고 싶다면 같은 로직으로 upsert)
    upsertGradleProp(
      props,
      "kotlin.daemon.jvm.options",
      kotlinDaemonJvmOptions
    );

    // expo-updates 채널 하드코딩
    upsertGradleProp(props, "expo.updates.channel", channel);

    c.modResults = props;
    return c;
  });
};

module.exports = withGradlePropsTuning;
module.exports.default = withGradlePropsTuning;
