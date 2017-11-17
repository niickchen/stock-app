import { Component } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Observable }     from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';
import { OnInit } from '@angular/core';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

import { AppSettings } from './global';
import { StockService } from './stock.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit {
    isInvalidInput = false;
    buttonDisabled = true; // search button
    
    private searchTerms = new Subject<string>();
    
    // if input is not valid stock symbol, error = true
    error:boolean = false;
    
    buttonRouterLink;
    
    constructor(private http: HttpClient, private stockService: StockService,) {}
    
    options: Observable<any>;
    
    ngOnInit(): void {
        this.buttonRouterLink = "";
        
        // call autocompSearch after keyup 0.2s && if word changed
        this.options = this.searchTerms.debounceTime(200).distinctUntilChanged().switchMap(term => term ? this.autocompSearch(term) : Observable.of<any>([])).catch(error => {
            // add error handling
        
        
            return Observable.of<any>([]);
        });
        
    }
    
    
    keyUp(term: string): void {
        // add new string to searchTerms
        this.searchTerms.next(term);
        if (!term || term.replace(/ +/g, "") === "") {
            this.buttonDisabled = true;
        } else this.buttonDisabled = false;
    }
    
    // retrieve the autocompletion list
    autocompSearch(term: string): Observable<any>{
        let params = new HttpParams().set('input', term);
        return this.http.get(AppSettings.SERVER_BASE_URL + AppSettings.AUTO_COMPLETE_URL, {params: params});
    }

    
    clearInput(): void {
        this.isInvalidInput = false;
        this.buttonDisabled = true;
        this.options = this.searchTerms.distinctUntilChanged().switchMap(term => term ? this.autocompSearch(term) : Observable.of<any>([])).catch(error => {
            // add error handling
        
        
            return Observable.of<any>([]);
        });
        
        this.error = false;
        
        this.stockService.clear();

    }
    
    // error notification if input value is not valid
    // search values in service
    search(value: string): void {
        if (!value || value.replace(/ +/g, "") === "") {
            // change button router link
            if (this.stockService.getSendOut() == 0) {
                this.buttonRouterLink = "/favorite";
            } else if (window.location.href.includes("/detail")) this.buttonRouterLink = "/detail";
            else this.buttonRouterLink = "/favorite";
            
            this.isInvalidInput = true;
            this.error = false;
        // query is not empty
        } else {
            // change button router link
            this.buttonRouterLink = "/detail";
            
            this.isInvalidInput = false;
            // search
            this.stockService.clear();
            this.stockService.update(value); // error handling later
        }
    }
    
    
}
