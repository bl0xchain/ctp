const asyncHandler = require('express-async-handler')
const Currency = require('../models/currencyModel')
const Batch = require('../models/batchModel')
const Stats = require('../models/statsModel')
const util = require( 'util' )
const mysql = require('mysql')
const { calculateCTPForBatch } = require('./statsController')

const mysqlConn = () => {
    const connection = mysql.createConnection( {
        host: 'localhost',
        user: 'shashank',
        password: process.env.MYSQL_PASSWORD,
        database: 'ctp_index',
        multipleStatements: true
    } );
    return {
        query( sql, args ) {
            return util.promisify( connection.query )
                .call( connection, sql, args );
        },
        close() {
            return util.promisify( connection.end ).call( connection );
        }
    };
}

const importCurrencies = asyncHandler(async(req, res) => {
    const dbConn = mysqlConn()
    try {
        const currencies = await dbConn.query('SELECT * FROM currency_meta WHERE ctp_group = "CTP10" OR ctp_group = "CTP50"');
        currencies.map(async(currency, i) => {
            await Currency.create({
                coingecko_id: currency.coingecko_id,
                name: currency.name,
                symbol: currency.symbol,
                image: currency.image,
                category: currency.category,
                total_supply: currency.total_supply,
                ff_assumption: currency.ff_assumption,
                ctp_group: currency.ctp_group
            })
            console.log(`Imported ${currency.name}`)
        })
        res.status(200).json(currencies)
    } catch (error) {
        console.log(error.message)
        res.status(400)
        throw new Error('Problem with importing currencies')
    }
})

const importBatches = asyncHandler(async(req, res) => {
    const dbConn = mysqlConn()
    try {
        let currency_map = {}
        let mongo_currencies = {}
        const mysql_currencies_res = await dbConn.query('SELECT id, coingecko_id FROM currency_meta WHERE ctp_group = "CTP10" OR ctp_group = "CTP50"');
        const mongo_currencies_res = await Currency.find();
        
        mongo_currencies_res.map((currency, i) => {
            mongo_currencies[currency.coingecko_id] = currency._id
        })
        mysql_currencies_res.map((currency, i) => {
            currency_map[Number(currency.id)] = mongo_currencies[currency.coingecko_id]
        })
        
        const currency_ids = Object.keys(currency_map).map(Number)
        // const batches = Array.from({length: 10}, (_, i) => i + 1);
        const batches = await dbConn.query('SELECT * FROM batch');
        batches.map(async(batch, i) => {
            const batch_data = await Batch.create({
                name: batch.batch_name,
                created: new Date(batch.created*1000)
            })
            const stats_data = await dbConn.query('SELECT * FROM currency_data_history WHERE batch = ? AND currency_id IN (?)', [batch.batch_id, currency_ids])
            stats_data.map(async(data, i) => {
                await Stats.create({
                    currency: currency_map[data.currency_id],
                    batch: batch_data._id,
                    market_cap: data.market_cap,
                    price: data.price,
                    free_float: data.free_float,
                    volume: data.volume,
                    circulating_supply: data.circulating_supply,
                    price_change_24h: data.price_change_24h,
                    cic: data.cic,
                    ff_mcap: data.ff_mcap,
                    pv_ratio: data.pv_ratio,
                    high_24h: data.high_24h,
                    low_24h: data.low_24h,
                    price_change_percentage_24h: data.price_change_percentage_24h,
                    ath: data.ath,
                    atl: data.atl
                })
            })
            console.log(`Batch: ${batch_data._id}`)
        })
        res.status(200).json({message: 'Done'})
    } catch (error) {
        console.log(error.message)
        res.status(400)
        throw new Error('Problem with importing batches')
    }
})

const calculateCTP = asyncHandler(async(req, res) => {
    try {
        const batches = await Batch.find({ //query today up to tonight
            created: {
                $gte: new Date('2022-05-11'), 
            }
        })
        console.log(batches.length)
        let status = {status: 'Empty'}
        batches.map(async (batch, i) => {
            calculateCTPForBatch(batch._id)
        })
        res.status(200).json(status)
    } catch (error) {
        console.log(error.message)
        res.status(400)
        throw new Error('Problem with calculating CTP')
    }
})



module.exports = {
    importCurrencies,
    importBatches,
    calculateCTP
}