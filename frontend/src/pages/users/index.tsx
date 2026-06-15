import { useState, useEffect } from "react";
import { AppLayout } from "@/widgets/app-layout";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
  Avatar,
  AvatarFallback,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui";
import { User } from "@/shared/types";
import { UserRoleBadge, userApi } from "@/entities/user";
import { Plus, Search, Download, Filter, Edit, Trash2 } from "lucide-react";
import { useIsDesktop } from "@/shared/hooks/useMediaQuery";
import { authStore } from "@/features/auth";
import { toast } from "sonner";

interface EditForm {
  fullName: string;
  email: string;
  department: string;
  role: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const isDesktop = useIsDesktop();
  const userRole = authStore.getUserRole();

  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [editTarget, setEditTarget] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({ fullName: "", email: "", department: "", role: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userApi.getAll();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.department.toLowerCase().includes(search.toLowerCase()),
  );

  const openEdit = (user: User) => {
    setEditTarget(user);
    setEditForm({ fullName: user.fullName, email: user.email, department: user.department, role: user.role });
  };

  const handleEditSave = async () => {
    if (!editTarget) return;
    setSaving(true);
    try {
      const updated = await userApi.update(editTarget.id, editForm);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      setEditTarget(null);
      toast.success("Пользователь обновлён");
    } catch {
      toast.error("Ошибка при сохранении");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await userApi.delete(deleteTarget.id);
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      toast.success("Пользователь удалён");
    } catch {
      toast.error("Ошибка при удалении");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Row 1: Title + Add User button */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Каталог пользователей
            </h1>
            <p className="text-muted-foreground mt-1">
              Управление пользователями и правами доступа
            </p>
          </div>
          {userRole === "admin" && (
            <Button className="bg-[#2563eb] hover:bg-[#1d4ed8] gap-2">
              <Plus className="w-4 h-4" />
              Добавить пользователя
            </Button>
          )}
        </div>

        {/* Row 2: Search + actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Поиск по имени, email или отделу..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Фильтр
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Экспорт
            </Button>
          </div>
        </div>

        {/* Users list */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <>
            {isDesktop ? (
              <div className="bg-white rounded-lg border border-gray-200">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Пользователь</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Отдел</TableHead>
                      <TableHead>Роль</TableHead>
                      <TableHead>Последний вход</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-[#2E74B5] text-white">
                                {user.fullName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.fullName}</p>
                              <p className="text-sm text-gray-500">
                                @{user.login}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.department}</TableCell>
                        <TableCell>
                          <UserRoleBadge role={user.role} />
                        </TableCell>
                        <TableCell>{user.lastLogin}</TableCell>
                        <TableCell className="text-right">
                          {userRole === "admin" && (
                            <div className="flex justify-end gap-1">
                              <button
                                title="Редактировать"
                                onClick={() => openEdit(user)}
                                className="p-2 text-muted-foreground hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                title="Удалить"
                                onClick={() => setDeleteTarget(user)}
                                className="p-2 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="bg-white rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar>
                        <AvatarFallback className="bg-[#2E74B5] text-white">
                          {user.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{user.fullName}</p>
                        <p className="text-sm text-gray-500">@{user.login}</p>
                      </div>
                      <UserRoleBadge role={user.role} />
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Email:</span>
                        <span>{user.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Отдел:</span>
                        <span>{user.department}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Последний вход:</span>
                        <span>{user.lastLogin}</span>
                      </div>
                    </div>
                    {userRole === "admin" && (
                      <div className="flex gap-2 mt-3 pt-3 border-t">
                        <button
                          onClick={() => openEdit(user)}
                          className="flex-1 p-2 text-sm text-muted-foreground hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          <Edit size={14} /> Изменить
                        </button>
                        <button
                          onClick={() => setDeleteTarget(user)}
                          className="flex-1 p-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          <Trash2 size={14} /> Удалить
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Results count */}
        {!loading && filteredUsers.length > 0 && (
          <p className="text-sm text-gray-500 text-center">
            Показано {filteredUsers.length} из {users.length} пользователей
          </p>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editTarget} onOpenChange={(o) => !o && setEditTarget(null)}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Редактировать пользователя</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Полное имя</Label>
              <Input
                value={editForm.fullName}
                onChange={(e) => setEditForm((f) => ({ ...f, fullName: e.target.value }))}
                placeholder="Иванов Иван Иванович"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="user@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Отдел</Label>
              <Input
                value={editForm.department}
                onChange={(e) => setEditForm((f) => ({ ...f, department: e.target.value }))}
                placeholder="ИТ отдел"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Роль</Label>
              <Select value={editForm.role} onValueChange={(v) => setEditForm((f) => ({ ...f, role: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите роль" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Администратор</SelectItem>
                  <SelectItem value="operator">Оператор</SelectItem>
                  <SelectItem value="viewer">Наблюдатель</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)} disabled={saving}>
              Отмена
            </Button>
            <Button
              className="bg-[#2563eb] hover:bg-[#1d4ed8]"
              onClick={handleEditSave}
              disabled={saving}
            >
              {saving ? "Сохранение..." : "Сохранить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete AlertDialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить пользователя?</AlertDialogTitle>
            <AlertDialogDescription>
              «{deleteTarget?.fullName}» будет удалён безвозвратно.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Отмена</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteConfirm}
              disabled={deleting}
            >
              {deleting ? "Удаление..." : "Удалить"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
