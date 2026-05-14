Создай полноценную вёрстку SPA-приложения на React + TypeScript + Vite + Tailwind CSS
на основе прикреплённых дизайн-макетов из Stitch.

ТЕХНИЧЕСКИЙ СТЕК:
- React 18 + TypeScript
- Vite (сборщик)
- Tailwind CSS (все стили только через классы Tailwind, без кастомного CSS)
- React Router v6 (маршрутизация)
- Axios (HTTP-запросы к API)
- Lucide React (иконки)

---

АРХИТЕКТУРА: Feature Sliced Design (FSD)
https://feature-sliced.design/

СТРУКТУРА ПРОЕКТА:

src/
├── app/
│   ├── providers/
│   │   ├── RouterProvider.tsx     # Все маршруты приложения
│   │   └── AuthProvider.tsx       # Контекст авторизации
│   ├── styles/
│   │   └── index.css              # Tailwind directives
│   └── main.tsx
│
├── pages/                         # Страницы (тонкие, только композиция)
│   ├── login/
│   │   └── index.tsx
│   ├── dashboard/
│   │   └── index.tsx
│   ├── equipment/
│   │   └── index.tsx
│   ├── equipment-form/
│   │   └── index.tsx
│   ├── movements/
│   │   └── index.tsx
│   ├── decommission/
│   │   └── index.tsx
│   ├── reports/
│   │   └── index.tsx
│   ├── directories/
│   │   └── index.tsx
│   └── users/
│       └── index.tsx
│
├── widgets/                       # Самостоятельные блоки UI
│   ├── sidebar/
│   │   ├── ui/
│   │   │   └── Sidebar.tsx
│   │   └── index.ts
│   ├── header/
│   │   ├── ui/
│   │   │   └── Header.tsx
│   │   └── index.ts
│   ├── app-layout/
│   │   ├── ui/
│   │   │   └── AppLayout.tsx
│   │   └── index.ts
│   ├── stats-cards/
│   │   ├── ui/
│   │   │   └── StatsCards.tsx
│   │   └── index.ts
│   └── recent-movements-table/
│       ├── ui/
│       │   └── RecentMovementsTable.tsx
│       └── index.ts
│
├── features/                      # Бизнес-фичи (действия пользователя)
│   ├── auth/
│   │   ├── ui/
│   │   │   └── LoginForm.tsx
│   │   ├── model/
│   │   │   └── authStore.ts
│   │   └── index.ts
│   ├── equipment-add/
│   │   ├── ui/
│   │   │   └── AddEquipmentForm.tsx
│   │   └── index.ts
│   ├── equipment-move/
│   │   ├── ui/
│   │   │   └── MoveEquipmentModal.tsx
│   │   └── index.ts
│   ├── equipment-filter/
│   │   ├── ui/
│   │   │   └── EquipmentFilters.tsx
│   │   └── index.ts
│   ├── equipment-decommission/
│   │   ├── ui/
│   │   │   └── DecommissionButton.tsx
│   │   └── index.ts
│   ├── report-export/
│   │   ├── ui/
│   │   │   └── ExportButtons.tsx
│   │   └── index.ts
│   └── user-manage/
│       ├── ui/
│       │   └── UserForm.tsx
│       └── index.ts
│
├── entities/                      # Бизнес-сущности
│   ├── equipment/
│   │   ├── ui/
│   │   │   ├── EquipmentCard.tsx      # Карточка (мобильный)
│   │   │   ├── EquipmentRow.tsx       # Строка таблицы (десктоп)
│   │   │   └── EquipmentBadge.tsx     # Статус-бейдж
│   │   ├── model/
│   │   │   └── types.ts
│   │   ├── api/
│   │   │   └── equipmentApi.ts
│   │   └── index.ts
│   ├── movement/
│   │   ├── ui/
│   │   │   ├── MovementCard.tsx
│   │   │   └── MovementRow.tsx
│   │   ├── model/
│   │   │   └── types.ts
│   │   ├── api/
│   │   │   └── movementApi.ts
│   │   └── index.ts
│   ├── user/
│   │   ├── ui/
│   │   │   ├── UserCard.tsx
│   │   │   └── UserRoleBadge.tsx
│   │   ├── model/
│   │   │   └── types.ts
│   │   ├── api/
│   │   │   └── userApi.ts
│   │   └── index.ts
│   └── department/
│       ├── model/
│       │   └── types.ts
│       ├── api/
│       │   └── departmentApi.ts
│       └── index.ts
│
└── shared/                        # Переиспользуемое без бизнес-логики
    ├── ui/
    │   ├── Button.tsx
    │   ├── Input.tsx
    │   ├── Select.tsx
    │   ├── Modal.tsx
    │   ├── Card.tsx
    │   ├── Table.tsx
    │   ├── Badge.tsx
    │   ├── Skeleton.tsx           # Загрузочные скелетоны
    │   ├── Toast.tsx              # Уведомления
    │   ├── EmptyState.tsx         # Пустые состояния
    │   └── Spinner.tsx
    ├── api/
    │   └── axiosInstance.ts       # Базовый axios с interceptors
    ├── config/
    │   └── routes.ts              # Константы маршрутов
    ├── hooks/
    │   ├── useMediaQuery.ts       # Хук для адаптива
    │   └── useDebounce.ts         # Хук для поиска
    └── types/
        └── index.ts               # Глобальные TypeScript типы

