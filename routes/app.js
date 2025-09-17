const db = require('../config/db');
const db_mongoose = require('../config/db_mongoose');
const mongoose = require('mongoose');
const logAcesso = require('../models/LogAcesso');
const path = require('path');
const express = require('express');
const app = express();

app.use(express.urlencoded({
        extended: true
    })
)

db.sequelize.sync({force: false}).then(() => {
    console.log('Todas as tabelas foram sincronizadas');
});

mongoose.connect(db_mongoose.connection, { useUnifiedTopology: true, useNewUrlParser: true }).then(() => {
    console.log('Conectado ao MongoDB com sucesso');
}).catch(() => {
    console.log('Erro ao conectar ao MongoDB');
});

async function inserirLog(usuario, rotaAcessada, dataHora ) {
    new logAcesso({ usuario, rotaAcessada, dataHora }).save().then(() => {
        console.log('Log de acesso inserido com sucesso');
    }).catch((err) => {
        console.log('Erro ao inserir log de acesso: ' + err);
    });
}

app.get("", async function(req, res) {
    inserirLog(req.headers['x-forwarded-for'] || req.connection.remoteAddress, "/", new Date());
    res.sendFile(path.join(__dirname, '../pages/inicio.html'));
});

app.get("/cadastro.css", async function(req, res) {
    res.sendFile(path.join(__dirname, '../pages/cadastro.css'));
});

app.get("/logo.png", async function(req, res) {
    res.sendFile(path.join(__dirname, '../pages/logo.png'));
});

app.get("/gerenciaAluno", async function(req, res) {
    inserirLog(req.headers['x-forwarded-for'] || req.connection.remoteAddress, "/gerenciaAluno", new Date());
    res.sendFile(path.join(__dirname, '../pages/gerAluno.html'));
});

app.post("/excluirAluno", async function(req, res) {
    try {
        const resultado = await db.Aluno.destroy({
            where: {
                matricula: {
                    [db.Sequelize.Op.like]: `%${req.body.matricula}%`
                }
            }
        });
        if (resultado === 0) {
            return res.sendFile(path.join(__dirname, '../pages/cadastroFalhou.html'));
        }
        res.sendFile(path.join(__dirname, '../pages/cadastroSucesso.html'));
    } catch (sequelizeErrors) {
        res.sendFile(path.join(__dirname, '../pages/cadastroFalhou.html'));
    }
});

app.post("/alterarAluno", async function(req, res) {
    try {
        const aluno = await db.Aluno.findOne({
            where: {
                matricula: req.body.matricula
            }
        });
        if (!aluno) {
            return res.sendFile(path.join(__dirname, '../pages/cadastroFalhou.html'));
        }
        await aluno.update({
            nome: req.body.nome,
            curso: req.body.curso,
        });
        res.sendFile(path.join(__dirname, '../pages/cadastroSucesso.html'));
    } catch (sequelizeErrors) {
        res.sendFile(path.join(__dirname, '../pages/cadastroFalhou.html'));
    }
});

app.post("/cadastroAluno", async function(req, res){
    try {
        // Verifica se já existe aluno com a mesma matrícula
        const existente = await db.Aluno.findOne({
            where: { matricula: req.body.matricula }
        });
        if (existente) {
            return res.sendFile(path.join(__dirname, '../pages/cadastroFalhou.html'));
        }
        await db.Aluno.create({
            nome: req.body.nome,
            matricula: req.body.matricula,
            curso: req.body.curso,
        });
        res.sendFile(path.join(__dirname, '../pages/cadastroSucesso.html'));
    } catch (sequelizeErrors) {
        res.sendFile(path.join(__dirname, '../pages/cadastroFalhou.html'));
    }
});

app.get("/gerenciaDisciplina", async function(req, res) {
    inserirLog(req.headers['x-forwarded-for'] || req.connection.remoteAddress, "/gerenciaDisciplina", new Date());
    res.sendFile(path.join(__dirname, '../pages/gerDisciplina.html'));
});

