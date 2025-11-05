#!/bin/bash

# Release APK 클린 빌드 스크립트
# 사용법: ./scripts/build-release-apk.sh

set -e  # 에러 발생 시 스크립트 중단

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT"

echo "🚀 Release APK 클린 빌드를 시작합니다..."
echo ""

# 1. Expo prebuild로 네이티브 코드 재생성
echo "📦 Expo prebuild 실행 중..."
CI=1 npx expo prebuild -p android --clean
echo "✓ Prebuild 완료"
echo ""

# 1-1. Prebuild 이후 Gradle 메모리/린트 설정 재주입
echo "🛠️ Gradle 설정(메모리/린트) 적용 중..."
GRADLE_PROPERTIES="$PROJECT_ROOT/android/gradle.properties"
if [ -f "$GRADLE_PROPERTIES" ]; then
    # JVM 메모리
    sed -i '' 's|^org.gradle.jvmargs=.*$|org.gradle.jvmargs=-Xmx4096m -Xms1024m -XX:MaxMetaspaceSize=1024m -Dfile.encoding=UTF-8|g' "$GRADLE_PROPERTIES" || true
    if ! grep -q '^kotlin.daemon.jvm.options=' "$GRADLE_PROPERTIES"; then
        printf "\nkotlin.daemon.jvm.options=-Xmx2048m,-Xms512m,-XX:MaxMetaspaceSize=1024m\n" >> "$GRADLE_PROPERTIES"
    fi
    # Kotlin 버전 강제 정렬 (빌드 오류 회피용 - 2.1.20 권장)
    if grep -q '^android.kotlinVersion=' "$GRADLE_PROPERTIES"; then
        sed -i '' 's|^android.kotlinVersion=.*$|android.kotlinVersion=2.1.20|g' "$GRADLE_PROPERTIES"
    else
        printf "\nandroid.kotlinVersion=2.1.20\n" >> "$GRADLE_PROPERTIES"
    fi
    # expo-updates KSP 비활성화 (내부 컴파일러 에러 회피)
    if grep -q '^expo.updates.codegen.enabled=' "$GRADLE_PROPERTIES"; then
        sed -i '' 's|^expo.updates.codegen.enabled=.*$|expo.updates.codegen.enabled=false|g' "$GRADLE_PROPERTIES"
    else
        printf "\nexpo.updates.codegen.enabled=false\n" >> "$GRADLE_PROPERTIES"
    fi
fi

APP_BUILD_GRADLE="$PROJECT_ROOT/android/app/build.gradle"
if [ -f "$APP_BUILD_GRADLE" ]; then
    if ! grep -q '^[[:space:]]*lint[[:space:]]*{' "$APP_BUILD_GRADLE"; then
        awk '{
            print $0
            if ($0 ~ /^android \{/ && inserted != 1) {
                print "    lint {";
                print "        abortOnError false";
                print "        checkReleaseBuilds false";
                print "    }";
                inserted = 1;
            }
        }' "$APP_BUILD_GRADLE" > "$APP_BUILD_GRADLE.tmp" && mv "$APP_BUILD_GRADLE.tmp" "$APP_BUILD_GRADLE"
    fi
fi
echo "✓ Gradle 설정 적용 완료"
echo ""

# 1-2. AndroidManifest.xml 수정 (Firebase 알림 색상 충돌 해결 + tools 네임스페이스 추가)
echo "🔧 AndroidManifest.xml 수정 중..."
MANIFEST_PATH="$PROJECT_ROOT/android/app/src/main/AndroidManifest.xml"
if [ -f "$MANIFEST_PATH" ]; then
    # tools 네임스페이스가 없으면 루트 manifest 태그에 추가
    if ! grep -q 'xmlns:tools="http://schemas.android.com/tools"' "$MANIFEST_PATH"; then
        sed -i '' 's|<manifest |<manifest xmlns:tools="http://schemas.android.com/tools" |' "$MANIFEST_PATH"
    fi
    # tools:replace 속성 추가
    sed -i '' 's|<meta-data android:name="com.google.firebase.messaging.default_notification_color" android:resource="@color/notification_icon_color"/>|<meta-data android:name="com.google.firebase.messaging.default_notification_color" android:resource="@color/notification_icon_color" tools:replace="android:resource"/>|g' "$MANIFEST_PATH"
    echo "✓ AndroidManifest.xml 수정 완료"
else
    echo "⚠️  AndroidManifest.xml을 찾을 수 없습니다."
fi
echo ""

# 2. Gradle 클린 빌드
echo "🧹 Gradle 클린 빌드 실행 중..."
cd "$PROJECT_ROOT/android"
export JAVA_TOOL_OPTIONS="-Xmx4g -XX:MaxMetaspaceSize=1024m"
export LINT_HEAP_SIZE=4096m
./gradlew clean
echo "✓ Clean 완료"
echo ""

# 3. Release APK 빌드
echo "🔨 Release APK 빌드 중..."
export JAVA_TOOL_OPTIONS="-Xmx4g -XX:MaxMetaspaceSize=1024m"
export LINT_HEAP_SIZE=4096m
./gradlew assembleRelease
echo "✓ 빌드 완료"
echo ""

# 4. APK 파일 확인
APK_PATH="$PROJECT_ROOT/android/app/build/outputs/apk/release/app-release.apk"
if [ -f "$APK_PATH" ]; then
    APK_SIZE=$(ls -lh "$APK_PATH" | awk '{print $5}')
    echo "✅ APK 빌드 성공!"
    echo "📍 위치: $APK_PATH"
    echo "📦 크기: $APK_SIZE"
    echo ""
    echo "💡 애뮬레이터에 설치하려면:"
    echo "   adb install -r $APK_PATH"
else
    echo "❌ APK 파일을 찾을 수 없습니다."
    exit 1
fi
