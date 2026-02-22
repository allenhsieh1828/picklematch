import type { Metadata } from 'next';
import { Noto_Sans_TC } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import { AuthProvider } from '@/lib/authContext';

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-noto',
});

export const metadata: Metadata = {
  title: 'PickleMatch｜找到你的下一個球局',
  description: '匹克球愛好者的媒合平台，快速瀏覽、報名附近球局',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" className={notoSansTC.variable}>
      <body className="min-h-screen bg-gray-950 font-sans antialiased">
        <AuthProvider>
          <Navbar />
          <main className="mx-auto max-w-5xl px-0 sm:px-4 lg:px-6">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
