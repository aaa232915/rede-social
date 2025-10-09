//Dependências //Executar da primeira vez
//npm init -y
//npm install express mysql2 dotenv
//npm install cors

//Para executar o servi

const cors = require('cors');

const express = require('express');
const app = express();
const db = require('./db');
require('dotenv').config();

app.use(express.json());
app.use(cors())

const PORT = process.env.PORT || 3000;

//Rota POST - Cadastrar novo produto
app.post('/cadastro', (req, res) => {
  // As variáveis dentro dos {} recebem os dados que vieram do front-end
  const { nomeUsuario, senha } = req.body;

  //Se os dados que vieram do font-end forem em branco
  if (!nomeUsuario || !senha) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }

  //Realiza a inserção dos dados recebidos no banco de dados
  const sql = 'INSERT INTO login (nomeUsuario, senha) VALUES (?,?)';
  db.query(sql, [nomeUsuario, senha ], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Essa nome de usuário já está cadastrado' });
      }
      return res.status(500).json({ error: err.message });
    }

    // Em caso de sucesso encaminha uma mensagem e o id do produto
    res.status(201).json({ message: 'Cadastro realizado com sucesso', id: result.insertId });
  });
});



app.post('/novoPost', (req, res) => {
  // As variáveis dentro dos {} recebem os dados que vieram do front-end
  const { legenda, caminhoPostagem } = req.body;

  //Se os dados que vieram do font-end forem em branco
  if (!legenda || !caminhoPostagem) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }

  //Realiza a inserção dos dados recebidos no banco de dados
  const sql = 'INSERT INTO posts (legenda, caminhoPostagem) VALUES (?,?)';
  db.query(sql, [legenda, caminhoPostagem ], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Essa nome de usuário já está cadastrado' });
      }
      return res.status(500).json({ error: err.message });
    }

    // Em caso de sucesso encaminha uma mensagem e o id do produto
    res.status(201).json({ message: 'Post realizado com sucesso', id: result.insertId });
  });
});

app.get('/ver posts', (req, res) => {
  res.send(''); // Responde com texto simples
});

app.get('/api/usuarios', (req, res) => {
  // Lógica para buscar usuários do banco de dados
  res.json([{ id: 1, nome: 'Alice' }, { id: 2, nome: 'Bob' }]);
});

app.post('/entrar', async (req, res) => {
  const { nomeUsuario, senha } = req.body;

  if (!nomeUsuario || senha) {
    return res.status(400).json({ error: 'Os campos nome de usuário e a senha são obrigatórios' });
  }

  try {
    // Query para buscar usuários com nome parecido
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE name LIKE ?', [`%${nomeUsuario, senha}%`]
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

// Start server
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});



    

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});