---

ПРАВИЛА FSD (строго соблюдать):

1. Импорты только СВЕРХУ ВНИЗ по слоям:
   shared → entities → features → widgets → pages → app
   
2. НЕЛЬЗЯ импортировать:
   - features из entities
   - widgets из features
   - pages из widgets
   - всё что нарушает иерархию слоёв

3. Каждый слайс экспортирует через index.ts (публичный API):
   export { EquipmentCard } from './ui/EquipmentCard'
   export type { Equipment } from './model/types'

4. Страницы (pages) — только тонкая композиция виджетов и фич:
   // pages/equipment/index.tsx
   import { AppLayout } from '@/widgets/app-layout'
   import { EquipmentFilters } from '@/features/equipment-filter'
   import { AddEquipmentForm } from '@/features/equipment-add'
   // Никакой бизнес-логики в pages!

---

TYPESCRIPT ТИПЫ (shared/types/index.ts):

type EquipmentStatus = 'in_stock' | 'deployed' | 'decommissioned'
type UserRole = 'admin' | 'operator' | 'viewer'

interface Equipment {
  id: number
  name: string
  type: string
  serialNumber: string
  department: string
  status: EquipmentStatus
  createdAt: string
}

interface Movement {
  id: number
  equipment: Equipment
  from: string
  to: string
  date: string
  operator: string
  status: 'completed' | 'in_progress'
}

interface User {
  id: number
  fullName: string
  login: string
  role: UserRole
  department: string
  lastLogin: string
}

---

АДАПТИВ (Tailwind breakpoints):

Sidebar:
- lg: фиксированная 240px, иконки + текст
- md: 64px, только иконки + tooltip
- sm: скрыта, бургер → drawer с оверлеем

Таблицы → Карточки:
- lg: обычная таблица
- md и ниже: каждая строка = карточка (card view)

Фильтры:
- lg: в одну строку горизонтально
- md и ниже: accordion "Фильтры ▼"

Форма оборудования:
- lg: двухколоночный grid
- md и ниже: одна колонка

Modal → Bottom Sheet:
- lg: по центру экрана max-w-lg
- md и ниже: bottom sheet снизу, rounded-t-2xl

Кнопка добавления:
- lg: обычная кнопка в шапке таблицы
- md и ниже: круглая FAB кнопка fixed внизу справа

---

ДОПОЛНИТЕЛЬНЫЕ ТРЕБОВАНИЯ:

- Алиасы путей в vite.config.ts: @/app, @/pages, @/widgets,
  @/features, @/entities, @/shared
- Роль 'viewer': кнопки редактирования не рендерятся через
  условие в JSX (не через CSS display:none)
- Skeleton-экраны при загрузке данных (не спиннеры)
- Toast уведомления: fixed, правый нижний угол, auto-dismiss 3 сек
- Empty state для всех таблиц и списков
- Все формы с валидацией обязательных полей
- Никаких any в TypeScript