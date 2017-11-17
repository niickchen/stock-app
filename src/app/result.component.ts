import { Component, Input } from '@angular/core';
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
import { Stock } from './stock';
import { StockService } from './stock.service';


@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})

export class ResultComponent implements OnInit {

    result: Stock;
    
    constructor(private http: HttpClient, private stockService: StockService,) {}
    
    
    ngOnInit(): void {
        
    }
}
