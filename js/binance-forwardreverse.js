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
    let netResult = convertBackToAUD(finalAsk, intermediaryValue)

    return netResult
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
    let netResult = convertBackToAUD(finalAsk, intermediaryValue)

    return netResult
}

;(async () => {

    // instantiate the exchange
    let exchange = new ccxt.binance  ({
        "apiKey": "xxx",
        "secret": "xxx",
    })

    try {

            // fetch tickers
            let forwardTicker = await exchange.fetchTicker ('ETH/AUD')
            console.log ('ETH/AUD', 'dateTime', forwardTicker['datetime'], 'bid', forwardTicker['bid'], 'ask', forwardTicker['ask'])

            let intermediaryTicker = await exchange.fetchTicker ('BNB/ETH')
            console.log ('BNB/ETH', 'dateTime', intermediaryTicker['datetime'], 'bid', intermediaryTicker['bid'], 'ask',intermediaryTicker['ask'])

            let reverseTicker = await exchange.fetchTicker ('BNB/AUD')
            console.log ('BNB/AUD', 'dateTime', reverseTicker['datetime'], 'bid', reverseTicker['bid'],  'ask',reverseTicker['ask'])




            // Test forward cycle on $1000AUD
            let result = testTradeCycle(forwardTicker['ask'], intermediaryTicker['ask'], reverseTicker['bid'],0.000000001)
            if(result < 1000) {
                //Test reverse cycle on $1000AUD
                result = testReverseTradeCycle(reverseTicker['ask'], intermediaryTicker['ask'], forwardTicker['bid'],0.000000001)
                if(result < 1000) {
                    console.log ('NO REVERSE TRADE')
                }
                else {
                    console.log ('Reverse TRADE Success')
                }

            }
            else {
                console.log ('Forward TRADE Success')
            }

            

            //Sample ONLY

            // // create market order
            // let marketOrder = await exchange.createOrder('ETH/USD', 'market', 'buy', 0.01)
            // console.log('New market order'.green, marketOrder);

            // // cancel order
            // let canceledOrder = await exchange.cancelOrder(newOrder.id)
            // console.log('Canceled order'.green, canceledOrder);

            // // open orders
            // let secondOpenOrders = await exchange.fetchOpenOrders()
            // log('Open orders'.green, asTable(secondOpenOrders))

            // // create new limit order
            // let newOrder = await exchange.createOrder('ETH/USD', 'limit', 'buy', 0.01, 8000)
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