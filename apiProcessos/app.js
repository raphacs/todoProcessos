const express = require('express');
const fs = require('fs');
const cors = require('cors');


const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

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
            isCompleted: req.body.isCompleted || false
        };

        // Adiciona o novo processo ao array
        processos.push(novoProcesso);

        // Salva os processos atualizados no arquivo
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

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
