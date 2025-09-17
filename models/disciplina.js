module.exports = (sequelize, Sequelize) => {
    const Disciplina = sequelize.define('disciplina', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true, allowNull: false, primaryKey: true
        },
        codigo: { 
            type: Sequelize.STRING, allowNull: false, unique: true 
        },
        nome: {
            type: Sequelize.STRING, allowNull: false
        },
        cargaHoraria: { 
            type: Sequelize.INTEGER, allowNull: false 
        },
    });
    return Disciplina;
}