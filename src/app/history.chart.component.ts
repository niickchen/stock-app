import { Component, Input }         from '@angular/core';
import { AfterViewInit }                   from '@angular/core';
 declare var $ :any;
 declare var Highcharts :any;
 
@Component({
    selector: 'app-history-chart',
    template: `<div style="width: 100%; height:80%;" id="history-container"></div>`
})

export class HistoryChartComponent implements AfterViewInit { 
    @Input() data: any[]; // 0: timestamp, 1: price
    @Input() symbol: string;
    
    ngAfterViewInit() {
    	this.renderChart();
    }
 
    renderChart() {     

        Highcharts.stockChart('history-container', {
        
            rangeSelector: {
                selected: 0,
                buttons: [{
                    type: 'week',
                    count: 1,
                    text: '1w'
                }, {
                    type: 'month',
                    count: 1,
                    text: '1m'
                }, {
                    type: 'month',
                    count: 3,
                    text: '3m'
                }, {
                    type: 'month',
                    count: 6,
                    text: '6m'
                }, {
                    type: 'ytd',
                    text: 'YTD'
                }, {
                    type: 'year',
                    count: 1,
                    text: '1y'
                }, {
                    type: 'all',
                    text: 'All'
                }]
            },

            title: {
                text: this.symbol + ' Stock Value'
            },

            subtitle: {
                useHTML: true,
                text: '<a href="https://www.alphavantage.co/" target="_blank" style="color:#0000EE;"> Source: Alpha Vantage </a>',
            },
            tooltip: {
                shared: false,
                split: false,
                enabled: true
            },
            
            series: [{
                name: this.symbol,
                data: this.data,
                type: 'area',
                tooltip: {
                    valueDecimals: 2
                }
            }]
        });


    }
}