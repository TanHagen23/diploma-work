import { ReactNode, useState } from 'react';
import { Sidebar } from '@/widgets/sidebar';
import { Header } from '@/widgets/header';
import { Sheet, SheetContent } from '@/shared/ui';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0f172a]">
      {/* Desktop sidebar — always visible on lg+ */}
      <aside className="hidden lg:flex w-60 flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile / tablet sidebar via Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-64 border-none bg-[#1a1f2e]">
          <Sidebar onNavigate={() => setMobileMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header onMenuClick={() => setMobileMenuOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </main>

        <footer className="flex-shrink-0 px-6 py-3 border-t border-gray-100 dark:border-[#334155] bg-white dark:bg-[#1e293b]">
          <p className="text-xs text-gray-400 text-center">
            © 2025 AssetManager WMS. Все права защищены.
          </p>
        </footer>
      </div>
    </div>
  );
}
