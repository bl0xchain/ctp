const express = require('express')
const router = express.Router()
const { getCurrencies, addCurrency, deleteCurrency, updateCurrency } = require('../controllers/currencyController')
const { getCurrencyStatsByGroup, getCurrencyStatsByCurrency, getCurrencyStatsHistory, refreshCurrencyStats, getCTPStatsHistory, getCTPStatsReturns } = require('../controllers/statsController')

router.route("/").get(getCurrencies).post(addCurrency)
router.route("/:id").put(updateCurrency).delete(deleteCurrency)
router.route("/stats/:ctp_group").get(getCurrencyStatsByGroup)
router.route("/data/:currency_id").get(getCurrencyStatsByCurrency)
router.route("/history/:currency_id").get(getCurrencyStatsHistory)
router.route("/refresh-stats").get(refreshCurrencyStats)
router.route("/ctp-stats").get(getCTPStatsHistory)
router.route("/ctp-returns").get(getCTPStatsReturns)

module.exports = router