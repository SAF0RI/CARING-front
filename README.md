# CARING-front
caring front repository

## 🚀 APK 빌드

### 자동 빌드 (커밋 시)
Git 커밋 시 자동으로 다음이 실행됩니다:
1. 버전 자동 증가 (`app.json`의 `version`과 `build.gradle`의 `versionCode`/`versionName`)
2. Release APK 빌드

```bash
git commit -m "feat: 새로운 기능 추가"
# 자동으로 버전이 증가하고 APK가 빌드됩니다
```

커밋 시 빌드를 건너뛰려면:
```bash
git commit --no-verify -m "feat: 빌드 없이 커밋"
```

### 수동 빌드
```bash
npm run build:apk
```

## 📦 버전 관리

- `app.json`: `expo.version` (예: "1.0.0")
- `android/app/build.gradle`: `versionCode` (정수), `versionName` (문자열)
- 커밋 시 자동으로 patch 버전이 증가합니다 (1.0.0 → 1.0.1)

## 🔧 개발 환경

```bash
npm start          # 개발 서버 시작
npm run android    # Android 앱 실행
npm run ios        # iOS 앱 실행
npm run lint       # 코드 린팅
```