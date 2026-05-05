import './globals.css';
import type { Metadata } from 'next';
import { Web3Provider } from '../components/Web3Provider';

export const metadata: Metadata = {
  title: 'CastKit Example Mint',
  description: 'Reference mint page for CastKit.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}

