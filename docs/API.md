# FusCuba Messenger API Документация

## 🔐 Аутентификация

Все защищенные маршруты требуют JWT токен в заголовке:
```
Authorization: Bearer <token>
```

## 📝 API Endpoints

### Authentication

#### POST `/api/auth/register`
Регистрация нового пользователя
```json
{
  "username": "alex",
  "email": "alex@example.com",
  "password": "123456"
}
```

#### POST `/api/auth/login`
Вход в аккаунт
```json
{
  "email": "alex@example.com",
  "password": "123456"
}
```

#### POST `/api/auth/logout`
Выход из аккаунта (требует токен)

### Users

#### GET `/api/users`
Получить всех пользователей (требует токен)

#### GET `/api/users/:id`
Получить профиль пользователя

#### GET `/api/users/me/profile`
Получить свой профиль (требует токен)

#### PUT `/api/users/me/profile`
Обновить профиль (требует токен)
```json
{
  "username": "alex_new",
  "bio": "Разработчик",
  "avatar": "https://..."
}
```

#### GET `/api/users/search/:query`
Поиск пользователей по имени или email

### Messages

#### POST `/api/messages/send`
Отправить сообщение (требует токен)
```json
{
  "recipientId": "userId",
  "text": "Привет!",
  "type": "text"
}
```

#### GET `/api/messages/chat/:userId`
Получить сообщения с пользователем (требует токен)

#### GET `/api/messages/unread/count`
Получить количество непрочитанных сообщений (требует токен)

#### DELETE `/api/messages/:messageId`
Удалить сообщение (требует токен)

### Contacts

#### GET `/api/contacts`
Получить все контакты (требует токен)

#### POST `/api/contacts/add`
Добавить контакт (требует токен)
```json
{
  "contactId": "userId"
}
```

#### DELETE `/api/contacts/:contactId`
Удалить контакт (требует токен)

#### PUT `/api/contacts/:contactId/block`
Заблокировать контакт (требует токен)

#### PUT `/api/contacts/:contactId/favorite`
Добавить/удалить из избранного (требует токен)
```json
{
  "isFavorite": true
}
```

## 🔌 Socket.io Events

### Client -> Server

- `join-chat` - Присоединиться к чату
- `send-message` - Отправить сообщение в реальном времени
- `user-typing` - Уведомить, что пользователь печатает

### Server -> Client

- `receive-message` - Получить новое сообщение
- `user-typing` - Пользователь печатает
- `user-connected` - Пользователь подключился
- `user-disconnected` - Пользователь отключился

## 📊 Response Format

```json
{
  "success": true,
  "message": "Описание",
  "data": {}
}
```

## ❌ Error Handling

```json
{
  "success": false,
  "message": "Описание ошибки"
}
```
