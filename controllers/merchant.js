const model = require('../models/merchant')

exports.create = async (req, res) => await model.create(req, res)
exports.read = async (req, res) => await model.read(req, res)
exports.readById = async (req, res) => await model.readById(req, res)
exports.update = async (req, res) => await model.update(req, res)
exports.deleteMerchant = async (req, res) => await model.deleteMerchant(req, res)
