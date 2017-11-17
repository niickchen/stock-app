/*
    Todo: change time zone based on user's locale.
*/

import { Component, Input }         from '@angular/core';
import { HttpParams, HttpClient }   from '@angular/common/http';
import { Observable }             from 'rxjs/Observable';
import { Subject }                from 'rxjs/Subject';
import { OnInit }                   from '@angular/core';
import { Location }                 from '@angular/common';
import { ActivatedRoute }     from '@angular/router';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

import { AppSettings } from './global';
import { Stock } from './stock';
import { StockService } from './stock.service';

declare var FB: any;
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})

export class DetailComponent implements OnInit {
    
    constructor(private http: HttpClient, private stockService: StockService, private location: Location, private route: ActivatedRoute) {}
    
    passedSymbol: string; // passed from queries
    source: string;
    results: Stock;
    
    tickerSymbol: string;
    lastPrice: string;
    change: string;
    timestamp: string;
    open: string;
    close: string;
    daysrange: string;
    volume: string;
    newsItems: any[];
    fbActive: boolean;
    indicator: string;
    
    // change price indicator
    up: boolean = false;
    down: boolean = false;
    src: string = '';
    
    // tab control
    hideCurrent = false;
    hideHis = true;
    hideNews = true;
    
    // progress
    detailProgress: boolean;
    SMAProgress: boolean;
    EMAProgress: boolean;
    STOCHProgress: boolean;
    RSIProgress: boolean;
    ADXProgress: boolean;
    CCIProgress: boolean;
    BBANDSProgress: boolean;
    MACDProgress: boolean;
    newsProgress: boolean;
    received: number;
    
    emptyStar: boolean;
    
    // error tags
    detailError: boolean = false;
    SMAError: boolean = false;
    EMAError: boolean = false;
    STOCHError: boolean = false;
    RSIError: boolean = false;
    ADXError: boolean = false;
    CCIError: boolean = false;
    BBANDSError: boolean = false;
    MACDError: boolean = false;
    newsError: boolean = false;
    
    // plot data
    priceData = [];
    SMAData = [];
    EMAData = [];
    STOCHData = [];
    RSIData = [];
    ADXData = [];
    CCIData = [];
    BBANDSData = [];
    MACDData = [];
    historyData = [];
    
    // plot options
    pricePlotOptions: any; // highcharts options
    SMAPlotOptions: any; // highcharts options
    EMAPlotOptions: any; // highcharts options
    STOCHPlotOptions: any; // highcharts options
    RSIPlotOptions: any; // highcharts options
    ADXPlotOptions: any; // highcharts options
    CCIPlotOptions: any; // highcharts options
    BBANDSPlotOptions: any; // highcharts options
    MACDPlotOptions: any; // highcharts options
    currPlotOptions: any; // currently selected options
    
    // if plot data is ready
    priceDataReady = false;
    historyDataReady = false;
    SMADataReady = false;
    EMADataReady = false;
    STOCHDataReady = false;
    RSIDataReady = false;
    ADXDataReady = false;
    CCIDataReady = false;
    BBANDSDataReady = false;
    MACDDataReady = false;

    
    // 121 vaild market days from today
    dates: string[] = [];
    
    // dataDate =  the last time results updated
    dataDateDetail: number;
    dataDateSMA: number;
    dataDateEMA: number;
    dataDateSTOCH: number;
    dataDateRSI: number;
    dataDateADX: number;
    dataDateCCI: number;
    dataDateBBANDS: number;
    dataDateMACD: number;
    dataDateNews: number;
    dataDateHistory: number;
    
    
    
