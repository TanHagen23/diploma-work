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

export default function SettingsPage() {
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
              <CardTitle>Общие настройки</CardTitle>
              <CardDescription>Базовые настройки системы</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="company">Название организации</Label>
                <Input id="company" defaultValue="Acme Warehouse Inc." />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="timezone">Часовой пояс</Label>
                <Input id="timezone" defaultValue="America/New_York" />
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
            <Button variant="outline">Отмена</Button>
            <Button className="bg-[#2563eb] hover:bg-[#1d4ed8]">Сохранить</Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
