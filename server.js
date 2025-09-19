// server.js - backend principal
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const path = require('path');

const authRoutes = require('./routes/auth'); // criaremos em seguida

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de segurança e parsing
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || '*',
  credentials: true,
}));

// Limite simples de requisições (proteção básica)
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 120, // número de requisições por IP na janela
  message: { error: 'Muitas requisições, tente novamente mais tarde.' }
});
app.use(limiter);

// Rotas API (arquivo routes/auth.js)
app.use('/api/auth', authRoutes);

// Servir frontend estático (pasta public/)
app.use(express.static(path.join(__dirname, 'public')));

// Pega a raiz e envia index.html (se existir)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Conexão ao MongoDB e start do servidor
async function start() {
  try {
    if (!process.env.MONGO_URI) {
      console.warn('⚠️ MONGO_URI não definido. Configure o .env antes de rodar em produção.');
    }
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fgeotour', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB conectado');
    app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
  } catch (err) {
    console.error('Erro ao conectar no MongoDB:', err);
    process.exit(1);
  }
}

start();
