module.exports = (sequelize, Sequelize) => {
    const AlunoDisciplina = sequelize.define('alunodisciplina', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        }
    });
    return AlunoDisciplina;
}
