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

/////

app.use(express.json({ limit: "10mb" }));
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())



app.post("/upload", (req, res) => {
  try {
    const { imagem } = req.body;

    if (!imagem) {
      return res.status(400).json({ erro: "Nenhuma imagem enviada." });
    }

    // Gerar nome único
    const nomeArquivo = Date.now() + ".png";
    const caminhoArquivo = `public/uploads/${nomeArquivo}`;
    const caminhoBanco = `/uploads/${nomeArquivo}`;

    // Remover prefixo base64
    const base64Data = imagem.replace(/^data:image\/\w+;base64,/, "");

    // Salvar no servidor
    fs.writeFileSync(caminhoArquivo, Buffer.from(base64Data, "base64"));

    // Salvar no banco
    const query = "INSERT INTO posts (imagem) VALUES (?)";
    db.query(query, [caminhoBanco], (err) => {
      if (err) {
        console.error("Erro ao salvar no banco:", err);
        return res.status(500).json({ erro: "Erro ao salvar no banco." });
      }
      res.json({ sucesso: true, caminho: caminhoBanco });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao processar upload." });
  }
});

// 🔹 Listar imagens
app.get("/posts", (req, res) => {
  const query = "SELECT * FROM posts ORDER BY id DESC";
  db.query(query, (err, resultados) => {
    if (err) {
      console.error("Erro ao buscar posts:", err);
      return res.status(500).json({ erro: "Erro ao buscar posts." });
    }
    res.json(resultados);
  });
});



// app.post('/novoPost', (req, res) => {
//   // As variáveis dentro dos {} recebem os dados que vieram do front-end
//   const { legenda, caminhoPostagem } = req.body;

//   //Se os dados que vieram do font-end forem em branco
//   if (!legenda || !caminhoPostagem) {
//     return res.status(400).json({ error: 'Dados incompletos' });
//   }

//   //Realiza a inserção dos dados recebidos no banco de dados
//   const sql = 'INSERT INTO posts (legenda, caminhoPostagem) VALUES (?,?)';
//   db.query(sql, [legenda, caminhoPostagem ], (err, result) => {
//     if (err) {
//       if (err.code === 'ER_DUP_ENTRY') {
//         return res.status(409).json({ error: 'Essa nome de usuário já está cadastrado' });
//       }
//       return res.status(500).json({ error: err.message });
//     }

//     // Em caso de sucesso encaminha uma mensagem e o id do produto
//     res.status(201).json({ message: 'Post realizado com sucesso', id: result.insertId });
//   });
// });

// app.get('/ver posts', (req, res) => {
//   res.send(''); // Responde com texto simples
// });

// app.get('/api/usuarios', (req, res) => {
//   // Lógica para buscar usuários do banco de dados
//   res.json([{ id: 1, nome: 'Alice' }, { id: 2, nome: 'Bob' }]);
// });

// app.post('/entrar', (req, res) => {
//   const { nomeUsuario, senha } = req.body;

//   if (!nomeUsuario || !senha) {
//     return res.status(400).json({ error: 'nome de usuario e senha são obrigatórios' });
//   }

//   const sql = 'SELECT * FROM login WHERE nomeUsuario = ? AND senha = ?';
//   db.query(sql, [nomeUsuario, senha], (err, results) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }

//     if (results.length === 0) {
//       return res.status(401).json({ error: 'Credenciais inválidas' });
//     }

//     // Login bem-sucedido
//     const user = results[0];
//     res.json({
//       message: 'Login bem-sucedido',
//       user: {
//         nomeUsuario: nomeUsuario,
//         senha: senha
//       }
//     });
//   });
// });


// app.post('/post', (req, res) => {
//   // As variáveis dentro dos {} recebem os dados que vieram do front-end
//   const { legenda, caminhoPostagem } = req.body;

//   //Se os dados que vieram do font-end forem em branco
//   if (!legenda || !caminhoPostagem) {
//     return res.status(400).json({ error: 'Dados incompletos' });
//   }

//   //Realiza a inserção dos dados recebidos no banco de dados
//   const sql = 'INSERT INTO posts (legenda, caminhoPostagem) VALUES (?,?)';
//   db.query(sql, [legenda, caminhoPostagem ], (err, result) => {
//     if (err) {
//       if (err.code === 'ER_DUP_ENTRY') {
//         return res.status(409).json({ error: 'Essa nome de usuário já está cadastrado' });
//       }
//       return res.status(500).json({ error: err.message });
//     }

//     // Em caso de sucesso encaminha uma mensagem e o id do produto
//     res.status(201).json({ message: 'Post realizado com sucesso', id: result.insertId });
//   });
// });

// app.use(express.json({ limit: "10mb" }));
// const path = require('path');
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(cors())



// app.post("/upload", (req, res) => {
//   try {
//     const { imagem } = req.body;

//     if (!imagem) {
//       return res.status(400).json({ erro: "Nenhuma imagem enviada." });
//     }

//     // Gerar nome único
//     const nomeArquivo = Date.now() + ".png";
//     const caminhoArquivo = `public/uploads/${nomeArquivo}`;
//     const caminhoBanco = `/uploads/${nomeArquivo}`;

//     // Remover prefixo base64
//     const base64Data = imagem.replace(/^data:image\/\w+;base64,/, "");

//     // Salvar no servidor
//     fs.writeFileSync(caminhoArquivo, Buffer.from(base64Data, "base64"));

//     // Salvar no banco
//     const query = "INSERT INTO posts (imagem) VALUES (?)";
//     db.query(query, [caminhoBanco], (err) => {
//       if (err) {
//         console.error("Erro ao salvar no banco:", err);
//         return res.status(500).json({ erro: "Erro ao salvar no banco." });
//       }
//       res.json({ sucesso: true, caminho: caminhoBanco });
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ erro: "Erro ao processar upload." });
//   }
// });

// // 🔹 Listar imagens
// app.get("/posts", (req, res) => {
//   const query = "SELECT * FROM posts ORDER BY id DESC";
//   db.query(query, (err, resultados) => {
//     if (err) {
//       console.error("Erro ao buscar posts:", err);
//       return res.status(500).json({ erro: "Erro ao buscar posts." });
//     }
//     res.json(resultados);
//   });
// });



    

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});



