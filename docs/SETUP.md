# 🚀 Установка и запуск

## Требования

- Node.js 14+
- MongoDB 4.0+
- npm или yarn

## Установка

### 1. Клонируем репозиторий

```bash
git clone https://github.com/FusXCuba/FusCuba2007-0.git
cd FusCuba2007-0
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Конфигурация

```bash
cp .env.example .env
```

Отредактируйте `.env`:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/fuscuba-messenger
JWT_SECRET=your-secret-key
```

### 4. Запуск MongoDB

```bash
# Если MongoDB установлен локально
mongod

# Или используйте Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

### 5. Инициализация БД

```bash
npm run seed
```

### 6. Запуск сервера

```bash
# Production
npm start

# Development (с автоперезагрузкой)
npm run dev
```

Сервер запустится на `http://localhost:3000`

## Тестовые учетные записи

| Email | Пароль |
|-------|--------|
| alex@example.com | 123456 |
| maria@example.com | 123456 |
| ivan@example.com | 123456 |
| elena@example.com | 123456 |
| dmitry@example.com | 123456 |

## 📁 Структура папок

```
.
├── client/              # Frontend HTML/CSS/JS
├── server/              # Backend Express
│   ├── models/          # MongoDB модели
│   ├── routes/          # API маршруты
│   ├── middleware/      # Middleware
│   └── server.js        # Главный файл
├── database/            # БД скрипты
├── docs/                # Документация
├── uploads/             # Загруженные файлы
├── package.json         # Зависимости
└── .env                 # Конфигурация
```

## 🐛 Troubleshooting

### MongoDB connection refused
- Убедитесь, что MongoDB запущен
- Проверьте MONGODB_URI в .env

### Port already in use
- Измените PORT в .env
- Или закройте процесс, использующий порт 3000

### Модули не найдены
```bash
rm -rf node_modules package-lock.json
npm install
```
