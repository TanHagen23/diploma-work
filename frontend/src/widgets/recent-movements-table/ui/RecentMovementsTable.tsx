import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Badge, Skeleton } from '@/shared/ui';
import { Movement } from '@/shared/types';
import { movementApi } from '@/entities/movement';
import { ArrowRight } from 'lucide-react';

export function RecentMovementsTable() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovements = async () => {
      try {
        const data = await movementApi.getRecent(5);
        setMovements(data);
      } catch (error) {
        console.error('Failed to fetch movements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovements();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Movements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Movements</CardTitle>
        <a href="/movements" className="text-sm text-blue-600 hover:text-blue-700">
          View All
        </a>
      </CardHeader>
      <CardContent>
        <div className="hidden lg:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipment</TableHead>
                <TableHead>Serial Number</TableHead>
                <TableHead>From → To</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Operator</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell className="font-medium">{movement.equipmentName}</TableCell>
                  <TableCell>{movement.equipment.serialNumber}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{movement.from}</span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{movement.to}</span>
                    </div>
                  </TableCell>
                  <TableCell>{movement.date}</TableCell>
                  <TableCell>{movement.operator}</TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        movement.status === 'completed'
                          ? 'bg-green-100 text-green-800 hover:bg-green-100'
                          : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                      }
                    >
                      {movement.status === 'completed' ? 'Completed' : 'In Progress'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile view */}
        <div className="lg:hidden space-y-4">
          {movements.map((movement) => (
            <div key={movement.id} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{movement.equipmentName}</p>
                  <p className="text-sm text-gray-500">{movement.equipment.serialNumber}</p>
                </div>
                <Badge 
                  className={
                    movement.status === 'completed'
                      ? 'bg-green-100 text-green-800 hover:bg-green-100'
                      : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                  }
                >
                  {movement.status === 'completed' ? 'Completed' : 'In Progress'}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span>{movement.from}</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <span>{movement.to}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>{movement.date}</span>
                <span>{movement.operator}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
