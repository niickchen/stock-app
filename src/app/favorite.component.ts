/* Because of the bugs of Bootstrap Toggle, an open-source toggle plugin I found online, 
    I have to detect mousemove to invoke an function to get the value of the toggle,
    which is not recommended. I will change this method later.
    
    TODO: save the state of toggle after leaving fav-component.
          save the sorting method and order value.
*/

import { Component, Input } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
//import { Observable }     from 'rxjs/Observable';
//import { Subject }           from 'rxjs/Subject';
import { OnInit, AfterViewInit } from '@angular/core';


//import 'rxjs/add/observable/of';
//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/debounceTime';
//import 'rxjs/add/operator/catch';
//import 'rxjs/add/operator/distinctUntilChanged';
//import 'rxjs/add/operator/switchMap';

import { AppSettings } from './global';
import { Stock } from './stock';
import { StockService } from './stock.service';

declare var $ :any;

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css'],
})

export class FavoriteComponent implements OnInit, AfterViewInit {

    currentSymbol: string; // currently searched symbol
    savedSymbols: string[];
    src: string = '';
    up = false;
    down = false;
    autorefresh = false;
    favList: any[] = [];
    favListBak: any[] = [];
    isSortedByDefault: boolean = true;
    gotoLink: string = '/';
    disabledGotoStockInfo: boolean = true;
    myAutoRefresh: any;
    autoRefreshState: boolean = false;
    selected: string = "Default";
    order: string;
    
    constructor(private http: HttpClient, private stockService: StockService,) {}
    
    results: Stock;
    
    ngOnInit(): void {
        // update fav list stock prices
        this.stockService.updateFavStockDetail();
        // get saved items from local storage
        this.getFavList();
        // disable or activate go-to-stock-info button
        setInterval(() => this.gotoStockInfo(), 100);
        // initialize auto refresh toggle switch button
        $(function() {
            $('#toggle-one').bootstrapToggle();
        })
    }
    
    ngAfterViewInit() {
        
    }
    
    // disable or activate go-to-stock-info button
    gotoStockInfo(): void {
        if (this.stockService.getSendOut() > 0) {
            this.gotoLink = '/detail';
            this.currentSymbol = this.stockService.getSymbol();
            this.disabledGotoStockInfo = false;
        } else {
            this.gotoLink = '/favorite';
            this.disabledGotoStockInfo = true;
        }
    }
    
    // update every five seconds
    autoRefresh():void {
        // turn on auto refresh
        if (!this.autoRefreshState) {
            this.stockService.updateFavStockDetail();
            this.myAutoRefresh = setInterval(() => {
                this.updateFavList();
                this.stockService.updateFavStockDetail();
            }, 5000);
            this.autoRefreshState = true;
        // turn off auto refresh
        } else {
            clearInterval(this.myAutoRefresh);
            this.autoRefreshState = false;
        }
        
    }
    
    detectToggleValue(checked: boolean) {
        if (this.autoRefreshState != checked) this.autoRefresh();
    }
    
    refresh(): void {
        this.stockService.updateFavStockDetail();
        setTimeout(() => this.updateFavList(), 6000);
        
    }
    
    getFavList(): void {
        if (localStorage.getItem("symbol")) {
            this.savedSymbols = JSON.parse(localStorage.getItem("symbol"));
            for (let i = 0; i < this.savedSymbols.length; i++) {
                this.favList[i] = JSON.parse(localStorage.getItem(this.savedSymbols[i]));
            }
        } else {
            this.favList = [];
        }
        
        this.favListBak = this.favList.slice();
    }
    
    // update starred items from local storage
    updateFavList(): void {
        this.getFavList();
        this.sortBy(this.selected, this.order);
    }
    
    deleteStarredSymbol(stock: string): void {
        localStorage.removeItem(stock);
        let index = this.savedSymbols.indexOf(stock);
        
            if (index > -1) {
                this.savedSymbols.splice(index, 1);
                localStorage.setItem('symbol', JSON.stringify(this.savedSymbols));
                this.favListBak.splice(index, 1);
                for (let i = 0; i < this.favList.length; i++) {
                    if (this.favList[i].symbol == stock) {
                        this.favList.splice(i, 1);
                            
                        return;
                    }
                }
            }
    }
    
    setOrder(selected: string, order: string): void {
        this.selected = selected;
        this.order = order;
        this.sortBy(selected, order);
    }
    