app.post("/excluirDisciplina", async function(req, res) {
    try {
        const resultado = await db.Disciplina.destroy({
            where: {
                codigo: {
                    [db.Sequelize.Op.like]: `%${req.body.codigo}%`
                }
            }
        });
        if (resultado === 0) {
            return res.sendFile(path.join(__dirname, '../pages/cadastroFalhou.html'));
        }
        res.sendFile(path.join(__dirname, '../pages/cadastroSucesso.html'));
    } catch (sequelizeErrors) {
        res.sendFile(path.join(__dirname, '../pages/cadastroFalhou.html'));
    }
});

app.post("/alterarDisciplina", async function(req, res) {
    try {
        const disciplina = await db.Disciplina.findOne({
            where: {
                codigo: req.body.codigo
            }
        });
        if (!disciplina) {
            return res.sendFile(path.join(__dirname, '../pages/cadastroFalhou.html'));
        }
        await disciplina.update({
            nome: req.body.nome,
            cargaHoraria: req.body.cargaHoraria,
        });
        res.sendFile(path.join(__dirname, '../pages/cadastroSucesso.html'));
    } catch (sequelizeErrors) {
        res.sendFile(path.join(__dirname, '../pages/cadastroFalhou.html'));
    }
});

app.post("/cadastroDisciplina", async function(req, res){
    try {
        await db.Disciplina.create({
            codigo: req.body.codigo,
            nome: req.body.nome,
            cargaHoraria: req.body.cargaHoraria,
        });
        res.sendFile(path.join(__dirname, '../pages/cadastroSucesso.html'));
    } catch (sequelizeErrors) {
        res.sendFile(path.join(__dirname, '../pages/cadastroFalhou.html'));
    }
});

app.get("/gerenciaMatricula", async function(req, res) {
    inserirLog(req.headers['x-forwarded-for'] || req.connection.remoteAddress, "/gerenciaMatricula", new Date());
    res.sendFile(path.join(__dirname, '../pages/gerMatricula.html'));
});

app.get("/api/alunos", async function(req, res) {
    inserirLog(req.headers['x-forwarded-for'] || req.connection.remoteAddress, "/api/alunos", new Date());
    try {
        const alunos = await db.Aluno.findAll();
        res.json(alunos);
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar alunos" });
    }
});

app.get("/api/disciplinas", async function(req, res) {
    inserirLog(req.headers['x-forwarded-for'] || req.connection.remoteAddress, "/api/disciplinas", new Date());
    try {
        const disciplinas = await db.Disciplina.findAll();
        res.json(disciplinas);
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar disciplinas" });
    }
});

app.post("/matricula", async function(req, res){
    try {
        // Confirma se aluno e disciplina existem
        const aluno = await db.Aluno.findOne({
            where: { matricula: req.body.matricula }
        });
        const disciplina = await db.Disciplina.findOne({
            where: { codigo: req.body.codigo }
        });
        const alunoDisciplina = await db.AlunoDisciplina.findOne({
            where: { alunoId: aluno.id, disciplinaId: disciplina.id }
        });
        if (!aluno || !disciplina || alunoDisciplina) {
            return res.sendFile(path.join(__dirname, '../pages/cadastroFalhou.html'));
        }
        // Cria vínculo usando os campos matricula e codigo
        await db.AlunoDisciplina.create({
            alunoId: aluno.id,
            disciplinaId: disciplina.id,
        });
        res.sendFile(path.join(__dirname, '../pages/cadastroSucesso.html'));
    } catch (sequelizeErrors) {
        console.error(sequelizeErrors);
        res.sendFile(path.join(__dirname, '../pages/cadastroFalhou.html'));
    }
});

