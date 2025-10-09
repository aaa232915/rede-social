//C:\Users\lucas\OneDrive\Desktop\APILogin> nodemon server.js

//Dependências
//npm init -y
//npm install express mysql2 dotenv
//npm install cors

const cors = require('cors');

const express = require('express');
const app = express();
const db = require('./db');
require('dotenv').config();

app.use(express.json());
app.use(cors())

const PORT = process.env.PORT || 3000;

// Rota GET - Listar usuários
app.get('/usuarios', (req, res) => {
  db.query('SELECT * FROM clientes', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Rota POST - Criar novo usuário
app.post('/usuarios', (req, res) => {
  const { login, senha } = req.body;

  if (!login || !senha) {
    return res.status(400).json({ error: 'login e senha são obrigatórios' });
  }

  const sql = 'SELECT * FROM clientes WHERE login = ? AND senha = ?';
  db.query(sql, [login, senha], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Login bem-sucedido
    const user = results[0];
    res.json({
      message: 'Login bem-sucedido',
      user: {
        id: user.id,
        login: user.login,
        senha: user.senha
      }
    });
  });
});

//ROTA POST - Cadastro de novos usuarios
app.post('/cadastro', (req, res) => {
  const { login1, senha } = req.body;

  if (!login1 || !senha) {
    return res.status(400).json({ error: 'Login e senha são obrigatórios' });
  }

  const sql = 'INSERT INTO clientes (login, senha) VALUES (?, ?)';
  db.query(sql, [login1, senha], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Login já está cadastrado' });
      }
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({ message: 'Usuário registrado com sucesso', id: result.insertId });
  });
});

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
