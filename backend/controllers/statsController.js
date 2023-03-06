const asyncHandler = require('express-async-handler')
const Batch = require('../models/batchModel')
const Stats = require('../models/statsModel')
const Currency = require('../models/currencyModel')
const axios = require('axios')

const getCurrencyStats = asyncHandler( async (req, res) => {
    const { ctp_group } = req.params
    try {
        const batch  = await Batch.findOne({}, {}, { sort: { created: -1 } })
        let currencies_stats
        const currencies  = await Currency.find({ ctp_group: 'CTP10' })
        const currency_ids = currencies.map((currency) => {return currency._id})
        currencies_stats = await Stats.find({ batch: batch._id, currency: { $in: currency_ids } }).populate('currency').exec()
        
        let total_freefloat = 0;
        currencies_stats.map(currency => {
            total_freefloat += Number(currency.ff_mcap)
        })
        
        updated_currency_stats = [];
        const finalStats = [];
        currencies_stats.map(currency => {
            updated_currency_stats.push({
                id: currency.currency._id,
                name: currency.currency.name,
                symbol: currency.currency.symbol,
                image: currency.currency.image,
                category: currency.currency.category,
                market_cap: currency.market_cap,
                price: currency.price,
                price_change_24h: currency.price_change_percentage_24h,
                weight: (currency.ff_mcap * 100 / total_freefloat * 100).toFixed()
            })
            finalStats.push(parseInt((currency.ff_mcap * 100 / total_freefloat * 100).toFixed()));
        })


        res.status(200).json({
            data: finalStats
        })

        // res.status(200).json({batch, currencies:updated_currency_stats.sort(function(a, b) {
        //     return b.market_cap - a.market_cap;
        // })})
    } catch (error) {
        console.log(error.message)
        res.status(400)
        throw new Error("Problem with getting currency stats")
    }
} )

const getCurrencyStatsByGroup = asyncHandler( async (req, res) => {
    const { ctp_group } = req.params
    try {
        const batch  = await Batch.findOne({}, {}, { sort: { created: -1 } })
        let currencies_stats
        let currencies
        if(ctp_group === 'CTP50') {
            currencies  = await Currency.find({ ctp_group: { $in: ['CTP10', 'CTP50'] } })
        } else {
            currencies  = await Currency.find({ ctp_group })
        }
        const currency_ids = currencies.map((currency) => {return currency._id})
            currencies_stats = await Stats.find({ batch: batch._id, currency: { $in: currency_ids } }).populate('currency').exec()
        let total_freefloat = 0;
        currencies_stats.map(currency => {
            total_freefloat += Number(currency.ff_mcap)
        })
        
        updated_currency_stats = [];
        currencies_stats.map(currency => {
            updated_currency_stats.push({
                id: currency.currency._id,
                name: currency.currency.name,
                symbol: currency.currency.symbol,
                image: currency.currency.image,
                category: currency.currency.category,
                market_cap: currency.market_cap,
                price: currency.price,
                price_change_24h: currency.price_change_percentage_24h,
                weight: (currency.ff_mcap / total_freefloat * 100)
            })
        })


        res.status(200).json({batch, currencies:updated_currency_stats.sort(function(a, b) {
            return b.market_cap - a.market_cap;
        })})
    } catch (error) {
        console.log(error.message)
        res.status(400)
        throw new Error("Problem with getting currency stats")
    }
} )

const getCurrencyStatsByCurrency = asyncHandler( async (req, res) => {
    const { currency_id } = req.params
    try {
        const batch  = await Batch.findOne({}, {}, { sort: { created: -1 } })
        const currency = await Stats.findOne({ batch: batch._id, currency: currency_id }).populate('currency')
        res.status(200).json({currency, updated: batch.created})
    } catch (error) {
        res.status(400)
        throw new Error("Problem with getting currency stats")
    }
} )

const getCurrencyStatsHistory = asyncHandler( async (req, res) => {
    const { currency_id } = req.params
    const { duration } = req.query || 14;
    try {
        const today = new Date();
        const priorDate = new Date(new Date().setDate(today.getDate() - parseInt(duration)));
        const batches  = await Batch.find({ created: { $gte: priorDate } }, {}, { sort: { created: -1 } })
        
        const batch_ids = batches.map((batch) => {return batch._id})
        const currencies = await Stats.find({ batch: { $in: batch_ids }, currency: currency_id }).populate('currency').populate('batch')
        const stats = [];
        currencies.map(currency => {
            stats.push({
                coingecko_id: currency.currency.coingecko_id,
                name: currency.currency.name,
                symbol: currency.currency.symbol,
                image: currency.currency.image,
                category: currency.currency.category,
                total_supply: currency.currency.total_supply,
                ctp_group: currency.currency.ctp_group,
                created: currency.batch.created,
                market_cap: currency.market_cap,
                price: currency.price,
                free_float: currency.free_float,
                volume: currency.volume,
                circulating_supply: currency.circulating_supply,
                price_change_percentage_24h: currency.price_change_percentage_24h
            })
        })

        res.status(200).json(stats.sort(function(a, b) {
            return a.created - b.created;
        }))
    } catch (error) {
        console.log(error.message);
        res.status(400)
        throw new Error("Problem with getting currency stats 1")
    }
} )

