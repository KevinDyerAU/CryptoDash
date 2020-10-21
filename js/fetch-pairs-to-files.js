"use strict";

const ccxt = require ('../../ccxt.js')
    , log  = require ('ololog').noLocate // npm install ololog
    , fs   = require ('fs')

    // the numWorkers constant defines the number of concurrent workers
    // those aren't really threads in terms of the async environment
    // set this to the number of cores in your CPU * 2
    // or play with this number to find a setting that works best for you
    , numWorkers = 8

;(async () => {

    // instantiate the exchange
    let exchange = new ccxt.binance  ({
        "apiKey": "g85RI8GmSnA8MlHr9mjz8juHhUUeVvXkaGCnEmtHg2XaotM5E9I4aBO2MtEucLqw",
        "secret": "A9Q5AqlUQEgsLPeZdSqyx9frGEppFWU2AZnc4fkNn4TzANSr8s8rsspydiVgbK6H",
    })


    try {

            // // fetch account balances from the exchange
            let balance = await exchange.fetchBalance()
            // log('balance total'.green, balance.total)
            // let valueETH = balance['ETH']
            // log('balance ETH'.green, valueETH)
            let valueBTC = balance['BTC']
            log('balance BTC'.green, valueBTC)

            let allSymbols = ""
            for (let symbol of exchange.symbols) {

                if ((symbol.includes ('AUD'))) { // only include XRP
                    log.yellow (' ' + symbol);
                    allSymbols.concat(' '+symbol+' ')
                    allSymbols.concat("\n")
                }

            }

            log('symbols'.green, allSymbols)

            try {

                // make a filename from exchange id
                const filename =  'BinanceUTSD.json'

                // save the response to a file
                // fs.writeFileSync (filename, allSymbols);

                // print out a message on success
                log.green ('symbols saved to', filename)

            } catch (e) {

                // in case of error - print it out and ignore it further
                log.red (e.constructor.name, e.message)
            }

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
