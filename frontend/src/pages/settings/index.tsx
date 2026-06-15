import { useState, useEffect } from 'react';
import { AppLayout } from '@/widgets/app-layout';
import {
  Button,
  Input,
  Label,
  Separator,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui';
import { Switch } from '@/app/components/ui/switch';
import { userApi } from '@/entities/user';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [userId, setUserId] = useState<number | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    userApi.me().then((user) => {
      setUserId(user.id);
      setFullName(user.fullName);
      setEmail(user.email);
      setDepartment(user.department);
    }).catch(() => {
      toast.error('Не удалось загрузить профиль');
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      await userApi.update(userId, { fullName, email, department });
      toast.success('Настройки сохранены');
    } catch {
      toast.error('Ошибка при сохранении');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Настройки</h1>
          <p className="text-muted-foreground mt-1">
            Управление настройками системы управления складом.
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Профиль пользователя</CardTitle>
              <CardDescription>Личные данные учётной записи</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Полное имя</Label>
                <Input
                  id="fullName"
                  value={loading ? '' : fullName}
                  disabled={loading}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={loading ? '' : email}
                  disabled={loading}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="department">Отдел / Должность</Label>
                <Input
                  id="department"
                  value={loading ? '' : department}
                  disabled={loading}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Уведомления</CardTitle>
              <CardDescription>Настройка получения уведомлений</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email-уведомления</p>
                  <p className="text-sm text-muted-foreground">
                    Получать уведомления по email о важных событиях
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Оповещения о низком запасе</p>
                  <p className="text-sm text-muted-foreground">
                    Уведомлять при снижении запасов
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Оповещения о перемещениях</p>
                  <p className="text-sm text-muted-foreground">
                    Уведомлять при перемещении оборудования
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Безопасность</CardTitle>
              <CardDescription>Управление настройками безопасности</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Двухфакторная аутентификация</p>
                  <p className="text-sm text-muted-foreground">
                    Дополнительный уровень защиты аккаунта
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Тайм-аут сессии</p>
                  <p className="text-sm text-muted-foreground">
                    Автовыход через 30 минут неактивности
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Отмена
            </Button>
            <Button
              className="bg-[#2563eb] hover:bg-[#1d4ed8]"
              onClick={handleSave}
              disabled={saving || loading}
            >
              {saving ? 'Сохранение…' : 'Сохранить'}
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