app.post("/desmatricula", async function(req, res){
    try {
        // Confirma se aluno em disciplina existem
        const aluno = await db.Aluno.findOne({
            where: { matricula: req.body.matricula }
        });
        const disciplina = await db.Disciplina.findOne({
            where: { codigo: req.body.codigo }
        });
        const alunoDisciplina = await db.AlunoDisciplina.findOne({
            where: { alunoId: aluno.id, disciplinaId: disciplina.id }
        });
        if (!alunoDisciplina) {
            return res.sendFile(path.join(__dirname, '../pages/cadastroFalhou.html'));
        }
        // Destroi vínculo usando os campos matricula e codigo
        await db.AlunoDisciplina.destroy({
            where: { alunoId: aluno.id, disciplinaId: disciplina.id }
        });
        res.sendFile(path.join(__dirname, '../pages/cadastroSucesso.html'));
    } catch (sequelizeErrors) {
        console.error(sequelizeErrors);
        res.sendFile(path.join(__dirname, '../pages/cadastroFalhou.html'));
    }
});

app.get("/logs", async function(req, res) {
    inserirLog(req.headers['x-forwarded-for'] || req.connection.remoteAddress, "/logs", new Date());
    res.sendFile(path.join(__dirname, '../pages/logAcesso.html'));
});

app.get("/api/logAcesso", async function(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Busca logs do MongoDB, ordenados do mais recente para o mais antigo
        const logs = await logAcesso.find().sort({ dataHora: -1 }).skip(skip).limit(limit);
        const total = await logAcesso.countDocuments();

        // Formata os dados para o frontend
        res.json({
            logs: logs.map(log => ({
                usuario: log.usuario,
                rotaAcessada: log.rotaAcessada,
                dataHora: log.dataHora
            })),
            hasMore: skip + logs.length < total
        });
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar logs de acesso" });
    }
});

app.get("/alunos/:matricula/disciplinas", async function(req, res) {
    inserirLog(req.headers['x-forwarded-for'] || req.connection.remoteAddress, "/alunos/" + req.params.matricula + "/disciplinas", new Date());
    try {
        // Busca o aluno pela matrícula
        const aluno = await db.Aluno.findOne({
            where: { matricula: req.params.matricula }
        });
        if (!aluno) {
            return res.sendFile(path.join(__dirname, '../pages/cadastroFalhou.html'));
        }

        // Busca as disciplinas vinculadas ao aluno usando o relacionamento padrão
        const disciplinas = await aluno.getDisciplinas();

        let html = `
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <title>Disciplinas de ${aluno.nome}</title>
            <link rel="stylesheet" href="/cadastro.css">
            <style>
                .log-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 32px;
                    background: #fff;
                    border-radius: 12px;
                    overflow: hidden;
                }
                .log-table th, .log-table td {
                    padding: 12px 8px;
                    border-bottom: 1px solid #e0e0e0;
                    text-align: left;
                }
                .log-table th {
                    background: #2563eb;
                    color: #fff;
                    font-weight: 700;
                }
                .log-table tr:nth-child(even) {
                    background: #f7f8fa;
                }
            </style>
        </head>
        <body>
            <div class="cadastro-container">
                <button onclick="window.location.href='/'" class="matricula-btn-voltar">Voltar</button>
                <h1>Disciplinas de ${aluno.nome}</h1>
                <table class="log-table">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Nome</th>
                            <th>Carga Horária</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        if (disciplinas.length === 0) {
            html += `<tr><td colspan="3" style="text-align:center; color:#888;">Nenhuma disciplina matriculada.</td></tr>`;
        } else {
            for (const d of disciplinas) {
                html += `
                    <tr>
                        <td>${d.codigo || ''}</td>
                        <td>${d.nome || ''}</td>
                        <td>${d.cargaHoraria || ''}</td>
                    </tr>
                `;
            }
        }
        html += `
                    </tbody>
                </table>
            </div>
        </body>
        </html>
        `;
        res.send(html);
    } catch (err) {
        console.error(err);
        res.sendFile(path.join(__dirname, '../pages/cadastroFalhou.html'));
    }
});

app.listen(8081, function (){
    console.log("Servidor no http://localhost:8081")
});