    ngOnInit(): void {
        // do not update if clicked from search button or nav button
        this.route.queryParamMap.subscribe(params => {
            this.passedSymbol = params.get('symbol');
            this.source = params.get('from');
            });
        if (this.source != 'search' && this.source != 'nav') {
            this.stockService.clear();
            this.stockService.update(this.passedSymbol); // error handling later
        }
        
        if (!localStorage.getItem("symbol")) localStorage.setItem("symbol", "[]");
            
      
        this.emptyStar = true;
        this.detailProgress = false;
        this.SMAProgress = false;
        this.EMAProgress = false;
        this.STOCHProgress = false;
        this.RSIProgress = false;
        this.ADXProgress = false;
        this.CCIProgress = false;
        this.BBANDSProgress = false;
        this.MACDProgress = false;
        this.newsProgress = false;
        this.received = 0;
        this.fbActive = false;
        this.indicator = "price";
        this.currPlotOptions = this.pricePlotOptions;
        
        this.results = this.stockService.getResults();
        this.update();
        
        
        // listening for new data
        this.stockService.stock$.subscribe((newstock: Stock) => {
            this.results = newstock;
            this.update();
        });
        
        // DO NOT UPDATE INDICATOR DATA INSIDE SUBSCRIBE OR IT WILL CAUSE HUGE DELAY.
        // We check if there is new data ready every second.
        setInterval(() => {
            this.updateIndicatorData();
            // update fbActive tag
            this.shareOnFB(this.indicator);
            }, 1000);
    }
    
    
    // receive data from service and change properties
    update(): void {
            // progress update
            this.emptyStar = true;

            this.received = this.stockService.getSendOut();
            if (this.received == 0) {
                // clear error tags
                this.detailError = false;
                this.SMAError = false;
                this.EMAError = false;
                this.STOCHError = false;
                this.RSIError = false;
                this.ADXError = false;
                this.CCIError = false;
                this.BBANDSError = false;
                this.MACDError = false;
                this.newsError = false;
                
                this.priceDataReady = false;
                this.historyDataReady = false;
                this.SMADataReady = false;
                this.EMADataReady = false;
                this.STOCHDataReady = false;
                this.RSIDataReady = false;
                this.ADXDataReady = false;
                this.CCIDataReady = false;
                this.BBANDSDataReady = false;
                this.MACDDataReady = false;
                
                this.fbActive = false;
                
            }
            
            this.detailProgress = this.results.detailProgress;
            this.SMAProgress = this.results.SMAProgress;
            this.EMAProgress = this.results.EMAProgress;
            this.STOCHProgress = this.results.STOCHProgress;
            this.RSIProgress = this.results.RSIProgress;
            this.ADXProgress = this.results.ADXProgress;
            this.CCIProgress = this.results.CCIProgress;
            this.BBANDSProgress = this.results.BBANDSProgress;
            this.MACDProgress = this.results.MACDProgress;
            this.newsProgress = this.results.newsProgress;
            
            // update fbActive tag
            this.shareOnFB(this.indicator);
    
            // update table
            var meta = this.results.times['Meta Data'];
            var timesdaily = this.results.times['Time Series (Daily)'];
            
            
            // update details
            // error handling, probably invalid ticker symbol from input
            let errorMsgDetails = this.results.times["Error Message"];
            // TODO: specifically handle invalid ticker symbol error
            if (errorMsgDetails) {
                this.detailError = true;
            } 
            
            else if (meta) {
                this.tickerSymbol = meta['2. Symbol'];
                // update star
                var obj = JSON.parse(localStorage.getItem("symbol"));
                for (var i = 0; i < obj.length; i++) {
                    if (obj[i] == this.tickerSymbol) {
                        this.emptyStar = false;
                        break;
                    }
                    else this.emptyStar = true;
                }
                // determine if todays market closed
                this.timestamp = (meta['3. Last Refreshed']).length > 12? meta['3. Last Refreshed'] + " EST" : meta['3. Last Refreshed'] + " 16:00:00 EST";
            
            // [0] means the first day from today that is a market day (inclusive)
            
                this.lastPrice = (Math.round(parseFloat(timesdaily[Object.keys(timesdaily)[0]]['4. close']) * 100) / 100).toFixed(2);
                
                var changeValue = (parseFloat(timesdaily[Object.keys(timesdaily)[0]]['4. close']) - parseFloat(timesdaily[Object.keys(timesdaily)[1]]['4. close']));
                
                
                let changePercent = changeValue / parseFloat(timesdaily[Object.keys(timesdaily)[1]]['4. close']) * 100;
                
                // change is changeValue & changePercent
                this.change = (Math.round(changeValue * 100) / 100).toFixed(2) + " (" + (Math.round(changePercent * 100) / 100).toFixed(2) + "%) ";
                
                if (changeValue > 0) {
                    this.up = true;
                    this.down = false;
                    this.src= 'http://cs-server.usc.edu:45678/hw/hw8/images/Up.png';
                } else if (changeValue < 0) {
                    this.up = false;
                    this.down = true;
                    this.src= 'http://cs-server.usc.edu:45678/hw/hw8/images/Down.png';
                } else {
                    this.up = false;
                    this.down = false;
                    this.src= '';
                }
                
                
                this.open = ((Math.round(parseFloat(timesdaily[Object.keys(timesdaily)[0]]['1. open']) * 100) / 100).toFixed(2));
                
                this.close = (meta['3. Last Refreshed']).length > 12 ? ((Math.round(parseFloat(timesdaily[Object.keys(timesdaily)[1]]['4. close']) * 100) / 100).toFixed(2)) : ((Math.round(parseFloat(timesdaily[Object.keys(timesdaily)[0]]['4. close']) * 100) / 100).toFixed(2));
                
                this.daysrange = (Math.round(parseFloat(timesdaily[Object.keys(timesdaily)[0]]['3. low']) * 100) / 100).toFixed(2) + ' - ' + (Math.round(parseFloat(timesdaily[Object.keys(timesdaily)[0]]['2. high']) * 100) / 100).toFixed(2);
                
                this.volume = timesdaily[Object.keys(timesdaily)[0]]['5. volume'].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                
                // from earliest days to recent days, 121 days in total
                this.dates = Object.keys(timesdaily).slice(0, 121).reverse(); 
                
                
            }
            
            // update SMA
            if (this.SMAProgress && JSON.stringify(this.results.sma) == '{}') {
                this.SMAError = true;
            }
            
            // update EMA
            if (this.EMAProgress && JSON.stringify(this.results.ema) == '{}') {
                this.EMAError = true;
            }
            
            // update STOCH
            if (this.STOCHProgress && JSON.stringify(this.results.stoch) == '{}') {
                this.STOCHError = true;
            }
            
            // update RSI
            if (this.RSIProgress && JSON.stringify(this.results.rsi) == '{}') {
                this.RSIError = true;
            }
            
            // update ADX
            if (this.ADXProgress && JSON.stringify(this.results.adx) == '{}') {
                this.ADXError = true;
            }
            
            // update CCI
            if (this.CCIProgress && JSON.stringify(this.results.cci) == '{}') {
                this.CCIError = true;
            }
            
            // update BBANDS
            if (this.BBANDSProgress && JSON.stringify(this.results.bbands) == '{}') {
                this.BBANDSError = true;
            }
            
            // update MACD
            let errorMsgMACD = this.results.times["Error Message"];
            if (this.MACDProgress && errorMsgMACD) {
                this.MACDError = true;
            }
            
            // update news
            if (this.detailError) {
                this.newsError = true;
                
            } else {
                if (this.results.news.item) {
                    this.newsItems = this.results.news.item; 
                    // only show 5 valid news links
                    for (var i = 0; i < this.newsItems.length; i++) {
                        if (!this.isValidLink(this.newsItems[i].link)) {
                            this.newsItems.splice(i, 1);
                        }
                    }
                    if (this.newsItems.length > 5) this.newsItems = this.newsItems.slice(0, 5);
                } else {
                    this.newsItems = [{"title":"", "sa:author_name":"", "pubDate":"", "link":"",}];
                }
            }
            
            if (this.detailProgress && !this.detailError) {
                this.updateStarredStockInfo();
            }
            
    }

