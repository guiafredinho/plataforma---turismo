// rotas/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Importando o modelo de usuário

// Rota de cadastro
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verificar se já existe usuário com este email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'E-mail já está em uso!' });
    }

    // Criar novo usuário
    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao cadastrar usuário' });
  }
});

// Rota de login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar se o usuário existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Usuário não encontrado!' });
    }

    // Comparar senha
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Senha incorreta!' });
    }

    res.status(200).json({ message: 'Login realizado com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
});

module.exports = router;
