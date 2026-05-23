import { ReactNode } from 'react';
import { Sidebar } from '@/widgets/sidebar';
import { Header } from '@/widgets/header';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0f172a]">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </main>

        <footer className="flex-shrink-0 px-6 py-3 border-t border-gray-100 dark:border-[#334155] bg-white dark:bg-[#1e293b]">
          <p className="text-xs text-gray-400 text-center">
            © 2025 AssetManager WMS. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