    updateIndicatorData(): void {
        if (this.detailProgress && this.dataDateDetail != this.results.date && !this.detailError){
                this.dataDateDetail = this.results.date;
                let timesdaily = this.results.times['Time Series (Daily)'];
                for (let i = 0; i < 121; i++) {
                    this.priceData[i] = [parseFloat((Math.round(parseFloat(timesdaily[this.dates[i]]['4. close']) * 100) / 100).toFixed(2)), parseFloat(timesdaily[this.dates[i]]['5. volume'])];
                }
                this.priceDataReady = true;
        }
        if (this.detailProgress && this.dataDateHistory != this.results.date && !this.detailError){
                this.dataDateHistory = this.results.date;
                let timesdaily = this.results.times['Time Series (Daily)'];
                // get 1000 price data points
                let thousandDates = Object.keys(timesdaily).slice(0, 1000).reverse(); 
                for (let i = 0; i < thousandDates.length; i++) {
                    this.historyData[i] = [new Date(thousandDates[i]).getTime(), parseFloat((Math.round(parseFloat(timesdaily[thousandDates[i]]['4. close']) * 100) / 100).toFixed(2))];
                }
                this.historyDataReady = true;
        }

        if (this.SMAProgress && this.dataDateSMA != this.results.date && !this.SMAError){
                this.dataDateSMA = this.results.date;
                var data = this.results.sma['Technical Analysis: SMA'];
                
                for (let i = 0; i < 120; i++) {
                    this.SMAData[i] = parseFloat(data[this.dates[i]].SMA);
                    
                }
                this.SMAData[120] = parseFloat(data[Object.keys(data)[0]].SMA);
                this.SMADataReady = true;
        }
        if (this.EMAProgress && this.dataDateEMA != this.results.date && !this.EMAError){
                this.dataDateEMA = this.results.date;
                
                let data = this.results.ema['Technical Analysis: EMA'];
                for (let i = 0; i < 120; i++) {
                    this.EMAData[i] = parseFloat(data[this.dates[i]].EMA);
                }
                this.EMAData[120] = parseFloat(data[Object.keys(data)[0]].EMA);
                this.EMADataReady = true;
        }
        if (this.MACDProgress && this.dataDateMACD != this.results.date && !this.MACDError){
                this.dataDateMACD = this.results.date;
                
                let data = this.results.macd['Technical Analysis: MACD'];
                for (let i = 0; i < 120; i++) {
                    this.MACDData[i] = [parseFloat(data[this.dates[i]]['MACD_Hist']), parseFloat(data[this.dates[i]]['MACD_Signal']), parseFloat(data[this.dates[i]]['MACD'])];
                }
                this.MACDData[120] = [parseFloat(data[Object.keys(data)[0]]['MACD_Hist']), parseFloat(data[Object.keys(data)[0]]['MACD_Signal']), parseFloat(data[Object.keys(data)[0]]['MACD'])];
                this.MACDDataReady = true;
        }
        if (this.BBANDSProgress && this.dataDateBBANDS != this.results.date && !this.BBANDSError){
                this.dataDateBBANDS = this.results.date;
                
                let data = this.results.bbands['Technical Analysis: BBANDS'];
                for (let i = 0; i < 120; i++) {
                    this.BBANDSData[i] = [parseFloat(data[this.dates[i]]['Real Middle Band']), parseFloat(data[this.dates[i]]['Real Upper Band']), parseFloat(data[this.dates[i]]['Real Lower Band'])];
                }
                this.BBANDSData[120] = [parseFloat(data[Object.keys(data)[0]]['Real Middle Band']), parseFloat(data[Object.keys(data)[0]]['Real Upper Band']), parseFloat(data[Object.keys(data)[0]]['Real Lower Band'])];
                this.BBANDSDataReady = true;
        }
        if (this.RSIProgress && this.dataDateRSI != this.results.date && !this.RSIError){
                this.dataDateRSI = this.results.date;
                
                let data = this.results.rsi['Technical Analysis: RSI'];
                for (let i = 0; i < 120; i++) {
                    this.RSIData[i] = parseFloat(data[this.dates[i]].RSI);
                }
                this.RSIData[120] = parseFloat(data[Object.keys(data)[0]].RSI);
                this.RSIDataReady = true;
        }
        if (this.CCIProgress && this.dataDateCCI != this.results.date && !this.CCIError){
                this.dataDateCCI = this.results.date;
                
                let data = this.results.cci['Technical Analysis: CCI'];
                for (let i = 0; i < 120; i++) {
                    this.CCIData[i] = parseFloat(data[this.dates[i]].CCI);
                }
                this.CCIData[120] = parseFloat(data[Object.keys(data)[0]].CCI);
                this.CCIDataReady = true;
        }
        if (this.STOCHProgress && this.dataDateSTOCH != this.results.date && !this.STOCHError){
                this.dataDateSTOCH = this.results.date;
                
                let data = this.results.stoch['Technical Analysis: STOCH'];
                for (let i = 0; i < 120; i++) {
                    this.STOCHData[i] = [parseFloat(data[this.dates[i]].SlowD), parseFloat(data[this.dates[i]].SlowK)];
                }
                this.STOCHData[120] = [parseFloat(data[Object.keys(data)[0]].SlowD), parseFloat(data[Object.keys(data)[0]].SlowK)];
                this.STOCHDataReady = true;
        }
        if (this.ADXProgress && this.dataDateADX != this.results.date && !this.ADXError){
                this.dataDateADX = this.results.date;
                
                let data = this.results.adx['Technical Analysis: ADX'];
                for (let i = 0; i < 120; i++) {
                    this.ADXData[i] = parseFloat(data[this.dates[i]].ADX);
                }
                this.ADXData[120] = parseFloat(data[Object.keys(data)[0]].ADX);
                this.ADXDataReady = true;
        }
    }
    
    
    
