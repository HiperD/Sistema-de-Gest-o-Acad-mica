module.exports = (sequelize, Sequelize) => {
    const Aluno = sequelize.define('aluno', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true, allowNull: false, primaryKey: true
        },
        nome: {
            type: Sequelize.STRING, allowNull: false
        },
        matricula: { 
            type: Sequelize.STRING, allowNull: false, unique: true 
        },
        curso: { 
            type: Sequelize.STRING, allowNull: false 
        }
    });
    return Aluno;
}