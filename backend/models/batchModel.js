const mongoose = require('mongoose')

const batchSchema = mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Please add name'],
    },
    ctp_value_10: {
        type: Number
    },
    total_price_10: {
        type: Number
    },
    total_volume_10: {
        type: Number
    },
    ctp_value_50: {
        type: Number
    },
    total_price_50: {
        type: Number
    },
    total_volume_50: {
        type: Number
    },
    created: {
        type: Date, 
        default: Date.now
    }
})

module.exports = mongoose.model('Batch', batchSchema)