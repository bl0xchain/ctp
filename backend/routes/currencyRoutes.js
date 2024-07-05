const express = require('express')
const router = express.Router()
const { getCurrencies, addCurrency, deleteCurrency, updateCurrency } = require('../controllers/currencyController')
const { getCurrencyStatsByGroup, getCurrencyStatsByCurrency, getCurrencyStatsHistory, refreshCurrencyStats, getCTPStatsHistory, getCTPStatsHistoryNew, getCTPStatsReturns, getCurrencyStats, getCTPData } = require('../controllers/statsController')
const { adminOnly } = require('../middleware/authMiddleware')

// router.route("/").get(getCurrencies).post(addCurrency)
// router.route("/:id").put(updateCurrency).delete(deleteCurrency)
router.get('/', getCurrencies)
router.post('/', adminOnly, addCurrency)
router.put('/:id', adminOnly, updateCurrency)
router.delete('/:id', adminOnly, deleteCurrency)
router.route("/stats").get(getCurrencyStats)
router.route("/stats/:ctp_group").get(getCurrencyStatsByGroup)
router.route("/data/:currency_id").get(getCurrencyStatsByCurrency)
router.route("/history/:currency_id").get(getCurrencyStatsHistory)
router.route("/refresh-stats").get(refreshCurrencyStats)
router.route("/ctp-stats").get(getCTPStatsHistory)
router.route("/ctp-stats-new").get(getCTPStatsHistoryNew)
router.route("/ctp-returns").get(getCTPStatsReturns)
router.route("/ctp-data").get(getCTPData)

module.exports = router