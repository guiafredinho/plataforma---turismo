// routes/auth.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Rota de cadastro
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verifica se já existe usuário com o email
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email já cadastrado" });
    }

    // Cria novo usuário
    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: "Usuário registrado com sucesso!" });
  } catch (err) {
    res.status(500).json({ message: "Erro no servidor", error: err.message });
  }
});

// Rota de login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verifica usuário
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Usuário não encontrado" });
    }

    // Compara senha
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Senha incorreta" });
    }

    res.status(200).json({ message: "Login bem-sucedido!", userId: user._id });
  } catch (err) {
    res.status(500).json({ message: "Erro no servidor", error: err.message });
  }
});

module.exports = router;
