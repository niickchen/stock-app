import { Component, Input, EventEmitter, Output, AfterViewInit  }         from '@angular/core';
declare var Highcharts :any;

@Component({
    selector: 'app-price-chart',
    template: `<div style="width:100%; height:80%;" id="price-container"></div>`
})

export class PriceChartComponent implements AfterViewInit { 
    @Input() dates: string[]; // 121 elements
    @Input() data: any[];
    @Input() symbol: string;
    @Output() plotOptions: EventEmitter<any> = new EventEmitter<any>();
    
    ngAfterViewInit() {
    	this.renderChart();
    }
 
    renderChart() {
        var prices = this.data.slice().map(data => data[0]);
        var volumes = this.data.slice().map(data => data[1]);
        this.dates = this.dates.map(data => data.substring(5).replace('-', '/'));
        var options = {
                    chart: {
                        zoomType: "x"
                    },
                    
                    title: {
                        text: this.symbol + ' Stock Price and Volume'
                    },

                    subtitle: {
                        useHTML: true,
                        text: '<a href="https://www.alphavantage.co/" target="_blank" style="color:#0000EE;"> Source: Alpha Vantage </a>',
                        /*
                        style: {
                            a:hover: 'black'
                        }
                    */
                        
                    },

                    xAxis: {
                        categories: this.dates,
                        tickInterval: 5
                    },
                    
                    yAxis: [ {
                        //min: minp - (maxp-minp)/12 - (maxp-minp)/6,
                        //max: (maxp-minp)/12 + maxp,
                        
                        tickAmount: 5,
                        title: {
                            text: 'Stock Price'
                        }
                    },{
                        min: 0,
                        //max: 7*maxv,
                        gridLineWidth: 0,
                        opposite: true,
                        title: {
                            text: 'Volume'
                        },
                        tickAmount: 5
                    }    
                    ],
                    
                    
                    tooltip: {
                        shared: false
                    },
                    
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    },

                    plotOptions: {
                        column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                        },
                        area: {
                        
                        marker: {
                            enabled: false,
                            symbol: 'circle',
                            radius: 2,
                            states: {
                                hover: {
                                    enabled: true
                    }
                }
            },
                 fillOpacity: 0.25       
        }
                    },

                    series: [{
                        name: 'Price',
                        data: prices,
                        color: '#66a9ff',
                        type: 'area',
                        tooltip: {
                            valueDecimals: 2
                        }
                    },{
                        name: 'Volume',
                        data: volumes,
                        color: '#FF0000',
                        type: 'column',
                        yAxis: 1
                    }],


                };
                
        this.plotOptions.emit(options); // emit options varibale
        Highcharts.chart('price-container', options); // plot Highcharts
    }
        
}