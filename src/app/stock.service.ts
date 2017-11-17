import { Injectable } from '@angular/core';
import { Stock } from './stock';
import { HttpParams, HttpClient } from '@angular/common/http';
import { AppSettings } from './global';
import { Observable }     from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';

@Injectable()
export class StockService {
    private sendOut = 0;
    
    stockData: Stock = {
        date: Date.now(),
        symbol: '',
        error: false,
        times: {},
        sma: {},
        ema: {},
        stoch: {},
        rsi: {},
        adx: {},
        cci: {},
        bbands: {},
        macd: {},
        news: {},
        detailProgress: false,
        SMAProgress: false,
        EMAProgress: false,
        STOCHProgress: false,
        RSIProgress: false,
        ADXProgress: false,
        CCIProgress: false,
        BBANDSProgress: false,
        MACDProgress: false,
        newsProgress: false,
    };
    
    error = false;
    
    private stock: Subject<Stock>;
    stock$: Observable<Stock>;
    
    
    constructor(private http: HttpClient) {
        this.stock = new Subject<Stock>();
        this.stock$ = this.stock.asObservable();
    }
    
    getSendOut(): number {
        return this.sendOut;
    }
    getResults(): Stock {
        return this.stockData;
    }
    
    getSymbol(): string {
        return this.stockData.symbol;
    }
    
    getDate(): number {
        return this.stockData.date;
    }
    
    clear(): void {
        this.sendOut = 0;
        this.stockData = {
            date: Date.now(),
            symbol: '',
            error: false,
            times: {},
            sma: {},
            ema: {},
            stoch: {},
            rsi: {},
            adx: {},
            cci: {},
            bbands: {},
            macd: {},
            news: {},
            detailProgress: false,
            SMAProgress: false,
            EMAProgress: false,
            STOCHProgress: false,
            RSIProgress: false,
            ADXProgress: false,
            CCIProgress: false,
            BBANDSProgress: false,
            MACDProgress: false,
            newsProgress: false,
        };
    }
    
    updateFavStockDetail(): void {
        let symbols = JSON.parse(localStorage.getItem('symbol'));
        for (let i = 0; i < symbols.length; i++) {
            let symbol = symbols[i];
            let params = new HttpParams().set('symbol', symbol);
            this.http.get(AppSettings.SERVER_BASE_URL + AppSettings.TIME_SERIES_DAILY_URL, {params: params}).subscribe(res => {
                if (JSON.stringify(res)!='{}') {
                    let metadata = res['Meta Data'];
                    let timesdaily = res['Time Series (Daily)'];
                    let changeValue = (parseFloat(timesdaily[Object.keys(timesdaily)[0]]['4. close']) - parseFloat(timesdaily[Object.keys(timesdaily)[1]]['4. close']));
                    let changePercent = changeValue / parseFloat(timesdaily[Object.keys(timesdaily)[1]]['4. close']) * 100;
                    let object = {
                        'symbol': metadata['2. Symbol'],
                        'timestamp' : (metadata['3. Last Refreshed']).length > 12? metadata['3. Last Refreshed'] + " EST" : metadata['3. Last Refreshed'] + " 16:00:00 EST",
                        'price' : (Math.round(parseFloat(timesdaily[Object.keys(timesdaily)[0]]['4. close']) * 100) / 100).toFixed(2),
                        'last' : (Math.round(parseFloat(timesdaily[Object.keys(timesdaily)[0]]['4. close']) * 100) / 100).toFixed(2),
                        'change' : (Math.round(changeValue * 100) / 100).toFixed(2) + " (" + (Math.round(changePercent * 100) / 100).toFixed(2) + "%) ",
                        'volume' : timesdaily[Object.keys(timesdaily)[0]]['5. volume'].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    };
                    localStorage.setItem(symbol, JSON.stringify(object));
                }
            });
        }
    }
    
    update(symbol: string): void {
        this.clear();
        this.stockData.date = Date.now();
        this.stock.next(this.stockData);
        this.sendOut += 1;
        
        // Make the HTTP request
        this.stockData.symbol = symbol.replace(/ +/g, "");
        let params = new HttpParams().set('symbol', symbol.replace(/ +/g, ""));
        
            this.http.get(AppSettings.SERVER_BASE_URL + AppSettings.TIME_SERIES_DAILY_URL, {params: params}).subscribe(res => {
                if (JSON.stringify(res)=='{}') {
                    this.stockData.times = "error";
                    this.stockData.error = true;
                    this.clear();
                    return;
                }
                else {
                    this.stockData.times = res;
                    this.stockData.error = false;
                    this.sendOut += 1;
                    this.stockData.detailProgress = true;
                    this.stock.next(this.stockData);
                }
            });
            
            if (!this.stockData.error) {
                
                this.http.get(AppSettings.SERVER_BASE_URL + AppSettings.SMA_URL, {params: params}).subscribe(res => {
                    this.stockData.sma = res;
                    this.sendOut += 1;
                    this.stockData.SMAProgress = true;
                    this.stock.next(this.stockData);
                    
                    
                });
                
                this.http.get(AppSettings.SERVER_BASE_URL + AppSettings.EMA_URL, {params: params}).subscribe(res => {
                    this.stockData.ema = res;
                    this.sendOut += 1;
                    this.stockData.EMAProgress = true;
                    this.stock.next(this.stockData);
                    
                });
                
                this.http.get(AppSettings.SERVER_BASE_URL + AppSettings.STOCH_URL, {params: params}).subscribe(res => {
                    this.stockData.stoch = res;
                    this.sendOut += 1;
                    this.stockData.STOCHProgress = true;
                    this.stock.next(this.stockData);
                    
                });
                
                this.http.get(AppSettings.SERVER_BASE_URL + AppSettings.RSI_URL, {params: params}).subscribe(res => {
                    this.stockData.rsi = res;
                    this.sendOut += 1;
                    this.stockData.RSIProgress = true;
                    this.stock.next(this.stockData);
                    
                });
                
                this.http.get(AppSettings.SERVER_BASE_URL + AppSettings.ADX_URL, {params: params}).subscribe(res => {
                    this.stockData.adx = res;
                    this.sendOut += 1;
                    this.stockData.ADXProgress = true;
                    this.stock.next(this.stockData);
                    
                });
                
                
                this.http.get(AppSettings.SERVER_BASE_URL + AppSettings.CCI_URL, {params: params}).subscribe(res => {
                    this.stockData.cci = res;
                    this.sendOut += 1;
                    this.stockData.CCIProgress = true;
                    this.stock.next(this.stockData);
                    
                });
                
                this.http.get(AppSettings.SERVER_BASE_URL + AppSettings.BBANDS_URL, {params: params}).subscribe(res => {
                    this.stockData.bbands = res;
                    this.sendOut += 1;
                    this.stockData.BBANDSProgress = true;
                    this.stock.next(this.stockData);
                    
                });
                
                this.http.get(AppSettings.SERVER_BASE_URL + AppSettings.MACD_URL, {params: params}).subscribe(res => {
                    this.stockData.macd = res;
                    this.stockData.MACDProgress = true;
                    this.sendOut += 1;
                    this.stock.next(this.stockData);
                });
                
                this.http.get(AppSettings.SERVER_BASE_URL + AppSettings.NEWS_URL, {params: params}).subscribe(res => {
                    if (res) {
                        this.stockData.news = res['rss'].channel;
                        this.sendOut += 1;
                        this.stockData.newsProgress = true;
                        this.stock.next(this.stockData);
                        
                    }
                });
                
            }
    }
}