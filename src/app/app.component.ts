import { Component, OnInit } from '@angular/core';
import { StockService } from './stock.service';
import { Stock } from './stock';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [StockService]
})

export class AppComponent implements OnInit {
  title = 'app';
  constructor(private stockService: StockService) { }
  
  ngOnInit(): void {
 
  }
}