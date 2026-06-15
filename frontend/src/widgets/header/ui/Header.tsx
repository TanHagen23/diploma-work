import { useState, useEffect } from 'react';
import { Bell, Search, LogOut, User, Settings, Sun, Moon, Menu } from 'lucide-react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Avatar,
  AvatarFallback,
  Input,
} from '@/shared/ui';
import { authStore } from '@/features/auth';
import { userApi } from '@/entities/user';
import { useNavigate } from 'react-router';
import { ROUTES } from '@/shared/config/routes';

const ROLE_LABELS: Record<string, string> = {
  admin: 'Администратор',
  manager: 'Менеджер',
  operator: 'Оператор',
  viewer: 'Наблюдатель',
};

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark'),
  );

  const [userName, setUserName] = useState(localStorage.getItem('user_name') ?? '');
  const [userEmail, setUserEmail] = useState(localStorage.getItem('user_email') ?? '');
  const [role, setRole] = useState(authStore.getUserRole());
  const roleLabel = ROLE_LABELS[role] ?? 'Наблюдатель';

  useEffect(() => {
    if (!authStore.isAuthenticated()) return;
    userApi.me().then((user) => {
      setUserName(user.fullName);
      setUserEmail(user.email);
      setRole(user.role as ReturnType<typeof authStore.getUserRole>);
      localStorage.setItem('user_name', user.fullName);
      localStorage.setItem('user_email', user.email);
      localStorage.setItem('user_role', user.role);
    }).catch(() => {});
  }, []);

  const handleLogout = () => {
    authStore.logout();
    navigate(ROUTES.LOGIN);
  };

  const toggleDark = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark((prev) => !prev);
  };

  return (
    <header className="flex items-center gap-3 px-4 lg:px-6 py-4 bg-white dark:bg-[#1e293b] border-b border-gray-100 dark:border-[#334155]">
      {/* Mobile menu trigger */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="lg:hidden flex-shrink-0 text-gray-500 dark:text-[#94a3b8] hover:text-gray-700 dark:hover:text-[#f1f5f9]"
        aria-label="Открыть меню"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-[#94a3b8]" />
        <Input
          type="text"
          placeholder="Поиск оборудования, перемещений или пользователей..."
          className="pl-10 bg-gray-50 dark:bg-[#0f172a] border-gray-200 dark:border-[#334155] focus:bg-white dark:focus:bg-[#1e293b] dark:text-[#f1f5f9] dark:placeholder-[#94a3b8]"
        />
      </div>

      {/* Right — Theme toggle, Notifications & User */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDark}
          className="text-gray-500 dark:text-[#94a3b8] hover:text-gray-700 dark:hover:text-[#f1f5f9]"
          title="Toggle theme"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <Button variant="ghost" size="icon" className="relative text-gray-500 dark:text-[#94a3b8] hover:text-gray-700 dark:hover:text-[#f1f5f9]">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-[#334155] cursor-pointer hover:opacity-80 transition-opacity">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-foreground">{userName}</div>
                <div className="text-xs text-muted-foreground">{roleLabel}</div>
              </div>
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-[#2E74B5] text-white">
                  <User size={16} className="text-white" />
                </AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium">{userName}</span>
                <span className="text-xs text-gray-500 font-normal">{userEmail}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer gap-2">
              <User className="h-4 w-4" />
              Профиль
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-2">
              <Settings className="h-4 w-4" />
              Настройки
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer gap-2 text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Выйти
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
