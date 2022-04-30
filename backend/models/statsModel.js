const mongoose = require('mongoose')

const statsSchema = mongoose.Schema({
    currency: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Currency'
    },
    batch: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Batch'
    },
    market_cap: {
        type: Number
    },
    price: {
        type: Number
    },
    free_float: {
        type: Number
    },
    volume: {
        type: Number
    },
    circulating_supply: {
        type: Number
    },
    price_change_24h: {
        type: Number
    },
    cic: {
        type: Number
    },
    ff_mcap: {
        type: Number
    },
    pv_ratio: {
        type: Number
    },
    high_24h: {
        type: Number
    },
    low_24h: {
        type: Number
    },
    price_change_percentage_24h: {
        type: Number
    },
    ath: {
        type: Number
    },
    atl: {
        type: Number
    }
})

module.exports = mongoose.model('Stats', statsSchema)