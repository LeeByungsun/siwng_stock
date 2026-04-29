import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Swing Dashboard",
  description: "기술적 지표 기반 스윙 매매 참고 대시보드",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
