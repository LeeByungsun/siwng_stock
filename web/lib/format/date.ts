export function formatKoreanDateTime(isoLike: string) {
  return new Date(isoLike).toLocaleString("ko-KR");
}
