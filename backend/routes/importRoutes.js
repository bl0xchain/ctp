const express = require('express')
const router = express.Router()
const { importCurrencies, importBatches, calculateCTP } = require('../controllers/importController')

router.route("/currencies").post(importCurrencies)
router.route("/batches").post(importBatches)
router.route("/ctp").post(calculateCTP)

module.exports = router