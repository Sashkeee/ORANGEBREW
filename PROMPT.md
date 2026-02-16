CONTEXT & PROJECT OVERVIEW

Мы разрабатываем ORANGE BREW — систему промышленной автоматизации класса SCADA для домашней пивоварни, работающую на одноплатном компьютере Orange Pi Zero.

Текущее состояние:
Проект существует в виде работающего прототипа "Monolith": один HTML-файл, содержащий React, Tailwind CDN и логику WebSocket. Логика управления железом (GPIO, PWM, PID) реализована на бэкенде в Node-RED.

Задача:
Мигрировать прототип в профессиональное, масштабируемое SPA-приложение (Single Page Application) на базе стека Vite + React.
Цель миграции — разделить ответственность, внедрить строгую типизацию (по возможности), улучшить DX (Developer Experience) и подготовить проект к расширению функционала (новые режимы: дистилляция, ректификация).

Ключевые ограничения:

Hardware: Orange Pi Zero имеет ограниченные ресурсы (RAM/CPU). Клиентский код должен быть максимально оптимизирован и не вызывать утечек памяти.

Network: Работа в локальной сети, возможны разрывы соединения. UI должен быть реактивным и устойчивым к потере связи.

1. TECH STACK (Стек технологий)

Build Tool: Vite (React template). Выбран за скорость сборки (HMR) и оптимизированный бандл для слабых устройств.

Framework: React 18+. Использование функциональных компонентов и хуков (useEffect, useMemo, useCallback).

Styling: Tailwind CSS.

Использование @layer components для создания переиспользуемых классов (.glass-panel, .lcd-text).

Конфигурация темы (tailwind.config.js) должна жестко фиксировать палитру проекта.

Icons: lucide-react. Современные, легковесные SVG-иконы вместо кастомных путей.

Router: react-router-dom (v6+). Для организации навигации между режимами (/brew, /distill, /settings) вместо условного рендеринга useState.

State Management: Zustand.

Выбран вместо Redux/Context API из-за легковесности и простоты работы с WebSocket.

Необходимо создать отдельные сторы: useSocketStore (соединение), useRecipeStore (данные), useProcessStore (состояние варки).

Backend Interface: Node-RED. Связь осуществляется исключительно через WebSocket. REST API не используется.

Utils: date-fns (для работы со временем), clsx / tailwind-merge (для условных стилей).

2. INFRASTRUCTURE & API (Инфраструктура)

Device IP: 192.168.1.14 (Orange Pi).

Web Server: Nginx (Port 80) — раздает статику (наш билд).

Note: Nginx настроен на SPA (redirect all 404 to index.html).

Backend (Node-RED): Port 1880.

WebSocket Endpoint: ws://192.168.1.14:1880/ws/brewery

Environment Configuration

Development Mode (npm run dev):

Приложение запускается на localhost.

WebSocket должен проксироваться или подключаться напрямую к IP 192.168.1.14:1880.

Production Mode (npm run build):

WebSocket должен автоматически определять хост: ws://${window.location.hostname}:1880/ws/brewery.

Protocol (Контракт данных)

Обмен данными происходит в формате JSON.

Входящие сообщения (Server -> Client):

Telemetry: { type: 'update', payload: { t1: number, t2: number, heater: bool, pump: bool } } — "Живые" данные датчиков (1Гц).

Recipes: { type: 'recipes_list', payload: Recipe[] } — Полный список рецептов при инициализации или изменении БД.

Process Status: { type: 'process_update', payload: ProcessState } — Состояние конечного автомата (текущий шаг, таймеры, целевая температура).

System Alerts: { type: 'alert', payload: { level: 'info'|'warn'|'error', msg: string } } — Всплывающие уведомления.

Исходящие команды (Client -> Server):

Data Fetch: { type: 'get_recipes', payload: null } — Принудительный запрос списка.

CRUD:

{ type: 'save_recipe', payload: Recipe }

{ type: 'delete_recipe', payload: string (id) }

Control:

{ type: 'start_brew', payload: Recipe } — Запуск логики варки.

{ type: 'stop_brew', payload: null } — Аварийная остановка (Reset).

{ type: 'skip_step', payload: null } — Пропуск текущей паузы.

Manual Override:

{ type: 'set_pwm', payload: { pin: 'ph2', value: 0-100 } } — Прямое управление ТЭНом.

Connection Logic:

Реализовать "Heartbeat" или автоматическое переподключение (Exponential Backoff) при разрыве связи.

Индикатор статуса соединения в Header (Online/Offline/Syncing).

3. DESIGN SYSTEM: "Industrial Tech-Glass"

Концепция: Темный, высококонтрастный интерфейс, ориентированный на читаемость в условиях производства (пар, плохое освещение). Эстетика "Cyberpunk / Industrial IoT".

Color Palette (Tailwind config):

