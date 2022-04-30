const asyncHandler = require('express-async-handler')

const Currency = require('../models/currencyModel')

const getCurrencies = asyncHandler(async (req, res) => {
    const currencies = await Currency.find()
    res.status(200).json(currencies)
})

const addCurrency = asyncHandler(async (req, res) => {
    const { coingecko_id, name, symbol, image, category, total_supply, ff_assumption, ctp_group } = req.body
    if(!coingecko_id || !name || !symbol || !image ) {
        res.status(400)
        throw new Error('coingecko_id, name, symbol, image are needed')
    }

    const currency = await Currency.create({
        coingecko_id,
        name,
        symbol,
        image,
        category,
        total_supply,
        ff_assumption,
        ctp_group
    })

    res.status(200).json(currency)
})

const updateCurrency = asyncHandler(async (req, res) => {
    const currency = await Currency.findById(req.params.id)
    if(!currency) {
        res.status(400)
        throw new Error('Currency not found')
    }

    const updatedCurrency = await Currency.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    })

    res.status(200).json(updatedCurrency);
})

const deleteCurrency = asyncHandler(async (req, res) => {
    const currency = await Currency.findById(req.params.id)
    if(!currency) {
        res.status(400)
        throw new Error('Currency not found')
    }

    await currency.remove()

    res.status(200).json({ id: req.params.id });
})

module.exports = {
    getCurrencies,
    addCurrency,
    updateCurrency,
    deleteCurrency,
}