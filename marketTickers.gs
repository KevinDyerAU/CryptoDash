function getCoinSpotMarketsPrice() {
  
  //retrieve all prices from Coinspot
  var url = "https://www.coinspot.com.au/pubapi/latest";
  
  var response = UrlFetchApp.fetch(url);
  var jsonResponse = JSON.parse(response);
  
  Logger.log(response);
  Logger.log(jsonResponse);
  
  //get latest price
  Logger.log(jsonResponse.prices);
  var btcJson = jsonResponse.prices['btc'];
  Logger.log(btcJson);
  Logger.log(btcJson.last);
                                    
  
  return btcJson.last;
}

function getSTEXMarketsPrice(quote, base) {
  //get currency pair
  //var quote = "XRP";
  //var base = "BTC";
  var currencyPair = 756;
  
  //retrieve XRP price from STEX in BTC
  //https://api3.stex.com/public/ticker // list all tickers and ids
  var url = "https://api3.stex.com/public/ticker/"+currencyPair;
  
  var response = UrlFetchApp.fetch(url);
  var jsonResponse = JSON.parse(response);
  
  Logger.log(response);
  Logger.log(jsonResponse);
  
  //get latest price
  Logger.log(jsonResponse.data);
  Logger.log(jsonResponse.data['last']);
  
  return jsonResponse.data['last'];
}

function getBTCMarketsPrice(quote, base) {
  //get currency pair
  //var quote = "XRP";
  //var base = "BTC";
  var currencyPair = quote+"/"+base;
  
  //retrieve XRP price from BTCMarkets in BTC
  var url = "https://api.btcmarkets.net/market/"+currencyPair+"/tick";
  
  var response = UrlFetchApp.fetch(url);
  var jsonResponse = JSON.parse(response);
  
  Logger.log(response);
  Logger.log(jsonResponse);
  
  //get latest price
  Logger.log(jsonResponse.lastPrice);
  
  return jsonResponse.lastPrice;
}

function getBinanceMarketsPrice(quote, base) {
  
  //get currency pair
  var quote = "XRP";
  var base = "BTC";
  var currencyPair = quote+base;
  
  //retrieve XRP price from Binance in BTC
  //https://api.binance.com/api/v1/ticker/price?symbol=LTCBTC
  var url = "https://api.binance.com/api/v1/ticker/price?symbol="+currencyPair;
  
  var response = UrlFetchApp.fetch(url);
  var jsonResponse = JSON.parse(response);
  
  Logger.log(response);
  Logger.log(jsonResponse);
  
  //get latest price
  Logger.log(jsonResponse.price);
  
  return jsonResponse.price;
}

function getGdaxMarketsPrice(quote, base) {
  
  //get currency pair
  var quote = "XRP";
  var base = "BTC";
  var currencyPair = quote+"-"+base;
  
  //retrieve XRP price from Binance in BTC
  //https://api.gdax.com/products/XRP-BTC/ticker
  var url = "https://api.gdax.com/products/"+currencyPair+"/ticker";
  
  Logger.log(url);
  
  var response = UrlFetchApp.fetch(url);
  var jsonResponse = JSON.parse(response);
  
  Logger.log(response);
  Logger.log(jsonResponse);
  
  //get latest price
  Logger.log(jsonResponse.price);
  
  return jsonResponse.price;
}

function getBittrexMarketsPrice(quote, base) {
  
  //get currency pair
//  var quote = "XRP";
//  var base = "BTC";
  var currencyPair = base+"-"+quote;
  
  //retrieve XRP price from Bittrex in BTC
  //https://api.bittrex.com/api/v1.1/public/getticker?market=BTC-XRP
  var url = "https://api.bittrex.com/api/v1.1/public/getticker?market="+currencyPair;
  
  var response = UrlFetchApp.fetch(url);
  var jsonResponse = JSON.parse(response);
  
  Logger.log(response);
  Logger.log(jsonResponse);
  
  //get latest price
  //{"success":true,"message":"","result":{"Bid":0.00002207,"Ask":0.00002209,"Last":0.00002209}}
  Logger.log(jsonResponse.result);
  Logger.log(jsonResponse.result['Last']);
  
  return jsonResponse.result['Last'];
}

function getCoinbeneMarketsPrice(quote, base) {
  
  //get currency pair
//  var quote = "XRP";
//  var base = "BTC";
  var currencyPair = quote+"/"+base;
  
  //retrieve XRP price from Coinbene in BTC
  //http://openapi-exchange.coinbene.com/api/exchange/v2/market/ticker/one?symbol=XRP/BTC
  var url = "http://openapi-exchange.coinbene.com/api/exchange/v2/market/ticker/one?symbol="+currencyPair;
  
  var response = UrlFetchApp.fetch(url);
  var jsonResponse = JSON.parse(response);
  
  Logger.log(response);
  Logger.log(jsonResponse);
  
  //get latest price
  Logger.log(jsonResponse.data);
  Logger.log(jsonResponse.data['latestPrice']);
  
  return jsonResponse.data['latestPrice'];
}