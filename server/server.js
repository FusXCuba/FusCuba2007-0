const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static(path.join(__dirname, '../client')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fuscuba-messenger')
  .then(() => console.log('✅ MongoDB подключен'))
  .catch(err => console.error('❌ MongoDB ошибка:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/contacts', require('./routes/contacts'));

// Socket.io events
io.on('connection', (socket) => {
  console.log('🟢 Пользователь подключен:', socket.id);

  socket.on('join-chat', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`Пользователь ${userId} присоединился к чату`);
  });

  socket.on('send-message', (data) => {
    io.to(`user_${data.recipientId}`).emit('receive-message', data);
  });

  socket.on('user-typing', (data) => {
    io.to(`user_${data.recipientId}`).emit('user-typing', { userId: data.userId });
  });

  socket.on('disconnect', () => {
    console.log('🔴 Пользователь отключен:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Внутренняя ошибка сервера'
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`\n🚀 Сервер запущен на http://localhost:${PORT}\n`);
});

module.exports = { app, io };
