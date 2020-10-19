"use strict";

const ccxt      = require ('../../ccxt.js')
const asTable   = require ('as-table')
const log       = require ('ololog').configure ({ locate: false })


require ('ansicolor').nice

let sleep = (ms) => new Promise (resolve => setTimeout (resolve, ms))

;(async () => {

    // instantiate the exchange
    let exchange = new ccxt.binance  ({
        "apiKey": "xxx",
        "secret": "xxx",
    })


    try {

            // fetch account balances from the exchange
            let balance = await exchange.fetchBalance()
            log('balance total'.green, balance.total)
            let valueBTC = balance['BTC']
            log('balance BTC'.green, valueBTC)
            let valueBNB = balance['BNB']
            log('balance BNB'.green, valueBNB)

            // fetch fees
            let btcAUDFee = await exchange.fetchTradingFee('BTC/AUD')
            log('fee'.green, 'BTC/AUD', btcAUDFee)

            let audBNBFee = await exchange.fetchTradingFee('BNB/AUD')
            log('fee'.green, 'BNB/AUD', audBNBFee)

            let btcBNBFee = await exchange.fetchTradingFee('BNB/BTC')
            log('fee'.green, 'BNB/BTC', btcBNBFee)

            // fetch tickers
            let btcAUDTicker = await exchange.fetchTicker ('BTC/AUD')
            console.log ('BTC/AUD', 'dateTime', btcAUDTicker['datetime'], 'bid', btcAUDTicker['bid'], 'ask', btcAUDTicker['ask'])

            let audBNBTicker = await exchange.fetchTicker ('BNB/AUD')
            console.log ('BNB/AUD', 'dateTime', audBNBTicker['datetime'], 'bid', audBNBTicker['bid'],  'ask',audBNBTicker['ask'])

            let btcBNBTicker = await exchange.fetchTicker ('BNB/BTC')
            console.log ('BNB/BTC', 'dateTime', btcBNBTicker['datetime'], 'bid', btcBNBTicker['bid'], 'ask',btcBNBTicker['ask'])



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