bg-app: #0b0f1a (Deep Space Black) — основной фон.

surface: rgba(23, 32, 53, 0.85) — для панелей (Cards).

Accents (Process Coding):

brew: #f97316 (Orange-500) — Пивоварение / Нагрев.

distill: #3b82f6 (Blue-500) — Дистилляция / Охлаждение.

rectify: #10b981 (Emerald-500) — Ректификация / Стабильность.

ferment: #a855f7 (Purple-500) — Брожение / Время.

danger: #ef4444 (Red-500) — Ошибки / Стоп.

UI Components Rules:

Glassmorphism:

Все карточки должны иметь класс backdrop-blur-xl.

Тонкая обводка border border-white/5 для выделения границ.

Глубокая тень shadow-2xl для создания объема.

Typography:

Headers: Sans-serif (Roboto/Inter), Bold, Italic, Uppercase, Tracking-tighter.

Data Values: Monospace (JetBrains Mono). Цифры не должны "скакать" при обновлении.

Visual Feedback:

Активные элементы (кнопки, включенные реле) должны иметь эффект внутреннего свечения (box-shadow с цветом акцента).

Слайдеры (Range inputs) должны быть стилизованы под общий дизайн (скрыть дефолтный webkit-appearance).

Animations:

framer-motion для сложных переходов (появление модальных окон, смена страниц).

CSS keyframes для индикаторов работы (вращение вентилятора, пульсация нагрева).

4. COMPONENT ARCHITECTURE (Структура папок)

Предлагаю использовать Feature-Sliced Design (упрощенный) для масштабируемости.

src/
├── assets/              # Статические файлы (logo.svg)
├── components/          # Shared UI Components
│   ├── layout/          # MainLayout, Header, Sidebar, StatusBadge
│   ├── ui/              # GlassCard, LcdDisplay, Slider, Button, Modal, Loader
│   └── icons/           # Кастомные иконки (MixerIcon, KettleIcon)
├── hooks/
│   └── useBrewerySocket.js # Хук-обертка над Zustand стором сокета
├── features/            # Модули бизнес-логики
│   ├── brewing/         # Всё, что касается пива
│   │   ├── components/  # Локальные компоненты (PauseList, KettleVisual)
│   │   ├── RecipeList.jsx
│   │   ├── RecipeConstructor.jsx
│   │   └── ProcessMonitor.jsx
│   ├── distillation/    # (Заготовка)
│   └── settings/        # Панель управления GPIO (Manual Control)
├── pages/               # Страницы роутера (HomePage, BrewPage...)
├── store/               # Zustand stores
│   ├── useSocketStore.js
│   └── useDataStore.js
├── utils/               # Хелперы
│   ├── formatTime.js
│   ├── pauseNames.js    # Логика именования пауз (Кислотная, Белковая...)
│   └── validators.js
└── styles/              # Глобальные стили и tailwind directives


5. DATA MODELS (TypeScript Interfaces / JSDoc)

Recipe Object:

interface Recipe {
  id: string;           // Timestamp-based ID
  name: string;         // "Golden IPA"
  brewer: string;       // "Alex"
  date: string;         // ISO Date "2024-02-26"
  location?: string;    // Optional
  ingredients?: string; // Text description
  pauses: MashStep[];
}

interface MashStep {
  t: number; // Температура (Target), e.g., 62
  m: number; // Время (Minutes), e.g., 40
}


Process State Object:

interface ProcessState {
  active: boolean;      // Флаг запущенного процесса
  step: number;         // -1 (preheat), 0...N (pauses), 999 (finish)
  stepTime: number;     // Секунд прошло на текущем шаге
  totalTime: number;    // Общее время варки в секундах
  targetTemp: number;   // Целевая температура (SetPoint)
  power: number;        // Текущая мощность ТЭНа (0-100)
  pendingRecipe?: Recipe; // Рецепт, ожидающий подтверждения
}


ИНСТРУКЦИЯ ДЛЯ ИИ (Steps to Execute):

Project Init: Инициализируй проект Vite + React. Установи зависимости: lucide-react, react-router-dom, zustand, clsx, tailwind-merge.

Config: Настрой tailwind.config.js, прописав кастомные цвета (brew, distill и т.д.) и шрифты (font-mono -> JetBrains Mono).

Store & Socket: Создай useSocketStore. Реализуй там логику подключения, реконнекта и распределения входящих сообщений по типам.

Routing: Настрой роутер. Создай Layout с общим хедером (где виден статус подключения).

UI Kit: Реализуй базовые компоненты: GlassCard (карточка), LcdText (цифровой дисплей), ModeButton (кнопки меню).

Feature - Brewing:

Перенеси логику конструктора рецептов (формы, валидация).

Реализуй экран мониторинга процесса (визуализация бака, таймеры).

Build: Убедись, что билд создает чистый dist, готовый для деплоя на Nginx.