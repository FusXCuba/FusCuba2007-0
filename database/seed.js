const mongoose = require('mongoose');
const User = require('../server/models/User');
const Contact = require('../server/models/Contact');
const Message = require('../server/models/Message');
const dotenv = require('dotenv');

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fuscuba-messenger');
    console.log('✅ Подключено к БД');

    // Clear existing data
    await User.deleteMany({});
    await Contact.deleteMany({});
    await Message.deleteMany({});
    console.log('🗑️  Данные очищены');

    // Create users
    const users = await User.create([
      {
        username: 'alex',
        email: 'alex@example.com',
        password: '123456',
        avatar: 'https://i.pravatar.cc/150?img=1',
        bio: 'Frontend разработчик 💻',
        status: 'online',
        isOnline: true
      },
      {
        username: 'maria',
        email: 'maria@example.com',
        password: '123456',
        avatar: 'https://i.pravatar.cc/150?img=2',
        bio: 'UX/UI дизайнер 🎨',
        status: 'online',
        isOnline: true
      },
      {
        username: 'ivan',
        email: 'ivan@example.com',
        password: '123456',
        avatar: 'https://i.pravatar.cc/150?img=3',
        bio: 'Backend разработчик 🚀',
        status: 'away',
        isOnline: false
      },
      {
        username: 'elena',
        email: 'elena@example.com',
        password: '123456',
        avatar: 'https://i.pravatar.cc/150?img=4',
        bio: 'DevOps инженер ⚙️',
        status: 'offline',
        isOnline: false
      },
      {
        username: 'dmitry',
        email: 'dmitry@example.com',
        password: '123456',
        avatar: 'https://i.pravatar.cc/150?img=5',
        bio: 'QA специалист ✅',
        status: 'offline',
        isOnline: false
      }
    ]);

    console.log(`✅ Создано ${users.length} пользователей`);

    // Create contacts
    const contacts = [];
    for (let i = 0; i < users.length; i++) {
      for (let j = 0; j < users.length; j++) {
        if (i !== j) {
          contacts.push({
            user: users[i]._id,
            contact: users[j]._id,
            isFavorite: Math.random() > 0.7
          });
        }
      }
    }

    await Contact.create(contacts);
    console.log(`✅ Создано ${contacts.length} контактов`);

    // Create messages
    const messages = [
      {
        sender: users[0]._id,
        recipient: users[1]._id,
        text: 'Привет! 👋 Как дела?',
        type: 'text',
        isRead: true
      },
      {
        sender: users[1]._id,
        recipient: users[0]._id,
        text: 'Привет! 😊 Все хорошо, спасибо! Ты как?',
        type: 'text',
        isRead: true
      },
      {
        sender: users[0]._id,
        recipient: users[1]._id,
        text: 'Отлично! Давай встретимся на встречу',
        type: 'text',
        isRead: true
      },
      {
        sender: users[2]._id,
        recipient: users[0]._id,
        text: 'Проверь мой код 👇',
        type: 'text',
        isRead: false
      },
      {
        sender: users[2]._id,
        recipient: users[0]._id,
        text: 'Нужна помощь с тестированием',
        type: 'text',
        isRead: false
      }
    ];

    await Message.create(messages);
    console.log(`✅ Создано ${messages.length} сообщений`);

    console.log('\n🎉 База данных успешно инициализирована!');
    console.log('\n📝 Тестовые учетные записи:');
    users.forEach(user => {
      console.log(`  📧 ${user.email} / 🔑 123456`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Ошибка:', error);
    process.exit(1);
  }
};

seedDatabase();
