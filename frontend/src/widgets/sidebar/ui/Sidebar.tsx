import { NavLink } from 'react-router';
import {
  LayoutDashboard,
  Box,
  ArrowLeftRight,
  Trash2,
  BarChart3,
  Database,
  Users,
  Settings,
  Menu,
} from 'lucide-react';
import { ROUTES } from '@/shared/config/routes';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui';
import { useIsMobile } from '@/shared/hooks/useMediaQuery';
import { useState } from 'react';
import { cn } from '@/app/components/ui/utils';

const mainNav = [
  { name: 'Dashboard',       href: ROUTES.DASHBOARD,    icon: LayoutDashboard },
  { name: 'Equipment',       href: ROUTES.EQUIPMENT,    icon: Box },
  { name: 'Movements',       href: ROUTES.MOVEMENTS,    icon: ArrowLeftRight },
  { name: 'Decommissioning', href: ROUTES.DECOMMISSION, icon: Trash2 },
  { name: 'Reports',         href: ROUTES.REPORTS,      icon: BarChart3 },
];

const adminNav = [
  { name: 'Users',          href: ROUTES.USERS,       icon: Users },
  { name: 'Reference Data', href: ROUTES.DIRECTORIES, icon: Database },
  { name: 'Settings',       href: ROUTES.SETTINGS,    icon: Settings },
];

function NavItem({
  item,
  collapsed = false,
  onClick,
}: {
  item: { name: string; href: string; icon: React.ElementType };
  collapsed?: boolean;
  onClick?: () => void;
}) {
  const link = (
    <NavLink
      to={item.href}
      onClick={onClick}
      end={item.href === '/'}
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

function SidebarContent({
  collapsed = false,
  onClick,
}: {
  collapsed?: boolean;
  onClick?: () => void;
}) {
  return (
    <div className="flex flex-col h-full bg-[#1a1f2e]">
      {/* Logo */}
      <div
        className={cn(
          'flex items-center gap-2 px-4 py-5 border-b border-white/10',
          collapsed && 'justify-center px-2',
        )}
      >
        <div className="flex items-center justify-center w-8 h-8 bg-[#2E74B5] rounded-lg flex-shrink-0">
          <Box className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-white font-semibold text-sm">AssetManager</span>
            <span className="text-gray-300 text-xs">Warehouse Admin</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <TooltipProvider delayDuration={0}>
          {mainNav.map((item) => (
            <NavItem key={item.href} item={item} collapsed={collapsed} onClick={onClick} />
          ))}

          {/* Administration section */}
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

    </div>
  );
}

export function Sidebar() {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  if (isMobile) {
    return (
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
        <SheetContent side="left" className="p-0 w-64 border-none bg-[#1a1f2e]">
          <SidebarContent onClick={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <>
      {/* Tablet collapsed */}
      <aside className="hidden md:flex lg:hidden w-16 flex-shrink-0">
        <SidebarContent collapsed />
      </aside>
      {/* Desktop full */}
      <aside className="hidden lg:flex w-60 flex-shrink-0">
        <SidebarContent />
      </aside>
    </>
  );
}
