const mongoose = require('mongoose')

const currencySchema = mongoose.Schema({
    coingecko_id: {
        type: String,
        require: [true, 'Please add coingecko_id'],
        unique: true
    },
    name: {
        type: String,
        require: [true, 'Please add name']
    },
    symbol: {
        type: String,
        require: [true, 'Please add symbol'],
        unique: true
    },
    image: {
        type: String,
        require: [true, 'Please add image']
    },
    category: {
        type: String,
    },
    total_supply: {
        type: Number,
    },
    ff_assumption: {
        type: Number,
    },
    ctp_group: {
        type: String,
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('Currency', currencySchema)