    sortBy(selected: string, order: string): void {
        if (selected == 'Default') {
            this.isSortedByDefault = true;
            this.favList = this.favListBak.slice();
        }
        else {
            this.isSortedByDefault = false;
            if (selected == 'Symbol') {
                if (order == 'Ascending') {
                    this.favList.sort((obj1, obj2) => {
                        if (obj1.symbol < obj2.symbol) return -1;
                        else if (obj1.symbol > obj2.symbol) return 1;
                        else return 0;
                        });
                } else {
                    this.favList.sort((obj1, obj2) => {
                        if (obj1.symbol < obj2.symbol) return 1;
                        else if (obj1.symbol > obj2.symbol) return -1;
                        else return 0;
                        });
                }
            } else if (selected == 'Price') {
                if (order == 'Ascending') {
                    this.favList.sort((obj1, obj2) => {
                        if (parseFloat(obj1.price) < parseFloat(obj2.price)) return -1;
                        else if (parseFloat(obj1.price) > parseFloat(obj2.price)) return 1;
                        else return 0;
                        });
                } else {
                    this.favList.sort((obj1, obj2) => {
                        if (parseFloat(obj1.price) < parseFloat(obj2.price)) return 1;
                        else if (parseFloat(obj1.price) > parseFloat(obj2.price)) return -1;
                        else return 0;
                        });
                }
            } else if (selected == 'Change') {
                if (order == 'Ascending') {
                    this.favList.sort((obj1, obj2) => {
                        if (parseFloat(obj1.change.split(' ')[0]) < parseFloat(obj2.change.split(' ')[0])) return -1;
                        else if (parseFloat(obj1.change.split(' ')[0]) > parseFloat(obj2.change.split(' ')[0])) return 1;
                        else return 0;
                        });
                } else {
                    this.favList.sort((obj1, obj2) => {
                        if (parseFloat(obj1.change.split(' ')[0]) < parseFloat(obj2.change.split(' ')[0])) return 1;
                        else if (parseFloat(obj1.change.split(' ')[0]) > parseFloat(obj2.change.split(' ')[0])) return -1;
                        else return 0;
                        });
                }
            } else if (selected == 'Change Percent') {
                if (order == 'Ascending') {
                    this.favList.sort((obj1, obj2) => {
                        if (parseFloat(obj1.change.split("(")[1].split('%')[0]) < parseFloat(obj2.change.split("(")[1].split('%')[0])) return -1;
                        else if (parseFloat(obj1.change.split("(")[1].split('%')[0]) > parseFloat(obj2.change.split("(")[1].split('%')[0])) return 1;
                        else return 0;
                        });
                } else {
                
                    this.favList.sort((obj1, obj2) => {
                        if (parseFloat(obj1.change.split("(")[1].split('%')[0]) < parseFloat(obj2.change.split("(")[1].split('%')[0])) return 1;
                        else if (parseFloat(obj1.change.split("(")[1].split('%')[0]) > parseFloat(obj2.change.split("(")[1].split('%')[0])) return -1;
                        else return 0;
                        });
                }
            } else if (selected == 'Volume') {
                if (order == 'Ascending') {
                    this.favList.sort((obj1, obj2) => {
                        if (parseFloat(obj1.volume.replace(/\,/g,"")) < parseFloat(obj2.volume.replace(/\,/g,""))) return -1;
                        else if (parseFloat(obj1.volume.replace(/\,/g,"")) > parseFloat(obj2.volume.replace(/\,/g,""))) return 1;
                        else return 0;
                        });
                } else {
                    this.favList.sort((obj1, obj2) => {
                        if (parseFloat(obj1.volume.replace(/\,/g,"")) < parseFloat(obj2.volume.replace(/\,/g,""))) return 1;
                        else if (parseFloat(obj1.volume.replace(/\,/g,"")) > parseFloat(obj2.volume.replace(/\,/g,""))) return -1;
                        else return 0;
                        });
                }
            }
        }
    }
    
    indicatorFlag(symbol: string): void {
        if (localStorage.getItem(symbol)) {
            let stock = JSON.parse(localStorage.getItem(symbol));
            if (parseFloat(stock['change'].split(' ')[0]) > 0) {
                this.up = true;
                this.down = false;
                this.src= 'http://cs-server.usc.edu:45678/hw/hw8/images/Up.png';
            } else if (parseFloat(stock['change'].split(' ')[0]) < 0) {
                this.up = false;
                this.down = true;
                
                this.src= 'http://cs-server.usc.edu:45678/hw/hw8/images/Down.png';
            } else {
                this.up = false;
                this.down = false;
                this.src= '';
            }
        } else {
            this.up = false;
            this.down = false;
            this.src= '';
        }
    }
    
}
