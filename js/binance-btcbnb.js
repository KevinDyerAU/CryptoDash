"use strict";

const ccxt      = require ('../../ccxt.js')
const asTable   = require ('as-table')
const log       = require ('ololog').configure ({ locate: false })


require ('ansicolor').nice

let sleep = (ms) => new Promise (resolve => setTimeout (resolve, ms))

/**
 * Calculate total based on asking prices minus maker fee.
 * Fee = 0.1% so  multiply by 0.001 and subtract from the tradeValue
 * 
 * @param {*} ask 
 * @param {*} tradeValue 
 */
const calculateTradeValue = function(ask, tradeValue,  precision = undefined) {
    ask = ccxt.decimalToPrecision (ask, ccxt.ROUND, precision, ccxt.TICK_SIZE)
    parseFloat (ask)

    log('asking price: '.yellow, ask)

    log('amount to be sold: '.yellow, tradeValue)

    let value = (tradeValue/ask)
    log('tradeValue before fee: '.yellow, value)

    let fee = value*0.001
    log('fee: '.red, fee)

    value = value - fee

    log('tradeValue after fee: '.green, value)

    return value
}

/**
 * Calculate total based on asking prices minus maker fee.
 * Fee = 0.1% so  multiply by 0.001 and subtract from the tradeValue
 * 
 * @param {*} ask 
 * @param {*} tradeValue 
 */
const calculateReverseTradeValue = function(ask, tradeValue,  precision = undefined) {
    ask = ccxt.decimalToPrecision (ask, ccxt.ROUND, precision, ccxt.TICK_SIZE)
    parseFloat (ask)

    log('asking price: '.yellow, ask)

    log('amount to be sold: '.yellow, tradeValue)

    let value = (tradeValue*ask)
    log('tradeValue before fee: '.yellow, value)

    let fee = value*0.001
    log('fee: '.red, fee)

    value = value - fee

    log('tradeValue after fee: '.green, value)

    return value
}

/**
 * Calculate AUD based on bid price minus taker fee.
 * Fee = 0.1% so  multiply by 0.001 and subtract from the tradeValue
 * 
 * @param {*} bidAUDPrice 
 * @param {*} tradeValue 
 */
const convertBackToAUD = function(bidAUDPrice,  tokenValue) {
    let value = tokenValue*bidAUDPrice
    log('AUD value before fee: '.yellow, value)

    let fee = value*0.001
    log('fee: '.red, fee)

    value = value - fee

    log('AUD after fee: '.green, value)

    return value
}

/**
 * Check to see if we should execute trade after fees based on $1000 AUD
 * @param {*} baseTrade 
 * @param {*} interTrade 
 * @param {*} finalTrade 
 * @param {*} precision 
 */
const testTradeCycle = function (baseAsk, interAsk, finalAsk,  precision = undefined) {
    log('------- Forward --------'.green)

    let initValue = 1000

    //step one AUD -> firstToken
    let baseTokenValue = calculateTradeValue(baseAsk, initValue, precision)

    //step two firstToken -> secondToken noting that intermediary pair will contain base
    let intermediaryValue = calculateTradeValue(interAsk, baseTokenValue, precision)

    //final trade intemdiary back to $AUD
    let audIntermediary = convertBackToAUD(finalAsk, intermediaryValue)
}

/**
 * Check to see if we should execute reverse trade after fees based on $1000 AUD
 * 
 * @param {*} baseTrade 
 * @param {*} interTrade 
 * @param {*} finalTrade 
 * @param {*} precision 
 */
const testReverseTradeCycle = function (baseAsk, interAsk, finalAsk,  precision = undefined) {
    log('------- Reverse --------'.green)
    let initValue = 1000

    //step one AUD -> firstToken
    let baseTokenValue = calculateTradeValue(baseAsk, initValue, precision)

    //step two firstToken -> secondToken noting that intermediary pair will contain base
    let intermediaryValue = calculateReverseTradeValue(interAsk, baseTokenValue, precision)

    //final trade intemdiary back to $AUD
    let audIntermediary = convertBackToAUD(finalAsk, intermediaryValue)
}

