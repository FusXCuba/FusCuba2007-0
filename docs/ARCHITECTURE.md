# 🏗️ Архитектура проекта

## Обзор

FusCuba Messenger - это full-stack приложение с трехслойной архитектурой:

```
┌─────────────────────────────────────────┐
│         Client (Frontend)               │
│  HTML/CSS/JavaScript в браузере         │
└────────────────────┬────────────────────┘
                     │ HTTP/WebSocket
┌────────────────────▼────────────────────┐
│         Server (Backend)                │
│  Node.js/Express API                    │
├────────────────────────────────────────┤
│  • Authentication (JWT)                 │
│  • User Management                      │
│  • Message Processing                   │
│  • Contact Management                   │
│  • Real-time via Socket.io              │
└────────────────────┬────────────────────┘
                     │ MongoDB Driver
┌────────────────────▼────────────────────┐
│     Database (MongoDB)                  │
│  • Users                                │
│  • Messages                             │
│  • Contacts                             │
└─────────────────────────────────────────┘
```

## Компоненты

### Frontend (Client)

**Локация:** `/client`

- `auth.html` - Страница входа/регистрации
- `index.html` - Главная страница чата
- `auth.js` - Логика аутентификации
- `messenger.js` - Логика мессенджера
- `style.css` - Стили

**Возможности:**
- Регистрация и вход
- Управление контактами
- Отправка/получение сообщений
- Real-time обновления
- Локальное хранилище

### Backend (Server)

**Локация:** `/server`

#### Структура

```
server/
├── models/           # Mongoose schemas
│   ├── User.js
│   ├── Message.js
│   └── Contact.js
├── routes/           # API endpoints
│   ├── auth.js
│   ├── users.js
│   ├── messages.js
│   └── contacts.js
├── middleware/       # Express middleware
│   ├── auth.js       # JWT verification
│   └── validation.js # Input validation
└── server.js         # Entry point
```

#### Основные модули

**Authentication (`auth.js`)**
- Регистрация пользователей
- Вход/выход
- JWT генерация
- Хеширование пароля (bcrypt)

**User Management (`users.js`)**
- Получение профиля
- Обновление профиля
- Поиск пользователей
- Статусы онлайна

**Messages (`messages.js`)**
- Отправка сообщений
- Получение истории
- Отметить как прочитано
- Удаление сообщений

**Contacts (`contacts.js`)**
- Добавление/удаление контактов
- Блокировка
- Избранное

### Database (MongoDB)

**Коллекции:**

1. **Users**
   - `_id` - ObjectId
   - `username` - Уникальное имя
   - `email` - Уникальный email
   - `password` - Хешированный пароль
   - `avatar` - URL аватара
   - `bio` - Биография
   - `status` - online/offline/away
   - `isOnline` - Boolean флаг
   - `lastSeen` - Дата последнего визита

2. **Messages**
   - `_id` - ObjectId
   - `sender` - Ссылка на User
   - `recipient` - Ссылка на User
   - `text` - Текст сообщения
   - `type` - text/image/file/autoresponse
   - `isRead` - Прочитано ли
   - `createdAt` - Время создания

3. **Contacts**
   - `_id` - ObjectId
   - `user` - Ссылка на User
   - `contact` - Ссылка на User (контакт)
   - `isBlocked` - Заблокирован ли
   - `isFavorite` - В избранном ли
   - `nickname` - Никнейм контакта

## Поток данных

### Отправка сообщения

```
1. Frontend отправляет POST /api/messages/send
   {
     recipientId: '...',
     text: 'Привет!',
     type: 'text'
   }

2. Backend проверяет JWT токен (middleware/auth)
   ✓ Если валиден → продолжаем
   ✗ Если невалиден → возвращаем 401

3. Backend валидирует данные (middleware/validation)
   ✓ Если корректны → продолжаем
   ✗ Если ошибки → возвращаем 400

4. Backend сохраняет сообщение в MongoDB
   const message = new Message({...})
   await message.save()

5. Backend отправляет ответ клиенту
   {
     success: true,
     message: {...с ID и временем}
   }

6. Frontend получает ответ и обновляет UI

7. Socket.io уведомляет получателя в real-time
   io.to('user_recipientId').emit('receive-message', data)

8. Получатель видит новое сообщение
```

## Безопасность

### JWT токены
- Генерируются при входе
- Хранятся в localStorage на клиенте
- Проверяются на каждый запрос
- Истекают через 7 дней

### Хеширование паролей
- Используется bcryptjs
- Соль = 10
- Никогда не хранятся в plaintext

### Валидация
- Все входные данные проверяются
- express-validator для Server-side

### CORS
- Включен для всех источников (можно ограничить)

## Масштабируемость

### Текущие ограничения
- Одна инстанция сервера
- Локальный Socket.io

### Для масштабирования
- Redis для хранения сессий
- Redis Adapter для Socket.io
- Load Balancer
- Кластеризация Node.js
- CDN для статики