const getCTPStatsHistory = asyncHandler( async (req, res) => {
    const { duration } = req.query || 14;
    const currencies = await Currency.find({ coingecko_id: { $in: ['ethereum', 'bitcoin'] } })
    const currencyIds = currencies.map(curr => { return curr._id })
    const data = {}
    try {
        const today = new Date();
        const priorDate = new Date(new Date().setDate(today.getDate() - parseInt(duration)));
        const batches  = await Batch.find({ created: { $gte: priorDate } }, {}, { sort: { created: -1 } })
        
        // const batch_ids = batches.map((batch) => {
        //     return batch._id}
        //     )
        batches.map(batch => {
            data[batch._id] = {
                created: batch.created,
                CTP10: batch.ctp_value_10,
                CTP50: batch.ctp_value_50
            }
        })
        // console.log(batches)
        const currencyStats = await Stats.find({ batch: { $in: Object.keys(data) }, currency: { $in: currencyIds } }).populate('currency').populate('batch')
        const stats = [];
        currencyStats.map(currency => {
            data[currency.batch._id][currency.currency.coingecko_id.toUpperCase()] = currency.price
        })

        res.status(200).json(Object.values(data).sort(function(a, b) {
            return a.created - b.created;
        }))
    } catch (error) {
        console.log(error.message);
        res.status(400)
        throw new Error("Problem with getting currency stats 1")
    }
} )

const getCTPStatsHistoryNew = asyncHandler( async (req, res) => {
    const { duration } = req.query || 14;
    const currencies = await Currency.find({ coingecko_id: { $in: ['ethereum', 'bitcoin'] } })
    const currencyIds = currencies.map(curr => { return curr._id })
    const data = {}
    try {
        const today = new Date();
        const priorDate = new Date(new Date().setDate(today.getDate() - parseInt(duration)));
        const batches  = await Batch.find({ created: { $gte: priorDate } }, {}, { sort: { created: -1 } })
        
        batches.map(batch => {
            data[batch._id] = {
                created: batch.created,
                CTP10: batch.ctp_value_10,
                CTP50: batch.ctp_value_50
            }
        })
        
        const currencyStats = await Stats.find({ batch: { $in: Object.keys(data) }, currency: { $in: currencyIds } }).populate('currency').populate('batch')
        const stats = [];
        currencyStats.map(currency => {
            data[currency.batch._id][currency.currency.coingecko_id.toUpperCase()] = currency.price
        })

        res.status(200).json(Object.values(data).sort(function(a, b) {
            return a.created - b.created;
        }))
    } catch (error) {
        console.log(error.message);
        res.status(400)
        throw new Error("Problem with getting currency stats 1")
    }
} )

const getCTPStatsReturns = asyncHandler( async (req, res) => {
    const { duration } = req.query || 14;
    const currencies = await Currency.find({ coingecko_id: { $in: ['ethereum', 'bitcoin'] } })
    const currencyIds = currencies.map(curr => { return curr._id })
    const data = {}
    try {
        const today = new Date();
        const batches = {};        
        const batch  = await Batch.findOne({}, {}, { sort: { created: -1 } })
        batches[batch._id] = {
            name: 'current',
            batch: batch
        }
        let priorDate = new Date(new Date().setDate(today.getDate() - 15));
        const batch_day  = await Batch.findOne({ created: { $lt: priorDate } }, {}, { sort: { created: -1 } })
        batches[batch_day._id] = {
            name: 'day',
            batch: batch_day
        }
        priorDate = new Date(new Date().setDate(today.getDate() - 30));
        const batch_month  = await Batch.findOne({ created: { $lt: priorDate } }, {}, { sort: { created: -1 } })
        batches[batch_month._id] = {
            name: 'month',
            batch: batch_month
        }
        priorDate = new Date(new Date().setDate(today.getDate() - 90));
        const batch_3month  = await Batch.findOne({ created: { $lt: priorDate } }, {}, { sort: { created: -1 } })
        batches[batch_3month._id] = {
            name: 'month3',
            batch: batch_3month
        }
        priorDate = new Date(new Date().setDate(today.getDate() - 182));
        const batch_6month  = await Batch.findOne({ created: { $lt: priorDate } }, {}, { sort: { created: -1 } })
        batches[batch_6month._id] = {
            name: 'month6',
            batch: batch_6month
        }
        priorDate = new Date(new Date().setDate(today.getDate() - 365));
        let batch_year  = await Batch.findOne({ created: { $lt: priorDate } }, {}, { sort: { created: -1 } })
        if(batch_year === null) {
            batch_year  = await Batch.findOne({}, {}, { sort: { created: 1 } })
        }
        batches[batch_year._id] = {
            name: 'year',
            batch: batch_year
        }

        const currencyStats = await Stats.find({ batch: { $in: Object.keys(batches) }, currency: { $in: currencyIds } }).populate('currency').populate('batch')

        currencyStats.map(stats => {
            batches[stats.batch._id][stats.currency.name] = stats.price;
        })

        let item;
        Object.keys(batches).map(batch_id => {
            item = batches[batch_id];
            data[item.name] = {
                CTP10: item.batch.ctp_value_10,
                CTP50: item.batch.ctp_value_50,
                Bitcoin: item.Bitcoin,
                Ethereum: item.Ethereum,
                created: item.batch.created
            }
        })

        res.status(200).json({
            data
        })
    } catch (error) {
        console.log(error.message);
        res.status(400)
        throw new Error("Problem with getting CTP stats History")
    }
} )

