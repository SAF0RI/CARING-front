#!/usr/bin/env node

/**
 * APK 버전 자동 증가 스크립트
 * app.json의 version과 build.gradle의 versionCode/versionName을 동기화하여 증가시킵니다.
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..');
const APP_JSON_PATH = path.join(PROJECT_ROOT, 'app.json');
const BUILD_GRADLE_PATH = path.join(PROJECT_ROOT, 'android', 'app', 'build.gradle');

// version 문자열을 파싱 (예: "1.0.0" -> [1, 0, 0])
function parseVersion(versionString) {
  return versionString.split('.').map(Number);
}

// 버전 배열을 문자열로 변환 (예: [1, 0, 0] -> "1.0.0")
function versionToString(versionArray) {
  return versionArray.join('.');
}

// 버전 증가 (patch 버전 증가)
function incrementVersion(versionArray) {
  const newVersion = [...versionArray];
  newVersion[2] = (newVersion[2] || 0) + 1; // patch 버전 증가
  return newVersion;
}

try {
  // 1. app.json 읽기 및 버전 파싱
  const appJson = JSON.parse(fs.readFileSync(APP_JSON_PATH, 'utf8'));
  const currentVersion = parseVersion(appJson.expo.version);
  const newVersion = incrementVersion(currentVersion);
  const newVersionString = versionToString(newVersion);

  console.log(`📦 버전 증가: ${appJson.expo.version} -> ${newVersionString}`);

  // 2. app.json 업데이트
  appJson.expo.version = newVersionString;
  fs.writeFileSync(APP_JSON_PATH, JSON.stringify(appJson, null, 2) + '\n');

  // 3. build.gradle 읽기
  let buildGradle = fs.readFileSync(BUILD_GRADLE_PATH, 'utf8');

  // 4. versionCode 찾기 및 증가
  const versionCodeMatch = buildGradle.match(/versionCode\s+(\d+)/);
  if (!versionCodeMatch) {
    throw new Error('build.gradle에서 versionCode를 찾을 수 없습니다.');
  }
  const currentVersionCode = parseInt(versionCodeMatch[1], 10);
  const newVersionCode = currentVersionCode + 1;

  console.log(`📦 versionCode 증가: ${currentVersionCode} -> ${newVersionCode}`);

  // 5. build.gradle 업데이트
  buildGradle = buildGradle.replace(
    /versionCode\s+\d+/,
    `versionCode ${newVersionCode}`
  );
  buildGradle = buildGradle.replace(
    /versionName\s+"[^"]+"/,
    `versionName "${newVersionString}"`
  );

  fs.writeFileSync(BUILD_GRADLE_PATH, buildGradle);

  console.log(`✅ 버전 업데이트 완료: ${newVersionString} (${newVersionCode})`);
  
  // 변경사항을 Git에 스테이징
  const { execSync } = require('child_process');
  try {
    execSync('git add app.json android/app/build.gradle', { stdio: 'ignore' });
    console.log('✅ 변경된 버전 파일들을 Git에 스테이징했습니다.');
  } catch (err) {
    // Git이 없거나 실패해도 계속 진행
    console.warn('⚠️  Git 스테이징 실패 (계속 진행합니다)');
  }
} catch (error) {
  console.error('❌ 버전 증가 실패:', error.message);
  process.exit(1);
}