    updateStarredStockInfo(): void {
        if (!this.emptyStar) {
            var deetsAboutThisTS = {
                "symbol": this.tickerSymbol,
                "last": this.lastPrice,
                "price": this.lastPrice,
                "change": this.change,
                "timestamp": this.timestamp,
                "volume": this.volume
            }
            localStorage.setItem(this.tickerSymbol, JSON.stringify(deetsAboutThisTS));
        }
    }
    
    invertStar(): void {
        if (this.detailProgress && !this.detailError){
            this.emptyStar = !this.emptyStar;

            // save to local storage
            if (!this.emptyStar) {

                // do not contain "symbol"
                if (!localStorage.getItem("symbol")) {
                    let symbols = [];
                    symbols[0] = this.tickerSymbol;
                    localStorage.setItem("symbol", JSON.stringify(symbols));
                } 
                // contains "symbol"
                else {
                    let symbolString = localStorage.getItem("symbol");
                    let symbols = JSON.parse(symbolString);

                    // do not contain this.tickerSymbol
                    if (symbols.indexOf(this.tickerSymbol) == -1) {
                        symbols.push(this.tickerSymbol);
                        localStorage.setItem("symbol", JSON.stringify(symbols));
                    } 

                    // update details about this ticker symbol
                    this.updateStarredStockInfo();
                }

            } 
            // remove
            else {
                if (localStorage.getItem("symbol")) {
                    let symbolString = localStorage.getItem("symbol");
                    let symbols = JSON.parse(symbolString);
                    let index = symbols.indexOf(this.tickerSymbol);
                    if (index > -1) {
                        symbols.splice(index, 1);
                        localStorage.setItem("symbol", JSON.stringify(symbols));
                    }
                    localStorage.removeItem(this.tickerSymbol);
                }

            }
        }
    }
    
