import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Skeleton } from '@/shared/ui';
import { Movement } from '@/shared/types';
import { movementsApi } from '@/shared/api/movements';
import { ArrowRight } from 'lucide-react';

export function RecentMovementsTable() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    movementsApi.getRecent(5)
      .then(setMovements)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle>Последние перемещения</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Последние перемещения</CardTitle>
        <a href="/movements" className="text-sm text-blue-600 hover:text-blue-700">
          Все перемещения
        </a>
      </CardHeader>
      <CardContent>
        {movements.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">Нет данных о перемещениях</p>
        ) : (
          <>
            <div className="hidden lg:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Оборудование</TableHead>
                    <TableHead>Инв. номер</TableHead>
                    <TableHead>Маршрут</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Ответственный</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movements.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="font-medium">{m.equipmentName}</TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">{m.equipment.serialNumber}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <span>{m.from}</span>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                          <span>{m.to}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{m.date}</TableCell>
                      <TableCell className="text-muted-foreground">{m.operator}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="lg:hidden space-y-4">
              {movements.map((m) => (
                <div key={m.id} className="border dark:border-[#334155] rounded-lg p-4 space-y-2">
                  <p className="font-medium">{m.equipmentName}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{m.from}</span>
                    <ArrowRight className="w-4 h-4" />
                    <span>{m.to}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{m.date}</span>
                    <span>{m.operator}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
