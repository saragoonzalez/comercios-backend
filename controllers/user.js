const model = require('../models/user')

exports.login = async (req, res) => await model.login(req, res)
exports.create = async (req, res) => await model.create(req, res)
exports.update = async (req, res) => await model.update(req, res)
exports.deleteUser = async (req, res) => await model.deleteUser(req, res)
exports.readByCity = async (req, res) => await model.readByCity(req, res)