;(async () => {

    // instantiate the exchange
    let exchange = new ccxt.binance  ({
        "apiKey": "xxx",
        "secret": "xxx",
    })


    try {

            // // fetch account balances from the exchange
            // let balance = await exchange.fetchBalance()
            // log('balance total'.green, balance.total)
            // let valueBTC = balance['BTC']
            // log('balance BTC'.green, valueBTC)
            // let valueBNB = balance['BNB']
            // log('balance BNB'.green, valueBNB)

            // fetch fees
            // let btcAUDFee = await exchange.fetchTradingFee('BTC/AUD')
            // log('fee'.green, 'BTC/AUD', btcAUDFee)

            // let audBNBFee = await exchange.fetchTradingFee('BNB/AUD')
            // log('fee'.green, 'BNB/AUD', audBNBFee)

            // let btcBNBFee = await exchange.fetchTradingFee('BNB/BTC')
            // log('fee'.green, 'BNB/BTC', btcBNBFee)

            // fetch tickers
            let btcAUDTicker = await exchange.fetchTicker ('BTC/AUD')
            console.log ('BTC/AUD', 'dateTime', btcAUDTicker['datetime'], 'bid', btcAUDTicker['bid'], 'ask', btcAUDTicker['ask'])

            let audBNBTicker = await exchange.fetchTicker ('BNB/AUD')
            console.log ('BNB/AUD', 'dateTime', audBNBTicker['datetime'], 'bid', audBNBTicker['bid'],  'ask',audBNBTicker['ask'])

            let btcBNBTicker = await exchange.fetchTicker ('BNB/BTC')
            console.log ('BNB/BTC', 'dateTime', btcBNBTicker['datetime'], 'bid', btcBNBTicker['bid'], 'ask',btcBNBTicker['ask'])


            // Test forward cycle
            let result = testTradeCycle(btcAUDTicker['ask'], btcBNBTicker['ask'], audBNBTicker['bid'],0.000000001)

            //Test reverse cycle
            result = testReverseTradeCycle(audBNBTicker['ask'], btcBNBTicker['ask'], btcAUDTicker['bid'],0.000000001)

            //Sample ONLY

            // // create market order
            // let marketOrder = await exchange.createOrder('BTC/USD', 'market', 'buy', 0.01)
            // console.log('New market order'.green, marketOrder);

            // // cancel order
            // let canceledOrder = await exchange.cancelOrder(newOrder.id)
            // console.log('Canceled order'.green, canceledOrder);

            // // open orders
            // let secondOpenOrders = await exchange.fetchOpenOrders()
            // log('Open orders'.green, asTable(secondOpenOrders))

            // // create new limit order
            // let newOrder = await exchange.createOrder('BTC/USD', 'limit', 'buy', 0.01, 8000)
            // console.log('New limit order'.green, newOrder);

            // open orders
            // let openOrders = await exchange.fetchOpenOrders()
            // log('Open orders'.green, asTable(openOrders))

            // // order data
            // let orderData = await exchange.fetchOrder(newOrder.id)
            // console.log('Order data'.green, orderData);


        } catch (e) {

            if (e instanceof ccxt.DDoSProtection || e.message.includes('ECONNRESET')) {
                log.bright.yellow('[DDoS Protection] ' + e.message)
            } else if (e instanceof ccxt.RequestTimeout) {
                log.bright.yellow('[Request Timeout] ' + e.message)
            } else if (e instanceof ccxt.AuthenticationError) {
                log.bright.yellow('[Authentication Error] ' + e.message)
            } else if (e instanceof ccxt.ExchangeNotAvailable) {
                log.bright.yellow('[Exchange Not Available Error] ' + e.message)
            } else if (e instanceof ccxt.ExchangeError) {
                log.bright.yellow('[Exchange Error] ' + e.message)
            } else if (e instanceof ccxt.NetworkError) {
                log.bright.yellow('[Network Error] ' + e.message)
            } else {
                throw e;
            }
        }

}) ()