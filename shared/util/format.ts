export const formatDate = (isoString: string) => {
  // 서버에서 온 ISO 문자열의 날짜를 정확히 추출하기 위해 UTC 기준으로 파싱
  // 예: "2024-01-15T15:00:00Z" -> "2024년 01월 15일" (UTC 기준 날짜)
  const date = new Date(isoString);
  // UTC 기준으로 날짜 추출하여 시간대 영향 방지
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}년 ${month}월 ${day}일`;
};

export const formatDuration = (milliseconds: number) => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

// 주차 계산 유틸리티 함수
export const getWeekOfMonth = (date: Date): number => {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstDayOfWeek = firstDay.getDay(); // 0 = 일요일
  const currentDay = date.getDate();
  
  // 첫 주의 시작일 계산 (일요일 기준)
  const firstWeekStart = firstDayOfWeek === 0 ? 1 : 8 - firstDayOfWeek;
  
  // 현재 날짜가 몇 주차인지 계산
  if (currentDay < firstWeekStart) {
    return 1;
  }
  return Math.ceil((currentDay - firstWeekStart + 1) / 7);
};

// 주차의 시작일과 종료일 계산
export const getWeekRange = (year: number, month: number, week: number): { start: Date; end: Date } => {
  const firstDay = new Date(year, month - 1, 1);
  const firstDayOfWeek = firstDay.getDay();
  
  // 첫 주의 시작일 계산 (일요일 기준)
  const firstWeekStart = firstDayOfWeek === 0 ? 1 : 8 - firstDayOfWeek;
  
  // 해당 주차의 시작일 계산
  const weekStartDay = firstWeekStart + (week - 1) * 7;
  const startDate = new Date(year, month - 1, weekStartDay);
  
  // 해당 주차의 종료일 계산 (토요일까지)
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);
  
  // 월의 마지막 날을 넘지 않도록 조정
  const lastDayOfMonth = new Date(year, month, 0).getDate();
  if (endDate.getDate() > lastDayOfMonth) {
    endDate.setDate(lastDayOfMonth);
  }
  
  return { start: startDate, end: endDate };
};

// 날짜를 YYYY-MM 형식으로 변환
export const formatYearMonth = (date: Date): string => {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
};

// 날짜 범위를 문자열로 포맷팅 (예: "10월 26일 - 11월 1일")
export const formatDateRange = (start: Date, end: Date): string => {
  const startMonth = start.getMonth() + 1;
  const startDay = start.getDate();
  const endMonth = end.getMonth() + 1;
  const endDay = end.getDate();
  
  if (startMonth === endMonth) {
    return `${startMonth}월 ${startDay}일 - ${endDay}일`;
  }
  return `${startMonth}월 ${startDay}일 - ${endMonth}월 ${endDay}일`;
};