    shareOnFB(indicator: string): void {
    
        // share to Facebook
        if (indicator=="fb" && this.fbActive) {
            // retrieve Highcharts exported picture URL
            var body = this.currPlotOptions;
            this.http.post(AppSettings.SERVER_BASE_URL + AppSettings.FACEBOOK_SHARE_URL, body).subscribe(res => {
                if (res) {
                    FB.ui({
                      method: 'feed',
                      link: res['link'],
                      display: 'iframe'
                    }, function(response){
                        if (response && !response.error_message) {
                          alert('Posting completed.');
                        } else {
                          alert('Not posted.');
                        }
                    });
                }});
        
            return;
        }
        
        this.indicator = indicator;
        
        if (indicator=="sma") {
            this.currPlotOptions = this.SMAPlotOptions;
            if (this.SMADataReady) this.fbActive = true;
            else this.fbActive = false;
        }
        else if (indicator=="ema") {
            this.currPlotOptions = this.EMAPlotOptions;
            if (this.EMADataReady) this.fbActive = true;
            else this.fbActive = false;
        }
        else if (indicator=="price") {
            this.currPlotOptions = this.pricePlotOptions;
            if (this.priceDataReady) this.fbActive = true;
            else this.fbActive = false;
        }
        else if (indicator=="stoch") {
            this.currPlotOptions = this.STOCHPlotOptions;
            if (this.STOCHDataReady) this.fbActive = true;
            else this.fbActive = false;
        }
        else if (indicator=="rsi") {
            this.currPlotOptions = this.RSIPlotOptions;
            if (this.RSIDataReady) this.fbActive = true;
            else this.fbActive = false;
        }
        else if (indicator=="adx") {
            this.currPlotOptions = this.ADXPlotOptions;
            if (this.ADXDataReady) this.fbActive = true;
            else this.fbActive = false;
        }
        else if (indicator=="cci") {
            this.currPlotOptions = this.CCIPlotOptions;
            if (this.CCIDataReady) this.fbActive = true;
            else this.fbActive = false;
        }
        else if (indicator=="bbands") {
            this.currPlotOptions = this.BBANDSPlotOptions;
            if (this.BBANDSDataReady) this.fbActive = true;
            else this.fbActive = false;
        }
        else if (indicator=="macd") {
            this.currPlotOptions = this.MACDPlotOptions;
            if (this.MACDDataReady) this.fbActive = true;
            else this.fbActive = false;
        }
        
    }
    
    setPricePlotOptions(options: any): void {
        this.pricePlotOptions = options;
    }
    
    setSMAPlotOptions(options: any): void {
        this.SMAPlotOptions = options;
    }
    
    setEMAPlotOptions(options: any): void {
        this.EMAPlotOptions = options;
    }
    
    setSTOCHPlotOptions(options: any): void {
        this.STOCHPlotOptions = options;
    }
    
    setRSIPlotOptions(options: any): void {
        this.RSIPlotOptions = options;
    }
    
    setADXPlotOptions(options: any): void {
        this.ADXPlotOptions = options;
    }
    
    setCCIPlotOptions(options: any): void {
        this.CCIPlotOptions = options;
    }
    
    setBBANDSPlotOptions(options: any): void {
        this.BBANDSPlotOptions = options;
    }
    
    setMACDPlotOptions(options: any): void {
        this.MACDPlotOptions = options;
    }
    
    
    
    
    
                        
    // to determine if news link leads to actual news page
    isValidLink(link: string): boolean {
        if (!link.includes("seekingalpha.com/symbol/")) {
            return true;
        } else return false;
    }
    
    
    // get rid of last 6 characters in pubDate
    formalizePubDate(date: string): string {
        return date.slice(0, -6);
    }
    

}
