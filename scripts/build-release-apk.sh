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

# 1-1. AndroidManifest.xml 수정 (Firebase 알림 색상 충돌 해결)
echo "🔧 AndroidManifest.xml 수정 중..."
MANIFEST_PATH="$PROJECT_ROOT/android/app/src/main/AndroidManifest.xml"
if [ -f "$MANIFEST_PATH" ]; then
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
./gradlew clean
echo "✓ Clean 완료"
echo ""

# 3. Release APK 빌드
echo "🔨 Release APK 빌드 중..."
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
