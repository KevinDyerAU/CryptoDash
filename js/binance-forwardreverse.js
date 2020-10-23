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
const calculateBuyValue = function(ask, tradeValue,  precision = undefined) {
    ask = ccxt.decimalToPrecision (ask, ccxt.ROUND, precision, ccxt.TICK_SIZE)
    parseFloat (ask)

    // log('I can buy for : '.yellow, ask)

    // log('amount to be sold: '.yellow, tradeValue)

    let value = (tradeValue/ask)
    // log('tradeValue before fee: '.yellow, value)

    let fee = value*0.001
    // log('fee: '.red, fee)

    value = value - fee

    // log('tradeValue after fee: '.green, value)

    return value
}

/**
 * Calculate total based on asking prices minus maker fee.
 * Fee = 0.1% so  multiply by 0.001 and subtract from the tradeValue
 * 
 * @param {*} bid 
 * @param {*} tradeValue 
 */
const calculateSellValue = function(bid, tradeValue,  precision = undefined) {
    bid = ccxt.decimalToPrecision (bid, ccxt.ROUND, precision, ccxt.TICK_SIZE)
    parseFloat (bid)

    // log('I can sell for price: '.yellow, bid)

    // log('amount to be sold: '.yellow, tradeValue)

    let value = (tradeValue*bid)
    // log('tradeValue before fee: '.yellow, value)

    let fee = value*0.001
    // log('fee: '.red, fee)

    value = value - fee

    // log('tradeValue after fee: '.green, value)

    return value
}

/**
 * Check to see if we should execute trade after fees based on $1000 BASE
 * @param {*} baseTrade 
 * @param {*} interTrade 
 * @param {*} finalTrade 
 * @param {*} precision 
 */
const testTradeCycle = function (baseAsk, interAsk, finalAsk,  precision = undefined) {
    // log('------- Forward --------'.green)

    let initValue = 1000

    //step one BASE -> firstToken
    let baseTokenValue = calculateBuyValue(baseAsk, initValue, precision)

    //step two firstToken -> secondToken noting that intermediary pair will contain base
    let intermediaryValue = calculateSellValue(interAsk, baseTokenValue, precision)

    //final trade intemdiary back to $USDT
    let netResult = calculateSellValue(finalAsk, intermediaryValue, precision)

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
    // log('------- Reverse --------'.green)
    let initValue = 1000

    //step one BASE -> firstToken
    let baseTokenValue = calculateBuyValue(baseAsk, initValue, precision)

    //step two firstToken -> secondToken noting that intermediary pair will contain base
    let intermediaryValue = calculateBuyValue(interAsk, baseTokenValue, precision)

    //final trade intemdiary back to $AUD
    let netResult = calculateSellValue(finalAsk, intermediaryValue, precision)

    return netResult
}

