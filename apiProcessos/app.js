// app.js (Node.js)

const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Função para obter a última data de execução do arquivo
function obterUltimaDataExecucao() {
  try {
    const data = fs.readFileSync('ultimaExecucao.txt', 'utf8');
    return data.trim();
  } catch (error) {
    // Se o arquivo não existir, retorna uma string vazia
    return '';
  }
}

// Função para salvar a última data de execução no arquivo
function salvarUltimaDataExecucao() {
  const dataAtual = new Date().toLocaleDateString();
  fs.writeFileSync('ultimaExecucao.txt', dataAtual, 'utf8');
}

// Função para atualizar isCompleted apenas se a data for diferente da última data de execução
function atualizarIsCompleted() {
  const ultimaDataExecucao = obterUltimaDataExecucao();
  const dataAtual = new Date().toLocaleDateString();

  if (ultimaDataExecucao !== dataAtual) {
    fs.readFile('processos.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }

      const processos = JSON.parse(data);

      // Atualizar isCompleted para false apenas se a última data de execução for diferente da data atual
      if (ultimaDataExecucao !== dataAtual) {
        processos.forEach(processo => {
          processo.isCompleted = false;
        });

        fs.writeFile('processos.json', JSON.stringify(processos), 'utf8', (err) => {
          if (err) {
            console.error(err);
            return;
          }

          salvarUltimaDataExecucao();
          console.log('isCompleted atualizado com sucesso.');
        });
      }
    });
  }
}

// Rota para obter todos os processos
app.get('/processos', (req, res) => {
  fs.readFile('processos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro interno do servidor');
      return;
    }

    const processos = JSON.parse(data);
    res.json(processos);
  });
});

// Rota para adicionar um novo processo (POST)
app.post('/processos', (req, res) => {
  fs.readFile('processos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro interno do servidor');
      return;
    }

    const processos = JSON.parse(data);
    const novoProcesso = {
      processo: req.body.processo,
      contribuidor: req.body.contribuidor,
      data: req.body.data,
      isCompleted: req.body.isCompleted || false,
    };

    processos.push(novoProcesso);

    fs.writeFile('processos.json', JSON.stringify(processos), 'utf8', (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Erro interno do servidor ao salvar o novo processo');
        return;
      }

      res.json({ message: 'Novo processo adicionado com sucesso', novoProcesso });
    });
  });
});

// Rota para excluir um processo pelo ID (DELETE)
app.delete('/processos/:id', (req, res) => {
  const idParaExcluir = req.params.id;

  fs.readFile('processos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro interno do servidor');
      return;
    }

    const processos = JSON.parse(data);
    const processosAtualizados = processos.filter(processo => processo.processo !== idParaExcluir);

    fs.writeFile('processos.json', JSON.stringify(processosAtualizados), 'utf8', (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Erro interno do servidor ao excluir o processo');
        return;
      }

      res.json({ message: `Processo com ID ${idParaExcluir} excluído com sucesso` });
    });
  });
});

// Rota para editar o campo isCompleted pelo ID (PUT)
app.put('/processos/:id', (req, res) => {
  const idParaEditar = req.params.id;
  const novoIsCompleted = req.body.isCompleted;

  fs.readFile('processos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro interno do servidor');
      return;
    }

    const processos = JSON.parse(data);
    const processoParaEditar = processos.find(processo => processo.processo === idParaEditar);

    if (!processoParaEditar) {
      res.status(404).send(`Processo com ID ${idParaEditar} não encontrado`);
      return;
    }

    processoParaEditar.isCompleted = novoIsCompleted;

    fs.writeFile('processos.json', JSON.stringify(processos), 'utf8', (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Erro interno do servidor ao editar o processo');
        return;
      }

      res.json({ message: `Campo isCompleted do processo com ID ${idParaEditar} editado com sucesso` });
    });
  });
});

// Iniciar a atualização de isCompleted apenas quando necessário
atualizarIsCompleted();

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
