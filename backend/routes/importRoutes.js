const express = require('express')
const router = express.Router()
const { importCurrencies, importBatches, calculateCTP } = require('../controllers/importController')
const { adminOnly } = require('../middleware/authMiddleware')

// router.route("/currencies").post(importCurrencies)
// router.route("/batches").post(importBatches)
// router.route("/ctp").post(calculateCTP)
router.post('/currencies', adminOnly, importCurrencies)
router.post('/batches', adminOnly, importBatches)
router.post('/ctp', adminOnly, calculateCTP)

module.exports = router