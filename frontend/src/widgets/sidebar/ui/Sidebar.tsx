import { NavLink } from 'react-router';
import {
  LayoutDashboard,
  Package,
  ArrowRightLeft,
  XCircle,
  BarChart3,
  Database,
  Users,
  Settings,
  Menu,
  Moon,
  Sun,
} from 'lucide-react';
import { ROUTES } from '@/shared/config/routes';
import { Sheet, SheetContent, SheetTrigger, Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui';
import { useIsDesktop, useIsMobile } from '@/shared/hooks/useMediaQuery';
import { useState } from 'react';
import { cn } from '@/app/components/ui/utils';

const mainNav = [
  { name: 'Dashboard',    href: ROUTES.DASHBOARD,    icon: LayoutDashboard },
  { name: 'Equipment',    href: ROUTES.EQUIPMENT,    icon: Package },
  { name: 'Movements',    href: ROUTES.MOVEMENTS,    icon: ArrowRightLeft },
  { name: 'Decommission', href: ROUTES.DECOMMISSION, icon: XCircle },
  { name: 'Reports',      href: ROUTES.REPORTS,      icon: BarChart3 },
];

const adminNav = [
  { name: 'Directories', href: ROUTES.DIRECTORIES, icon: Database },
  { name: 'Users',       href: ROUTES.USERS,       icon: Users },
  { name: 'Settings',    href: ROUTES.SETTINGS,    icon: Settings },
];

function NavItem({ item, collapsed = false, onClick }: {
  item: { name: string; href: string; icon: React.ElementType };
  collapsed?: boolean;
  onClick?: () => void;
}) {
  const link = (
    <NavLink
      to={item.href}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
          isActive
            ? 'bg-[#2E74B5] text-white'
            : 'text-gray-400 hover:text-white hover:bg-white/5',
          collapsed && 'justify-center px-2',
        )
      }
    >
      <item.icon className="w-5 h-5 flex-shrink-0" />
      {!collapsed && <span>{item.name}</span>}
    </NavLink>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right">{item.name}</TooltipContent>
      </Tooltip>
    );
  }

  return link;
}

function SidebarContent({ collapsed = false, onClick }: { collapsed?: boolean; onClick?: () => void }) {
  const [isDark, setIsDark] = useState(true);

  return (
    <div className="flex flex-col h-full bg-[#1a1f2e]">
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-2 px-4 py-5 border-b border-white/10',
        collapsed && 'justify-center px-2',
      )}>
        <div className="flex items-center justify-center w-8 h-8 bg-[#2E74B5] rounded-lg flex-shrink-0">
          <Package className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-white font-semibold text-sm">AssetManager</span>
            <span className="text-gray-500 text-xs">Warehouse Admin</span>
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <TooltipProvider delayDuration={0}>
          {mainNav.map((item) => (
            <NavItem key={item.href} item={item} collapsed={collapsed} onClick={onClick} />
          ))}

          {/* Administration divider */}
          <div className={cn('pt-4 pb-2', collapsed ? 'px-2' : 'px-3')}>
            {!collapsed ? (
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Administration
              </span>
            ) : (
              <div className="w-full h-px bg-white/10" />
            )}
          </div>

          {adminNav.map((item) => (
            <NavItem key={item.href} item={item} collapsed={collapsed} onClick={onClick} />
          ))}
        </TooltipProvider>
      </nav>

      {/* Theme toggle */}
      <div className="border-t border-white/10 p-3">
        <Button
          variant="ghost"
          className={cn(
            'w-full text-gray-400 hover:text-white hover:bg-white/5',
            collapsed ? 'px-2 justify-center' : 'justify-start',
          )}
          onClick={() => setIsDark(!isDark)}
        >
          {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          {!collapsed && <span className="ml-2 text-sm">Toggle Appearance</span>}
        </Button>
      </div>

      {/* User */}
      <div className="border-t border-white/10 p-4">
        <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
          <div className="w-8 h-8 rounded-full bg-[#2E74B5] flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
            AR
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Administrator</p>
              <p className="text-xs text-gray-500 truncate">Super Admin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  if (isMobile) {
    return (
      <>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-4 left-4 z-50 bg-[#1a1f2e] text-white hover:bg-[#1a1f2e]/80"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 border-none">
            <SidebarContent onClick={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <>
      {/* Tablet — collapsed */}
      <aside className="hidden md:flex lg:hidden w-16 flex-shrink-0">
        <SidebarContent collapsed />
      </aside>
      {/* Desktop — full */}
      <aside className="hidden lg:flex w-60 flex-shrink-0">
        <SidebarContent />
      </aside>
    </>
  );
}
