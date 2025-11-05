#!/bin/bash

# Release APK 클린 빌드 스크립트
# 사용법: ./scripts/build-release-apk.sh

set -e  # 에러 발생 시 스크립트 중단

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT"

echo "🚀 Release APK 클린 빌드를 시작합니다..."
echo ""

# 채널/환경 변수 주입 (기본값: production)
CHANNEL="${EXPO_UPDATES_CHANNEL:-}"
if [ -z "$CHANNEL" ]; then
  CHANNEL="production"
fi
export EXPO_UPDATES_CHANNEL="$CHANNEL"
export NODE_ENV="production"
echo "📡 EXPO_UPDATES_CHANNEL=$EXPO_UPDATES_CHANNEL"
echo "🌡️ NODE_ENV=$NODE_ENV"

# 1. Expo prebuild로 네이티브 코드 재생성
echo "📦 Expo prebuild 실행 중..."
CI=1 npx expo prebuild -p android --clean
echo "✓ Prebuild 완료"
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
APK_PATH="/Users/junhyeokpark/Project/CARING-front/android/app/build/outputs/apk/release/app-release.apk"
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
