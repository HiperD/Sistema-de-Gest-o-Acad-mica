const mongoose = require('mongoose');
const logAcesso = mongoose.Schema({
    usuario: { type: String, required: true },
    rotaAcessada: { type: String, required: true },
    dataHora: { type: Date, required: true },
})
module.exports = mongoose.model("logAcesso", logAcesso);