const calculateCTPForBatch = asyncHandler(async(batch_id) => {
    console.log('inside ')
    if(!batch_id) {
        return false
    }
    console.log(batch_id)
    try {
        const stats = await Stats.find({ batch: batch_id }).populate('currency').exec()
        let ctp_value_10 = 0, total_price_10 = 0, total_volume_10 = 0, ctp_value_50 = 0, total_price_50 = 0, total_volume_50 = 0
        stats.map(async(stat, i) => {
            ctp_value_50 += Number(stat.free_float * stat.price)
            total_price_50 += Number(stat.price)
            total_volume_50 += Number(stat.volume)
            if(stat.currency.ctp_group === 'CTP10') {
                ctp_value_10 += Number(stat.free_float * stat.price)
                total_price_10 += Number(stat.price)
                total_volume_10 += Number(stat.volume)
            }
        })
        const updatedBatch = await Batch.findByIdAndUpdate(batch_id, {
            ctp_value_10: (ctp_value_10 / 35000000),
            total_price_10: total_price_10,
            total_volume_10: total_volume_10,
            ctp_value_50: (ctp_value_50 / 35000000), 
            total_price_50: total_price_50,
            total_volume_50: total_volume_50
        })
        console.log(`Updated batch ${updatedBatch._id}`)
        return(stats)
    } catch (error) {
        console.log(error)
        return false
    }
})

const refreshCurrencyStats = asyncHandler( async (req, res) => {
    try {
        const currencies = await Currency.find({ ctp_group: { $in: ['CTP10', 'CTP50'] } })
        const currencyMapping = {}
        const currencyIds = currencies.map(currency => {
            currencyMapping[currency.coingecko_id] = currency
            return currency.coingecko_id
        })
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', 
        { params: { vs_currency: 'usd', ids: currencyIds.join(','), order: 'market_cap_desc', per_page: 50, page: 1, sparkline: false, price_change_percentage: '24h' }})
        if(response.data) {
            const date = new Date()
            const data = []
            const batch = await Batch.create({
                name: date.toDateString(),
                created: date
            })
            response.data.map(currency => {
                let free_float = currency.circulating_supply * currencyMapping[currency.id].ff_assumption
                data.push({
                    currency: currencyMapping[currency.id]._id,
                    batch: batch._id,
                    market_cap: currency.market_cap,
                    price: currency.current_price,
                    free_float,
                    volume: currency.total_volume,
                    circulating_supply: currency.circulating_supply,
                    price_change_24h: currency.price_change_24h,
                    cic: currency.total_volume / currency.market_cap,
                    ff_mcap: free_float * currency.current_price,
                    pv_ratio: currency.market_cap / currency.total_volume,
                    high_24h: currency.high_24h,
                    low_24h: currency.low_24h,
                    price_change_percentage_24h: currency.price_change_percentage_24h,
                    ath: currency.ath,
                    atl: currency.atl,
                    ctp_group: currencyMapping[currency.id].ctp_group
                })
            })
            const stats = await Stats.create(data)
            calculateCTPForBatch(batch._id)
            res.status(200).json({ message: `Stats added: ${batch.name} ` })
        } else {
            res.status(400)
            throw new Error('Cannot refresh currency stats')
        }
    } catch (error) {
        res.status(400)
        throw new Error('Cannot refresh currency stats')
    }
})

module.exports = {
    calculateCTPForBatch,
    getCurrencyStats,
    getCurrencyStatsByGroup,
    getCurrencyStatsByCurrency,
    getCurrencyStatsHistory,
    refreshCurrencyStats,
    getCTPStatsHistory,
    getCTPStatsHistoryNew,
    getCTPStatsReturns
}