const Sequelize = require('sequelize');
const sequelize = new Sequelize('web2_db', 'tester', '42456876', {
        host: 'localhost',
        dialect: 'postgres'
    });
var db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Aluno = require('../models/aluno.js')(sequelize, Sequelize);
db.Disciplina = require('../models/disciplina.js')(sequelize, Sequelize);
db.AlunoDisciplina = require('../models/alunoDisciplina.js')(sequelize, Sequelize);

db.Aluno.belongsToMany(db.Disciplina, { through: db.AlunoDisciplina });
db.Disciplina.belongsToMany(db.Aluno, { through: db.AlunoDisciplina });

module.exports = db;