;(async () => {

    // instantiate the exchange
    let exchange = new ccxt.binance  ({
        "apiKey": "xxx",
        "secret": "xxx",
    })

    try {
            let pairs = ['AAVE',
            'ADA',
            'AION',
            'ALGO',
            'ALPHA',
            'ANKR',
            'ANT',
            'ARDR',
            'ATOM',
            'AVAX',
            'BAL',
            'BAND',
            'BAT',
            'BCC',
            'BCH',
            'BEAM',
            'BEL',
            'BLZ',
            'BNB',
            'BNT',
            'BSV',
            'BTS',
            'BTT',
            'BZRX',
            'CELR',
            'CHR',
            'CHZ',
            'COCOS',
            'COMP',
            'COS',
            'COTI',
            'CRV',
            'CTSI',
            'CTXC',
            'CVC',
            'DAI',
            'DASH',
            'DATA',
            'DCR',
            'DENT',
            'DGB',
            'DIA',
            'DOCK',
            'DOGE',
            'DOT',
            'DREP',
            'DUSK',
            'EGLD',
            'ENJ',
            'EOS',
            'ERD',
            'ETC',
            'ETH',
            'FET',
            'FIL',
            'FIO',
            'FLM',
            'FTM',
            'FTT',
            'FUN',
            'GTO',
            'GXS',
            'HBAR',
            'HC',
            'HIVE',
            'HNT',
            'HOT',
            'ICX',
            'INJ',
            'IOST',
            'IOTA',
            'IOTX',
            'IRIS',
            'JST',
            'KAVA',
            'KEY',
            'KMD',
            'KNC',
            'KSM',
            'LEND',
            'LINK',
            'LRC',
            'LSK',
            'LTC',
            'LTO',
            'LUNA',
            'MANA',
            'MATIC',
            'MBL',
            'MCO',
            'MDT',
            'MFT',
            'MITH',
            'MKR',
            'MTL',
            'NANO',
            'NBS',
            'NEAR',
            'NEO',
            'NKN',
            'NMR',
            'NPXS',
            'NULS',
            'OCEAN',
            'OGN',
            'OMG',
            'ONE',
            'ONG',
            'ONT',
            'ORN',
            'OXT',
            'PAX',
            'PAXG',
            'PERL',
            'PNT',
            'QTUM',
            'REN',
            'REP',
            'RLC',
            'RSR',
            'RUNE',
            'RVN',
            'SAND',
            'SC',
            'SNX',
            'SOL',
            'SRM',
            'STMX',
            'STORJ',
            'STORM',
            'STPT',
            'STRAT',
            'STX',
            'SUN',
            'SUSHI',
            'SXP',
            'TCT',
            'TFUEL',
            'THETA',
            'TOMO',
            'TRB',
            'TROY',
            'TRX',
            'TUSD',
            'UMA',
            'UNI',
            'UTK',
            'VEN',
            'VET',
            'VITE',
            'WAN',
            'WAVES',
            'WIN',
            'WING',
            'WNXM',
            'WRX',
            'WTC',
            'XLM',
            'XMR',
            'XRP',
            'XTZ',
            'XVS',
            'XZC',
            'YFI',
            'YFII',
            'ZEC',
            'ZEN',
            'ZIL',
            'ZRX']

            let primaryMarket = "USDT"
            let intermediaryMarket = "BTC"

            for (let symbol of pairs) {

                // fetch tickers
                let forwardTicker = await exchange.fetchTicker (symbol+'/'+primaryMarket)
                // console.log (symbol+'/'+primaryMarket, 'dateTime', forwardTicker['datetime'], 'bid', forwardTicker['bid'], 'ask', forwardTicker['ask'])

                let intermediaryTicker = await exchange.fetchTicker (symbol+'/'+intermediaryMarket)
                // console.log (symbol+'/'+intermediaryMarket, 'dateTime', intermediaryTicker['datetime'], 'bid', intermediaryTicker['bid'], 'ask',intermediaryTicker['ask'])

                let reverseTicker = await exchange.fetchTicker (intermediaryMarket+'/'+primaryMarket)
                // console.log (intermediaryMarket+'/'+primaryMarket, 'dateTime', reverseTicker['datetime'], 'bid', reverseTicker['bid'],  'ask',reverseTicker['ask'])


                //TEST TRADE CYCLE INCL FEES

                // Test forward cycle on $1000AUD
                let result = testTradeCycle(forwardTicker['ask'], intermediaryTicker['ask'], reverseTicker['bid'],0.000000001)
                if(result < 1000) {
                    //Test reverse cycle on $1000AUD
                    result = testReverseTradeCycle(reverseTicker['ask'], intermediaryTicker['ask'], forwardTicker['bid'],0.000000001)
                    if(result < 1000) {
                        // log (symbol+' NO TRADE'.red)
                    }
                    else {
                        log (symbol+' Reverse TRADE Success!!'.green)
                        log (result)
                    }

                }
                else {
                    log (symbol+' Forward TRADE Success!!'.green)
                    log (result)
                }
            }
            

            //Execute TRADE Sample ONLY

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