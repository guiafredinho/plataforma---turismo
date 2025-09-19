// servidor.js

const express = require("express");
const app = express();
const porta = 3000;

// Permitir o servidor receber dados em JSON
app.use(express.json());

// Importar as rotas de autenticação
const authRotas = require("./rotas/auth");

// Usar as rotas de autenticação
app.use("/auth", authRotas);

// Rota inicial só para teste
app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀");
});

// Iniciar o servidor
app.listen(porta, () => {
  console.log(`Servidor rodando em http://localhost:${porta}`);
});
